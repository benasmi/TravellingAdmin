import React, {useCallback, useEffect, useRef, useState} from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import {withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow, DirectionsRenderer} from "react-google-maps"
import {geocodeFromLatLng} from "./MapGeolocation";
import MapToolbar from "./MapToolbar";
import PropTypes from "prop-types";
import MapLock from "./MapLock";
import CustomControlsManager from "./CustomControlsManager";
import ExploreIcon from '@material-ui/icons/Explore';
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Alert from "@material-ui/lab/Alert";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import API from "../../Networking/API";
import Avatar from "@material-ui/core/Avatar";
import DeleteIcon from "@material-ui/icons/Delete";
import Card from "@material-ui/core/Card";
var buildUrl = require('build-url');
const styles = theme => ({ largeIcon: {
        width: theme.spacing(14),
        height: theme.spacing(14),
    }});

const MapComponent = withGoogleMap(props =>
    <GoogleMap
        defaultZoom={12}
        ref={props.refInstance}
        center={{lat: props.position.latitude, lng: props.position.longitude }}
        defaultCenter={{lat: props.position.latitude, lng: props.position.longitude}}>

        {props.children}

    </GoogleMap>

);



function PlaceMap({classes, placeInfo,locationMarker,setLocationMarker,setParkingLocationMarker}) {

    const [otherPlacesData, setOtherPlacesData] = useState([]);
    const [infoWindows, setInfoWindows] = useState([]);

    const [isLocked, setIsLocked] = useState(placeInfo.placeId !== "");
    const refMap = useRef(null);

    function mapToolbarCallback(location) {
        setParkingLocationMarker(location);
        setLocationMarker(location)
    }

    useEffect(()=>{
        getClosestPlaces()
    },[locationMarker]);

    function getClosestPlaces(){
        API.Places.getAllPlacesAdmin(buildUrl(null, {
            queryParams: {
                p: "0",
                s: "10",
                range: 1,
                l: [locationMarker.latitude, locationMarker.longitude]
            }
        })).then(response=>{
            console.log("Vaje vaje", response.list)
            setOtherPlacesData(response.list);
        }).catch(error=>{

        })
    }

    function onMarkerDragEnd(event) {
        let newLat = event.latLng.lat(),
            newLng = event.latLng.lng();
        geocodeFromLatLng(newLat, newLng).then(location => {
            setLocationMarker(location);
            setParkingLocationMarker(location)
        })
    }
    
    return <React.Fragment>
        <MapToolbar
            isLocked={isLocked}
            locationCallback={mapToolbarCallback}/>

        <MapComponent
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `400px` }} />}
            mapElement={<div style={{ height: `100%` }} />}
            refInstance={refMap}
            position={locationMarker}
        >
            {
                otherPlacesData.map((location, i) =>{
                    console.log(location)
                    console.log(locationMarker)
                    const latitude = parseFloat(location.latitude)
                    const longitude = parseFloat(location.longitude)


                        return locationMarker.latitude.toFixed(3) !== latitude.toFixed(3) &&
                        locationMarker.longitude.toFixed(3)!==longitude.toFixed(3) ? <Marker
                            key={location.placeId}
                            position={{lat: latitude, lng: longitude}}
                            icon={{
                                url: require('../../res/selectedTourIcon.svg'),
                                scaledSize: new window.google.maps.Size(32, 32),
                                origin: new window.google.maps.Point(0, 0)
                            }}
                            onClick={() => {
                                if (!isLocked) {
                                    let markers = Object.assign([], infoWindows);
                                    markers[i] = true;
                                    setInfoWindows(markers)
                                }
                            }}
                        >
                            {infoWindows[i] && (
                                <InfoWindow onCloseClick={() => {
                                    let markers = Object.assign([], infoWindows);
                                    markers[i] = false;
                                    setInfoWindows(markers)
                                }
                                }>

                                    <Card style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                                        {location.photos[0].url ? <Avatar alt="Remy Sharp" src={location.photos[0].url}
                                                                          className={classes.largeIcon}/> : null}
                                        <Typography variant="h6">
                                            {location.name}
                                        </Typography>

                                    </Card>
                                </InfoWindow>
                            )}
                        </Marker> : null

                })
            }

            <Marker
                name={'Dolores park'}
                visible={true}
                draggable={!isLocked}
                onDragEnd={e => onMarkerDragEnd(e)}
                position={{lat: locationMarker.latitude, lng: locationMarker.longitude}}>
            </Marker>

            <CustomControlsManager position={window.google.maps.ControlPosition.BOTTOM_CENTER}>
                <div>
                    <IconButton aria-label="delete" onClick={()=>{
                        if(!isLocked){
                            const mapCenter = refMap.current.getCenter();
                            geocodeFromLatLng(mapCenter.lat(), mapCenter.lng()).then(location=>{
                                setLocationMarker(location)
                                setParkingLocationMarker(location)
                            });
                        }
                    }}>
                        <ExploreIcon fontSize={"large"}/>
                    </IconButton>
                </div>
            </CustomControlsManager>
        </MapComponent>



        <MapLock
            isLocked={isLocked}
            setIsLocked={setIsLocked}
        />
    </React.Fragment>


}

PlaceMap.propTypes = {
    locationMarker: PropTypes.object.isRequired,
    setLocationMarker: PropTypes.func.isRequired
};

export default withStyles(styles)(PlaceMap)