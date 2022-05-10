import globalStyles from "../styles";
import Grid from "@material-ui/core/Grid";
import { green } from "@material-ui/core/colors";
import { Button } from '@material-ui/core';

import Box from '@material-ui/core/Box';
import ClientComponent from "../components/analytics/Socket";
import { Delete, Save } from "@material-ui/icons";
import PropTypes from "prop-types";
import { CSVLink } from "react-csv";
import React, { useEffect, useState } from "react";
import IndexedDb from '../components/analytics/IndexedDb';
const propTypes = {

    match: PropTypes.any, // eslint-disable-line


};
//
// const stateTypes = {
//     settings:  PropTypes.any,
//     notification_data: PropTypes.any,
//     stream_notifications: PropTypes.any,
//     analytics_data: PropTypes.any,
//     data: PropTypes.arrayOf(PropTypes.object),
//
// };
const headers = [
    { label: "analytics", key: "analytics" },
    { label: "analytics id", key: "analytics_id" },
    { label: "id", key: "id" },
    { label: "stream url", key: "stream" },
    { label: "stream id", key: "stream_id" },
    { label: "Detected object", key: "classification" },
    { label: "Confidence", key: "confidence" },
    { label: "Frame Number", key: "frameNum" },
    { label: "Timestamp", key: "timestamp" },
   // { label: "Tags", key: "tags" },
    { label: "Session Id", key: "sessionId" },
    { label: "analytics json", key: "analytics_json"},
    { label: "data json", key: "data_json"},
    { label: "frame Json", key: "frame_json"}
];
var initdata={analytics: "opencv-object-detector",
analytics_id: "",
analytics_json: "",
classification: "",
confidence: 0.1,
data_json: "{}",
frameNum: "",
frame_json: "",
id: "",
sessionId: "",
stream: "",
stream_id: "",
timestamp: 1650419200
}

 
 const indexedDb = new IndexedDb('analyatic');
 const csvLink = React.createRef<any>()
class StreamPage extends React.Component<PropTypes.InferProps<typeof propTypes>, any> {



    constructor(props) {
        super(props);
        this.state = {


            streamName: this.props.match.params.handle,
            loading: false,
            processing: false,
            data: [],
            csvdata: [initdata],
            alert: [{ score: 3, logic: "<" }, { score: 50, logic: ">" }, { score: 50, logic: ">" }]
        };
       
    };


  /**
   * 
   * @param object  the alanytic object
   *
   */
  async export(object) {

       
        var key=object['id'] +object["analytics"];
        
       
        var thedata: any[] = [initdata];
        await indexedDb.createObjectStore([key])
        var objectstr = await indexedDb.getValue(key, 1);
       // var objectstr = localStorage.getItem(key);
        var objectdata = objectstr ? JSON.parse(objectstr['data']) : null;
       

        if (objectdata) {

            for (var i in objectdata) {

                var d = {}
                for (var j in object) {
                  
                    d[j] = object[j]
                }
                d['classification'] = i;
                var framedata = objectdata[i];
               //console.log(framedata);
               //console.log(framedata.length);
                for (let k = 0; k < framedata.length; k++) {
                     
                    var fd=d;
                    fd['confidence'] = framedata[k].data.roi[0].confidence;
                    fd['frameNum'] = framedata[k].frame.frameNum;
                    fd['timestamp'] = framedata[k].frame.timestamp;
                    //d['tags'] = framedata[k].data.tags;
                    fd['sessionId']= framedata[k].sessionId;
                    fd['analytics_json']=JSON.stringify(framedata[k].analytic);
                    fd['data_json']=JSON.stringify(framedata[k].data);
                    fd['frame_json']=JSON.stringify(framedata[k].frame);
                    thedata.push(fd);
                    //console.log(fd);
                    //console.log("--------")
                }


            }
        }
       
        this.setState({csvdata: thedata});

        return thedata;
    };

    exportcsv = async(event, object)  =>{
        
        if(!this.state.processing){
             this.setState({ processing: true });
        }
        else{
       
        var data=await this.export(object);
        this.setState({csvdata: data, processing: false});
              
        
        csvLink?.current?.click()

       
      

        }
    }
    async configKill(analyticsName, id) {
        
        var  analytic_host=analyticsName
        var analytic_port=3000
        if (analyticsName.includes('@')){
          analytic_host=  analyticsName.split('@')[1]
          if(analytic_host.includes(':')){
             analytic_host  =  analyticsName.split(':')[0]
             analytic_port =  analyticsName.split(':')[1]
          }
        }
        var API_URL = '/api/v1/kill';
        if (process.env.REACT_APP_API_URL) {
            API_URL = process.env.REACT_APP_API_URL + API_URL
        }

        const params = {
            "analytic_host": analytic_host,
            "analytic_port": analytic_port
        };

        await indexedDb.deleteValue(id+analyticsName, 1);
        //localStorage.removeItem(id+analyticsName+"_data");
        //localStorage.removeItem(id+analyticsName+"_metadata");
        this.setState({ loading: true });
        const response = await fetch(API_URL, {
            method: 'POST',
            mode: 'cors',
            headers: {
                //  'Accept': 'accept: */*',
                //    'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params),
        }).catch(error => {
            this.handleRequestError(error);
        });

        if (response) {
            var body_json = await response.json();

            if (response.ok) {
                this.handleRequestOk(body_json.join(body_json))
            } else {
                this.handleRequestError(JSON.stringify(body_json))
            }
        }

    }

    handleRequestError(msg) {
        this.setState({ loading: false });

    }

    handleRequestOk(msg) {
        this.setState({ loading: false });
        this.componentWillMount();

    }


    componentWillMount() {
        var API_URL = '/api/v1/config/stream/' + this.state.streamName;
        if (process.env.REACT_APP_API_URL) {
            API_URL = process.env.REACT_APP_API_URL + API_URL
        }

        fetch(API_URL)
            .then((response) => response.json())
            .then((responseJson) => {
          
                 this.setState({ data: responseJson })
            })
            .catch((error) => {
                console.error(error);
                this.setState({ data: [] })
            });

    }


    render() {

        const addNotification = () => {

            this.setState({ alert: [...this.state.alert, { score: 3, logic: "<" }] })


        };
        const styles = {

            iconSpan: {
                float: "left",
                height: 90,
                width: 90,
                textAlign: "center",
                backgroundColor: green[600]
            },
            icon: {
                height: 48,
                width: 48,
                marginTop: 20,
                maxWidth: "100%"
            }
        };




        return (

            <div>

                <h1 style={globalStyles.navigation}>stream/{this.state.streamName}</h1>

                <h3>Information:</h3>
                {!this.state.data || !(this.state.data?.length > 0) ? "No info found"
                    :
                    <div>

                        <h3 style={globalStyles.navigation}> Running: {this.state.data.length} analytics on <a
                            href={this.state.data[0]["stream"]} target="_blank">{this.state.data[0]["stream"]}</a></h3>

                    </div>
                }







                <h3>Event streams</h3>

                <Grid container spacing={3}>


                    {!this.state.data || !(this.state.data.length > 0) ? "No info found" : this.state.data.map(object =>
                        <Grid item xs={12} sm={6} md={6}>

                            <Box display="flex" flexDirection="column" border={2} borderColor="secondary.main"
                                borderRadius={16} m={1} p={2}>
                                <Button
                                    onClick={() => this.configKill(object["analytics"], object['id'])}
                                    variant="contained"
                                    color="secondary"
                                    startIcon={<Delete />}
                                >
                                    Delete
                                </Button>
                                <p></p>
                            {this.state.csvdata && this.state.csvdata.length>0 ? 
                                    <Button variant="contained"  onClick={(event) =>this.exportcsv(event, object)}
                                    color="primary"
                                    startIcon={<Save />}>
                                        export
                                  <CSVLink 
                                  data={this.state.csvdata}
                                  headers={headers}
                                  filename="detected-objects_reports.csv"
                                  target="_blank"
                                  >
                                <span ref={csvLink}></span>
                                    
                                    </CSVLink>
                                  </Button>
                                    : <p></p>
                            }

                                <ClientComponent
                                    url={this.state.data[0]["stream"]}
                                    subject={"stream." + object["id"] + ".analytic." + object["analytics"]}
                                    title={object["analytics"]} configId={object["id"]} />

                            </Box>

                        </Grid>
                    )
                    }

                </Grid>


            </div>

        );
    }
}


export default StreamPage;
