# Video Server 

ACE UI provides a way to use custom source as video input. You can use this project to stream different types of media for ace-ui or just for yourself for fun. 

We want to give credit for the codes for video_server.py to  [gist post](https://gist.github.com/n3wtron/4624820) Post from the gist post lined was used as baseline as code for this project. 

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

# Even more usage
### embeading
You can also embead the incoming stream on a html site. 
Example:

```
 <html>
<head></head>
<body>
    <img src="http://0.0.0.0:6420/cam.mjpg"/>
</body>
</html>
```

## Passing video server address on ace-ui
ACE UI provides a way to use custom source as video input. You can use this project to stream your files for ace-ui. 
1. If you are running it as a python script, you will need to expose the port of the video server and pass the public address of the host to the ace-ui configuration page. The URL needs to be the public address of your machine ie: http://192.168.1.100:6420/cam.mjpg

2. If you are running this server inside a container, and you are going to be accessing the server in a different container inside the same machine, you can use the docker container name as hostname. For instance, if the container name is video_server_1, you can submit this video url on the configuration page:  http://video_server_1:6420/cam.mjpg
