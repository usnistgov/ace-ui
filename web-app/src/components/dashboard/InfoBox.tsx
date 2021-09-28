import React from "react";
import PropTypes from "prop-types";
import CountUp from "react-countup";
import Paper from "@material-ui/core/Paper";
import {grey, lightBlue} from "@material-ui/core/colors";
import {StylesDictionary} from "../StylesDictionary";


const propTypes = {
    Icon: PropTypes.any, // eslint-disable-line
    color: PropTypes.string, // eslint-disable-line
    title: PropTypes.string,
    value: PropTypes.any,
    start: PropTypes.number,
};

type ComponentProps = PropTypes.InferProps<typeof propTypes>;

class InfoBox extends React.Component<ComponentProps, any> {
    render() {
        const {color, title, value, Icon, start = 0} = this.props;
        // @ts-ignore
        const styles: StylesDictionary = {
            content: {
                padding: "5px 10px",
                marginLeft: 90,
                height: 80
            },
            number: {
                display: "block",
                fontWeight: 400,
                fontSize: 18,
                color: grey[800]
            },
            text: {
                fontSize: 20,
                fontWeight: 300,
                color: grey[800]
            },
            iconSpan: {
                float: "left",
                height: 90,
                width: 90,
                textAlign: "center",
                backgroundColor: color || lightBlue[700]
            },
            icon: {
                height: 48,
                width: 48,
                marginTop: 20,
                maxWidth: "100%"
            }
        };

        return (
            <Paper>
        <span style={styles.iconSpan}>
          <div style={{color: "white"}}>
            <Icon style={styles.icon}/>
          </div>
        </span>
                <div style={styles.content}>
                    <span style={styles.text}>{title}</span>
                    <div style={styles.number}>
                        <CountUp start={start || 0} end={value} separator="," duration={1}/>
                    </div>
                </div>
            </Paper>
        );
    }
}


export default InfoBox;
