import React, {useCallback, useRef, useState} from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import {withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow, DirectionsRenderer} from "react-google-maps"
import {geocodeFromLatLng} from "./MapGeolocation";
import MapToolbar from "./MapToolbar";
import PropTypes from "prop-types";
import MapLock from "./MapLock";
import CustomControlsManager from "./CustomControlsManager";
import ExploreIcon from '@material-ui/icons/Explore';
import IconButton from "@material-ui/core/IconButton";

const styles = theme => ({});

const MapComponent = withGoogleMap(props =>
    <GoogleMap
        defaultZoom={12}
        ref={props.refInstance}
        center={{lat: props.position.latitude, lng: props.position.longitude }}
        defaultCenter={{lat: props.position.latitude, lng: props.position.longitude}}>

        <Marker
            name={'Dolores park'}
            visible={true}
            draggable={!props.isLocked}
            onDragEnd={e => onMarkerDragEnd(e, props.setPosition)}
            position={{lat: props.position.latitude, lng: props.position.longitude}}>
        </Marker>

        <CustomControlsManager position={window.google.maps.ControlPosition.BOTTOM_CENTER}>
            <div>
                <IconButton aria-label="delete" onClick={()=>{
                    if(!props.isLocked){
                        const mapCenter = props.refInstance.current.getCenter();
                        geocodeFromLatLng(mapCenter.lat(), mapCenter.lng()).then(location=>{
                            props.setPosition(location)
                        });
                    }
                }}>
                    <ExploreIcon fontSize={"large"}/>
                </IconButton>
            </div>
        </CustomControlsManager>
    </GoogleMap>

);

function onMarkerDragEnd(event, setLocationMarker) {
    let newLat = event.latLng.lat(),
        newLng = event.latLng.lng();
    geocodeFromLatLng(newLat, newLng).then(location => {
        setLocationMarker(location)
    })
}

function PlaceMap({placeInfo,locationMarker, setLocationMarker}) {

    const [isLocked, setIsLocked] = useState(placeInfo.placeId !== "");
    const refMap = useRef(null);

    function mapToolbarCallback(location) {
        setLocationMarker(location)
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
            isLocked={isLocked}
            position={locationMarker}
            setPosition={setLocationMarker}/>

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