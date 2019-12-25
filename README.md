# vidSmooth
This is an Electron frontend for ffmpeg's [vid.Stab](https://github.com/georgmartius/vid.stab) library that takes an input video and outputs a stabilized version in high quality mp4/h264 format.
## Features
- Any codec supported by ffmpeg will be supported as an input video (mp4, m4v, avi, wmv, mov, flv, mpg, mpeg, gif)
- Most settings vidStab uses as input are exposed to the user
     *   accuracy  
     *   shakiness  
     *   smoothing  
     *   maxshift  
     *   maxangle  
     *   crop method  
     *   camera path  
     *   tripod mode
- The user has the option to select a portion of the input video and create a stabilized sample before committing to the entire video

### Issues
- Occasionally ffmpeg will choke on a video input type, but since there is no error control built into this app, it will just stop responding
- When the smoothing settings are too agressive, vid.Stab will 1) over-crop a large portion of the video an/or 2) introduce edge artifacts in an attempt to interpolate video data
- If tripod mode is set to on, but the input video pans away from a subject, the result is that the edge pixels get smeared across the video and no further useful video will be displayed 

### Development Environment Setup
- you must first [install Node 12](https://nodejs.org/en/download/)
- `git clone https://github.com/uotw/vidSmooth.git`
- `cd vidSmooth`
- `npm install`
- install `ffmpeg`, `ffprobe` static binaries for your OS ([[MacOS](https://evermeet.cx/ffmpeg/)][[Windows](https://ffbinaries.com/downloads)]) per [these instructions](https://stackoverflow.com/questions/33152533/bundling-precompiled-binary-into-electron-app/38373289#38373289)  - make sure they are compiled with at least h264 and vidStab
- if on MacOS, install [`appswitch`](https://github.com/nriley/appswitch) binary per above instructions
- `npm start`
