import requests
import json
import sys
import argparse


#this script will register a analytic host with the ACE core endpoint url

#python3 test_register_analytic.py  -s $server  -a $analytic_host_name[:$port]  -n $analytic_name 
#python3 test/test_register_analytic.py -s 192.168.255.20 -a "192.168.255.10:3333" -n act_detector


parser = argparse.ArgumentParser()
parser.add_argument('-s', '--server', default="192.168.255.10", help='Specify an ACE server you want to register your analytic with')
parser.add_argument('-a', '--analytic_host', default="192.168.255.30[:3000]")
parser.add_argument('-n', '--analytic_name', default="test_object_detector")
args = parser.parse_args()
print(args)
server = args.server
analytic_host = args.analytic_host
analytic_name = args.analytic_name
 


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
