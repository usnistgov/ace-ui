import React from "react";
import {Link} from "react-router-dom";
import {lightBlue} from "@material-ui/core/colors";
import InfoBox from "../components/dashboard/InfoBox";

import globalStyles from "../styles";
import Grid from "@material-ui/core/Grid";
import {NotificationsActive, Storage} from "@material-ui/icons";
import FolderList from "../components/dashboard/FolderList";
import CircularProgress from '@material-ui/core/CircularProgress';
import {io} from "socket.io-client";

// const DashboardPage = () => {
//
// };
class DashboardPage extends React.Component {

    state = {

    };

    constructor(props) {
        super(props);


        if (props.settings) {
            this.state = {
                settings: props.settings,
                notification_data: [],
                stream_notifications: {}
            };
        }

        let ENDPOINT = "/";
        if (process.env.REACT_APP_API_URL) {
            ENDPOINT = process.env.REACT_APP_API_URL
        }
        const socket = io(ENDPOINT);


        socket.on('notification', (msg) => {
            let config_id = [msg.config_id];
            let stream_notifications = this.state.stream_notifications;
            if (stream_notifications[config_id] === undefined) {
                stream_notifications[config_id] = []
            }
            stream_notifications[config_id].push(msg);

            this.setState({
                notification_data: this.state.notification_data.concat([msg]),
                stream_notifications: stream_notifications
            })


        });
    }

    componentWillMount() {

        var API_URL_ANALYTICS = '/api/v1/analytics';
        if (process.env.REACT_APP_API_URL) {
            API_URL_ANALYTICS = process.env.REACT_APP_API_URL + API_URL_ANALYTICS
        }
        fetch(API_URL_ANALYTICS)
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({analytics_data: responseJson})
            })
            .catch((error) => {
                console.error(error);
                this.setState({data: []})
            });

        var API_URL_SETTINGS = '/api/v1/settings';
        if (process.env.REACT_APP_API_URL) {
            API_URL_SETTINGS = process.env.REACT_APP_API_URL + API_URL_SETTINGS
        }
        fetch(API_URL_SETTINGS)
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({settings: responseJson})
            })
            .catch((error) => {
                console.error(error);

            });
        this.setState({notification_data: [], stream_notifications: {}});
    }

    loadData() {

        var API_URL_ANALYTICS = '/api/v1/analytics';
        if (process.env.REACT_APP_API_URL) {
            API_URL_ANALYTICS = process.env.REACT_APP_API_URL + API_URL_ANALYTICS
        }

        fetch(API_URL_ANALYTICS)
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({analytics_data: responseJson})
            })
            .catch((error) => {
                console.error(error);
                this.setState({data: []})
            });


        var API_URL_SETTINGS = '/api/v1/settings';
        if (process.env.REACT_APP_API_URL) {
            API_URL_SETTINGS = process.env.REACT_APP_API_URL + API_URL_SETTINGS
        }
        fetch(API_URL_SETTINGS)
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({settings: responseJson})
            })
            .catch((error) => {
                console.error(error);

            });
    }

    renderMyData() {
    }

    render() {
        return (
            <div>
                {this.state.settings ? <div>
                    <h3 style={globalStyles.navigation}>Application / Dashboard</h3>

                    <Grid container spacing={3}>


                        <Grid item xs={12} sm={6} md={3}>
                            <Link to="/app/table/data" className="button">
                                <InfoBox Icon={Storage} color={lightBlue[700]} title="Analytics "
                                         value={this.state.settings?.analytics?.length}/>
                            </Link>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Link to="/app/dashboard" className="button">
                                <InfoBox Icon={Storage} color={lightBlue[700]} title="Streams"
                                         value={this.state.settings.stream_source.length}/>
                            </Link>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Link to="/app/dashboard" className="button">
                                <InfoBox Icon={NotificationsActive} color={lightBlue[700]} title="Notifications"
                                         start={this.state.notification_data.length - 1}
                                         value={this.state.notification_data.length}/>
                            </Link>
                        </Grid>


                    </Grid>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <FolderList data={this.state.settings.configuration}
                                        stream_notifications={this.state.stream_notifications}/>
                        </Grid>
                    </Grid>
                    <p>{this.state.settings.stream_notifications}</p>


                </div> : <CircularProgress color="secondary"/>}
            </div>
        );
    }

}

export default DashboardPage;
