Video Server
Credit: Initial code was copied from:  https://gist.github.com/n3wtron/4624820
This project allows users to create a video streaming server. The python program can stream from static video, image file directory, RTSP stream, and web camera.

Features
The project allows you to create a video server from-

Web camera
Static image file
RTSP or network stream
Online video file


Parameters & usage

optional arguments:
  -h, --help            show this help message and exit
  -v VIDEO_INPUT, --video-input VIDEO_INPUT
                        Specify a video file path, static image folder, rtsp stream address or camera i/o value
  -p PORT, --port PORT
  -a ADDRESS, --address ADDRESS
  --loop                Loop video




## Building container
### docker
To test, run the following command from this directory.

docker build -t video_server . && docker run -it -p 6420:6420 foo [YOUR ARGUMENT]

# Usage examples
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




Example to change parameters for the docker image:

docker run -it -p 6420:6420 foo --video-input rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov -p 6420

docker run -it foo -v image_dir:/app/image_dir -p 6420:6420 foo --video-input ezgif-frame-%03d.jpg -p 6420




embeading
The video URL could be embedded on external applications or web pages.