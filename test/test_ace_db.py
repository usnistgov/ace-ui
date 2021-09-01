import os
from unittest import TestCase

import ace_db


class TestAceDB(TestCase):
    def get_new_db(self):
        db_name = "test_database.db"
        try:
            os.remove(db_name)
        except OSError:
            pass
        return ace_db.AceDB(db_name)

    def test_initialize_table(self):
        db = self.get_new_db()
        self.assertFalse(db.table_exists("dining"), msg="dining table exists, this should not exist")
        self.assertTrue(db.table_exists("stream"), msg="stream table missing")
        self.assertTrue(db.table_exists("analytics"), msg="analytics table missing")
        self.assertTrue(db.table_exists("configuration"), msg="configuration table missing")
        self.assertTrue(db.table_exists("notification_configuration"), msg="alert table missing")
        cur = db.con.cursor()
        data = cur.execute("select count(*) from sqlite_master where type='table' ")
        self.assertEqual(data.fetchone()[0], 4, msg="Number of tables isn't equal to 4. Fix test cases")

    def test_add_notification_configuration(self):
        db = self.get_new_db()
        stream_data = ["http://a.com", "http://a.com", "http://a.com", "http://a.com"]
        analytics_data = ["analytics1", "analytics2", "analytics3", "analytics4"]

        db.add_config(stream_data[1], analytics_data[1], "test_label")
        db.add_config(stream_data[2], analytics_data[2], "test_label")
        db.add_config(stream_data[3], analytics_data[3], "test_label")
        data_id = db.getUUID(
            "{}{}".format("rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov", "object_detector:3000"))
        print(data_id)
        self.assertRaises(ValueError, db.add_notification_configuration, "Does Not exist", "B")
        try:
            db.add_notification_configuration(db.getUUID("{}{}".format(stream_data[1], analytics_data[1])),
                                              '{"data" :"SMOE MORE DATA"}')
            db.add_notification_configuration(db.getUUID("{}{}".format(stream_data[2], analytics_data[2])),
                                              '{"data" :"SMOE MORE DATA"}')
            db.add_notification_configuration(db.getUUID("{}{}".format(stream_data[3], analytics_data[3])),
                                              '{"some_more" :"SMOE MORE DATA"}')
        except ValueError:
            self.fail("test_add_alerts failed")

        data = db.get_data("notification_configuration")
        print(data)
        self.assertNotEqual(len(data), 0, msg="No data found")
        self.assertEqual(len(data), 3, msg="Alert table does not have required number of rows")
        self.assertEqual(len(data[0]), 3, msg="Alert table does not have required number of columns")

    def test_get_stream_by_id(self):
        db = self.get_new_db()
        stream = "something.mp4"
        id = db.getUUID(stream)

        try:
            db.add_stream(id, stream)
            data = db.get_stream_stream_id(id)
            print(data)
            self.assertEqual(data[0]["url"], stream)
            self.assertEqual(data[0]["id"], id)
        except Exception:
            self.fail("failed")

    def test_config_add_remove_get(self):
        db = self.get_new_db()

        streams = ["rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov", "http://wmccpinetop.axiscam.net/mjpg/video.mjpg"]
        analytics = ['object_detector:3000', 'object_detector:3000']

        db.add_config(streams[0], "object_detector:3000",
                      "test_label")
        config_id = db.add_config(streams[1], "object_detector:3000")
        data = db.get_data("configuration")
        self.assertNotEqual(len(data), 0)
        self.assertEqual(len(data), 2, msg="configuration table does not have required number of rows")
        self.assertEqual(len(data[0]), 5, msg="configuration table does not have required number of columns")
        data = db.get_configuration_by_id(db.getUUID(
            "{}{}".format("rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov", "object_detector:3000")))
        self.assertEqual(len(data), 1, msg="configuration table lookup failed")

        ### TEST GET
        data = db.get_configuration()
        self.assertEqual( data[streams[0]]["analytics"][0], analytics[0], msg="configuration table lookup failed")
        self.assertEqual( data[streams[0]]["analytics_id"][0],  db.getUUID(analytics[0]), msg="configuration table lookup failed")
        ### TEST REMOVE
        db.remove_config("object_detector:3000")
        data = db.get_data("configuration")
        self.assertEqual(len(data), 0)


    def test_get_configuration(self):
        db = self.get_new_db()
        db.add_config("rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov", "object_detector:3000",
                      "test_label")
        config_id = db.add_config("http://wmccpinetop.axiscam.net/mjpg/video.mjpg", "object_detector:3000")
        data = db.get_data("configuration")
        self.assertNotEqual(len(data), 0)
        self.assertEqual(len(data), 2, msg="configuration table does not have required number of rows")
        self.assertEqual(len(data[0]), 5, msg="configuration table does not have required number of columns")
        data = db.get_configuration_by_id(db.getUUID(
            "{}{}".format("rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov", "object_detector:3000")))
        self.assertEqual(len(data), 1, msg="configuration table lookup failed")
        db.remove_config("object_detector:3000")
        data = db.get_data("configuration")
        self.assertEqual(len(data), 0)

