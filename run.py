#!/usr/bin/env python3

import asyncio
import os
from functools import reduce
from http import HTTPStatus
from sqlite3 import IntegrityError

import connexion
import eventlet
from ace import aceclient, analytic_pb2
from ace.messenger import NATSConsumer
from flask import send_from_directory, redirect
from flask_cors import CORS
from flask_socketio import SocketIO
from google.protobuf import json_format

from ace_db import AceDB, Notifications

# connexion.FlaskApp needs to be defined and initialized before defining handler functions
port = 5000
spec_dir = "openapi/"
app = connexion.FlaskApp(__name__, port=port, specification_dir=spec_dir)

sio = SocketIO(app.app, cors_allowed_origins="*")

db = AceDB()
db.initialize_table()


@sio.event
def connect():
    print('connect ')


@sio.event
def message(sid, data):
    print("received msg")
    print("Socket ID: ", sid)
    print("Socket data: ", data)


@sio.event
def disconnect(sid="unknown"):
    print('disconnected ' + sid)


# openapi configuration is using all of the functions defined below.
# See the openapi yaml file and look for operationId values. Read more https://github.com/zalando/connexion
# HELPER

def parse_tag(s):
    if not s:
        raise ValueError("Empty tag key")
    pieces = s.split("=", 1)
    while len(pieces) < 2:
        pieces.append("")
    return {pieces[0]: pieces[1]}


def analytic_add(remote):
    """
    This function adds a remote analytic to the database.
    :param analytic: Name, IP, Port defined in openapi/ace_api.yaml
    :return: uuid
    """
    analytic_name = remote.get("analytic_name")
    analytic_host = remote.get("analytic_host")
    uuid = db.getUUID("{}{}".format(analytic_name, analytic_host.split(":")[0]))
    data_id = '{}|{}'.format(uuid,analytic_name)
    db.add_analytics(data_id, analytic_host)
    return uuid
    

def analytics_configure_batch(analytics_list):
    """
    This function configures an analytics gets used by openapi handler.
    :param analytics_list:  Analytics List object is defined in oepnmapi/ace_api.yaml
    :return: messages
    """
    messages = []
    for analytics in analytics_list:
        message, code = analytics_configure(analytics)
        messages = message.get("message")
        if code == 400:
            return {"message": messages}, 400
    return {"message": messages}, 200


def analytics_configure(analytics):
    """
    This function configures an analytics gets used by openapi handler.
    :param analytics:  Analytics List object is defined in openapi/ace_api.yaml
    :return: messages
    """

    message = []
    error = []

    analytics_id = analytics.get("analytics_id")
    analytics_tag_string = analytics.get("analytics_tag") or ""
    stream_source = analytics.get("stream_source")
    stream_name = analytics.get("stream_label")
    messenger_addr = analytics.get("messenger_addr")
    db_addr = analytics.get("db_addr")
    analytic_host = analytics.get("analytic_host").split(":")[0]
    analytic_port = "3000"

    if not analytic_host:
        error.append("analytic_host parameter is required")
    if not analytic_port:
        error.append("analytic_port parameter is required")
    if not stream_source:
        error.append("stream_source parameter is required")
    if len(error) > 0:
        app.app.logger(error)
        return {"message": error}, 400

    tags = analytics_tag_string.split(",")
    tag_map = {}
    for tag_str in tags:
        if (tag_str in ["", " ", None]):
            continue
        tag_map.update(parse_tag(tag_str.replace(" ", "")))

    a = analytic_pb2.AnalyticData(addr="{!s}:{!s}".format(analytic_host, analytic_port))

    stream_id = db.getUUID("{}{}".format(stream_source, analytic_host))

    client = aceclient.ConfigClient(host=analytic_host, port=analytic_port)
    client.config(
        src=stream_source,
        analytic=a,
        messenger_addr=messenger_addr,
        db_addr=db_addr,
        tags=tag_map,
        stream_id=stream_id,
        return_frame=True,
    )
    message.append("added  {} on {} ".format(stream_source, client.addr))

    try:
        db.remove_config(analytic_host)
        db.add_config(stream=stream_source, analytics=analytic_host, stream_name=stream_name)

    except IntegrityError as e:
        print("value pairs exists on config database for stream and analytics host.")

    return {"message": message}, 200


def get_configuration_by_stream_id(stream_id):
    return db.get_configuration_by_stream_id(stream_id)


def analytics_kill_batch(analytics_list):
    """
    This function removes an analytics configuration
    :param analytics_list:  Analytics List object is defined in oepnapi/ace_api.yaml
    :return: messages
    """
    messages = []
    for analytics in analytics_list:
        message, code = analytics_kill(analytics)
        if code == 400:
            # end configuration when we see an error.
            messages = message.get("message")
            return {"message": messages}, 400
    return {"message": messages}, 200


def analytics_kill(analytics):
    """
    This function removes an analytics configuration
    :param analytics:  analytics object is defined in oepnapi/ace_api.yaml
    :return: messages
    """
    message = []
    error = []
    analytic_host = analytics.get("analytic_host")
    analytic_port = analytics.get("analytic_port")

    if not analytic_host:
        error.append("analytic_host parameter is required")
    if not analytic_port:
        analytic_port = "3000"
        # error.append("analytic_port parameter is required")
    if len(error) > 0:
        return error, 400
    client = aceclient.ConfigClient(host=analytic_host, port=analytic_port)
    client.kill()
    db.remove_config(analytic_host)
    message.append("Killed {}".format(client.addr))
    return message, 200


def get_analytics_list():
    """
    Generate a list of running analytics
    :return: analytics-list
    """
    data = []
    analytics = db.get_analytics()
    for value in analytics:
        try:
            data.append({
                "analytic_host": value["hostname"],
                "analytic_port": "3000",
                "analytic_id": value["id"],
                "analytic_status": "running",
            })
        except KeyError:
            # Key is not present
            continue

    return data, 200


def get_settings():
    """
    Generate ace configuration for front page
    :return: settings
    """

    streams = db.get_stream()
    settings = {
        "stream_source": [x["url"] for x in streams],
        "stream_label": [x["name"] for x in streams],
        "analytics": [x["hostname"] for x in db.get_analytics()],
        "messenger_addr": "nats_server:4222",
        "db_addr": "influxdb:8086",
        "configuration": {
            "data": db.get_configuration(),
            "_key": streams

        },

    }

    return settings


def fetch_configuration():
    """
    Get configuration from database
    :return:
    """
    return db.get_configuration()


def notification_configuration(notification):
    """
    notification created here.
    :return: messages
    """

    db.add_notification_configuration(notification["id"], notification["objects"])

    return "Added notification configuration", 200


def get_notification_configuration():
    """
    notification get all configured notifications.
    :return: messages
    """

    data = db.get_decoded_notification_configuration()
    return data, 200


def get_notification_configuration_by_id(config_id):
    """
    Alert created here.
    :return: messages
    """

    data = db.get_notification_by_config_id(config_id)

    if data is not None:
        return data, 200
    else:
        return None, HTTPStatus.NO_CONTENT


@app.route("/")
def send_home():
    return redirect("/app")


@app.route("/app/")
def send_app():
    """
    Serves react index.html.
    :return:
    """
    return send_from_directory("web-app/build", "index.html")


@app.route('/app/<path:path>')
def serve(path):
    """
    Serves any files from build directory path.
    :return:
    """
    path_dir = os.path.abspath("web-app/build")
    if path != "" and os.path.exists(os.path.join(path_dir, path)):
        return send_from_directory(os.path.join(path_dir), path)
    else:
        return send_from_directory(os.path.join(path_dir), 'index.html')


def deep_get(dictionary, keys, default=None):
    '''
    Helper function for walking though dictionary path
    :param dictionary:
    :param keys:
    :param default:
    :return:
    '''
    return reduce(lambda d, key: d.get(key, default) if isinstance(d, dict) else default, keys.split("."),
                  dictionary)


def consumeNatsMessage(notifications):
    """
    This function should be run from it's own thread. Here we are subscribing to Nats and forwarding the messages via socket-io
    :return:
    """

    # "stream." + object["id"] + ".analytic." + object["analytics"]

    def emitMsg(results):
        json_data = json_format.MessageToJson(results.get("data"))
        subject_data = results.get("subject").split(".")

        sio.emit(results.get("subject"), json_data)
        try:

            config_id = subject_data[1]
            analytic = subject_data[3]
            cache_matcher = notifications.get_config()
            matcher_objects = cache_matcher.get(config_id)
            """
            matcher_objects = {"person":{}}
            """

            if matcher_objects is not None:
                matcher_objects = matcher_objects.keys()
            else:
                return
            dict_data = json_format.MessageToDict(results.get("data"))
            roi_data = deep_get(dict_data, "data.roi")

            if roi_data is not None:
                for roi in roi_data:
                    object_name = deep_get(roi, "classification")
                    if object_name in matcher_objects:
                        if not notifications.time_to_send(config_id, object_name, 4):
                            return
                        notification = {
                            # "data": dict_data,
                            "classification": object_name,
                            "confidence": deep_get(roi, "confidence"),
                            "timestamp": deep_get(dict_data, "data.endTimeMillis"),
                            "config_id": config_id,
                            "analytic": analytic,
                        }
                        sio.emit("notification", notification)
                        sio.emit("{nats_topic}.notification".format(nats_topic=results.get("subject")), notification)

        except IndexError:
            print("malformed subject")

    loop = asyncio.new_event_loop()
    consumer = NATSConsumer(addr="nats_server:4222", loop=loop, callback_func=emitMsg,
                            value_deserializer=lambda value: analytic_pb2.ProcessedFrame().FromString(value), )
    consumer.subscribe("stream.*.analytic.*")
    loop.run_forever()


app.add_api("ace_api.yaml", arguments={"title": "ACE API"})
if __name__ == "__main__":
    ## we use eventlet to make things work with socketio
    # call to eventlet.monkey_patch is necessary to prevent threading error with eventlet+flask.
    eventlet.monkey_patch()
    eventlet.spawn(consumeNatsMessage, Notifications(acedb=db))
    app.app.config["CORS_HEADERS"] = "Content-Type"
    CORS(app.app)
    eventlet.wsgi.server(eventlet.listen(('', port)), app)
