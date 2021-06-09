import React from "react";
import Paper from "@material-ui/core/Paper";
import globalStyles from "../styles";
import Grid from "@material-ui/core/Grid";
import DataBox from "../components/analytics/DataBox";
import {green, red} from "@material-ui/core/colors";
import {Button} from '@material-ui/core';

import Box from '@material-ui/core/Box';
import ClientComponent from "../components/analytics/socket";
import {CheckCircle, Delete} from "@material-ui/icons";

import Tooltip from '@material-ui/core/Tooltip';

class StreamPage extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            order: "asc",
            orderBy: "id",
            selected: [],

            streamName: this.props.match.params.handle,
            loading: false,

            page: 0,
            rowsPerPage: 10,
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
        console.log(API_URL);
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
            console.log(body_json);

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

        const {classes} = this.props;


        return (

            <div>

                <h1 style={globalStyles.navigation}>stream/{this.state.streamName}</h1>

                <h3>Information:</h3>
                {!this.state.data || !this.state.data.length > 0 ? "No info found"
                    :
                    <div>

                        <h3 style={globalStyles.navigation}> Running: {this.state.data.length} analytics on <a
                            href={this.state.data[0]["stream"]} target="_blank">{this.state.data[0]["stream"]}</a></h3>


                    </div>
                }

                <h3>Running analytics (Click to delete)</h3>
                {!this.state.data ? "No info found"
                    :

                    <Grid container spacing={3}>


                        {this.state.data.map(object =>
                            <Grid item xs={12} sm={12} md={6} lg={4}>
                                <Tooltip title="Click to delete this analytics">
                                    <Button to="" className="button" color="secondary"
                                            onClick={() => this.configKill(object["analytics"])}>
                                        <Paper>
                                            {this.state.loading ? <DataBox Icon={Delete}
                                                                           title=""
                                                                           color={red[500]}
                                                                           value={object["analytics"]}/> :

                                                <DataBox Icon={CheckCircle}
                                                         title=""
                                                         color={green[500]}
                                                         value={object["analytics"]}/>
                                            }
                                        </Paper>

                                    </Button>

                                </Tooltip>
                            </Grid>
                        )
                        }


                    </Grid>
                }

                <h3>Event streams</h3>

                <Grid container spacing={3}>


                    {!this.state.data || !this.state.data.length > 0 ? "No info found" : this.state.data.map(object =>
                        <Grid item xs={12} sm={6} md={6}>

                            <Box display="flex" flexDirection="column" border={2} borderColor="secondary.main"
                                 borderRadius={16} m={1} p={2}>


                                <ClientComponent
                                    subject={"stream." + object["id"] + ".analytic." + object["analytics"]}
                                    title={object["analytics"]}/>


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
