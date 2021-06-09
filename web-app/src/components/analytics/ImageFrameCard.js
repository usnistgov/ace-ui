import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import {Box, IconButton} from "@material-ui/core";
import {SkipNext, SkipPrevious} from "@material-ui/icons";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },


    highlight: {
        display: 'flex',
        backgroundColor: theme.palette.secondary.light,
        color: theme.palette.primary.contrastText
    },

    high: {
        display: 'flex',
        backgroundColor: "#42b559",

    },

    medium: {
        display: 'flex',
        backgroundColor: "#a7d98a",

    },
    low: {
        display: 'flex',
        backgroundColor: "#fcf2ce",
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
    },
    content: {
        flex: '1 0 auto',
    },
    cover: {
        width: 130,
        height: 130,
    },

    slide: {
        width: 250,
        height: 250,
    },
    controls: {
        display: 'flex',
        alignItems: 'center',
        paddingLeft: theme.spacing(1),
        paddingBottom: theme.spacing(1),
    },
    playIcon: {
        height: 38,
        width: 38,
    },
}));

export default function ImageFrameCard({data, keyName}) {
    const classes = useStyles();
    let frameDate = new Date(parseInt(data[0].data?.endTimeMillis));
    // let transition = (new Date() - frameDate) < 1500;

    let backgroundClass = "root";
    let confidence = 0;

    data[0].data.roi.forEach(function (entry) {

        if (entry.classification === keyName) {
            confidence = entry.confidence;
            switch (true) {
                case (confidence <= .55):
                    backgroundClass = "low";
                    break;
                case (confidence <= .8):
                    backgroundClass = "medium";
                    break;
                case (confidence >= .8):
                    backgroundClass = "high";
                    break;
                default:
                    backgroundClass = "root";
                    break;
            }
        }
        return ":)";


    });




    let title = keyName;
    let description = frameDate.toLocaleTimeString()

    //placeholder is a loading gif
    let placeholder = "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";
    let image = data[0].frame?.frame?.img ?? placeholder;
    const handleChange = (event) => {
        setState({...state, [event.target.name]: event.target.checked});
    };

    const [state, setState] = React.useState({
        track: false,

    });
    const [slideImage, setSlideImage] = React.useState(data[0].frame?.frame?.img ?? placeholder);
    const [currentSlide, setSlide] = React.useState(data[0]);
    const [currentIndex, setIndex] = React.useState(0);
    const handleSlideControl = (val) => {
        if (val + currentIndex >= 0 && val + currentIndex < data.length) {
            setIndex(currentIndex + val);
        }

        setSlideImage(data[currentIndex].frame?.frame?.img ?? placeholder);
        setSlide(data[currentIndex]);
    };

    return (
        <div>
            {state.track ?
                <div><Card className={classes[backgroundClass]}>
                    <Box borderColor="primary.main">
                        <CardMedia
                            className={classes.cover}
                            image={"data:image/jpeg;base64," + image}
                        />

                    </Box>


                    <div className={classes.controls}>

                        <Box p={1}>

                            <FormControlLabel
                                control={<Switch
                                    name="track" checked={state.track} onChange={handleChange}/>}
                                label="Track"
                            />
                        </Box>


                    </div>
                    <div className={classes.details}>
                        <CardContent className={classes.content}>
                            <Typography component="p" variant="h6">
                                {title}
                            </Typography>
                            <Typography variant="subtitle1" color="textSecondary">
                                {description}
                            </Typography>
                            <Typography variant="subtitle1" color="textSecondary">
                                {"confidence score: " + confidence}
                            </Typography>
                        </CardContent>

                    </div>
                </Card>
                    <Card>
                        <br/>
                        <Card className={classes.root}>
                            <CardMedia
                                className={classes.slide}
                                image={"data:image/jpeg;base64," + slideImage}
                            />
                            <div className={classes.details}>
                                <CardContent className={classes.content}>
                                    <Typography component="p" variant="h6">
                                        Objects ({currentSlide.data.roi.length})
                                    </Typography>
                                    <Typography variant="subtitle1" color="textSecondary">
                                        {currentSlide.data.roi.map((value, index) => {
                                            return <li
                                                key={index}>{value.classification + ": " + value.confidence.toString()}</li>
                                        })}
                                    </Typography>
                                </CardContent>

                            </div>
                        </Card>
                        <Card className={classes.root}>
                            <div>
                                <IconButton aria-label="next" onClick={() => handleSlideControl(-1)}>
                                    <SkipPrevious/>
                                </IconButton>
                                Frame: {currentIndex + 1} of {data.length}
                                <IconButton aria-label="previous" onClick={() => handleSlideControl(+1)}>
                                    <SkipNext/>
                                </IconButton>


                            </div>
                        </Card>
                    </Card>
                </div>
                :
                <Card className={classes[backgroundClass]}>
                    <CardMedia
                        className={classes.cover}
                        image={"data:image/jpeg;base64," + image}
                    />

                    <div className={classes.controls}>

                        <Box p={1}>

                            <FormControlLabel
                                control={<Switch
                                    name="track" checked={state.track} onChange={handleChange}/>}
                                label="Track"
                            />
                        </Box>
                    </div>
                    <div className={classes.details}>
                        <CardContent className={classes.content}>
                            <Typography component="p" variant="h6">
                                {title}
                            </Typography>
                            <Typography variant="subtitle1" color="textSecondary">
                                {description}
                            </Typography>
                            <Typography variant="subtitle1" color="textSecondary">
                                {"confidence score: " + confidence}
                            </Typography>
                        </CardContent>
                    </div>
                </Card>
            }
        </div>
    );
}
