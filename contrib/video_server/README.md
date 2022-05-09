# Video Server 

ACE UI (the web controller interface for ACE)  provides a way to use custom sources as video input. You can use this project to stream different types of media for ace-ui or use it by itself for fun. 

We want to give credit to a gist post. Code from this [gist post](https://gist.github.com/n3wtron/4624820), was used as the baseline code for this project. 

This video_server.py script allows users to create a video streaming server. The python program can create a video stream from static video, image file directory, RTSP stream, and web camera. 
## Features
The project allows you to create an embeaddable and online accessible video server from-
* Web camera
* Static image file
* RTSP or network stream
* Online video file using URL


## Parameters & usage
```
usage: video_server.py [-h] [-v VIDEO_INPUT] [-p PORT] [-a ADDRESS] [-s SHAPE [SHAPE ...]]
                       [--loop [LOOP]] [-fps IN_FPS] [-out-fps OUT_FPS]

This script can be use to serve a media.

optional arguments:
  -h, --help            show this help message and exit
  -v VIDEO_INPUT, --video-input VIDEO_INPUT
                        Specify a video file path, rtsp stream address, camera value, or image
                        directory path. You may add a list of media inputs by passing multiple argumens
                        of video input parameter. Example python video_server -v video1.mp4 -v
                        video2.mp4 -v image_dir/ezgif-frame* -v 0 (default: ['sample.mp4'])
  -p PORT, --port PORT
  -a ADDRESS, --address ADDRESS
  -s SHAPE [SHAPE ...], --shape SHAPE [SHAPE ...]
                        output video shape. Should be width and heights int value seperated by space.
                        Example: -s 800 600 (default: None)
  --loop [LOOP]         loop video when video ends. (default: True)
  -fps IN_FPS, --in-fps IN_FPS
                        input media frames per second (default: 30)
  -out-fps OUT_FPS, --out-fps OUT_FPS, -t OUT_FPS
                        frame rate reduction ratio relative to the in_fps. Value must be a factor of
                        in_fps (default: 30)
                        
```


# Sample usage
You can run this program inside a docker container or as a python script. The usage for docker and python is provided below. 

After running this script, the video server should be available on `http://localhost:6420/cam.mjpg`. If the default port number was changed, 6420 needs to be updated with your new port number.  

## Run using static video file path
docker run -v `pwd`:/opt/share -p 6420:6420 video_server --video-input /opt/share/sample.mp4 -p 6420

or 

python video_server.py  --video-input sample.mp4 -p 6420

## Run using static image folder
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
To test, run the following command from this directory. 
```
docker build -t video_server . && docker run -it -p 6420:6420 video_server [YOUR OPTIONAL ARGUMENTS]
```
Example to change parameters for the docker image: 


```
docker run -it -p 6420:6420 video_server --video-input rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mp4 -p 6420

docker run -it video_server -v image_dir:/app/image_dir -p 6420:6420 video_server --video-input /app/image_dir/ezgif-frame-%03d.jpg -p 6420

```

# Even more usage
### Web embedding
You can embed the incoming stream on an html site. 
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
ACE UI (the web controller interface for ACE) provides a way to use custom sources as video input. You can use this project to stream your files for ACE-UI. 
1. If you are running video_server as a python script, you will need to expose the port of the video server and pass the public address of the host to the ACE-UI configuration page. The URL needs to be the public address of your machine ie: http://192.168.1.100:6420/cam.mjpg

2. If you are running this server inside a container, and you are going to be accessing the server in a different container inside the same machine, you can use the docker container name as the hostname. For instance, if the container name is video_server_1, you can submit this video url on the configuration page:  http://video_server_1:6420/cam.mjpg
