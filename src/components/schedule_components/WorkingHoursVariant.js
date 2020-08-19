import withStyles from "@material-ui/core/styles/withStyles";
import React from "react";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import WorkingShift from "./WorkingShift";
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';

const styles = theme => ({
  root: {
    flex: 1,
    marginTop: 10,
    border: '1px dashed black',
    padding: 8
  },
  weekdayPickerContainer: {
    display: 'flex',
    width: '100%'
  },
  weekdayButton: {
    flex: 1,
    margin: 5,
    padding: 0,
    minHeight: 0,
    minWidth: 0,
  },
  removeButtonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
  }
});

export const weekdays = [
  {
    id: 0,
    name: "Mon",
    fullName: "Monday",
  },
  {
    id: 1,
    name: "Tue",
    fullName: "Tuesday",
  },
  {
    id: 2,
    name: "Wed",
    fullName: "Wednesday",
  },
  {
    id: 3,
    name: "Thu",
    fullName: "Thursday",
  },
  {
    id: 4,
    name: "Fri",
    fullName: "Friday",
  },
  {
    id: 5,
    name: "Sat",
    fullName: "Saturday",
  },
  {
    id: 6,
    name: "Sun",
    fullName: "Sunday",
  }
]


function WorkingHoursVariant({classes, enableLastAccommodation, scheduleData, setScheduleData, scheduleOpenIndex, variantId}) {

  const currentSchedule = scheduleData[scheduleOpenIndex];
  const currentVariant = currentSchedule.variants.filter(x => x.elementId === variantId)[0]

  const toggleWeekday = (weekDayIndex) => {
    setScheduleData(scheduleData => {
      const newScheduleData = [...scheduleData];
      let days = newScheduleData[scheduleOpenIndex].variants.find(item => item.elementId === variantId).days
      if (days.includes(weekDayIndex))
        days.splice(days.indexOf(weekDayIndex), 1);
      else
        days.push(weekDayIndex);
      return newScheduleData
    })
  }

  const weekdayReserved = (weekDayIndex) => {
    return currentSchedule.variants.some(variant => variant.days.includes(weekDayIndex));
  }

  const weekdayPicker = (
      <div className={classes.weekdayPickerContainer}>
        {weekdays.map((item) => {
          const dayActive = currentVariant.days.some(day => day === item.id);
          return(
              <Button onClick={() => toggleWeekday(item.id)}
                      className={classes.weekdayButton}
                      variant={"contained"}
                      color={dayActive ? "primary" : "secondary"}
                      disabled={!dayActive && weekdayReserved(item.id)}>
                {item.name}
              </Button>
          )}
        )
        }
      </div>
  )

  const handleDeleteVariant = () => {
    setScheduleData(oldData => {
      const newData = [...oldData];
      const variants = newData[scheduleOpenIndex].variants;
      variants.splice(variants.findIndex(variant => variant.elementId === variantId), 1)
      return newData;
    })
  }

  return (
      <div className={classes.root}>
        {/*<Divider light/>*/}

        {weekdayPicker}
        <WorkingShift
            enableLastAccommodation={enableLastAccommodation}
            scheduleData={scheduleData}
            scheduleOpenIndex={scheduleOpenIndex}
            setScheduleData={setScheduleData}
            variantId={variantId}/>
        <div className={classes.removeButtonContainer}>
          <Button
              variant="text"
              color="primary"
              size="large"
              onClick={handleDeleteVariant}
              startIcon={<DeleteOutlineIcon/>}
              style={{display: 'absolute'}}>Remove this variant</Button>
        </div>
      </div>
  )
}

export default withStyles(styles)(WorkingHoursVariant)


