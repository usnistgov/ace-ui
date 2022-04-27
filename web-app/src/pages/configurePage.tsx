import React, {useState} from "react";
import {Link, useHistory} from "react-router-dom";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import {grey} from "@material-ui/core/colors";
import PageBase from "../components/PageBase";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';

import {useSnackbar} from 'notistack';
import CircularProgress from "@material-ui/core/CircularProgress";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import {StylesDictionary} from "../components/StylesDictionary";


const ConfigurePage = ({settings}) => {


    const [loading, setLoading] = useState(false);
    const [state, setState] = React.useState({
        showCustom: false,

    });

    const handleChange = (event) => {
        setState({...state, [event.target.name]: event.target.checked});
    };
    const history = useHistory();
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();


    const styles: StylesDictionary = {
        toggleDiv: {
            marginTop: 20,
            marginBottom: 5
        },
        toggleLabel: {
            color: grey[400],
            fontWeight: 100
        },
        buttons: {
            marginTop: 30,
            float: "right"
        },
        saveButton: {
            marginLeft: 5
        }
    };


    const handleRequestError = function (err) {
        setLoading(false);
        console.warn(err);
        enqueueSnackbar("Error: " + err, {
            variant: 'error',
            autoHideDuration: 15000,
            persist: false,
            anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'center',
            },
        });

    };
    const handleRequestOk = function (message) {
        setLoading(false);
        enqueueSnackbar("Success: " + message, {
            variant: 'success',
            autoHideDuration: 10000,
            persist: false,
            anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'center',
            },
        });

        history.push('/app/dashboard');
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.target);
        const params = {};
        var is_remote=false;
        data.forEach(function (value, prop) {
            if(prop==='analytic_host' && String(value).indexOf('@')>=0)
            {
                is_remote=true;
            }
            params[prop] = value
        });
        //if it's remote, set the message_addr/nat sever to local openvpn client ip
        //also set local video server to local ip
        if(is_remote){
            var local_addr= process.env.LOCAL_SERVER_OVPN_IP ? process.env.LOCAL_SERVER_OVPN_IP : '192.168.255.10'
            params['messenger_addr']= local_addr+":4222"
            var streamingSource=params['stream_source']
            //if streaming source are local, go ahead replace it with openvpn client ip
            if(streamingSource.indexOf('http://video_file_')>=0){
                const src=streamingSource.split(":")
                params['stream_source']='http://'+local_addr+":"+streamingSource.split(":")[2];
                
            }
            params['db_addr']=local_addr+":"+params['db_addr'].split(":")[1];

        }
        var API_URL = '/api/v1/config';
        if (process.env.REACT_APP_API_URL) {
            API_URL = process.env.REACT_APP_API_URL + API_URL
        }

        setLoading(true);
        const response = await fetch(API_URL, {
            method: 'POST',
            mode: 'cors',
            headers: {
               // 'Accept': 'accept: */*',
               // 'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                 //"Access-Control-Allow-Credentials": "true",
      //"Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
      //"Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Authorization"
            },
            body: JSON.stringify(params),
        }).catch(error => {
            handleRequestError(error);
        });

        if (response) {
            var body_json = await response.json();

            if (response.ok) {

                var message = body_json["message"];
                handleRequestOk(message.join("\r\n"))
            } else {
                handleRequestError(JSON.stringify(body_json))
            }
        }
    };
    return (

        <PageBase title="Configure Analytics" navigation="App / Configure Page">
            <div>
                <FormControlLabel
                    control={<Switch checked={state.showCustom} onChange={handleChange} name="showCustom"/>}
                    label="Use custom stream source"
                />
                <form onSubmit={handleSubmit}>
                    {(settings.stream_source && Object.keys(settings.stream_source).length > 0 && !state.showCustom) ?

                        <FormControl fullWidth={true}>
                            <InputLabel id="select_stream_address">Stream Source</InputLabel>
                            <Select
                                labelId="select_stream_address"
                                name="stream_source"
                            >
                                {
                                    settings.stream_source.map((key, index) =>
                                        <MenuItem value={key}
                                                  key={key}>{settings.stream_label[index]}</MenuItem>
                                    )

                                }

                            </Select>
                        </FormControl>

                        :
                        <FormControl fullWidth={true}>
                            <TextField required
                                       helperText="Address of the stream for the analytic to process."
                                       label="Stream Source"
                                       id="stream_source"
                                       name="stream_source"
                                       defaultValue="rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov"
                                       fullWidth={true}
                                       margin="normal"
                            />
                            <TextField required
                                       helperText="A descriptive name for your stream source"
                                       label="Stream Label"
                                       id="stream_label"
                                       name="stream_label"
                                       defaultValue="Network video"
                                       fullWidth={true}
                                       margin="normal"
                            />
                        </FormControl>

                    }


                    {settings.analytics && Object.keys(settings.analytics).length > 0 ?

                        <FormControl fullWidth={true}>
                            <InputLabel id="select_analytics_address">Analytics address</InputLabel>
                            <Select
                                labelId="select_analytics_address"
                                name="analytic_host"
                            >


                                {
                                    Object.keys(settings.analytics).map((key, index) =>
                                        <MenuItem value={settings.analytics[key]}
                                                  key={settings.analytics[key]}>{settings.analytics[key].split(':')[0]}</MenuItem>
                                    )


                                }

                            </Select>
                        </FormControl>

                        :
                        <TextField required
                                   helperText="Address of the analytic to connect to."
                                   label="Analytics address"
                                   name="analytic_host"
                                   defaultValue="object_detector"
                                   fullWidth={true}
                                   margin="normal"
                        />
                    }

                    <TextField
                        helperText="Tag to add to the analytic output. For multiple tags, use comma separated value. Format is
                            'key=value'"
                        placeholder="foo=bar,test=test1"

                        label="Tags"
                        name="analytics_tag"
                        fullWidth={true}
                        margin="normal"
                    />


                    <input type="hidden" id="db_addr" name="db_addr" value={settings.db_addr}/>
                    <input type="hidden" id="messenger_addr" name="messenger_addr" value={settings.messenger_addr}/>


                    {loading ? <CircularProgress color="secondary"/> :

                        <div style={styles.buttons}>
                            <Link to="/">
                                <Button variant="contained">Cancel</Button>
                            </Link>

                            <Button
                                style={styles.saveButton}
                                variant="contained"
                                type="submit"
                                color="primary"
                            >
                                Apply
                            </Button>

                        </div>
                    }
                </form>
            </div>
        </PageBase>

    );
};

export default ConfigurePage;
