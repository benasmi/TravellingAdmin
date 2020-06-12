import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React, {useEffect, useState} from "react";
import AddIcon from '@material-ui/icons/Add';
import Button from "@material-ui/core/Button";
import Schedule from "../Schedule";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TextField from "@material-ui/core/TextField";
import {TimePicker} from "@material-ui/pickers";
import moment from "moment";

const styles = theme => ({
    header: {
        display: "flex",
        justifyContent : "space-between",
        flexWrap: "wrap"
    }
});

function SchedulesWrapper({classes, scheduleData, setScheduleData, isScheduleEnabled, setIsScheduleEnabled}){

    const addSchedule = () => {
        setScheduleData(oldData => {
            return [
                ...oldData,
                {scheduleDefault: false, from: "01-01", to: "01-02", periods : []}
            ]
        })
    }

    return(
        <div>
            <div className={classes.header}>
                <Typography variant="h6" >
                    Working schedule
                </Typography>
                <FormControlLabel
                    control={
                        <Switch
                            checked={isScheduleEnabled}
                            onChange={() => setIsScheduleEnabled(state => !state)}
                            color="primary"
                        />
                    }
                    label="Enable schedule for this place?"
                />
            </div>
            <br/>
            {isScheduleEnabled &&
                <React.Fragment>
                    {scheduleData.map((value, index) => {
                        return <Schedule data={value} index={index} setData={setScheduleData}/>
                    })}
                    <Button style={{float: "right"}}color="secondary" onClick={addSchedule}>
                        <AddIcon/>
                    </Button>
                </React.Fragment>}
        </div>
    )
}

SchedulesWrapper.propTypes = {
    classes: PropTypes.object.isRequired,
    scheduleData: PropTypes.array.isRequired,
    setScheduleData: PropTypes.func.isRequired,
    isScheduleEnabled: PropTypes.object.isRequired,
    setIsScheduleEnabled: PropTypes.func.isRequired,
};

export default withStyles(styles)(SchedulesWrapper)
