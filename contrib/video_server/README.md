# Video Server 
Credit: Initial code was copied form: https://gist.github.com/n3wtron/4624820

This project allows users to create a video streaming server. The python program can stream from static video, RTSP stream and web camera. 
## Features
The project allows you to create video server from-
* Web camera
* Static local file
* rtsp or network stream
* Online video file


## Arguements
```
optional arguments:
  -h, --help            show this help message and exit
  -v VIDEO_INPUT, --video-input VIDEO_INPUT
                        Specify a video file path, rtsp stream address or camera value
  -p PORT, --port PORT
  -a ADDRESS, --address ADDRESS
  --loop                Loop video

```


# docker
To test, run the following command from project directory. 
```
docker build -t foo . && docker run -it -p 6420:6420 foo [YOUR ARGUEMENT]
```
Example to change parameters for the docker image: 
`docker run -it -p 6420:6420 foo -v rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov -p 8000`