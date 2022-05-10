import requests
import json
import argparse
#this script will start  an  analytic 

#python3 test_start_analytic.py  -s $server  -a $analytic_host_name[:$port]  -n $analytic_name 
#python3 test/test_start_analytic.py -s 192.168.255.20 -a "192.168.255.10:3333" -n act_detector


parser = argparse.ArgumentParser()
parser.add_argument('-s', '--server', default="192.168.255.10", help='Specify an ACE server you want to notification to occur')
parser.add_argument('-a', '--analytic_host', default="192.168.255.30[:3000]", help="Specify analytic host name:port")
parser.add_argument('-n', '--analytic_name', default="test_object_detector")
args = parser.parse_args()
print(args)
server = args.server
analytic_host = args.analytic_host
analytic_name = args.analytic_name


url = "http://{}:5000/api/v1/config".format(server)

print("server url: {}, analytic host: {}, analytic name: {}".format(url, analytic_host, analytic_name))
#python3 test_register_analytic.py   $server $analytic_host_name $analytic_name 


payload = json.dumps({"analytic_host": "{}@{}".format(analytic_host, analytic_name),"db_addr": "{}:8086".format(server),"messenger_addr": "{}:4222".format(server),"analytics_tag": "","stream_source": "http://{}:6420/cam.mjpg".format(server)})
headers = {
  'Content-Type': 'application/json'
}



response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)

