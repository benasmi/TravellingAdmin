import React, {useEffect, useState} from "react";
import {GoogleMap, InfoWindow, Marker, withGoogleMap} from "react-google-maps";
import {geocodeFromLatLng} from "./MapGeolocation";
import MapToolbar from "./MapToolbar";
import API from "../../Networking/API";
import PropTypes, {func} from "prop-types";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import withStyles from "@material-ui/core/styles/withStyles";
import MapLock from "./MapLock";


const styles = theme =>({

});


const parkingIcon = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/parking_lot_maps.png';

const MapComponent = withGoogleMap(props =>
    <GoogleMap
        defaultZoom={12}
        center={{lat: props.position.latitude, lng: props.position.longitude }}
        defaultCenter={{lat: props.position.latitude, lng: props.position.longitude}}>

        <Marker
            onClick={()=>{if(!props.isLocked)props.setMainInfoWindow(true)}}
            name={'Dolores park'}
            visible={true}
            draggable={!props.isLocked}
            onDragEnd={e => onMarkerDragEnd(e, props.setPosition)}
            position={{lat: props.position.latitude, lng: props.position.longitude}}>

            {props.mainInfoWindow && (
                <InfoWindow onCloseClick={()=>{props.setMainInfoWindow(false)}}>
                    <div style={{display:"flex", flexDirection: "column"}}>
                        {props.position.address}
                        <Button
                            onClick={()=>{
                                props.addNewParking(props.position)
                            }}
                            variant="text"
                            color="secondary"
                            size="large"
                            startIcon={<AddIcon />}>
                            Add new parking
                        </Button>
                    </div>
                </InfoWindow>
            )}
        </Marker>

        {
            props.parkingData.map((location, i) =>{
                const latitude = parseFloat(location.latitude);
                const longitude = parseFloat(location.longitude);

                return <Marker
                    key={location.parkingId}
                    position={{ lat: latitude, lng: longitude}}
                    options={{icon: parkingIcon}}
                    onClick={()=>{
                        if(!props.isLocked){
                            let markers = Object.assign({},props.parkingInfoWindows, {});
                            markers[i] = true;
                            props.setParkingInfoWindows(markers)
                        }
                    }}
                >
                    {props.parkingInfoWindows[i] && (
                        <InfoWindow onCloseClick={()=>{
                                let markers = Object.assign({},props.parkingInfoWindows, {});
                                markers[i] = false;
                                props.setParkingInfoWindows(markers)
                            }
                        }>
                            <div style={{display:"flex", flexDirection: "column"}}>
                                {location.address}
                                <Button
                                    onClick={()=>{props.addExistingParking(location)}}
                                    variant="text"
                                    color="secondary"
                                    size="large"
                                    startIcon={<AddIcon />}>
                                    Add parking
                                </Button>
                            </div>
                        </InfoWindow>
                    )}

                </Marker>

            })
        }

    </GoogleMap>
);

function onMarkerDragEnd(event, setLocationMarker) {
    let newLat = event.latLng.lat(),
        newLng = event.latLng.lng();
    geocodeFromLatLng(newLat, newLng).then(location => {
        setLocationMarker(location)
    })
}

function ParkingMap({placeInfo, locationMarker, setLocationMarker, addNewParking, addExistingParking}) {

    const [parkingData, setParkingData] = useState([]);
    const [mainInfoWindow, setMainInfoWindow] = useState(false);
    const [parkingInfoWindows, setParkingInfoWindows] = useState(false);
    const [isLocked, setIsLocked] = useState(placeInfo.placeId !== undefined);

    function getClosestParking(){
        API.Parking.getParkingByLocation("?lat="+locationMarker.latitude+"&lng="+locationMarker.longitude).then(response=>{
            setParkingData(response);
        }).catch(error=>{
        })
    }

    useEffect(()=>{
        console.log("Downloading new markers");
        getClosestParking()
    },[locationMarker]);

    function mapToolbarCallback(location) {
        setMainInfoWindow(true);
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
            mainInfoWindow={mainInfoWindow}
            setMainInfoWindow={setMainInfoWindow}
            addNewParking={addNewParking}
            addExistingParking={addExistingParking}
            parkingInfoWindows={parkingInfoWindows}
            setParkingInfoWindows={setParkingInfoWindows}
            parkingData={parkingData}
            position={locationMarker}
            setPosition={setLocationMarker}
            isLocked={isLocked}
        />

        <MapLock
            isLocked={isLocked}
            setIsLocked={setIsLocked}
        />
    </React.Fragment>
}


ParkingMap.propTypes = {
    placeInfo: PropTypes.object.isRequired,
    locationMarker: PropTypes.object.isRequired,
    setLocationMarker: PropTypes.func.isRequired,
    addNewParking: PropTypes.func.isRequired,
    addExistingParking: PropTypes.func.isRequired
};

export default withStyles(styles)(ParkingMap)