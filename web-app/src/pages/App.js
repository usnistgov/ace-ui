import React from "react";
import {Route, Switch} from "react-router-dom";
import PropTypes from "prop-types";
import classNames from "classnames";
import {ThemeProvider, withStyles} from "@material-ui/core/styles";
import Header from "../components/Header";
import LeftDrawer from "../components/LeftDrawer";
import RightDrawer from "../components/RightDrawer";
import Dashboard from "./DashboardPage";
import ButtonBase from "@material-ui/core/ButtonBase";
import Form from "./ConfigurePage";

import DataTable from "./Table/DataTables";
import AnalyticsPage from "./AnalyticsPage";
import defaultTheme, {customTheme} from "../theme";
import Assessment from "@material-ui/icons/Assessment";
import Web from "@material-ui/icons/Web";

import {SnackbarProvider} from 'notistack';
import StreamPage from "./StreamPage";


const styles = () => ({
    container: {
        margin: "80px 20px 20px 15px",
        paddingLeft: defaultTheme.drawer.width,
        [defaultTheme.breakpoints.down("sm")]: {
            paddingLeft: 0
        }
        // width: `calc(100% - ${defaultTheme.drawer.width}px)`
    },
    containerFull: {
        paddingLeft: defaultTheme.drawer.miniWidth,
        [defaultTheme.breakpoints.down("sm")]: {
            paddingLeft: 0
        }
    },
    settingBtn: {
        top: 80,
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        color: "white",
        width: 48,
        right: 0,
        height: 48,
        opacity: 0.9,
        padding: 0,
        zIndex: 999,
        position: "fixed",
        minWidth: 48,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0
    }
});

class App extends React.Component {


    constructor(props) {
        super(props);
        // nav bar default open in desktop screen, and default closed in mobile screen
        this.state = {
            theme: defaultTheme,
            analytics_data: [],
            settings: false,
            menus: [
                {text: "Configure", icon: <Web/>, link: "/app/form"},
                {text: "Dashboard", icon: <Assessment/>, link: "/app/dashboard"},
                {text: "Analytics List", icon: <Web/>, link: "/app/table/data"}

            ],
            rightDrawerOpen: false,
            navDrawerOpen:
                window && window.innerWidth && window.innerWidth >= defaultTheme.breakpoints.values.md
                    ? true
                    : false
        };

        this.handleChangeRightDrawer = this.handleChangeRightDrawer.bind(this);
        this.handleChangeNavDrawer = this.handleChangeNavDrawer.bind(this);
        this.handleChangeTheme = this.handleChangeTheme.bind(this);
    }

    componentWillMount() {
        this.loadData();
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


    handleChangeNavDrawer() {
        this.setState({
            navDrawerOpen: !this.state.navDrawerOpen
        });
    }

    handleChangeRightDrawer() {
        this.setState({
            rightDrawerOpen: !this.state.rightDrawerOpen
        });
    }

    handleChangeTheme(colorOption) {
        const theme = customTheme({
            palette: colorOption
        });
        this.setState({
            theme
        });
    }

    render() {
        const {classes} = this.props;
        const {navDrawerOpen, rightDrawerOpen, theme} = this.state;

        return (
            this.state.settings ?
                <SnackbarProvider>
                    <ThemeProvider theme={theme}>
                        <Header handleChangeNavDrawer={this.handleChangeNavDrawer} navDrawerOpen={navDrawerOpen}/>

                        <LeftDrawer
                            navDrawerOpen={navDrawerOpen}
                            handleChangeNavDrawer={this.handleChangeNavDrawer}
                            menus={this.state.menus}
                        />
                        <ButtonBase
                            color="inherit"
                            classes={{root: classes.settingBtn}}
                            onClick={this.handleChangeRightDrawer}
                        >
                            <i className="fa fa-cog fa-3x"/>
                        </ButtonBase>
                        <RightDrawer
                            rightDrawerOpen={rightDrawerOpen}
                            handleChangeRightDrawer={this.handleChangeRightDrawer}
                            handleChangeTheme={this.handleChangeTheme}
                        />
                        {


                            <div className={classNames(classes.container, !navDrawerOpen && classes.containerFull)}>
                                <Switch>
                                    <Route exact path="/app"
                                           component={() => <Dashboard settings={this.state.settings}/>}/>
                                    <Route exact path="/app/dashboard" component={() => <Dashboard/>}/>
                                    <Route exact path="/app/form" component={() => <Form settings={this.state.settings}/>}/>
                                    <Route path="/app/table/data" component={DataTable}/>
                                    <Route path="/app/analytics/:handle" component={AnalyticsPage}/>
                                    <Route path="/app/stream/:handle" component={StreamPage}/>
                                </Switch>
                            </div>
                        }
                    </ThemeProvider>
                </SnackbarProvider> :
                <h1>Loading...</h1>
        );
    }
}

App.propTypes = {
    children: PropTypes.element,
    classes: PropTypes.object
};

export default withStyles(styles)(App);
