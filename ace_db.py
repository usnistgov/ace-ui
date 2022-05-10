import json
import sqlite3
import uuid
from datetime import datetime, timedelta
from functools import reduce

import yaml


class AceDB:
    def __init__(self, db_name="databaseOFace.db", config_file="static/settings.yml"):
        self.con = sqlite3.connect(db_name)
        self.con.row_factory = sqlite3.Row
        if not self.table_exists():
            self.initialize_table()
            self.initialize_data(config_file)

    def table_exists(self, table_name="stream"):
        """
        We use this function to check database initialization
        :param table_name:
        :return:
        """
        cur = self.con.cursor()
        cur.execute("select count(*) from sqlite_master where type='table' and name=(?)", [table_name])
        return cur.fetchone()[0] == 1

    def initialize_table(self):

        create_table_statement = {
            "create_stream_table": "create table if not exists stream (id varchar primary key, url varchar unique, name varchar)",
            "create_analytics_table": "create table if not exists analytics (id varchar primary key, hostname varchar unique)",
            "create_configuration_table": "create table if not exists configuration (id varchar primary key, stream varchar, stream_id varchar, analytics varchar, analytics_id varchar)",
            "create_notification_configuration_table": "create table if not exists notification_configuration (id varchar primary key, configuration_id varchar, filter_json varchar)",

        }

        for key in create_table_statement:
            try:
                with self.con:
                    self.con.execute(create_table_statement[key])
            except sqlite3.OperationalError as e:
                print("couldn't add the tables twice")
                print(e)
            except Exception as e:
                message = "An exception of type {0} occurred. Arguments:\n{1!r}".format(type(e).__name__, e.args)
                print(message)

    def initialize_data(self, yaml_data_path):
        '''
        here we are generating initial data based on values from an yaml file.
        :return:
        '''

        with open(yaml_data_path) as file:
            config = yaml.load(file, Loader=yaml.FullLoader)
            for i in config["stream_source"]:

                try:
                    stream_name = next(iter(i))
                    strem_url = i[stream_name]

                    data_id = str(uuid.uuid3(uuid.NAMESPACE_DNS, i[stream_name]))
                    self.add_stream(data_id, strem_url, stream_name)
                except sqlite3.IntegrityError as e:
                    print("stream exists :" + i)
                    continue
                except Exception as e:
                    message = "An exception of type {0} occurred. Arguments:\n{1!r}".format(type(e).__name__, e.args)
                    print(message)
                    raise ValueError('Error inserting data')

            with open(config["docker_compose_location"]) as file:
                docker_compose_data = yaml.load(file, Loader=yaml.FullLoader)

                for key, value in docker_compose_data["services"].items():
                    try:
                        if (value["labels"]["type"] == "analytics"):
                            data_id = str(uuid.uuid3(uuid.NAMESPACE_DNS, key))
                            self.add_analytics(data_id, key)
                    except KeyError:
                        # Key is not present
                        continue
                    except sqlite3.IntegrityError as e:
                        print("stream exists :" + i)
                        continue
                    except Exception as e:
                        message = "An exception of type {0} occurred. Arguments:\n{1!r}".format(type(e).__name__,
                                                                                                e.args)
                        raise ValueError('Error inserting data')

            # for i in config["analytics"]:
            #     try:
            #         data_id = str(uuid.uuid3(uuid.NAMESPACE_DNS, i))
            #         self.add_analytics(data_id, i)
            #     except sqlite3.IntegrityError as e:
            #         print("analytics exists :" + i)
            #         continue
            #     except Exception as e:
            #         message = "An exception of type {0} occurred. Arguments:\n{1!r}".format(type(e).__name__, e.args)
            #         raise ValueError('Error inserting data')

    def add_stream(self, data_id, data, name=None):
        ## We are using stream url as name when name hasn't been passed as parameter.
        name = name or data
        with self.con:
            self.con.execute("INSERT INTO stream VALUES (?,?,?)", (data_id, data, name))
            self.con.commit()

    def add_analytics(self, data_id, data):
        with self.con:
            self.con.execute("INSERT INTO analytics VALUES (?,?)", (data_id, data))
            self.con.commit()

    def getUUID(self, _string):
        return str(uuid.uuid3(uuid.NAMESPACE_DNS, _string))

    def remove_config(self, data):
        """
        removes configuration and notification for a given analytics
        :param data:
        :return:
        """

        cur = self.con.cursor()
        cur.execute("select * FROM configuration WHERE analytics=?", [data])
        notification_rows = self.zip_rows(cur.fetchall())
        with self.con:
            for row in notification_rows:
                try:
                    self.con.execute("DELETE FROM notification_configuration WHERE configuration_id=?", [row["id"]])
                except IndexError:
                    pass
            self.con.execute("DELETE FROM configuration WHERE analytics=?", [data])
            self.con.commit()

    def add_config(self, stream, analytics, stream_name=None):
        data_id = self.getUUID("{}{}".format(stream, analytics))
        stream_id = self.getUUID(stream)
        analytics_id = self.getUUID(analytics)

        try:
            self.add_stream(stream_id, stream, stream_name)
        except sqlite3.IntegrityError as e:
            print("stream exists :" + stream)
        try:
            self.add_analytics(analytics_id, analytics)
        except sqlite3.IntegrityError as e:
            print("analytics exist :" + analytics)

        with self.con:
            self.con.execute("INSERT INTO configuration VALUES (?,?,?,?,?)",
                             (data_id, stream, stream_id, analytics, analytics_id))
            self.con.commit()

    def get_data(self, table_name):
        cur = self.con.cursor()
        cur.execute("select * from " + table_name)
        return self.zip_rows(cur.fetchall())

    def zip_rows(self, rows):
        data = []
        for row in rows:
            d = dict(zip(row.keys(), row))  # a dict with column names as keys
            data.append(d)
        return data

    def get_stream(self):
        return self.get_data("stream")

    def get_stream_stream_id(self, stream_id):
        cur = self.con.cursor()
        cur.execute("select * from stream where id = ?", [stream_id])
        rows = cur.fetchall()
        return self.zip_rows(rows)

    def get_analytics(self):
        return self.get_data("analytics")

    def get_configuration(self):
        data = self.get_data("configuration")

        def pivot_table(rows, data):
            if data["stream"] in rows:
                rows[data["stream"]]["analytics"].append(data["analytics"])
                rows[data["stream"]]["analytics_id"].append(data["analytics_id"])
                rows[data["stream"]]["id"].append(data["id"])
                rows[data["stream"]]["notification"].append(self.get_notification_by_config_id(data["id"]))

            else:
                rows[data["stream"]] = {"analytics": [data["analytics"]], "analytics_id": [data["analytics_id"]],
                                        "id": [data["id"]],
                                        "notification": [self.get_notification_by_config_id(data["id"])]}
            return rows

        return reduce(pivot_table, data, {})

    def get_notification_config(self):
        data = self.get_data("notification_configuration")
        return data


    def get_notification_by_config_id(self, config_id):
        cur = self.con.cursor()
        cur.execute("select * from notification_configuration where configuration_id = ?", [config_id])
        row = cur.fetchone()

        if row:
            data = dict(zip(row.keys(), row))
            data["filter_json"] = json.loads(data["filter_json"])
            print(data["filter_json"])
            data["csv"] = ", ".join(data["filter_json"].keys())
            return data

    def get_configuration_by_stream_id(self, stream_id):
        cur = self.con.cursor()
        cur.execute("select * from configuration where stream_id = ?", [stream_id])
        rows = cur.fetchall()
        return self.zip_rows(rows)

    def get_configuration_by_id(self, configuration_id):
        cur = self.con.cursor()
        cur.execute("select * from configuration where id = ?", [configuration_id])
        rows = cur.fetchall()
        return self.zip_rows(rows)

    def add_notification_configuration(self, config_id, data_json):
        config = self.get_configuration_by_id(config_id)
        if len(config) == 0:
            raise ValueError('This stream is missing')

        with self.con:
            self.con.execute("INSERT OR REPLACE INTO notification_configuration VALUES (?,?,?)",
                             [config_id, config_id, json.dumps(data_json)])
            self.con.commit()

    def get_decoded_notification_configuration(self):
        data = self.get_notification_config()
        decoded_data = {}
        for i in data:

            try:
                decoded_data[i["configuration_id"]] = json.loads(i["filter_json"])
            except json.decoder.JSONDecodeError:
                print("malformed notification data")
                print(i)
        return decoded_data


class Notifications:
    def __init__(self, acedb):
        self.aceDb = acedb

        self.cache = {}
        self.update_delta_interval = timedelta(seconds=10)
        self.last_update = datetime.now()

    def build_cache(self):
        data = self.aceDb.get_notification_config()
        for i in data:

            try:
                self.cache[i["configuration_id"]] = json.loads(i["filter_json"])
                for key in self.cache[i["configuration_id"]].keys():
                    self.cache[i["configuration_id"]][key]["last_update"] = datetime.now() - self.update_delta_interval
            except json.decoder.JSONDecodeError:
                print("malformed notification data")
                print(i)

    def time_to_send(self, configuration_id, object_name, seconds):
        print(object_name)
        print(self.cache[configuration_id][object_name]["last_update"])
        if (datetime.now() - self.cache[configuration_id][object_name]["last_update"]) > timedelta(seconds=seconds):
            self.cache[configuration_id][object_name]["last_update"] = datetime.now()
            return True
        else:
            return False

    def get_config(self):
        if self.cache == {} or (datetime.now() - self.last_update) > self.update_delta_interval:
            self.build_cache()
            self.last_update = datetime.now()
        return self.cache


def test():
    # t = AceDB(db_name="test.db")
    # t.initialize_table()
    t = AceDB()
    n = Notifications(t)
    # t.add_notification_configuration('e389b32a-385d-395c-a820-2b2d183a6dc3', data_json={"test":"1", "score":"2"})
    c = t.get_decoded_notification_configuration()
    # print("###########caceeeeeee")
    print(c)

    # t.add_config("rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov", "object_detector:3000")
    # t.add_config("http://wmccpinetop.axiscam.net/mjpg/video.mjpg", "object_detector:3000")
    # print(t.get_data("configuration"))
    # t.add_alerts("T", "a", )


if __name__ == '__main__':
    test()
