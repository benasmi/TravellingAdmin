import withStyles from "@material-ui/core/styles/withStyles";
import React from "react";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import {TimePicker} from "@material-ui/pickers";
import moment from "moment";
import Typography from "@material-ui/core/Typography";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import shortid from 'shortid';

const styles = theme => ({
  root: {
    flex: 1,
    marginTop: 10,
    border: '1px dashed black',
    padding: 8
  },
  weekdayPickerContainer: {
    display: 'flex',
    width: '100%',
  },
  weekdayButtonContainer: {
    flex: 1,
    // margin: 5,
    padding: 0,
    minHeight: 0,
    minWidth: 0,
  },
  button: {
    flex: 1,
    margin: 5,
    padding: 0,
    minHeight: 0,
    minWidth: 0,
    width: '90%'
  },
  intervalContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    margin: 0,
    flexWrap: 'wrap',
  },
  pickerStyle: {
    width: 35,
    marginLeft: 3,
    margin: 0,
  },
  pickerInput: {
    fontSize: 13,
    padding: 0,
  },
})

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

const generateDefaultPeriod = () => {
  return {
    openTime: "08:00",
    closeTime: "18:00",
    elementId: shortid.generate()
  }
}

function ScheduleWorkingHours({schedule, setSchedule, scheduleOpenIndex, classes}) {

  const findPeriods = (dayIndex) => {
    return schedule[scheduleOpenIndex].periods.filter(period => period.openDay === dayIndex)
  }

  const changeOpenTime = (elementId, time) => {
    setSchedule(oldData => {
      const newData = [...oldData]
      newData[scheduleOpenIndex].periods.find(period => period.elementId === elementId).openTime = moment(time).format('HH:mm');
      return newData;
    })
  }
  const changeCloseTime = (elementId, time) => {
    setSchedule(oldData => {
      const newData = [...oldData]
      newData[scheduleOpenIndex].periods.find(period => period.elementId === elementId).closeTime = moment(time).format('HH:mm');
      return newData;
    })
  }

  const determineGlobalCloseTime = () => {
    if(schedule[scheduleOpenIndex].periods == null || schedule[scheduleOpenIndex].length === 0)
      return "08:00"
    else
      return moment(schedule[scheduleOpenIndex].periods[0].closeTime, "HH:mm")
  }
  const determineGlobalOpenTime = () => {
    if(schedule[scheduleOpenIndex].periods == null || schedule[scheduleOpenIndex].length === 0)
      return "18:00"
    else
      return moment(schedule[scheduleOpenIndex].periods[0].openTime, "HH:mm")
  }

  return (
      <div>
        <div className={classes.root}>
          <div className={classes.weekdayPickerContainer}>
            {weekdays.map((item, index) => {
              const periods = findPeriods(index)
              const splitSchedule = periods.length > 1

              const toggleWorkday = () => {
                if (periods.length > 0) {
                  setSchedule(oldData => {
                    const newData = [...oldData]
                    newData[scheduleOpenIndex].periods = newData[scheduleOpenIndex].periods.filter(period => period.openDay !== index)
                    return newData
                  })
                } else {
                  setSchedule(oldData => {
                    const newData = [...oldData]
                    newData[scheduleOpenIndex].periods.push({...generateDefaultPeriod(), openDay: index})
                    return newData
                  })
                }
              }

              const toggleSplitSchedule = () => {
                if (splitSchedule)
                  setSchedule(oldData => {
                    const newData = [...oldData];
                    const periods = newData[scheduleOpenIndex].periods.filter(period => period.openDay === index)
                    const lastperiod = periods.pop()
                    newData[scheduleOpenIndex].periods = newData[scheduleOpenIndex].periods.filter(period => period.elementId != lastperiod.elementId)
                    return newData;
                  })
                else
                  setSchedule(oldData => {
                    const newData = [...oldData];
                    newData[scheduleOpenIndex].periods.push({...generateDefaultPeriod(), openDay: index})
                    return newData;
                  })
              }

              return (
                  <>
                    <div className={classes.weekdayButtonContainer}>
                      <Button variant={"contained"}
                              color={periods.length !== 0 ? "primary" : "secondary"}
                              className={classes.button}
                              onClick={toggleWorkday}>
                        {item.name}
                      </Button>
                      {periods.map((period) => {
                        return <>
                          <div className={classes.intervalContainer}>
                            <TimePicker
                                margin="normal"
                                ampm={false}
                                className={classes.pickerStyle}
                                format="HH:mm"
                                minutesStep={30}
                                InputProps={{
                                  classes: {
                                    input: classes.pickerInput,
                                  },
                                }}
                                value={moment(period.openTime, "HH:mm")}
                                onChange={(time) => changeOpenTime(period.elementId, time)}
                            />
                            <Typography variant="h7">
                              -
                            </Typography>
                            <TimePicker
                                margin="normal"
                                ampm={false}
                                className={classes.pickerStyle}
                                format="HH:mm"
                                minutesStep={30}
                                InputProps={{
                                  classes: {
                                    input: classes.pickerInput,
                                  },
                                }}
                                value={moment(period.closeTime, "HH:mm")}
                                onChange={(time) => changeCloseTime(period.elementId, time)}
                            />
                          </div>
                        </>
                      })}
                      {periods.length !== 0 && <FormControlLabel
                          style={{width: '100%'}}
                          control={
                            <Checkbox
                                name="checkedB"
                                color="primary"
                                checked={splitSchedule}
                                onChange={toggleSplitSchedule}
                            />
                          }
                          label={<span style={{fontSize: 13}}>Split</span>}
                      />}

                    </div>
                    <Divider orientation="vertical" flexItem/>
                  </>
              )
            })}
          </div>

        </div>
        <Typography variant="h7">
          Global time
        </Typography>
        <TimePicker
            margin="normal"
            ampm={false}
            format="HH:mm"
            className={classes.pickerStyle}
            minutesStep={30}
            InputProps={{
              classes: {
                input: classes.pickerInput,
              },
            }}
            onChange={(e) => {
              setSchedule(schedules => {
                const newSchedules = [...schedules]
                newSchedules[scheduleOpenIndex].periods = newSchedules[scheduleOpenIndex].periods.map(period => {
                  return {
                    ...period,
                    openTime: moment(e).format("HH:mm")
                  }
                })
                return newSchedules
              })
            }}
            value={determineGlobalOpenTime()}
        />
        <Typography variant="h7">
          -
        </Typography>
        <TimePicker
            margin="normal"
            ampm={false}
            format="HH:mm"
            className={classes.pickerStyle}
            minutesStep={30}
            InputProps={{
              classes: {
                input: classes.pickerInput,
              },
            }}
            onChange={(e) => {
              setSchedule(schedules => {
                const newSchedules = [...schedules]
                newSchedules[scheduleOpenIndex].periods = newSchedules[scheduleOpenIndex].periods.map(period => {
                  return {
                    ...period,
                    closeTime: moment(e).format("HH:mm")
                }
                })
                return newSchedules
              })
            }}
            value={determineGlobalCloseTime()}
        />
      </div>
  )
}

export default withStyles(styles)(ScheduleWorkingHours)
