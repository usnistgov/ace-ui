import React from "react";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import ListSubheader from "@material-ui/core/ListSubheader";
import SettingsIcon from '@material-ui/icons/Settings';
import Paper from "@material-ui/core/Paper";
import {Link} from "react-router-dom";

class DataList extends React.Component {

    constructor(props) {
        super(props);
        if (props.data) {

            this.state = {
                data: props.data,
                title: props.title
            };
        } else {
            this.state = {
                data: []
            };
        }


    }

    render() {


        return (
            <Paper>
                <List>

                    <ListSubheader>{this.state.title}</ListSubheader>


                    {this.state.data.map((value) => {
                        const labelId = `checkbox-list-label-${value}`;
                        return (

                            <ListItem key={value} role={undefined} dense button component={Link}
                                      to={"/analytics/" + value}>

                                <ListItemText id={labelId} primary={value}/>
                                <ListItemSecondaryAction>


                                    <IconButton component={Link} to={"/app/form/"} edge="end" aria-label="comments">
                                        <SettingsIcon/>
                                    </IconButton>

                                </ListItemSecondaryAction>
                            </ListItem>

                        );
                    })}
                </List>
            </Paper>


        );
    }
}

export default DataList;