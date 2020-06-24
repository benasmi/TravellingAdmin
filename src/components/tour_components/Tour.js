import {withStyles} from "@material-ui/core/styles";
import React, {createRef, useCallback, useEffect, useMemo, useRef, useState} from "react";
import useTheme from "@material-ui/core/styles/useTheme";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import TourPlaceComponent from "./TourPlaceComponent";
import Paper from "@material-ui/core/Paper";
import TourPlacesWrapper from "./TourPlacesWrapper";
import PlaceSearch from "./PlaceSearch";
import DaysWrapper from "./DaysWrapper";
import TourReducer from "./TourReducer";
import TourDataReducer from "./TourReducer";
import TourInfoComponent from "./TourInfoComponent";
import Divider from "@material-ui/core/Divider";
import TourMap from "./TourMap";
import Button from "@material-ui/core/Button";
import API from "../../Networking/API";
import UseSnackbarContext from "../../contexts/UseSnackbarContext";
import shortid from 'shortid';
import CircularProgress from "@material-ui/core/CircularProgress";
import Backdrop from "@material-ui/core/Backdrop";

export const ElementType = {
    place: 0,
    transport: 1
}
export const PlaceType = {
    api: 1,
    local: 0
}

const styles = theme => ({
    root: {
        [theme.breakpoints.down("lg")]: {
            overflow: "scroll",
        },
        [theme.breakpoints.up("lg")]: {
            overflow: "initial",
            display: "flex",
        },
        height: `calc(100% - 64px)`,
        width: "100%",
        '&::-webkit-scrollbar': {
            display: "none"
        },
    },
    loader: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100vw",
        height: "100vh"
    },
    rightLayout: {
        flex: 2,
        '&::-webkit-scrollbar': {
            display: "none"
        },
        [theme.breakpoints.up("lg")]: {
            height: "100%",
            overflowY: "scroll",

        },
    },
    leftLayout: {
        [theme.breakpoints.up("lg")]: {
            height: "100%",
        },
        overflowY: "scroll",

        flex: 1,
        '&::-webkit-scrollbar': {
            display: "none"
        },
    },
    actionsArea: {
        padding: theme.spacing(1),
        display: "flex",
        justifyContent: "flex-end"
    },

})

const sampleTourData = {
    name: "",
    description: "",
    days: [
        {
            description: "",
            elementIdentifier: "jkasfbjkdsbjk",
            tour: []
        }
    ]
}

function Tour({classes, match}) {

    const [localPlacesFound, setLocalPlacesFound] = useState([])
    const [apiPlacesFound, setApiPlacesFound] = useState([])
    const [currentDay, setCurrentDay] = useState(0)
    const [tourId, setTourId] = useState(match.params.tourId)
    const [isLoading, setIsLoading] = useState(match.params.tourId !== undefined);

    const [errorInfo, setErrorInfo] = useState({
            errors: {
                titleMissing: false,
                /* Any client-side verification errors may by added here, and handled in individual components */
            },
            showErrors: false
        }
    )

    const [tourInfo, dispatchTourInfo] = React.useReducer(TourDataReducer, sampleTourData)
    const {addConfig} = UseSnackbarContext();


    const handleAddPlaceClick = (placeInfo, type) => {
        dispatchTourInfo({
            type: 'ADD_ELEMENT',
            day: currentDay,
            data: {
                type: ElementType.place,
                data: {
                    type: type,
                    details: {...placeInfo}
                },
            },
            onError: () => {
                addConfig(false, "This place already exists in this tour.")
            }
        })
    }

    useEffect(() => {
        if (tourId !== undefined) {
            // setIsLoading(true)
            loadData()
        }
    }, [])

    const loadData = () => {
        API.Tour.getTour("?id=" + tourId).then((response) => {
            let aggregatedDays = [];
            response.days.forEach(day => {
                let aggregatedElements = [];
                day.data.forEach(place => {
                    let aggregatedPlace = {
                        type: ElementType.place,
                        data: {details: place.place, type: place.place.type}
                    }
                    delete aggregatedPlace.data.details.type
                    aggregatedElements.push(aggregatedPlace)
                    place.transport.forEach(transport => {
                        aggregatedElements.push({
                            type: ElementType.transport,
                            data: {transport: transport.fk_transportId - 1, elementIdentifier: shortid.generate()}
                        })
                    })
                })
                let aggregatedDay = {...day, tour: aggregatedElements, elementIdentifier: shortid.generate()}
                delete aggregatedDay.data
                aggregatedDays.push(aggregatedDay)
            })
            let aggregatedTour = {...response, days: aggregatedDays}
            dispatchTourInfo({type: 'SET_ALL', data: aggregatedTour})
        }).catch((error) => {
            addConfig(false, "Tour has failed to load")
            setTourId(undefined)
        }).finally(() => {
            setIsLoading(false)
        })
    }

    const handleSave = () => {
        let containsErrors = false;
        Object.keys(errorInfo.errors).map(function(keyName, keyIndex) {
            if(errorInfo.errors[keyName]){
                setErrorInfo(state => {return {...state, showErrors: true}})
                containsErrors = true;
            }
        })
        if(containsErrors) return
        setErrorInfo(state => {return {...state, showErrors: false}})

        const aggregatedDays = []
        tourInfo.days.forEach(day => {
            let aggregatedDay = {...day, data: []}
            delete aggregatedDay.tour
            delete aggregatedDay.elementIdentifier
            for (let i = 0; i < day.tour.length; i++) {
                let element = day.tour[i]
                if (element.type !== ElementType.place)
                    continue;
                let transport = []
                for (let j = i + 1; j < day.tour.length && day.tour[j].type === ElementType.transport; j++) {
                    transport.push({fk_transportId: day.tour[j].data.transport + 1})
                }
                let aggregatedPlace = {
                    place: {
                        type: element.data.type,
                        placeId: element.data.details.placeId
                    },
                    transport: transport
                }
                aggregatedDay.data.push(aggregatedPlace)
            }
            aggregatedDays.push(aggregatedDay)
        })
        let aggregatedTour = {...tourInfo, days: aggregatedDays}

        if (tourId === undefined) {
            API.Tour.insertTour(aggregatedTour).then((response) => {
                addConfig(true, "Tour has been inserted successfully!")
                setTourId(response)
            }).catch((error) => {
                addConfig(false, "Something went wrong while saving this tour.")
            })
        } else {
            API.Tour.updateTour(aggregatedTour, "?id=" + tourId).then((response) => {
                addConfig(true, "Tour has been updated successfully!")
            }).catch((error) => {
                addConfig(false, "Something went wrong while saving this tour.")
            })
        }

    }

    const leftLayout = useMemo(() => (
        <div className={classes.leftLayout}>
            <PlaceSearch addPlaceCallback={handleAddPlaceClick} localPlacesFound={localPlacesFound}
                         setLocalPlacesFound={setLocalPlacesFound} apiPlacesFound={apiPlacesFound}
                         setApiPlacesFound={setApiPlacesFound}/>
        </div>
    ), [localPlacesFound, apiPlacesFound, currentDay])


    let dayInfoWithoutDesc = JSON.stringify(tourInfo.days.map(day => {
        let dayCopy = {...day}
        delete dayCopy.description
        return dayCopy
    }))

    const mapComponent = useMemo(() => (
        <React.Fragment>
            <TourPlacesWrapper errorInfo={errorInfo} setErrorInfo={setErrorInfo}
                               currentDay={currentDay} tourInfoReducer={dispatchTourInfo} tourInfo={tourInfo}/>
            <TourMap tourInfo={tourInfo} currentDay={currentDay}/>
        </React.Fragment>
    ),[dayInfoWithoutDesc, currentDay])

    const tourDaysComponents = useMemo(() => (
        <div>
            <DaysWrapper currentDay={currentDay} setCurrentDay={setCurrentDay} tourInfo={tourInfo}
                         tourInfoReducer={dispatchTourInfo}/>
            <Divider variant="middle"/>
            {mapComponent}
        </div>
    ), [tourInfo.days, currentDay, errorInfo]);

    const rightLayout = useMemo(() => (
        <Paper className={classes.rightLayout} >
            <TourInfoComponent tourInfo={tourInfo} tourInfoReducer={dispatchTourInfo} errorInfo={errorInfo} setErrorInfo={setErrorInfo}/>
            <Divider variant="middle"/>
            {tourDaysComponents}
            <div className={classes.actionsArea}>
                <Button variant="contained" color="primary" onClick={handleSave}>
                    Save this tour
                </Button>
            </div>
        </Paper>
    ), [tourInfo, currentDay, errorInfo]);

    const theme = useTheme();
    const largeScreen = useMediaQuery(theme.breakpoints.up('lg'));

    const content = (
        <React.Fragment>
            {largeScreen ?
                <React.Fragment>
                    {leftLayout}
                    {rightLayout}
                </React.Fragment> :
                <React.Fragment>
                    {rightLayout}
                    {leftLayout}
                </React.Fragment>
            }
        </React.Fragment>
    );

    return (
        <div className={classes.root}>
            {isLoading ? <div className={classes.loader}><CircularProgress/></div> : content}
        </div>
    )
}


export default withStyles(styles)(Tour)
