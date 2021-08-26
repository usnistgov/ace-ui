import {render} from "react-dom";
import routes from "./routes";
import registerServiceWorker from "./registerServiceWorker";
import "./styles.scss";
import "font-awesome/css/font-awesome.css";
import TimeAgo from 'javascript-time-ago'

import en from 'javascript-time-ago/locale/en'

TimeAgo.addDefaultLocale(en)


require("./favicon.ico");

render(routes, document.getElementById("root"));
registerServiceWorker();
