import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Avatar from "@material-ui/core/Avatar";
import SettingsIcon from "@material-ui/icons/Settings";
import {FormHelperText, InputLabel, MenuItem, Select} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import {useSnackbar} from "notistack";
import {useHistory} from "react-router-dom";

export default function FormDialog({data, item}) {
    const [open, setOpen] = React.useState(false);
    const [state, setState] = React.useState({textFieldValue: "", optionField: 0});
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const history = useHistory();


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubscribe = async () => {

        let objects = {};
        state.textFieldValue.split(',').forEach(function (entry) {
            objects[entry.trim().toLocaleLowerCase()] = {}
        });
        let creationSuccess = undefined;
        if (state.optionField === "all") {
            for (let index = 0; index < data[1].analytics.length; index++)  {
                if(creationSuccess === false){
                    // exit function if there were errors on previous creation
                    continue;
                }
                let params = {
                    "id": data[1].id[index],
                    "objects": objects,
                };
                creationSuccess = await postConfig(params);
            }

        } else {
            let params = {
                "id": data[1].id[state.optionField],
                "objects": objects,
            };
            creationSuccess = await postConfig(params);
        }
        if(creationSuccess === true){
            handleClose();
            history.push('/app/dashboard');
        }
    };

    const postConfig = async (params ) => {
        var API_URL = '/api/v1/notification_configuration';
        if (process.env.REACT_APP_API_URL) {
            API_URL = process.env.REACT_APP_API_URL + API_URL
        }


        const response = await fetch(API_URL, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Accept': 'accept: */*',
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params),
        }).catch(err => {
            handleRequestError(err);

        });

        if (response && response.ok) {
            var body_json = await response.json();

            if (response.ok) {
                handleRequestOk(body_json)
                return true;
            } else {
                handleRequestError(JSON.stringify(body_json))
                return false;
            }
        }
    }
    const handleRequestError = function (err) {
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
        console.info(message);
        enqueueSnackbar("Success: " + message, {
            variant: 'Success',
            autoHideDuration: 2000,
            persist: false,
            anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'center',
            },
        });
    };


    const _handleTextFieldChange = (e) => {
        setState(prevState => ({
            ...prevState,
            textFieldValue: e.target.value
        }));

    };

    const handleOptionChange = (event, index, value) => {

        setState(prevState => ({
            ...prevState,
            optionField: event.target.value
        }));

    }

    // const _handlOptioneChange = (event) => {
    //     console.log(event.target.value)
    //
    //     setState({
    //         optionField: event.target.value
    //     });
    //
    // };
    return (


        <div>
            <Button color="primary" onClick={handleClickOpen}>
                <Avatar>

                    <SettingsIcon color="action" fontSize="large"/>

                </Avatar>
            </Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" fullWidth={true}
                    maxWidth='md'>
                <DialogTitle id="form-dialog-title">Configure notification for {item.name} </DialogTitle>

                <DialogContent>

                    <FormControl>
                        <InputLabel id="demo-simple-select-autowidth-label">Analytics</InputLabel>
                        <Select
                            labelId="demo-simple-select-autowidth-label"
                            id="demo-simple-select-autowidth"
                            value={state.optionField}
                            onChange={handleOptionChange}
                            autoWidth
                        >
                            <MenuItem value="all">
                                <em>all</em>
                            </MenuItem>

                            {data[1].analytics.map(function (name, index) {
                                return <MenuItem value={index}>{data[1].analytics[index]}</MenuItem>;
                            })}
                        </Select>
                        <FormHelperText>Select an analytic from drop down</FormHelperText>
                    </FormControl>


                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Name of the objects you want to get notified on. "
                        fullWidth
                        value={state.textFieldValue}
                        onChange={_handleTextFieldChange}
                        helperText={"Comma separated values (example:truck,person,dog)"}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubscribe} color="primary">
                        Subscribe
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
