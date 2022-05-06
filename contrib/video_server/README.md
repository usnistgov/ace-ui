# Video Server 
Credit: Initial code was copied from:  https://gist.github.com/n3wtron/4624820

This project allows users to create a video streaming server. The python program can stream from static video, image file directory, RTSP stream, and web camera. 
## Features
The project allows you to create a video server from-
* Web camera
* Static image file
* RTSP or network stream
* Online video file

## Parameters & usage
```
optional arguments:
  -h, --help            show this help message and exit
  -v VIDEO_INPUT, --video-input VIDEO_INPUT
                        Specify a video file path, image directory, rtsp stream address or camera value
  -p PORT, --port PORT
  -a ADDRESS, --address ADDRESS
  --loop                Loop video
  --fps FPS

```


# Samle usage
You can run this program inside docker container or as python script. The useage using docker and python is provided below. 
After running this script, video server should be available on http://localhost:6420/cam.mjpg with the default parameters as provided on the example. 

## Run using static video file path
docker run -v `pwd`:/opt/share -p 6420:6420 video_server --video-input /opt/share/sample.mp4 -p 6420

or 

python video_server.py  --video-input sample.mp4 -p 6420

## Run using static image folde
docker run -v `pwd`:/opt/share -p 6420:6420  video_server --video-input "/opt/share/image_dir/ezgif-frame-%03d.jpg" --port 6420

or 

python video_server.py --video-input "image_dir/ezgif-frame-%03d.jpg --port 6420
## Run using a stream address
docker run -v `pwd`:/opt/share -p 6420:6420  video_server --video-input rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mp4  --port 6420

or 

python video_server.py  --video-input rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mp4  -p 6420

## Run server that outputs your web camera
docker run -v `pwd`:/opt/share -p 6420:6420 video_server --video-input 0 --port 6420

or 

python video_server.py  --video-input 0 --port 6420


# docker
To test, run the following command from project directory. 
```
docker build -t video_server . && docker run -it -p 6420:6420 foo [YOUR ARGUMENT]
```
Example to change parameters for the docker image: 


```
docker run -it -p 6420:6420 video_server --video-input rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mp4 -p 6420

docker run -it video_server -v image_dir:/app/image_dir -p 6420:6420 foo --video-input /app/image_dir/ezgif-frame-%03d.jpg -p 6420

```

# embeading
You can also embead the incoming stream in a html site. 
Example:

```
<video src="http://0.0.0.0:6420/cam.mjpg" controls>
   Your browser does not support the <code>video</code> element.
</video>
```