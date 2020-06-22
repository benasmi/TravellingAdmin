import React, {useEffect, useRef, useState} from "react";
import {GoogleMap, InfoWindow, Marker, withGoogleMap} from "react-google-maps";
import {geocodeFromLatLng} from "./MapGeolocation";
import MapToolbar from "./MapToolbar";
import API from "../../Networking/API";
import PropTypes, {func} from "prop-types";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import withStyles from "@material-ui/core/styles/withStyles";
import MapLock from "./MapLock";
import CustomControlsManager from "./CustomControlsManager";
import IconButton from "@material-ui/core/IconButton";
import ExploreIcon from "@material-ui/icons/Explore";
import Alert from "@material-ui/lab/Alert";
import Typography from "@material-ui/core/Typography";


const MapComponent = withGoogleMap(props =>
    <GoogleMap
        ref={props.refInstance}
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

        <CustomControlsManager position={window.google.maps.ControlPosition.BOTTOM_CENTER}>
            <div>
                <IconButton aria-label="delete" onClick={()=>{
                    if(!props.isLocked){
                        let loc = Object.assign({},props.position, {});
                        const mapCenter = props.refInstance.current.getCenter();
                        loc.latitude = mapCenter.lat();
                        loc.longitude = mapCenter.lng();
                        props.setPosition(loc)
                    }
                }}>
                    <ExploreIcon fontSize={"large"}/>
                </IconButton>
            </div>
        </CustomControlsManager>

        {
            props.parkingData.map((location, i) =>{
                const latitude = parseFloat(location.latitude);
                const longitude = parseFloat(location.longitude);
                console.log(parkingIsAttached(location, props.selectedParkingData));
                return <Marker
                    key={location.parkingId}
                    position={{ lat: latitude, lng: longitude}}
                    icon={{
                        url: parkingIsAttached(location, props.selectedParkingData) ? require('../../res/selectedParking.svg') :
                            require('../../res/availableParking.svg'),
                        scaledSize: new window.google.maps.Size(20, 48),
                        origin: new window.google.maps.Point(0, 0),
                        anchor: new window.google.maps.Point(10, 35)
                    }}
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
                                <Typography variant="h6">
                                    {location.address}
                                </Typography>
                                {parkingIsAttached(location, props.selectedParkingData) ? <div>
                                        <Alert severity="success">This parking location is already attached! See below in "Selected parking locations" section.</Alert>
                                </div> :
                                <Button
                                    onClick={()=>{props.addExistingParking(location)}}
                                    variant="text"
                                    color="secondary"
                                    size="large"
                                    startIcon={<AddIcon />}>
                                    Add parking
                                </Button>
                                }
                            </div>
                        </InfoWindow>
                    )}

                </Marker>

            })
        }

    </GoogleMap>
);

function parkingIsAttached(parking, selectedParkingData) {
    for(let i = 0; i<selectedParkingData.length; i++){
        if(selectedParkingData[i].address === parking.address)
            return true
    }
    return false
}

function onMarkerDragEnd(event, setLocationMarker) {
    let newLat = event.latLng.lat(),
        newLng = event.latLng.lng();
    geocodeFromLatLng(newLat, newLng).then(location => {
        setLocationMarker(location)
    })
}

function ParkingMap({placeInfo,
                        locationMarker,
                        setLocationMarker,
                        addNewParking,
                        addExistingParking,
                        selectedParkingData
                    }) {

    const [parkingData, setParkingData] = useState([]);
    const [mainInfoWindow, setMainInfoWindow] = useState(false);
    const [parkingInfoWindows, setParkingInfoWindows] = useState(false);
    const [isLocked, setIsLocked] = useState(false);
    const refMap = useRef(null);


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
            refInstance={refMap}
            selectedParkingData={selectedParkingData}
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

export default ParkingMap