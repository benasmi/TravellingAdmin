import withStyles from "@material-ui/core/styles/withStyles";
import React, {useState} from "react";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import {DatePicker, TimePicker} from "@material-ui/pickers";
import moment from "moment";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import shortid from 'shortid';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: 5,
  },
  intervalContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    margin: 0,
    flexWrap: 'wrap',
  },
  pickerStyle: {
    width: 50,
    marginLeft: 3,
    margin: 0,
  }
});

function WorkingDayIntervals({classes, scheduleData, setScheduleData, scheduleOpenIndex, variantId, enableLastAccommodation}) {

  const currentSchedule = scheduleData[scheduleOpenIndex];
  const currentVariant = currentSchedule.variants.find(x => x.elementId === variantId)

  const toggleSplitSchedule = () => {
    if (currentVariant.shifts.length > 1)
      setScheduleData(oldData => {
        const newData = [...oldData];
        const shifts = newData[scheduleOpenIndex].variants.find(variant => variantId === variant.elementId).shifts
        while (shifts.length > 1)
          shifts.pop()
        return newData;
      })
    else
      setScheduleData(oldData => {
        const newData = [...oldData];
        const shiftToPush = {
          openTime: "08:00",
          closeTime: "18:00",
          elementId: shortid.generate()
        }
        if(enableLastAccommodation)
          shiftToPush['lastAccommodation'] = "18:00"
        newData[scheduleOpenIndex]
            .variants
            .find(variant => variantId === variant.elementId)
            .shifts
            .push(shiftToPush)
        return newData;
      })
  }

  const changeOpenTime = (shiftId, time) => {
    setScheduleData(oldData => {
      const newData = [...oldData]
      currentSchedule
          .variants
          .find(x => x.elementId === variantId)
          .shifts
          .find(shift => shift.elementId === shiftId)
          .openTime = moment(time).format('HH:mm') ;
      return newData;
    })
  }

  const changeCloseTime = (shiftId, time) => {
    setScheduleData(oldData => {
      const newData = [...oldData]
      currentSchedule
          .variants
          .find(x => x.elementId === variantId)
          .shifts
          .find(shift => shift.elementId === shiftId)
          .closeTime = moment(time).format('HH:mm');
      return newData;
    })
  }
  const changeLastAccommodationTime = (shiftId, time) => {
    setScheduleData(oldData => {
      const newData = [...oldData]
      currentSchedule
          .variants
          .find(x => x.elementId === variantId)
          .shifts
          .find(shift => shift.elementId === shiftId)
          .lastAccommodation = moment(time).format('HH:mm');
      return newData;
    })
  }

  const shifts = currentVariant.shifts.map((shift, index) => {
    const lastShift = index !== currentVariant.shifts.length - 1
    const firstShift = index === 0
    return (
        <>
          <div className={classes.intervalContainer}>

            <Typography variant="h7">
              {firstShift ? 'O' : 'o'}pens at
            </Typography>
            <TimePicker
                margin="normal"
                ampm={false}
                className={classes.pickerStyle}
                format="HH:mm"
                value={moment(shift.openTime, "HH:mm")}
                onChange={(date) => changeOpenTime(shift.elementId, date)}
            />
            <Typography variant="h7">
              and closes at
            </Typography>
            <TimePicker
                margin="normal"
                ampm={false}
                className={classes.pickerStyle}
                format="HH:mm"
                value={moment(shift.closeTime, "HH:mm")}
                onChange={(date) => changeCloseTime(shift.elementId, date)}
            />
            {enableLastAccommodation &&
            <>
              <Typography variant="h7">
                last accommodation at
              </Typography>
              <TimePicker
                  margin="normal"
                  ampm={false}
                  className={classes.pickerStyle}
                  format="HH:mm"
                  value={moment(shift.lastAccommodation, "HH:mm")}
                  onChange={(date) => changeLastAccommodationTime(shift.elementId, date)}
              />
            </>
            }

          </div>
          {lastShift && <Typography variant="h7" style={{marginRight: 5}}>
            THEN
          </Typography>}
        </>)
  })

  return (
      <div className={classes.root}>
        {shifts}
        <FormControlLabel
            control={
              <Checkbox
                  name="checkedB"
                  color="primary"
                  checked={currentVariant.shifts.length > 1}
                  onChange={toggleSplitSchedule}
              />
            }
            label="Split schedule"
        />
      </div>
  )
}

export default withStyles(styles)(WorkingDayIntervals)


