import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import {Link} from 'react-router-dom';
import Paper from "@material-ui/core/Paper";
import ListSubheader from "@material-ui/core/ListSubheader";
import {Badge} from "@material-ui/core";
import {NotificationsActive} from "@material-ui/icons";
import FormDialog from "./FormDialog";
import MouseOverPopover from "./PopOver";

class FolderList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            key_map: {},
            stream_notifications: {},
        };

        if (props.data) {


            var key_map = {};
            props.data._key.forEach(function (item, index) {
                key_map[item["url"]] = {"id": item["id"], "name": item["name"], "url": item["url"]}
            });
            this.state = {
                data: props.data.data,
                key_map: key_map,
                stream_notifications: props.stream_notifications,

            };
        }


    }

    render() {


        return (
            <Paper>

                <List>

                    <ListSubheader>Running Streams and analytics</ListSubheader>

                    {


                        Object.entries(this.state.data).map((value) => {
                            let item = this.state.key_map[value[0]];
                            let sub_notification = []
                            let sub_title = [];

                            for (let [index, ids] of value[1].id.entries()) {

                                let notifications = this.state.stream_notifications?.[ids];
                                let notification_label = value[1].notification?.[index]?.csv ?? "None"
                                sub_title.push(value[1].analytics[index] + "(" + notification_label + "), ");
                                if (notifications) {
                                    sub_notification.push(notifications);
                                }

                            }

                            let total_notification = 0;
                            let last_updated = 0;
                            let update_date = 0;
                            let last_detection = "";

                            for (const key in sub_notification) {
                                total_notification = total_notification + sub_notification[key].length;
                                let key_update = parseInt(sub_notification[key].slice(-1)[0]["timestamp"]);
                                if (last_updated < key_update) {

                                    last_updated = key_update;
                                    last_detection = JSON.stringify(sub_notification[key].slice(-1)[0]);
                                    update_date = new Date(last_updated);
                                }
                            }


                            return (<ListItem>
                                    <ListItemAvatar>
                                        <FormDialog data={value} item={item}/>

                                    </ListItemAvatar>
                                    <ListItemText primary={item.name}
                                                  secondary={sub_title}/>


                                    <Badge button={true} component={Link}

                                           to={{
                                               pathname: "/app/stream/" + item.id,


                                           }}
                                           badgeContent={total_notification}
                                           max={10000}
                                           color="secondary"

                                           anchorOrigin={{
                                               vertical: 'top',
                                               horizontal: 'right',
                                           }}
                                    >
                                        <MouseOverPopover stream_notifications={sub_notification}
                                                          update_date={update_date}></MouseOverPopover>
                                        <NotificationsActive color="primary"/>
                                    </Badge>

                                </ListItem>
                            );
                        })
                    }


                </List>
            </Paper>
        );
    }
}


export default FolderList;
