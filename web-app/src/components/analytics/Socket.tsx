import React, { useEffect, useState } from "react";
import socketIOClient, { io } from "socket.io-client";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Box, FormControl, FormLabel, Radio, RadioGroup } from '@material-ui/core';
import ClientFrame from "./SocketFrame";
import ImageFrameCard from "./ImageFrameCard";
//import MjpegPlayerComponent from './MjpegPlayer';

export default function ClientComponent({ url, subject, title, configId }) {
    const subject_addr = subject;
    const [socketdata, setSocketData] = useState("");
    const source_url = url;
    const PROCESSING = 'Now processing:';
    let ENDPOINT = "/";
    if (process.env.REACT_APP_API_URL) {
        ENDPOINT = process.env.REACT_APP_API_URL
    }

    const [jsonData, setJson] = useState({ "frame": undefined, "objects": [], "timestamp": undefined, "unique": [] });
    const [objects, setObjects] = useState({});
    const [dataView, setDataView] = React.useState('all');
    const [actionMessage, setActionMessage] = React.useState(PROCESSING);
    const [state, setState] = React.useState({
        showRaw: false,
        checkedRawInput: false,
        notification_configuration: { "filter_json": [] },
        counts: {},
        alertTextBox: undefined,
        matchers: [],


    });
    const [frame, setFrame] = useState();

    
    // save data to localStorage 
    const saveStateToLocalStorage = (objects, metadata) => {
        try{
        localStorage.setItem(configId +title+ '_data', JSON.stringify(objects));
        localStorage.setItem(configId +title+ '_metadata', JSON.stringify(metadata));
        }catch (e) {
            localStorage.clear();
        }
    }





    const getNotificationConfiguration = async () => {

        let API_URL = '/api/v1/notification_configuration/' + configId;
        if (process.env.REACT_APP_API_URL) {
            API_URL = process.env.REACT_APP_API_URL + API_URL
        }
        let response = await fetch(API_URL, {
            method: 'GET',
            mode: 'cors',
            headers: {
                //  'Accept': 'accept: */*',
                // 'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
        }).catch(error => {

            // this.handleRequestError(error);
        });
        if (response && response.status == 200) {
            setState({ ...state, ["notification_configuration"]: await response.json() });
        }
        else{
              //restore objects from local storage if it's empty 
    if (objects == null || Object.keys(objects).length === 0) {
        
        let metadata = localStorage.getItem(configId+title + '_metadata');
        metadata ? setJson(JSON.parse(metadata)) : true;
       
        let data = localStorage.getItem(configId + title+'_data');
        if(data){
            setActionMessage("Processed:");
            setObjects(JSON.parse(data));
        }

        data ? setObjects(JSON.parse(data)) : console.log("empty state");



    }

        }

    }


    useEffect(() => {

        const socket = io(ENDPOINT);
        socket.on(subject_addr, raw_data => {
            let j = JSON.parse(raw_data);

            setSocketData(raw_data);
            let data = jsonData;
            let tmp_objects = objects;
            try {
                if (actionMessage != PROCESSING) {
                    setActionMessage(PROCESSING);
                }
                if (j.data?.roi?.length > 0) {

                    for (let x of j.data.roi) {
                        let classificationName = x.classification;
                        if (classificationName === undefined) {
                            continue;
                        }
                        if (tmp_objects[classificationName] === undefined) {
                            tmp_objects[classificationName] = [];
                        }
                        tmp_objects[classificationName].unshift(j)
                    }
                }
                if (j.frame?.frame?.img !== undefined) {
                    setFrame(j.frame.frame.img);
                }
                //We are setting data to previous values, if the object is not defined.
                data["frame"] = j.frame?.frameNum ?? data["frame"];
                data["timestamp"] = j.frame?.timestamp ?? data["timestamp"];

            } finally {

                   saveStateToLocalStorage(tmp_objects, data);
                for (const [key, value] of Object.entries(tmp_objects)) {
                    while (tmp_objects[key].length > 10) {
                        tmp_objects[key].pop();
                    }
                }
                //set overall data object
                setObjects(tmp_objects);
                //set each frame data
                setJson(data);      
             
                

            }

        });


        getNotificationConfiguration();


    }, []);


    const handleChange = (event) => {
        setState({ ...state, [event.target.name]: event.target.checked });
    };



    const getMatcherString = function (matchers) {
        return matchers.reduce(function (obj, matcher) {
            obj.push(matcher["name"]);
            return obj;
        }, []);
    };


    const handleTextChange = function handleChange(evt) {
        setState({ ...state, [evt.target.name]: evt.target.value });

    };
    const handleDataViewChange = (event) => {
        setDataView(event.target.value);
    };


    return (

        <div>

            <Box display="flex" flexDirection="row" p={1} m={1}>

                <Box p={1}>
                    <FormLabel component="legend">Analytics Information</FormLabel>
                    <p><strong>Analytics: </strong> {title} </p>
                </Box>

                <Box p={1}>

                    <FormControl component="fieldset">
                        <FormLabel component="legend">View Option</FormLabel>
                        <RadioGroup
                            aria-label="Gender"
                            name="gender1"
                            value={dataView} onChange={handleDataViewChange}
                        >
                            <FormControlLabel value="all" control={<Radio />} label="All Objects" />
                            <FormControlLabel value="filter" control={<Radio />} label="Notification Objects" />
                            <FormControlLabel value="raw" control={<Radio />} label="Raw Data" />
                        </RadioGroup>
                    </FormControl>

                </Box>


            </Box>


            <br />
            <ClientFrame data={frame} />


            <br />
            <div>

                {
                    {
                        'all': <div>

                            <pre>
                                <h5>{actionMessage} </h5>
                                {"frame:" + jsonData["frame"] + " timestamp:" + jsonData["timestamp"]}

                            </pre>
                            <h5>Detected objects </h5>


                            {

                                Object.keys(objects).map(function (keyName, keyIndex) {

                                    return <div>
                                        <ImageFrameCard data={objects[keyName]} keyName={keyName} />
                                        <br />
                                    </div>;

                                })
                            }


                        </div>,
                        'filter': <div>

                            <pre>
                                <h5>Now processing: </h5>
                                {"frame:" + jsonData["frame"] + " timestamp:" + jsonData["timestamp"]}

                            </pre>
                            <h5>Detected objects </h5>


                            {

                                Object.keys(objects).map(function (keyName, keyIndex) {
                                    if (state?.notification_configuration?.filter_json[keyName] === undefined) {
                                        return <p />;
                                    } else {
                                        return <div>
                                            <ImageFrameCard data={objects[keyName]} keyName={keyName} />
                                            <br />
                                        </div>;

                                    }
                                })
                            }


                        </div>,
                        'raw': <Box component="div" overflow="hidden" bgcolor="background.paper">
                            <pre>{socketdata}</pre>
                        </Box>
                    }[dataView]
                }
            </div>


            <br />
        </div>
    );
}