# Code modules

## ACE-API

ACE API has three layers (socket-io, open-api, and Flask) , all served from ./run.py. When the flask app receives a
request it goes through the layers for handling any incoming request.

* If the incoming request protocol matches socket-io, it gets handled first
* Next, it matches the request against open-api protocol
* Finally, any unhandled request gets forwarded to flask

#### socket-io

We use socket-io to stream real-time events. NATs messages are forwarded via socket-io.

#### open-api

The api server is self-documenting! The documentation page can be accessed from /api/v1/ui after running run.py script

[Read more about open-api specs](https://michal.karzynski.pl/blog/2016/06/19/building-beautiful-restful-apis-using-flask-swagger-ui-flask-restplus/)

#### flask

Flask module for serving static files build from ace-ui

### Installation / Running the ACE-UI (Python) code locally

* Install [python](https://www.python.org/downloads/release/python-380/)
* Install [venv](https://docs.python.org/3/library/venv.html)
* Install the python dependency by running `pip install -r requirement` from the project root directory. You may want to
  create a [virtual environment](https://docs.python.org/3/library/venv.html) first

_running local python code for development_

```
python3 -m venv env
source env/bin/activate
pip install -r requirement.txt
python run.py
```

_for test_

```sh
pytest ./test
```

### Code structure for python backend

There are three components to python application

* [run.py](../run.py) contains API related code. We use open-api for linking the python functions with the API
  endpoints. Please see [openapi/ace_api.yaml](../openapi/ace_api.yaml) for how the API was designed. Furthermore, when
  you run the python code, an UI for the API is available on `http://[root_url]/api/v1/ui`
* [ace_db.py](../ace_db.py) contains code for linking database with the API. For database, we are using
  [sqlite3](https://docs.python.org/3/library/sqlite3.html).
* [Tests](../test) direcotry contains test code for python module. We try our best to write test code here.

## ACE-ui (Web App)

The code for ACE web interface is located on [web-app](../web-app/) directory. This was build using a base react
template from https://github.com/hanyuei/react-material-admin (MIT licensed)

Additional documentation for ACE-web app is available on ./web-app/README.md React framework was used for building the
user interface.

### Installation / Running the ACE-UI (Web-APP) code locally

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

### Code structure for NodeJS modules

The front end is written in Javascript and typescript and packaged with NodeJS. Code structure is the following:
* The javascript code is located on [web-app/src](../web-app/src) directory
* Code for each individual page is on [web-app/src/pages](../web-app/src/pages)
* Code for components that makes up the pages is on [web-app/src/components](../web-app/src/components). Here component for individual page may have their sub folders.


## Infrastructure and configuration

We use N, Grafana, Nats.io and several other components in the background to run this system.

* [../nginx](../nginx) directory contains configuration on how the reverse proxy was setup for this application.
* [../grafana](../grafana) directory contains configuration on Grafana. See
  the [docker-compose.yaml](../docker-compose.yml) to learn about how these directories are mounted to nginx and Grafana
  containers. 