import React from 'react';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import ReactTimeAgo from 'react-time-ago';

const useStyles = makeStyles((theme) => ({
    popover: {
        pointerEvents: 'none',
    },
    paper: {
        padding: theme.spacing(1),
    },
}));

export default function MouseOverPopover({stream_notifications = {}, update_date}) {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setTimeout(() => setAnchorEl(null), 150)

    };

    const open = Boolean(anchorEl);

    return (
        <div>

            <Typography
                aria-owns={open ? 'mouse-over-popover' : undefined}
                aria-haspopup="true"
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
            >
                {update_date ? <ReactTimeAgo date={update_date} timeStyle="twitter"/> : ""}

            </Typography>
            <Popover
                id="mouse-over-popover"
                className={classes.popover}
                classes={{
                    paper: classes.paper,
                }}
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                onClose={handlePopoverClose}
                disableRestoreFocus
            >
                <br/>
                <br/>
                {stream_notifications !== undefined ? <div>
                    {Object.keys(stream_notifications).map((e1, i1) => {
                        return (
                            <div key={i1} className="board-row">
                                <h5>Notification(s) for {stream_notifications[e1][0]["analytic"]} 3
                                    of {stream_notifications[e1].length} </h5>
                                {stream_notifications[e1].slice(-3).reverse().map((e2, i2) => {
                                    return (
                                        <p key={i2}>
                                            <ReactTimeAgo date={new Date(parseInt(e2["timestamp"]))} locale="en-US"/>

                                            {

                                                "    " + e2["classification"] + " with confidence score " + e2["confidence"]}


                                        </p>
                                    )
                                })}
                            </div>
                        )
                    })}
                </div> : ""}
                <Typography></Typography>

            </Popover>
        </div>
    );
}