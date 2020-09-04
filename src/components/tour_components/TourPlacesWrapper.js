import {withStyles} from "@material-ui/core/styles";
import TourPlaceComponent from "./TourPlaceComponent";
import React from "react";
import PropTypes from "prop-types";
import {ElementType} from "./Tour";
import { SortableContainer, SortableElement} from "react-sortable-hoc";
import TransportItem from "./TransportItem";
import shortid from 'shortid';
import Alert from "@material-ui/lab/Alert";

const styles = theme => ({
    tourPlaceComponent: {
        margin: theme.spacing(2)
    },
    root: {
        display: "flex",
        flexFlow: "column wrap",
        margin: theme.spacing(1)
    }
})

const TourPlaceSortable = SortableElement(({handleEditPlace, currentDay, elementData, removePlaceCallback, classes, tourInfoReducer, elementIndex, lastElement}) => (
    <div>
        <TourPlaceComponent removeCallback={removePlaceCallback} classes={{root: classes.tourPlaceComponent}}
                            elementData={elementData}
                            tourInfoReducer={tourInfoReducer}
                            elementIndex={elementIndex}
                            currentDay={currentDay}
                            handleEditPlace={handleEditPlace}
                            lastElement={lastElement}/>
    </div>
));

const SortableList = SortableContainer(({handleEditPlace, currentDay, removeElementCallback, tourInfo, classes, tourInfoReducer}) => {

    return (

        <ul>
            {tourInfo.days[currentDay].tour.map((item, index) => {

                switch (item.type) {
                    case ElementType.place:
                        return <TourPlaceSortable key={item.data.details.placeId} elementIndex={index}
                                                  elementData={item}
                                                  lastElement={index === tourInfo.days[currentDay].tour.length - 1}
                                                  index={index}
                                                  classes={classes}
                                                  currentDay={currentDay}
                                                  handleEditPlace={handleEditPlace}
                                                  tourInfoReducer={tourInfoReducer}
                                                  removePlaceCallback={() => removeElementCallback(index)}/>
                }
            })}
        </ul>
    )
});

function TourPlacesWrapper({classes, tourInfo, tourInfoReducer, currentDay, errorInfo, setErrorInfo, handleEditPlace}) {

    const removeElementCallback = (index) => {
        tourInfoReducer({
            type: 'REMOVE_ELEMENT',
            day: currentDay,
            index: index
        })
    };

    const onSortEnd = ({oldIndex, newIndex}) => {
        tourInfoReducer({
            type: 'MOVE_ELEMENT',
            day: currentDay,
            oldIndex: oldIndex,
            newIndex: newIndex
        })
    }

    return (
        <div className={classes.root}>
            {tourInfo.days[currentDay].tour.length === 0 &&
            <Alert severity="warning">You have not added any places for the currently selected day.</Alert>}
            <SortableList
                pressDelay={200}
                disableAutoscroll={false}
                tourInfoReducer={tourInfoReducer}
                tourInfo={tourInfo}
                onSortEnd={onSortEnd}
                handleEditPlace={handleEditPlace}
                currentDay={currentDay}
                classes={classes}
                removeElementCallback={removeElementCallback}/>
        </div>
    )
}

TourPlacesWrapper.propTypes = {
    tourInfo: PropTypes.object.isRequired,
    tourInfoReducer: PropTypes.func.isRequired,
    currentDay: PropTypes.number.isRequired,
};

export default withStyles(styles)(TourPlacesWrapper)
