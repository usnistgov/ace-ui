FROM python:buster
RUN apt-get update
RUN apt-get install ffmpeg libsm6 libxext6  -y
WORKDIR /usr/src/app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENTRYPOINT ["python", "./video_server.py" ]
