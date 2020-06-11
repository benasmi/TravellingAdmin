import {withStyles} from "@material-ui/core/styles";
import React from "react";
import PropTypes from "prop-types";
import DayCard from "./DayCard";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import {SortableContainer, SortableElement} from "react-sortable-hoc";
import shortid from 'shortid';
import UseAlertDialogContext from "../../contexts/UseAlertDialogContext";

const styles = theme => ({
    root: {
        margin: theme.spacing(2)
    },
    addDayButton: {
        marginTop: theme.spacing(1)
    },
    footerWrapper: {
        display: "flex",
        width: "100%",
        justifyContent: "flex-end"
    }
})

const DayCardSortable = SortableElement(({dayInfo, day, currentDay, onSelectCallback, tourInfoReducer, removeDayCallback}) => (
    <DayCard
        description={dayInfo.description}
        currentDay={currentDay}
        index={day}
        handleRemoveDay={removeDayCallback}
        onSelectCallback={onSelectCallback}
        tourInfoReducer={tourInfoReducer}/>
));

const SortableList = SortableContainer(({elements, currentDay, onSelectCallback, tourInfoReducer, removeDayCallback}) => {

    return (
        <ul>
            {elements.map((item, index) => {
                return <DayCardSortable
                    currentDay={currentDay}
                    day={index}
                    index={index}
                    removeDayCallback={removeDayCallback}
                    key={item.elementIdentifier}
                    dayInfo={item}
                    onSelectCallback={onSelectCallback}
                    tourInfoReducer={tourInfoReducer}/>
            })}
        </ul>
    );
});

function DaysWrapper({classes, currentDay, setCurrentDay, tourInfo, tourInfoReducer}) {

    const { addAlertConfig } = UseAlertDialogContext();

    const handleSelect = (index) => {
        setCurrentDay(index)
    }

    const addDayHandler = () => {
        tourInfoReducer({
            type: 'ADD_DAY',
            data: {
                description: "",
                elementIdentifier: shortid.generate(),
                tour: []
            }
        })
    }

    const removeDay = (day) => {
        tourInfoReducer({
                type: 'REMOVE_DAY',
                day: day,
            }
        )
        if(day === currentDay)
            setCurrentDay(day - 1)
    }

    const removeDayCallback = (day) => {
        if(tourInfo.days.length === 1){
            addAlertConfig("Warning", "The tour has to have at least one day", [])
        }else{
            if(tourInfo.days[day].tour.length > 0){ //This day has at least one place/transport added to it
                addAlertConfig("Warning", "Are you sure you want to remove this day?",[{name: "yes", action: ()=>{
                    removeDay(day)
                    }}],() => {
                })
            }else removeDay(day)
        }
    }

    const onSortEnd = ({oldIndex, newIndex}) => {
        tourInfoReducer({
            type: 'MOVE_DAY',
            oldIndex: oldIndex,
            newIndex: newIndex
        })
        setCurrentDay(newIndex)
    }

    return (
        <div className={classes.root}>
            <SortableList
                elements={tourInfo.days}
                currentDay={currentDay}
                onSortEnd={onSortEnd}
                removeDayCallback={removeDayCallback}
                distance={10}
                onSelectCallback={handleSelect}
                tourInfoReducer={tourInfoReducer}/>
            <div className={classes.footerWrapper}>
                <Button
                    variant="text"
                    color="secondary"
                    size="large"
                    className={classes.addDayButton}
                    onClick={addDayHandler}
                    startIcon={<AddIcon/>}>
                    Add another day
                </Button>
            </div>

        </div>
    )
}

DaysWrapper.propTypes = {
    setCurrentDay: PropTypes.func.isRequired,
    currentDay: PropTypes.number.isRequired,
    tourInfoReducer: PropTypes.func.isRequired,
    tourInfo: PropTypes.object.isRequired,
};

export default withStyles(styles)(DaysWrapper)
