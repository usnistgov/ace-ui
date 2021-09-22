# ACE UI Application
##  Introduction
The ACE UI Application is a small web-based application built upon the [ACE Framework](http://github.com/usnistgov/ace). This application allows end users to interact, monitor, and configure with underlying ACE environment from a web dashboard. A preconfigured docker-compose file is provided with an example setup, but customization and extension of the application (e.g., additional or different analytics) is possible through modifying configuration files.

## Detailed Documentations 
* [Usage](docs/USAGE.md) Details on how to use the user interface.
* [Development](docs/DEVELOPMENT.md) Guide on how to create local environment for development.
* [Contribution](CONTRIBUTING.md) Guide on contributing to this repository


## Quick Start
### Requirements
* docker
* docker-compose
* unix terminal with makefile installed
* ACE base containers and analytics built on the system (See the [ACE Framework](http://github.com/usnistgov/ace) for more details on building these)

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

### Running Application
1. Build the required docker containers by running `make build`. 
2. start the application run `make start`
3. Using a web browser, go to this URL  http://localhost:8999/app/ to access the ACE UI


### Makefile shortcuts
To make development easier, a makefile was included. Run `make help` from the root of the project to see the documentation. As of writing this README, you can use the following options:

```
$make help
help                           This help.
dev                            install requirements.txt
build                          Build ace containers
start                          start ace stack using docker-compose
stop                           stop ace stack using docker-compose
```
