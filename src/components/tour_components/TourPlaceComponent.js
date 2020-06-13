import {withStyles} from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import React from "react";
import IconButton from "@material-ui/core/IconButton";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import RemoveIcon from '@material-ui/icons/Remove';
import CardHeader from "@material-ui/core/CardHeader";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import Alert from "@material-ui/lab/Alert";

const styles = theme => ({
    cardRoot: {
        [theme.breakpoints.only("lg")]: {
            display: 'flex',
            // alignItems: "flex-start"
        },
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
        flex: 5
    },
    content: {
        flex: '1 0 auto',
    },
    cover: {
        [theme.breakpoints.down("lg")]: {
            height: "200px",
        },
        [theme.breakpoints.only("lg")]: {
            flex: 1,
            height: "auto",
        },
    },
    root: {
        display: "flex",
        flexFlow: "column wrap"
    },
    addParkingWrapper: {
        display: "inline-block"
    }
})


function TourPlaceComponent({classes, elementData, removeCallback, addTransportCallback, displayNoTransportWarning}) {

    function truncateText(text) {
        if (text == null)
            return ""
        if (text.length > 500) {
            return text.substring(0, 500) + "...";
        } else {
            return text
        }
    }

    return (
        <div className={classes.root}>
            <Card className={classes.cardRoot}>

                {elementData.data.details.photos != null && elementData.data.details.photos.length > 0 &&
                <CardMedia
                    className={classes.cover}
                    image={elementData.data.details.photos[0].url}

                />
                }

                <div className={classes.details}>
                    <CardContent className={classes.content}>
                        <Typography component="h5" variant="h5">
                            {elementData.data.details.name}
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary">
                            {truncateText(elementData.data.details.description)}
                        </Typography>
                    </CardContent>
                </div>
                <CardHeader
                    action={
                        <IconButton aria-label="remove" onClick={() => removeCallback(elementData)}>
                            <RemoveIcon/>
                        </IconButton>
                    }
                />
            </Card>

            {displayNoTransportWarning &&
            <Alert severity="error">No transport from this place specified</Alert>}

            <div className={classes.addParkingWrapper}>
                <Button style={{display: "inline"}} color="secondary" onClick={() => addTransportCallback(elementData)}>
                    <AddIcon/>
                </Button>
                <Typography style={{display: "inline"}} variant="subtitle1">
                    Add transport from this place
                </Typography>
            </div>

        </div>

    )
}

TourPlaceComponent.propTypes = {
    elementData: PropTypes.object.isRequired,
    removeCallback: PropTypes.func.isRequired,
    addTransportCallback: PropTypes.func.isRequired,
    displayNoTransportWarning: PropTypes.bool
};

export default withStyles(styles)(TourPlaceComponent)
