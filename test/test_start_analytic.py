import requests
import json

url = "http://192.168.255.10:5000/api/v1/config"

payload = json.dumps({"analytic_host": "192.168.255.20@mobilenet-object-detector","db_addr": "192.168.255.10:8086","messenger_addr": "192.168.255.10:4222","analytics_tag": "","stream_source": "http://192.168.255.10:6420/cam.mjpg"})
headers = {
  'Content-Type': 'application/json'
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)

