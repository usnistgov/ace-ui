import React from "react";
import {
    Button,
    Collapse,
    FormControl,
    FormControlLabel,
    FormHelperText,
    IconButton,
    Input,
    InputAdornment,
    InputLabel,
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    makeStyles,
    Paper,
    Select,
    Switch,
    TextField
} from "@material-ui/core";
import {Add, AddCircle, Delete} from "@material-ui/icons";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import NotificationItems from "./NotificationItem";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import ListSubheader from "@material-ui/core/ListSubheader";
import GridListTileBar from "@material-ui/core/GridListTileBar";

const useStyles = makeStyles((theme) => ({
    root: {},
    container: {

        display: "block",
        width: "100%",
        margin: "auto",
    },
    paper: {
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },

    svg: {
        width: 100,
        height: 100,
    },
    polygon: {
        fill: theme.palette.common.white,
        stroke: theme.palette.divider,
        strokeWidth: 1,
    },
}));

export default function FilterForm({config="something"}) {
    const [state, setState] = React.useState({
        showRaw: false,
        checkedRawInput: false,
        counts: {},
        alertTextBox: undefined,
        matchers: [{id: 1, name: "test", condition: "abc"}],


    });
    const classes = useStyles();
    const [checked, setChecked] = React.useState(false);

    const handleChange = () => {
        setChecked((prev) => !prev);
    };

    const handleAddItem = () => {

        var matchers = state.matchers;
        var id = matchers.length > 0 ? matchers[matchers.length - 1].id + 1 : 0;

        matchers.push({
            id: id,
            name: state.alertTextBox,
            score: "0.40",
        });
        setState({matchers: matchers, alertTextBox: ""});
        submitChange().then(r => {});
    };

    const handleDelete = (id) => {
        var matchers = state.matchers.filter(ex => ex.id !== id);
        setState({...state, matchers: matchers});
        submitChange().then(r => {});
    }

    const  submitChange = async () => {
        const params = {"data":state.matchers, "id":config};
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
        }).catch(error => {

        });

        if (response) {



        }
    };



    const handleTextChange = (evt) =>{
        setState({...state, [evt.target.name]: evt.target.value});


    };



    return (
        <Box display="flex" flexDirection="column" border={2} borderColor="secondary.main"
             borderRadius={16} m={1} p={2}>
            <FormControlLabel
                control={<Switch checked={checked} onChange={handleChange}/>}
                label="More notification options"
            />

            <FormControl>
                <InputLabel>Object (ie: person)</InputLabel>

                <Input
                    name="alertTextBox"
                    id="standard-adornment-password"
                    value={state.alertTextBox}
                    onChange={handleTextChange}

                    endAdornment={<InputAdornment position="end">
                        <IconButton
                            color="primary"

                            aria-label="toggle password visibility"
                            onClick={handleAddItem}
                        >
                            <AddCircle/>
                        </IconButton>
                    </InputAdornment>
                    }
                />
                <FormHelperText id="component-helper-text">You will receive notification when this item is
                    detected. </FormHelperText>

            </FormControl>
            <br/>


            <Collapse in={checked}>
                <div className={classes.container}>

                    <List>
                        {state.matchers.map(({id, name, condition}) => (
                            <ListItem key={id}>
                                <ListItemText primary={name}/>
                                <ListItemSecondaryAction>
                                    <IconButton
                                        color="secondary"
                                        onClick={() => handleDelete(id)}
                                    >
                                        <Delete/>
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                    </List>

                </div>

            </Collapse>


        </Box>


    );

}