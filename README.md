# ACE UI Application
##  Introduction
The ACE UI Application is a small web-based application built upon the [ACE Framework](http://github.com/usnistgov/ace). This application allows end users to interact, monitor, and configure with underlying ACE environment from a web dashboard. A preconfigured docker-compose file is provided with an example setup, but customization and extension of the application (e.g., additional or different analytics) is possible through modifying configuration files.

## Quick Start
### Requirements
* docker
* docker-compose
* unix terminal with makefile installed
* ACE base containers and analytics (See the [ACE Framework](http://github.com/usnistgov/ace) for more details on building these)

### Build and configure the Application
* Run `make docker-build` to build the ACE API server docker container
* To use local video files for testing, drop those files into this directory and update the `docker-compose.yml` file so that one of the video_file containers references your file (and example is shown below)
``` 
video_file_1:
    image: video_server:demo
    restart: always
    labels:
      type: video
    volumes:
      - $PWD:/videos
    command:
      - "-v"
      - "/videos/{video filename}"      # Replace "{video filename}" with the name of your video file
```
Two local video files can be configured this way using the example docker-compose deployment provided.

For additional information on configuring the application see the [documentation](docs)

### Running the Application
To start the applciation run `make docker start`

To UI can now be accessed at: http://localhost:5000/  


# Detailed Information

### ACE API docker container
This project supplies with a docker environment. To build the attached docker image, follow these steps:

1. We will need the ace deployment docker image (datamachines/nist-ace:0.1). Run the build.sh script from ACE repository to generate this image. See for more information https://github.com/usnistgov/ACE#example-deployment 
2. Run `docker build -t datamachines/ace-ui:0.1 .` from the root of the project to generate the docker image
3. Run  `docker run -p 5000:5000 datamachines/ace-ui:0.1` to start an instance of ace-ui
4. Access the UI
    To access the management UI, visit: http://localhost:5000/  
    To access the API documentation, visit http://localhost:5000/api/v1/ui

### Makefile shortcuts
To make development easier, a makefile was included. Run `make help` from the root of the project to see the documentation. As of writing this README, you can use the following options:

```
$make help
help                           This help.
python-start                   start local python server
pip-install                    install requirements.txt
docker-build                   Build the container
docker-build-nc                Build the container without any cache
docker-run                     Run container
docker-up                      Build and run this project in a container
docker-stop                    Stop and remove container running this project
start-ace                      start ace stack using docker-compose
```


### ACE-api
ACE API has three layers (socket-io, open-api, and Flask) , all served from ./run.py. When the flask app receives a request it goes though the layers for handling any incoming request.
* If the incoming request protocol matches socket-io, it gets handled first
* Next, it matches the request against open-api protocol
* Finally any unhandled request gets forwarded to flask

#### socket-io
We use socket-io to stream real-time events. NATs messages are forwarded via socket-io.

#### open-api
The api server is self-documenting! The documentation page can be accessed from /api/v1/ui after running run.py script

[Read more about open-api specs](https://michal.karzynski.pl/blog/2016/06/19/building-beautiful-restful-apis-using-flask-swagger-ui-flask-restplus/)

#### flask
Flask module is used for serving static files build from ace-ui


### ACE-ui (Web App)
additional documentation for ACE-web app is available on ./web-app/README.md React framework was used for building the user interface.

### Installation / Running

_for dev_

```sh
git clone <repository-url>

cd ace-api/web-app
# change into the new directory
npm install

npm start # will run the app and open it on your browser window. Note that your system must resolve hostnames such as nats_server


```

_for test_

```sh
npm run test
```

_for Production_

```sh
npm run build

cd build

# start a static server serving ./build dir, eg node serve/http-server or serve in express using express.static
serve -s build
```
