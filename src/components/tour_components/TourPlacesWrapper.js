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

const TourPlaceSortable = SortableElement(({displayNoTransportWarning, elementData, removePlaceCallback, classes, addTransportCallback}) => (
    <div>
        <TourPlaceComponent removeCallback={removePlaceCallback} classes={{root: classes.tourPlaceComponent}}
                            addTransportCallback={addTransportCallback} elementData={elementData}
                            displayNoTransportWarning={displayNoTransportWarning}/>
    </div>
));
const TransportItemSortable = SortableElement(({transportId, transportChangeCallback, transportRemoveCallback}) => (
    <div>
        <TransportItem transportId={transportId} transportRemoveCallback={transportRemoveCallback} transportChangeCallback={transportChangeCallback}/>
    </div>
));

const SortableList = SortableContainer(({currentDay, removeElementCallback, tourInfo, classes, addTransportCallback, transportChangeCallback}) => {

    const shouldDisplayNoTransportWarning = (index) => {
        let elements = tourInfo.days[currentDay].tour
        return ((elements.length -1 ) > index) && elements[index + 1].type !== ElementType.transport
    }

    return (

        <ul>
            {tourInfo.days[currentDay].tour.map((item, index) => {

                switch (item.type) {
                    case ElementType.place:
                        return <TourPlaceSortable key={item.data.details.placeId} index={index}
                                                  addTransportCallback={addTransportCallback} elementData={item}
                                                  classes={classes}
                                                  displayNoTransportWarning={shouldDisplayNoTransportWarning(index)}
                                                  removePlaceCallback={() => removeElementCallback(index)}/>
                    case ElementType.transport:
                        return <TransportItemSortable key={item.data.elementIdentifier} index={index}
                                                      transportId={item.data.transport}
                                                      transportRemoveCallback = {() => removeElementCallback(index)}
                                                      transportChangeCallback={(transport) => transportChangeCallback(index, transport)}/>
                }
            })}
        </ul>
    )
});

function TourPlacesWrapper({classes, tourInfo, tourInfoReducer, currentDay, errorInfo, setErrorInfo}) {

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

    const handleTransportChange = (index, data) => {
        tourInfoReducer({
            type: 'UPDATE_ELEMENT',
            day: currentDay,
            index: index,
            data: data
        })
    }

    const addTransportCallback = (details) => {
        tourInfoReducer({
            type: 'INSERT_TRANSPORT_FOR_PLACE',
            placeId: details.data.details.placeId,
            day: currentDay,
            data: {type: ElementType.transport, data: {transport: 0, elementIdentifier: shortid.generate()}}
        })
    }



    return (
        <div className={classes.root}>
            {tourInfo.days[currentDay].tour.length === 0 &&
            <Alert severity="warning">You have not added any places for the currently selected day.</Alert>}
            <SortableList
                pressDelay={200}
                disableAutoscroll={false}
                currentDay={currentDay}
                tourInfo={tourInfo}
                transportChangeCallback={handleTransportChange}
                onSortEnd={onSortEnd}
                classes={classes}
                addTransportCallback={addTransportCallback}
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
