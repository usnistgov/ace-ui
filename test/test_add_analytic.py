import requests
import json

url = "http://0.0.0.0:5000/api/v1/add_analytic"


payload = json.dumps(
{"analytic_host": "192.168.255.30","analytic_name": "test_object_detector"}
)
headers = {
  'Content-Type': 'application/json'
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)
