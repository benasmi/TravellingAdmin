import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Schedule from "../Schedule";


const styles = theme => ({
    outline: {
        margin: theme.spacing(1),
        padding: theme.spacing(1),
        width: '100%'
    },
    button: {
        margin: theme.spacing(2)
    },
    paper:{
        padding: theme.spacing(2),
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: "8px"
    },
});

function WorkingSchedule({classes, scheduleData, setScheduleData,workingScheduleEnabled, setWorkingScheduleEnabled}) {

    return <div>
        <Typography variant="h6" >
            Working schedule
        </Typography>
        <FormControlLabel
            control={
                <Switch
                    checked={workingScheduleEnabled['hasSchedule']}
                    onChange={() => {
                        var obj = Object.assign({}, workingScheduleEnabled,{});
                        obj['hasSchedule'] = !obj['hasSchedule'];
                        console.log(obj);
                        setWorkingScheduleEnabled(obj)}}
                    color="primary"
                />
            }
            label="Enable working schedule for this place"
        />
        <br/>
        {workingScheduleEnabled['hasSchedule'] &&
            <Schedule scheduleData={scheduleData} setScheduleData={setScheduleData}/>
        }
    </div>
}

export default withStyles(styles)(WorkingSchedule)