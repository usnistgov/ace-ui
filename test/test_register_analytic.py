import requests
import json
import sys

#this script will register a analytic host with the ACE core endpoint url

#python3 test_register_analytic.py   $server $analytic_host_name $analytic_name 

#ace core server
server="192.168.255.10"

#register analytic host with the ace gpu server
#.30 nano, .20 laptop .10 gpu server
analytic_host="192.168.255.30"
analytic_name="test_object_detector"

if len(sys.argv)>=4 :
  server=sys.argv[1]
  analytic_host=sys.argv[2]
  analytic_name=sys.argv[3]


url = "http://{}:5000/api/v1/add_analytic".format(server)
print("server url: {}, analytic host: {}, analytic name: {}".format(url, analytic_host, analytic_name))
#
payload = json.dumps(
{"analytic_host": analytic_host,"analytic_name": analytic_name}
)
headers = {
  'Content-Type': 'application/json'
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)
