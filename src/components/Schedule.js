import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React, {useEffect, useState} from "react";
import Button from "@material-ui/core/Button";
import RemoveIcon from "@material-ui/icons/Remove";
import Paper from "@material-ui/core/Paper";
import {DatePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';
import Divider from "@material-ui/core/Divider";
import DayComponent from "./DayComponent";
import moment from "moment";

const styles = theme => ({
    header: {
        display: "flex",
        justifyContent : "space-between"
    },
    root: {
        padding: theme.spacing(2),
        margin: theme.spacing(1)
    },
    pickerStyle: {
        margin: theme.spacing(1)
    },
    headerLeft: {
        width: "100%",
        display: "flex",
        justifyContent: "left"
    }
});

function Schedule({classes, data, setData, index}){

    const[periods, setPeriods] = useState([...data.periods])

    const handleIntervalChange = (newIntervals, openDay) => {
        setPeriods(oldPeriods => {
            let filtered = oldPeriods.filter(item => item.openDay !== openDay)
            if(newIntervals.length === 0)
                return [...filtered]
            return [
                ...filtered,
                ...newIntervals
            ]
        })
    }

    useEffect(() => {
        setData(oldData => {
            return oldData.map((schedule, i) => {
                if( i === index){
                    return {...schedule, periods: periods}
                }else return schedule
            })
        })
    }, [periods])

    const generateWeekdayViews = () => {
        let views = []
        for(let i =0; i < 7; i++){
            views.push(<DayComponent scheduleData={data} onChange={handleIntervalChange} setScheduleData={setData} openDay={i} key={i}/>)
        }
        return views
    }

    const updateFromTime = (value) => {
        setData(oldData => {
            return oldData.map((schedule, i) => {
                if( i === index){
                    return {...schedule, from: moment(value).format('MM-DD').toString()}
                }else return schedule
            })
        })
    }
    const updateToTime = (value) => {
        setData(oldData => {
            return oldData.map((schedule, i) => {
                if( i === index){
                    return {...schedule, to: moment(value).format('MM-DD').toString()}
                }else return schedule
            })
        })
    }
    const removeSchedule = () => {
        setData(oldData => {
            return oldData.filter((item, i) => index !== i)
        })
    }

    return(
        <Paper className={classes.root}>
            <div className={classes.header}>
                <div className={classes.headerLeft}>
                    {data.scheduleDefault &&
                    <Typography variant="h6" >
                        Date: Year round
                    </Typography>}
                    {!data.scheduleDefault &&
                        <React.Fragment>
                            <DatePicker
                                className={classes.pickerStyle}
                                views={["month", "date"]}
                                label="From"
                                value={moment(data.from, "MM-DD")}
                                onChange={updateFromTime}
                            />
                            <DatePicker
                                className={classes.pickerStyle}
                                views={["month", "day"]}
                                label="To"
                                value={moment(data.to, "MM-DD")}
                                onChange={updateToTime}
                            />
                        </React.Fragment>
                    }
                </div>
                {!data.scheduleDefault &&
                <Button color="secondary" onClick = {removeSchedule}>
                    <RemoveIcon/>
                </Button>}

            </div>
            <br/>
            {generateWeekdayViews()}
        </Paper>
    )
}

Schedule.propTypes = {
    classes: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    setData: PropTypes.func.isRequired,
};

export default withStyles(styles)(Schedule)
