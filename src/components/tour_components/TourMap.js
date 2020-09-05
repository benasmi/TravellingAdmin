import React, {useContext, useEffect, useMemo, useRef, useState} from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";
import {withGoogleMap, GoogleMap, Marker, InfoWindow, DirectionsRenderer} from "react-google-maps"
import {ElementType} from "./Tour";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import FilterBlock from "../add_place_components/FilterBlock";
import CustomControlsManager from "../maps/CustomControlsManager";
import API from "../../Networking/API";
import {PlacesFilterContext} from "../../contexts/PlacesFilterContext";
import Avatar from "@material-ui/core/Avatar";
import CircularProgress from "@material-ui/core/CircularProgress";

const google = window.google;

const styles = theme => ({
    root: {
        margin: theme.spacing(4),
    }, cover: {
        [theme.breakpoints.down("lg")]: {
            height: "200px",
        },
        [theme.breakpoints.only("lg")]: {
            flex: 1,
            height: "auto",
        },
    },
    largeIcon: {
        width: theme.spacing(14),
        height: theme.spacing(14),
    },
});


/**
 * Tours map component
 * @type {React.ComponentClass<WithGoogleMapProps>}
 */
const MyMapComponent = withGoogleMap(props =>
    <GoogleMap
        ref={props.refMap}
        defaultZoom={8}
        defaultCenter={{lat: 55.2983804, lng: 23.9132164}}>

        {props.children}

    </GoogleMap>
);


function TourMap({classes, tourInfo, currentDay, addPlace, removePlace}) {

    const [directions, setDirection] = useState();

    console.log('rerender')

    const [infoWindows, setInfoWindows] = useState([]);
    const [directionPlaces, setDirectionPlaces] = useState([])


    const [places, setPlaces] = useState([]);
    const [placesInfoWindows, setPlacesInfoWindows] = useState([]);

    const [loadingArea, setLoadingArea] = useState(false);
    const refMap = useRef(null);

    const {filterQuery} = useContext(PlacesFilterContext);

    const constructPlaceData = () => {
        let p = tourInfo.days[currentDay].tour.filter(item => item.type === ElementType.place);
        let places = [];
        p.forEach(item => {
            let placeId = item.data.details.placeId;
            let lat = item.data.details.latitude;
            let lng = item.data.details.longitude;
            let name = item.data.details.name;
            let photos = item.data.details.photos;
            places.push({placeId: placeId, latitude: lat, longitude: lng, name: name, photo: photos.length > 0 ? photos[0].url : null});
        });
        setInfoWindows(Array(places.length).fill(false))
        setDirectionPlaces(places);
        return places
    };

    useEffect(() => {
        const places = constructPlaceData();
        if(places.length>1){
            const waypoints = places.map(p =>({
                location: {lat: p.latitude, lng:p.longitude},
                stopover: true
            }));

            const origin = waypoints.shift().location;
            let destination = null;

            if (waypoints.length > 0)
                destination = waypoints.pop().location;
            else
                destination = origin;

            const directionsService = new google.maps.DirectionsService();

            directionsService.route(
                {
                    origin: origin,
                    destination: destination,
                    travelMode: google.maps.TravelMode.DRIVING,
                    waypoints: waypoints
                },
                (result, status) => {
                    if (status === google.maps.DirectionsStatus.OK) {
                        setDirection(result)
                    } else {
                        alert(status);
                    }
                }
            );
        } else {
            setDirection(null)
        }
    }, [currentDay, tourInfo.days]);


    function fetchPlaces(){
        console.log("Getting all places...", refMap.current.getCenter().lat())
        getAllPlaces(filterQuery + "&p=" + 0 + "&s=" + 100 + "&l=" + refMap.current.getCenter().lat() + "," + refMap.current.getCenter().lng() + "range=" + 50)
    }

    useEffect(() => {
        if(!loadingArea){
            if(refMap.current != null){
                fetchPlaces()
            }
        }
    }, [filterQuery]);

    function getAllPlaces(query) {
        setLoadingArea(true);
        API.Places.getAllPlacesAdmin(query).then(locations => {
            setPlacesInfoWindows(Array(locations.list.length).fill(false));
            setPlaces(locations.list)
            setLoadingArea(false)
        }).catch(err => {
            console.log(err);
            setLoadingArea(false)
        })
    }

    function addPlaceToTourDay(place) {
        setPlacesInfoWindows(Array(places.length).fill(false));
        addPlace(place, ElementType.place)
    }

    function removePlaceFromTourDay(place) {
        tourInfo.days[currentDay].tour.map((row, index)=>{
            if(row.type === ElementType.place){
                if(row.data.details.placeId === place.placeId){
                    removePlace(index)
                }
            }
        })
    }

    /**
     * Renders places markers on the map
     * @return {*[]}
     */
    function PlacesMarkers() {
        return places.map((location, i) => {
            const latitude = parseFloat(location.latitude);
            const longitude = parseFloat(location.longitude);
            return <Marker
                zIndex={1}
                key={location.placeId}
                position={{lat: latitude, lng: longitude}}
                onClick={() => {
                    let markers = Object.assign({}, placesInfoWindows);
                    markers[i] = true;
                    setPlacesInfoWindows(markers)
                }}
            >
                {placesInfoWindows[i] && (
                    <InfoWindow onCloseClick={() => {
                        let markers = Object.assign({}, placesInfoWindows);
                        markers[i] = false;
                        setPlacesInfoWindows(markers)
                    }
                    }>
                        <div style={{display: "flex", flexDirection: "column"}}>
                            <Typography variant="h6">
                                {location.name}
                            </Typography>

                            <Button
                                onClick={()=>{addPlaceToTourDay(location)}}
                                variant="text"
                                color="secondary"
                                size="large"
                                startIcon={<AddIcon/>}>
                                Add this place to tour!
                            </Button>
                        </div>
                    </InfoWindow>
                )}
            </Marker>
        })
    }


    const searchAreaComponent = useMemo(() => (
        <CustomControlsManager position={window.google.maps.ControlPosition.TOP_CENTER}>
            <div>
                {loadingArea ?
                    <CircularProgress />
                    :
                    <Button variant="contained"
                            color="primary"
                            onClick={() => {
                               fetchPlaces()
                            }}
                    >
                        Search area...
                    </Button>
                }

            </div>
        </CustomControlsManager>
    ), [loadingArea]);

    return (
        <div className={classes.root}>
            <FilterBlock/>
            <MyMapComponent
                loadingElement={<div style={{height: `100%`}}/>}
                containerElement={<div style={{height: `400px`}}/>}
                mapElement={<div style={{height: `100%`}}/>}
                refMap={refMap}>

                {searchAreaComponent}
                <PlacesMarkers/>

                {/* Rendering direction path*/}
                {directions ?
                    <DirectionsRenderer
                        options={{suppressMarkers: true, draggable: false}}
                        draggable={false}
                        directions={directions}/> : null}

                {/* Rendering direction places markers*/}
                {directionPlaces.map((marker, index) => {
                    const position = { lat: marker.latitude, lng: marker.longitude };
                    return <Marker
                        zIndex={2}
                        icon={{
                            url: require('../../res/selectedTourIcon.svg'),
                            scaledSize: new window.google.maps.Size(48, 48),
                            origin: new window.google.maps.Point(0, 0),
                            labelOrigin: new window.google.maps.Point(24, 16),
                        }}
                        key={index}
                        position={position}
                        label={{text: `${index+1}`, color: "white"}}
                        onClick={
                        ()=>{
                            let info = Object.assign({}, infoWindows);
                            info[index] = true;
                            setInfoWindows(info);
                        }
                    }>
                        {infoWindows[index] && (
                        <InfoWindow onCloseClick={()=>{
                            let info = Object.assign({}, infoWindows);
                            info[index] = false;
                            setInfoWindows(info);
                        }}>
                                <Card style={{display:"flex", flexDirection: "column",alignItems:"center"}}>
                                    {marker.photo ?<Avatar alt="Remy Sharp" src={marker.photo} className={classes.largeIcon}/> : null}

                                    <Typography>
                                        {marker.name}
                                    </Typography>
                                    <Button
                                        onClick={()=>removePlaceFromTourDay(marker)}
                                        style={{marginTop: 12}}
                                        variant="contained"
                                        color="secondary"
                                        startIcon={<DeleteIcon />}
                                    >
                                        Remove from tour
                                    </Button>

                                </Card>
                        </InfoWindow>
                        )}
                    </Marker>
                })}

            </MyMapComponent>

        </div>
    )
}

TourMap.propTypes = {
    tourInfo: PropTypes.object.isRequired,
    currentDay: PropTypes.number.isRequired,
};

export default withStyles(styles)(TourMap)
