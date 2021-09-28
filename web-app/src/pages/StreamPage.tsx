import React from "react";
import globalStyles from "../styles";
import Grid from "@material-ui/core/Grid";
import {green} from "@material-ui/core/colors";
import {Button} from '@material-ui/core';

import Box from '@material-ui/core/Box';
import ClientComponent from "../components/analytics/Socket";
import {Delete} from "@material-ui/icons";
import PropTypes from "prop-types";

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


class StreamPage extends React.Component<PropTypes.InferProps<typeof propTypes>, any> {


    constructor(props) {
        super(props);
        this.state = {


            streamName: this.props.match.params.handle,
            loading: false,
            data: [],
            alert: [{score: 3, logic: "<"}, {score: 50, logic: ">"}, {score: 50, logic: ">"}]
        };
    };

    async configKill(analyticsName) {
        const params = {
            "analytic_host": analyticsName
        };

        var API_URL = '/api/v1/kill';
        if (process.env.REACT_APP_API_URL) {
            API_URL = process.env.REACT_APP_API_URL + API_URL
        }

        this.setState({loading: true});
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
        this.setState({loading: false});

    }

    handleRequestOk(msg) {
        this.setState({loading: false});
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
                this.setState({data: responseJson})
            })
            .catch((error) => {
                console.error(error);
                this.setState({data: []})
            });

    }


    render() {

        const addNotification = () => {

            this.setState({alert: [...this.state.alert, {score: 3, logic: "<"}]})


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
                                    onClick={() => this.configKill(object["analytics"])}
                                    variant="contained"
                                    color="secondary"
                                    startIcon={<Delete/>}
                                >
                                    Delete
                                </Button>

                                <ClientComponent
                                    subject={"stream." + object["id"] + ".analytic." + object["analytics"]}
                                    title={object["analytics"]} configId={object["id"]}/>

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
