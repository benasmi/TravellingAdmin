import {withStyles} from "@material-ui/core/styles";
import {Card} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";


const styles = theme => ({
    scheduleCard: {
        margin: theme.spacing(1),
        padding: theme.spacing(1),
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
        //width: '100%'
    },
})

function ScheduleCard({dayOfWeek, setData, data, classes}){

    const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

    const [openTime, setOpenTime] = useState(data.openTime);
    const [closeTime, setCloseTime] = useState(data.closeTime);
    const [isClosed, setIsClosed] = useState(data.isClosed);

    React.useEffect(() => {
        setData(oldData => {
            return oldData.map(item => {
                if(item.dayOfWeek === dayOfWeek)
                    return {dayOfWeek: dayOfWeek, openTime: openTime, closeTime: closeTime, isClosed: isClosed}
                else return item
            })
        })
    }, [openTime, isClosed, closeTime])

    return(
    <Card elevation={1} className={classes.scheduleCard}  >
        <Typography variant="h6">
            {weekDays[dayOfWeek]}
        </Typography>

        <div >

            {!isClosed &&
                <React.Fragment>
                <TextField
                    label="Opening time"
                    type="time"
                    value={openTime}
                    onChange={(e) => setOpenTime(e.target.value)}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    inputProps={{
                        step: 300, // 5 min
                    }}
                />
                <TextField
                    label="Closing time"
                    type="time"
                    onChange={(e) => setCloseTime(e.target.value)}
                    value={closeTime}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    inputProps={{
                        step: 300, // 5 min
                    }}
                />
                </React.Fragment>
            }
            <Checkbox
                name="checkedB"
                color="primary"
                onChange={() => setIsClosed(state => !state)}
                checked={!isClosed}
            />

        </div>

    </Card>
    )
}
ScheduleCard.propTypes = {
    dayOfWeek: PropTypes.number.isRequired,
    setData: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
};

function Schedule({scheduleData, setScheduleData, classes}) {
    return(
        <div>
            {scheduleData.map((item, index) => {
                return <ScheduleCard key={index} dayOfWeek={index} classes={classes} data = {scheduleData.filter(item => item.dayOfWeek === index)[0]}  setData={setScheduleData}/>
            })}
        </div>
    )
}

Schedule.propTypes = {
    setScheduleData: PropTypes.func.isRequired,
    scheduleData: PropTypes.array.isRequired,
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Schedule)