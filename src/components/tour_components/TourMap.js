import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import TextField from "@material-ui/core/TextField";
import PropTypes from "prop-types";

const styles = theme => ({
    root: {
        margin: theme.spacing(4),
    },
});

function TourMap({classes, tourInfo, currentDay}) {

    /*
    Example of getting 0th place and 0th day lat and lng
    let lat = tourInfo.days[0].tour[0].details.latitude
    let lng = tourInfo.days[0].tour[0].details.longitude

    Keep in mind, that you want to only look for elements, that are of place (not of transport) type.
    So you'd do something like this to get current day's places:
    let places = tourInfo.days[currentDay].tour.filter(item => item.type === ElementType.place)
    and then something like this
    places.forEach(item => {
        let lat = item.details.latitude
        let lng = item.details.longitude
    })
    */
    return (
        <div className={classes.root}>
            {/*Map placeholder*/}
        </div>
    )
}

TourMap.propTypes = {
    tourInfo: PropTypes.object.isRequired,
    currentDay: PropTypes.number.isRequired,
};

export default withStyles(styles)(TourMap)