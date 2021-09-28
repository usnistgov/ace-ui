import React from "react";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import App from "./pages/App";


export default (
    <Router>
        <Switch>
            <Route path="/" component={App}/>
        </Switch>
    </Router>
);
