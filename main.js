const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
const windowStateKeeper = require('electron-window-state');
let win;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow() {
    //Get previous state
    let mainWindowState = windowStateKeeper({
        defaultWidth: 1000,
        defaultHeight: 800
    });

    // Create the window using the state information
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            nodeIntegrationInWorker: true
        },
        'x': mainWindowState.x,
        'y': mainWindowState.y,
        'width': mainWindowState.width,
        'height': mainWindowState.height,
        'minWidth': 950,
        'minHeight': 736,
        'show': false,
        'resizable': true

    });


    mainWindow.webContents.on('did-finish-load', function() {
        sethtmlsize();
        mainWindow.show();
    });

    // Let us register listeners on the window, so we can update the state
    // automatically (the listeners will be removed when the window is closed)
    // and restore the maximized or full screen state
    mainWindowState.manage(mainWindow);
    /*
      // Create the browser window.
      mainWindow = new BrowserWindow({width: 1100, height: 750})
    */
    //mainWindow.setResizable(true);
    // and load the index.html of the app.
    mainWindow.loadURL(`file://${__dirname}/index.html`)

    //initialize GLOBAL WORKING DIR VARIABLE
    global.workdirObj = {
        prop1: null
    };
    mainWindow.on('close', function(event) {
        //event.preventDefault();
        if (global.workdirObj.prop1) {
            console.log('removing the ' + global.workdirObj.prop1 + ' directory.');
            const spawnsync = require('child_process').spawnSync;
            spawnsync('cmd.exe', ['/c', 'rd', '/s', '/q', global.workdirObj.prop1]);
            //console.log('stdout here: \n' + rd.stdout);
        }
    });

    // Open the DevTools.
    // mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
        app.quit();
    });
    mainWindow.on('resize', function(event) {

        sethtmlsize();
    });
}

function sethtmlsize() {
    var size = mainWindow.getSize();
    var height = size[1];
    var newheight = height - 52;
    var width = size[0];
    mainWindow.webContents.executeJavaScript("$('body').css('height','" + newheight + "px');");
    mainWindow.webContents.executeJavaScript("$('html').css('height','" + newheight + "px');");
    mainWindow.webContents.executeJavaScript("$('html').css('width','" + width + "px');");
    mainWindow.webContents.executeJavaScript("$('body').css('width','" + width + "px');");
}

// In some file from the main process
// like main.js
const {
    ipcMain
} = require('electron');

ipcMain.on('ondragstart', (event, filePath) => {
    event.sender.startDrag({
        file: filePath,
        icon: 'img/video_icon.png'
    })
})

// Attach listener in the main process with the given ID
ipcMain.on('resethtmlsize', (event, arg) => {
    var size = mainWindow.getSize();
    var height = size[1];
    var newheight = height - 52;
    var width = size[0];
    mainWindow.webContents.executeJavaScript("$('body').css('height','" + newheight + "px');");
    mainWindow.webContents.executeJavaScript("$('html').css('height','" + newheight + "px');");
    mainWindow.webContents.executeJavaScript("$('html').css('width','" + width + "px');");
    mainWindow.webContents.executeJavaScript("$('body').css('width','" + width + "px');");
});


ipcMain.on('expandWindow', (event, newsize) => {
    mainWindow.setSize(newsize.width, newsize.height);
    if (newsize.width > mainWindow.minWidth) {
        mainWindow.webContents.executeJavaScript("$('html').css('width','" + newsize.width + "px');");
        mainWindow.webContents.executeJavaScript("$('body').css('width','" + newsize.width + "px');");
    }
    if (newsize.height > mainWindow.minHeight) {
        mainWindow.webContents.executeJavaScript("$('body').css('height','" + newsize.height + "px');");
        mainWindow.webContents.executeJavaScript("$('html').css('height','" + newsize.height + "px');");
    }
});


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function() {
    createWindow();
    //sethtmlsize();
});

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function() {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.