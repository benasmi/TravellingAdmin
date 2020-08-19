import withStyles from "@material-ui/core/styles/withStyles";
import React, {useState} from "react";
import Typography from "@material-ui/core/Typography";
import {DatePicker, TimePicker} from "@material-ui/pickers";
import moment from "moment";
import WorkingHoursVariant, {weekdays} from "./WorkingHoursVariant";
import Button from "@material-ui/core/Button";
import history from "../../helpers/history";
import AddIcon from "@material-ui/icons/Add";
import shortid from 'shortid';
import Alert from "@material-ui/lab/Alert";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import ScheduleWorkingHours from "./ScheduleWorkingHours";

const styles = theme => ({
  root: {
    flex: 1,
    marginTop: 10,
    width: '100%',
  },
  scheduleDateContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
  pickerStyle: {
    width: 100,
    padding: 5,
  }
});


function Schedule({classes, scheduleData, setScheduleData, scheduleOpenIndex, setScheduleOpenIndex, seasonalScheduleEnabled}) {

  const currentSchedule = scheduleData[scheduleOpenIndex]

  const changeFromDate = (date, value) => {
    setScheduleData(oldData => {
      const newData = [...oldData];
      newData[scheduleOpenIndex].from = moment(date).format('MM-DD');
      return newData;
    })
  }

  const changeToDate = (date, value) => {
    setScheduleData(oldData => {
      const newData = [...oldData];
      newData[scheduleOpenIndex].to = moment(date).format('MM-DD');
      return newData;
    })
  }

  const scheduleDateContainer = (
      <div className={classes.scheduleDateContainer}>
        <Typography variant="h8">
          This schedule applies from
        </Typography>
        <DatePicker
            className={classes.pickerStyle}
            views={["month", "date"]}
            // maxDate={currentSchedule.to}
            value={currentSchedule.from}
            onChange={changeFromDate}
        />
        <Typography variant="h8">
          to
        </Typography>
        <DatePicker
            className={classes.pickerStyle}
            views={["month", "date"]}
            // minDate={currentSchedule.from}
            value={currentSchedule.to}
            onChange={changeToDate}
        />
      </div>
  )

  const handleRemoveSchedule = () => {
    setScheduleOpenIndex(index => {
      setScheduleData(oldData => {
        return  [...oldData].filter((item, i) => index !== i)
      })
      return index - 1;
    })
  }

  return (
      <div className={classes.root}>
        {seasonalScheduleEnabled && scheduleDateContainer}
        {scheduleOpenIndex !== 0 && <Button
            variant="text"
            color="primary"
            size="large"
            onClick={handleRemoveSchedule}
            startIcon={<DeleteOutlineIcon/>}
            style={{display: 'absolute'}}>Remove this schedule</Button>}

        <ScheduleWorkingHours schedule={scheduleData} setSchedule={setScheduleData} scheduleOpenIndex={scheduleOpenIndex} />

      </div>
  )
}

export default withStyles(styles)(Schedule)


