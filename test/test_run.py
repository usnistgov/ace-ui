
from unittest import TestCase

import run



class TestRun(TestCase):
    # def test_connect(self):
    #     self.fail()
    #
    # def test_message(self):
    #     self.fail()
    #
    # def test_disconnect(self):
    #     self.fail()
    #

    #
    # def test_analytics_configure_batch(self):
    #     self.fail()
    #
    # def test_analytics_configure(self):
    #     self.fail()
    #
    # def test_get_configuration_by_stream_id(self):
    #     self.fail()
    #
    # def test_analytics_kill_batch(self):
    #     self.fail()
    #
    # def test_analytics_kill(self):
    #     self.fail()
    #
    # def test_get_analytics_list(self):
    #     self.fail()
    #
    def test_get_settings(self):
        settings_data = run.get_settings()
        assert type(settings_data.get("stream_source")) == list
        assert type(settings_data.get("stream_label")) == list
        assert type(settings_data.get("analytics")) == list
        assert type(settings_data.get("messenger_addr")) == str
        assert type(settings_data.get("db_addr")) == str
        assert type(settings_data.get("configuration")) == dict


    def test_get_settings(self):
        assert run.parse_tag("test=example") == {'test': 'example'}
        assert run.parse_tag("test") == {'test': ''}

    #
    # def test_fetch_configuration(self):
    #     self.fail()
    #
    # def test_notification_configuration(self):
    #     self.fail()
    #
    # def test_get_notification_configuration(self):
    #     self.fail()
    #
    # def test_get_notification_configuration_by_id(self):
    #     self.fail()
    #
    # def test_send_home(self):
    #     self.fail()

    # def test_send_app(self):
    #     self.fail()
    #
    # def test_serve(self):
    #     self.fail()

    def test_deep_get(self):
        dict_data = {"lv1": {"lv2": {"lv3": {"lv4": "needle"}}}}
        assert  run.deep_get(dict_data, "lv1.lv2.lv3.lv4") == 'needle'


    # def test_consume_nats_message(self):
    #     self.fail()
