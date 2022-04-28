import requests
import json

#this script will start  an  analytic 

#python3 test_start_analytic.py   $server $analytic_host_name $analytic_name 


#register analytic host with the ace gpu server
#.30 nano, .20 laptop .10 gpu server
analytic_host="192.168.255.30"
analytic_name="test_object_detector"

#local server, in general,this should be ace core where all client send result and notification to 
#in our setup, this is the gpu server in data center
server="192.168.255.10"


if len(sys.argv)>=5 :
  server=sys.argv[1]
  analytic_host=sys.argv[2]
  analytic_name=sys.argv[3]
  local_openvpn_server_name=sys.argv[4]

url = "http://{}:5000/api/v1/config".format(server)

print("server url: {}, analytic host: {}, analytic name: {}".format(url, analytic_host, analytic_name))
#python3 test_register_analytic.py   $server $analytic_host_name $analytic_name 


payload = json.dumps({"analytic_host": "{}@{}".format(analytic_host, analytic_name),"db_addr": "{}:8086".format(server),"messenger_addr": "{}:4222".format(server),"analytics_tag": "","stream_source": "http://{}:6420/cam.mjpg".format(server)})
headers = {
  'Content-Type': 'application/json'
}



response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)

