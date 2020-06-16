import React, {useState} from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import {withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow, DirectionsRenderer} from "react-google-maps"
import {geocodeFromLatLng} from "./MapGeolocation";
import MapToolbar from "./MapToolbar";
import PropTypes from "prop-types";
import MapLock from "./MapLock";

const styles = theme => ({});


const MapComponent = withGoogleMap(props =>
    <GoogleMap
        defaultZoom={12}
        center={{lat: props.position.latitude, lng: props.position.longitude }}
        defaultCenter={{lat: props.position.latitude, lng: props.position.longitude}}>

        <Marker
            name={'Dolores park'}
            visible={true}
            draggable={!props.isLocked}
            onDragEnd={e => onMarkerDragEnd(e, props.setPosition)}
            position={{lat: props.position.latitude, lng: props.position.longitude}}>
        </Marker>

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

    const [isLocked, setIsLocked] = useState(placeInfo.placeId !== undefined);

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