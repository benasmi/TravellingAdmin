import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";
import React, {useState} from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import { TimePicker } from "@material-ui/pickers";
import moment from "moment";
import WarningIcon from '@material-ui/icons/Warning';
import Moment from "react-moment";

const styles = theme => ({
    root: {
        display: "flex",
        justifyContent : "space-between",
        margin: theme.spacing(0.5),
        padding: theme.spacing(0.5),
        alignItems: "center"
    },
    picker: {
        margin: theme.spacing(0.5),
        width: "30%"
    }
});

function ScheduleInterval({classes, intervals, index, setIntervals}){

    const getCloseDay = (closeTime, openTime) => {
        let currentPeriod = intervals[index]
        if(moment(closeTime, "HH:mm").isBefore(moment(openTime, "HH:mm")))
            return (currentPeriod.openDay + 1) > 6 ? 0 : (currentPeriod.openDay +1)
        else return currentPeriod.openDay
    }

    let handleUpdateOpenTime = (value) => {
        setIntervals((oldIntervals) => {
            return oldIntervals.map((item, i) => {
                if(index === i){
                    return {
                        ...item,
                        openTime: moment(value).format("HH:mm").toString(),
                        closeDay: getCloseDay(item.closeTime, value)
                    }
                }else return item
            })
        })
    }
    let handleUpdateCloseTime = (value) => {
        setIntervals((oldIntervals) => {
            return oldIntervals.map((item, i) => {
                if(index === i){
                    return {
                        ...item,
                        closeTime: moment(value).format("HH:mm").toString(),
                        closeDay: getCloseDay(value, item.openTime)
                    }
                }else return item
            })

        })
    }

    const handleDelete = () => {
        setIntervals(oldIntervals => {
            return oldIntervals.filter((item, i) => i !== index)
        })
    }

    return(
        <div className={classes.root}>
            <div>
                <TimePicker
                    margin="normal"
                    ampm={false}
                    label="Opens"
                    className={classes.picker}
                    format="HH:mm"
                    value={moment(intervals[index].openTime, "HH:mm")}
                    onChange={handleUpdateOpenTime}
                    InputProps={{
                        disableUnderline: true,
                    }}
                />
                <TimePicker
                    margin="normal"
                    ampm={false}
                    className={classes.picker}
                    label="Closes"
                    format="HH:mm"
                    value={moment(intervals[index].closeTime, "HH:mm")}
                    onChange={handleUpdateCloseTime}
                    InputProps={{
                        disableUnderline: true,
                    }}
                />

                {intervals[index].closeDay !== intervals[index].openDay &&
                    <React.Fragment>
                        <Typography variant="subtitle1">
                            <WarningIcon style={{marginRight: "10px"}}/>
                            Closes the next day
                        </Typography>
                    </React.Fragment>}
            </div>
            <div>
                <Button color="primary" onClick={handleDelete}>
                    <DeleteOutlineIcon/>
                </Button>
            </div>
        </div>
    )
}

ScheduleInterval.propTypes = {
    classes: PropTypes.object.isRequired,
    intervals: PropTypes.array.isRequired,
    setIntervals: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
};

export default withStyles(styles)(ScheduleInterval)
