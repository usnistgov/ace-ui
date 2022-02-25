# ACE UI Application
##  Introduction
The ACE UI Application is a small web-based application built upon the [ACE Framework](http://github.com/usnistgov/ace). This application allows end users to interact, monitor, and configure with underlying ACE environment from a web dashboard.

## Detailed Documentations 
* [Usage](docs/USAGE.md) Details on how to use the user interface.
* [Development](docs/DEVELOPMENT.md) Guide on how to create local environment for development.
* [Contribution](CONTRIBUTING.md) Guide on contributing to this repository



### Requirements

You'll want to these packages for running and testing the full codebase

* [docker](https://docs.docker.com/get-docker/)
* [docker compose](https://docs.docker.com/compose/install/)
* unix terminal with makefile installed. Most unix terminal has makefile installed by default. 
* ACE base containers and analytics built on the system (See the [ACE Framework](http://github.com/usnistgov/ace) for 
  more details on building these). TLDR: clone [ACE Framework](http://github.com/usnistgov/ace) and run `bash build.sh`
#### Deploy standalone WEB UI as docker-compose

*  cd web-app
*  update .env envirnonment variable to reflect ACE service endpoint
*  rm -rf build node_modules
*  docker build -t datamachines/ace-ui-react:${APP_VERSION} .
*  cd ..
*  make start-web
*  you could access web ui via http://localhost

