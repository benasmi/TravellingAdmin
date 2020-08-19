import withStyles from "@material-ui/core/styles/withStyles";
import React, {useEffect, useState} from "react";
import Typography from "@material-ui/core/Typography";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Button from "@material-ui/core/Button";
import history from "../../helpers/history";
import AddIcon from "@material-ui/icons/Add";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import Schedule from "./Schedule";
import moment from "moment";
import Switch from "@material-ui/core/Switch";
import shortid from 'shortid';
import TextField from "@material-ui/core/TextField";

const styles = theme => ({
  root: {
    width: '100%',
    display: "flex",
    flexDirection: "column",
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  tabContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
  },
  tabsLayout: {
    flex: 9,
  },
  addScheduleButtonContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  header: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between'
  }
});

export const defaultScheduleData = [
  {
    from: "01-25",
    to: "02-20",
    periods: [
      {
        openTime: "08:00",
        closeTime: "18:00",
        openDay: 0,
        elementId: shortid.generate()
      },
      {
        openTime: "08:00",
        closeTime: "18:00",
        openDay: 1,
        elementId: shortid.generate()
      },
      {
        openTime: "08:00",
        closeTime: "18:00",
        openDay: 2,
        elementId: shortid.generate()
      },
      {
        openTime: "08:00",
        closeTime: "18:00",
        openDay: 3,
        elementId: shortid.generate()
      },
      {
        openTime: "08:00",
        closeTime: "18:00",
        openDay: 4,
        elementId: shortid.generate()
      },
      {
        openTime: "08:00",
        closeTime: "17:00",
        openDay: 5,
        elementId: shortid.generate()
      },
    ],

  }
]

function SchedulesContainer({classes, scheduleData, setScheduleData, scheduleOpenIndex, setScheduleOpenIndex, seasonalScheduleEnabled, setSeasonalScheduleEnabled, isScheduleEnabled, setIsScheduleEnabled, lastAccommodation, setLastAccommodation}) {

  const handleAddSchedule = () => {
    setScheduleData(oldData => {
      const newData = [...oldData]
      newData.push({
        from: "01-01",
        to: "05-01",
        periods: [...defaultScheduleData[0].periods]
      })
      setScheduleOpenIndex(newData.length - 1)
      return newData;
    })
  }

  const tabsLayout = (
      <div className={classes.tabContainer}>
        <Tabs
            value={scheduleOpenIndex}
            onChange={(event, newValue) => setScheduleOpenIndex(newValue)}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            className={classes.tabsLayout}
        >
          {
            scheduleData.map((item, index) =>
                <Tab onClick={() => setScheduleOpenIndex(index)}
                     label={`${moment(item.from).format("MMMM ")}-${moment(item.to).format("MMMM ")}`}/>
            )
          }
        </Tabs>
        <div className={classes.addScheduleButtonContainer}>
          <IconButton
              onClick={handleAddSchedule}
              variant="text"
              color="secondary"
              size="large">
            <AddIcon/>
          </IconButton>
        </div>

      </div>
  )

  const handleToggleSeasonalSchedule = () => {
    const enabled = !seasonalScheduleEnabled
    setSeasonalScheduleEnabled(() => {
      setScheduleOpenIndex(0)
      return enabled
    })
    if(enabled){
      setScheduleData(schedule => {
        return [...schedule].map(item => {
          return {
            ...item,
            from: "01-01",
            to: "02-01"
          }
        })
      })
    }
  }

  const handleEnableLastAccommodation = () => {
    let accommodationTimeEnabled = lastAccommodation != null;
    setLastAccommodation(accommodationTimeEnabled ? null : 30)
  }

  return (
      <div className={classes.root}>
        <div className={classes.header}>
          <Typography variant="h6">
            Working hours
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


        { isScheduleEnabled &&
        <>
        <FormControlLabel
            control={
              <Checkbox
                  checked={seasonalScheduleEnabled}
                  onChange={handleToggleSeasonalSchedule}
                  name="checkedB"
                  color="primary"
              />
            }
            label="Enable seasonal schedule"
        />
          <FormControlLabel
          control={
          <Checkbox
              name="checkedB"
              color="primary"
              checked={lastAccommodation != null}
              onChange={handleEnableLastAccommodation}
          />
        }
          label="Specify last accommodation times"
          />
          {lastAccommodation != null &&
          <>
            {/*<Typography variant="h8">*/}
            {/*  Minutes before close time*/}
            {/*</Typography>*/}
            <TextField
                id="standard-number"
                label="Minutes to closing time"
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                value={lastAccommodation}
                onChange={(e) => setLastAccommodation(e.target.value)}
            />
          </>
          }

        {seasonalScheduleEnabled && tabsLayout}

          <Schedule scheduleData={scheduleData}
          seasonalScheduleEnabled={seasonalScheduleEnabled}
          setScheduleData={setScheduleData} scheduleOpenIndex={scheduleOpenIndex} setScheduleOpenIndex={setScheduleOpenIndex}/>
          </>}
      </div>
  )
}

export default withStyles(styles)(SchedulesContainer)


