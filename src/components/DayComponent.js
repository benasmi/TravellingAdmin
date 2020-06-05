import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";
import React, {useEffect, useState} from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import Paper from "@material-ui/core/Paper";
import ScheduleInterval from "./ScheduleInterval";
import Divider from "@material-ui/core/Divider";

const styles = theme => ({
    header: {
        display: "flex",
        justifyContent : "space-between"
    },
    root: {
        margin: theme.spacing(0.5),
        padding: theme.spacing(0.5)
    }
});

function DayComponent({classes, scheduleData, setScheduleData, openDay, onChange}){

    let [intervals, setIntervals] = useState(scheduleData.periods.filter(item => item.openDay === openDay))

    useEffect(() => {
        onChange(intervals, openDay)
        console.log(intervals)
    }, [intervals])

    let weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

    const handleAddPeriod = () => {
        setIntervals(oldIntervals => {
            return [
                ...oldIntervals,
                {openDay: openDay, closeDay: openDay, openTime: "08:00", closeTime: "18:00"}
            ]
        })
    }

    return(
        <div className={classes.root}>
            <div className={classes.header}>
                <Typography variant="h6" >
                    {weekDays[openDay]}
                </Typography>
                <Button color="secondary" onClick={handleAddPeriod}>
                    <AddIcon/>
                </Button>
            </div>

            {intervals.map((value, index) => {
                return <React.Fragment>
                    <Divider variant="middle" />
                    <ScheduleInterval index={index} intervals={intervals} setIntervals={setIntervals}/>
                </React.Fragment>
            })}

        </div>
    )
}

DayComponent.propTypes = {
    classes: PropTypes.object.isRequired,
    scheduleData: PropTypes.object.isRequired,
    setScheduleData: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default withStyles(styles)(DayComponent)
