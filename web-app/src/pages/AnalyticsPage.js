import React from "react";
import PropTypes from "prop-types";
import Paper from "@material-ui/core/Paper";
import globalStyles from "../styles";
import Grid from "@material-ui/core/Grid";
import {Link} from "react-router-dom";
import DataBox from "../components/analytics/DataBox";
import {green, grey} from "@material-ui/core/colors";
import AlarmIcon from '@material-ui/icons/Alarm';
import AddAlarmIcon from '@material-ui/icons/AddAlarm';

import Fab from '@material-ui/core/Fab';

import Box from '@material-ui/core/Box';
import ClientComponent from "../components/analytics/Socket";

class AnalyticsPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            order: "asc",
            orderBy: "id",
            selected: [],

            analyticsName: this.props.match.params.handle,
            // data2: null,
            page: 0,
            rowsPerPage: 10,
            alert: [{score: 3, logic: "<"}, {score: 50, logic: ">"}, {score: 50, logic: ">"}]
        };


    };


    componentWillMount() {
        // var API_URL = '/api/v1/analytics';
        // if (process.env.REACT_APP_API_URL) {
        //     API_URL = process.env.REACT_APP_API_URL + API_URL
        // }
        //
        // fetch(API_URL)
        //     .then((response) => response.json())
        //     .then((responseJson) => {
        //         this.setState({data: responseJson})
        //     })
        //     .catch((error) => {
        //         console.error(error);
        //         this.setState({data: []})
        //     });

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
                <h3 style={globalStyles.navigation}>stream/{this.state.analyticsName}</h3>
                <Paper hidden={true}>

                    <Grid container spacing={3} hidden>
                        <Grid item xs={2} sm={2} md={2}>
                            <Box display="flex" flexDirection="row" p={1} m={1}>

                                <Fab variant="extended" color="secondary" onClick={addNotification}>
                                    <AddAlarmIcon/>
                                    Add notification
                                </Fab>

                            </Box>

                        </Grid>
                    </Grid>

                    <Grid container spacing={3}>


                        <Grid item xs={12} sm={6} md={3}>
                            <Link to="" className="button">
                                <DataBox Icon={AlarmIcon} color={grey[600]} title={"Updated  on"}
                                         value="12/31/2020"/>
                            </Link>
                        </Grid>
                        {this.state.alert.map(function (object, i) {
                            return <Grid item xs={12} sm={6} md={3}>
                                <Link to="" className="button">
                                    <DataBox Icon={AlarmIcon} color={grey[600]}
                                             title={"operator" + object.logic + " : score " + object.score}
                                             value="12/31/2020"/>
                                </Link>
                            </Grid>;
                        })}


                    </Grid>
                </Paper>

                <Grid container spacing={3}>
                    <Grid item xs={12} sm={12}>


                        <Box display="flex" flexDirection="row">

                            <Paper elevation={3} variant="outlined">

                                <br/>

                                <ClientComponent/>
                            </Paper>


                        </Box>


                    </Grid>


                </Grid>


            </div>

        );
    }
}

AnalyticsPage.propTypes = {
    classes: PropTypes.object.isRequired
};

export default AnalyticsPage;
