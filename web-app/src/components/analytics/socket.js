import React, {useEffect, useState} from "react";
import socketIOClient from "socket.io-client";
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import {Box} from '@material-ui/core';
import ClientFrame from "./SocketFrame";
import ImageFrameCard from "./ImageFrameCard";

export default function ClientComponent({subject, title}) {
    const subject_addr = subject;
    const [socketdata, setSocketData] = useState("");
    const [connect, setConnect] = useState(undefined);
    let ENDPOINT = "/";
    if (process.env.REACT_APP_API_URL) {
        ENDPOINT = process.env.REACT_APP_API_URL
    }

    const [jsonData, setJson] = useState({"frame": undefined, "objects": [], "timestamp": undefined, "unique": []});
    const [objects, setObjects] = useState({});

    const [state, setState] = React.useState({
        showRaw: false,
        checkedRawInput: false,
        counts: {},
        alertTextBox: undefined,
        matchers: [],


    });
    const [frame, setFrame] = useState();


    useEffect(() => {
        const socket = socketIOClient(ENDPOINT);
        socket.on(subject_addr, raw_data => {
            let j = JSON.parse(raw_data);
            setConnect("true");
            setSocketData(raw_data);
            let data = jsonData;
            let tmp_objects = objects;
            try {
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

                for (const [key, value] of Object.entries(tmp_objects)) {
                    while (tmp_objects[key].length > 10) {
                        tmp_objects[key].pop();
                    }
                }
                setObjects(tmp_objects);
                setJson(data)

            }
        });


    }, []);


    const handleChange = (event) => {
        setState({...state, [event.target.name]: event.target.checked});
    };


    const handleDelete = (id) => {
            var matchers = state.matchers.filter(ex => ex.id !== id);
            setState({...state, matchers: matchers});
        }
    ;

    const getMatcherString = function (matchers) {
        return matchers.reduce(function (obj, matcher) {
            obj.push(matcher["name"]);
            return obj;
        }, []);
    };

    const handleAddItem = () => {

        var matchers = state.matchers;
        var id = matchers.length > 0 ? matchers[matchers.length - 1].id + 1 : 0;

        matchers.push({
            id: id,
            name: state.alertTextBox,
            condition: "equal",
            object: "TODO update .roi[0].classification"
        });


        setState({matchers: matchers, alertTextBox: ""});


    };

    const handleTextChange = function handleChange(evt) {
        setState({...state, [evt.target.name]: evt.target.value});

    };


    return (

        <div>

            <Box display="flex" flexDirection="row" p={1} m={1}>
                <p><strong>Analytics: </strong> {title} </p>
                <Box p={1}>
                    <FormControlLabel
                        control={<Switch checked={state.checkedRawInput} onChange={handleChange}
                                         name="checkedRawInput"/>}
                        label="Raw Data"
                    />
                </Box>



            </Box>



            <br/>
            <ClientFrame data={frame}/>


            <br/>

            {!state.checkedRawInput ?


                <div>

                   <pre>
                       <h5>Now processing: </h5>
                       {"frame:" + jsonData["frame"] + " timestamp:" + jsonData["timestamp"]}

                    </pre>
                    <h5>Detected objects </h5>


                    {

                        Object.keys(objects).map(function (keyName, keyIndex) {

                            return <div>
                                <ImageFrameCard data={objects[keyName]} keyName={keyName}/>
                                <br/>
                            </div>;

                        })
                    }


                </div> :
                <div>

                    <pre>{socketdata}</pre>

                </div>}


            <br/>
        </div>
    );
}