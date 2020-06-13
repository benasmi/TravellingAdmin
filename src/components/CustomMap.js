import React, {memo, useEffect, useMemo, useState} from 'react'
import Autocomplete from 'react-google-autocomplete';
import Geocode from "react-geocode";
import {compose, withProps, withReducer, withStateHandlers} from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from "react-google-maps"
import withStyles from "@material-ui/core/styles/withStyles";
import {map} from "react-bootstrap/cjs/ElementChildren";
import PropTypes, {func} from "prop-types";
import Button from "@material-ui/core/Button";
import history from "../helpers/history";
import AddIcon from "@material-ui/icons/Add";
import MyLocationIcon from '@material-ui/icons/MyLocation';
import IconButton from "@material-ui/core/IconButton";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Alert from "@material-ui/lab/Alert";
import Grid from "@material-ui/core/Grid";


//

//Geocoding API: AIzaSyDGFjZHSoRrZ2AEO0ONXvjuN4RiCmknXf8
//Places API: AIzaSyDGFjZHSoRrZ2AEO0ONXvjuN4RiCmknXf8
//Maps API: AIzaSyDGFjZHSoRrZ2AEO0ONXvjuN4RiCmknXf8

const styles = theme => ({
    content: {
        margin: theme.spacing(1)
    },
    autocomplete:{
        width: '200px',
        height: '40px',
        fontSize: "14px",
        border: "0",
        borderBottom: "2px solid grey",
        outline:"0",
        marginBottom: "4px"
    },
    root: {
        display:"flex",
        flexDirection: "column",
        marginTop: "8px",
        padding: theme.spacing(1)
    }
});

var markerData = {};
function CustomMap({classes, locationData, setLocationData, mapHeight, selectedParkingCallback, changedParkingMarkerCallback, addParkingCallback, initialLock}){

    CustomMap.propTypes = {
        locationData: PropTypes.object,
        setLocationData: PropTypes.func,
        mapHeight: PropTypes.number
    };

    var parkingIcon = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/parking_lot_maps.png';
    var firstTime = true;

    Geocode.setApiKey("AIzaSyDGFjZHSoRrZ2AEO0ONXvjuN4RiCmknXf8");
    Geocode.enableDebug();


    function useFunction(callback) {
        const ref = React.useRef();
        ref.current = callback;

        return React.useCallback(function() {
            const callback = ref.current;
            if (typeof callback === "function") {
                return callback.apply(this, arguments);
            }
        }, []);
    }
    const selectParkingHandler = useFunction(selectedParkingCallback);
    const addNewParkingHandler = useFunction(addParkingCallback);

    const onPlaceSelected = (place, onMarkerLocationChanged, onParkingDataChanged) => {

        const address = place.formatted_address
        const addressArray =  place.address_components
        if(addressArray !== undefined){
            const city = getCity( addressArray ),
                country = getCountry(addressArray),
                latitudeValue = place.geometry.location.lat(),
                longitudeValue = place.geometry.location.lng();

            onMarkerLocationChanged(latitudeValue, longitudeValue, address, city, country);
            changeLocationData(city,country,address,latitudeValue,longitudeValue, onParkingDataChanged);
        }
    };

    const onMarkerDragEnd = ( event, onMarkerLocationChanged, onParkingDataChanged) => {
        let newLat = event.latLng.lat(),
            newLng = event.latLng.lng();
            geocodeFromLatLng(newLat, newLng, onMarkerLocationChanged, onParkingDataChanged)
    };

    function geocodeFromLatLng(newLat, newLng, onMarkerLocationChanged, onParkingDataChanged){
        Geocode.fromLatLng( newLat , newLng ).then(
            response => {
                const address = response.results[0].formatted_address
                const addressArray =  response.results[0].address_components
                if(addressArray!==undefined){
                    const city = getCity( addressArray ),
                        country = getCountry( addressArray );

                    onMarkerLocationChanged(newLat, newLng, address, city, country);

                    changeLocationData(city,country,address,newLat,newLng, onParkingDataChanged);
                }
            },
            error => {
                console.error(error);
            }
        );
    }

    function geocodeFromAddress(address, onMarkerLocationChanged, onParkingDataChanged){
        Geocode.fromAddress( address ).then(
            response => {
                const { lat, lng } = response.results[0].geometry.location;
                const address = response.results[0].formatted_address;
                const addressArray =  response.results[0].address_components;
                if(addressArray!==undefined){
                    const city = getCity( addressArray ),
                        country = getCountry( addressArray );

                    onMarkerLocationChanged(lat, lng, address, city, country);
                    changeLocationData(city,country,address,lat,lng, onParkingDataChanged);
                }
            },
            error => {
                console.error(error);
            }
        );
    }


    const handleKeyPress = (event, onMarkerLocationChange, onParkingDataChange) =>{
        const value = event.target.value;
        if (event.which === 13 || event.keyCode === 13) {
            if (/[a-zA-Z]+/.test(value)){
                geocodeFromAddress(value, onMarkerLocationChange, onParkingDataChange)
            }else{
                let position = value.split(/[ ,]+/);
                if(position.length === 2){
                    geocodeFromLatLng(parseFloat(position[0]), parseFloat(position[1]), onMarkerLocationChange, onParkingDataChange)
                }
            }
            return false;
        }
        return true;
    };

    function changeLocationData(city,country,address,latitude,longitude, onParkingDataChanged) {
        let data = Object.assign({}, locationData, {});
        data['city'] = city;
        data['country'] = country;
        data['address'] = address;
        data['latitude'] = latitude;
        data['longitude'] = longitude;
        setLocationData(data);
        markerData = data;
        if (changedParkingMarkerCallback !== undefined){
            changedParkingMarkerCallback(city,address,country, latitude,longitude, onParkingDataChanged);
        }
    }

    /**
     * Get the city and set the city input value to the one selected
     *
     * @param addressArray
     * @return {string}
     */
    const getCity = ( addressArray ) => {
        if(addressArray !== undefined){
            let city = '';
            for( let i = 0; i < addressArray.length; i++ ) {
                if ( addressArray[ i ].types[0] && 'administrative_area_level_2' === addressArray[ i ].types[0] ) {
                    city = addressArray[ i ].long_name;
                    return city;
                }
            }
        }
    };

    function getCurrentPosition(onMarkerLocationChanged, onParkingDataChanged, toggleParkingInfoWindow){
        navigator.geolocation.getCurrentPosition(function(position) {
            let newLat = position.coords.latitude,
                newLng = position.coords.longitude;

            Geocode.fromLatLng( newLat , newLng ).then(
                response => {
                    const address = response.results[0].formatted_address
                    const addressArray =  response.results[0].address_components
                    if(addressArray!==undefined){
                        const city = getCity( addressArray ),
                            country = getCountry( addressArray );

                        toggleParkingInfoWindow(true);
                        onMarkerLocationChanged(newLat, newLng, address, city, country);
                        changeLocationData(city,country,address,newLat,newLng, onParkingDataChanged);
                    }
                },
                error => {
                }
            );
        }, error=>{
            alert(error.message + "\n" + JSON.stringify(error))
        });
    }

    const getCountry = (addressArray) =>{
        if(addressArray!==undefined){
        let country = '';
        for( let i = 0; i < addressArray.length; i++ ) {
            if ( addressArray[ i ].types[0] && 'country' === addressArray[ i ].types[0] ) {
                country = addressArray[ i ].long_name;
                return country;
            }
        }
        }
    };

    /**
     *
     * Renders parking data markers
     *
     * @param onToggleOpen Method to open marker's info window
     * @param infoWindows Marker info window
     * @param parking data
     * @returns {*}
     */
    const markers = (onToggleOpen, infoWindows, parking, mapIsLocked) =>{
        return parking.map((location, i) => {

            const latitude = parseFloat(location.latitude);
            const longitude = parseFloat(location.longitude);

            return (
                <Marker
                    key={location.parkingId}
                    position={{ lat: latitude, lng: longitude}}
                    options={{icon: parkingIcon}}
                    onClick={()=>{
                        if(!mapIsLocked)
                            onToggleOpen(location.parkingId)}}
                >

                    {infoWindows[i].showInfo && (
                        <InfoWindow >
                            <div style={{display:"flex", flexDirection: "column"}}>
                                {location.address}
                                <Button
                                    onClick={()=>{if(!mapIsLocked)selectParkingHandler(location)}}
                                    variant="text"
                                    color="secondary"
                                    size="large"
                                    className={classes.button}
                                    startIcon={<AddIcon />}>
                                    Add parking
                                </Button>
                            </div>
                        </InfoWindow>
                    )}

                </Marker>
            )
        })
    };


    function initialParkingLoad(onParkingDataChange) {
        if(changedParkingMarkerCallback!== undefined && firstTime){
            changedParkingMarkerCallback(locationData.city,
                locationData.address,
                locationData.country,
                locationData.latitude,
                locationData.longitude,
                onParkingDataChange);
                firstTime = false
        }
    }

    /**
     * Map component that renders parking data and has draggable marker
     */
    const MyMapComponent = compose(
        withProps({
            containerElement: <div style={{ height: mapHeight }} />,
            mapElement: <div style={{ height: `100%` }} />,
        }),
        withGoogleMap
    )(props =>
        <GoogleMap
            defaultZoom={12}
            center={{lat: props.markerLocation.latitude, lng: props.markerLocation.longitude }}
            defaultCenter={{ lat: props.markerLocation.latitude, lng: props.markerLocation.longitude }}
        >
            <Marker
                name={'Dolores park'}
                visible={true}
                draggable={!props.isDraggable}
                onClick={()=>{if(!props.isDraggable)props.toggleDraggableInfoWindow(true)}}
                onDragEnd={e=>onMarkerDragEnd(e, props.markerChanger, props.onParkingDataChange)}
                position={{ lat: props.markerLocation.latitude, lng: props.markerLocation.longitude }} >

                {props.infoWindow.show && addParkingCallback && (
                    <InfoWindow onCloseClick={()=>{props.toggleDraggableInfoWindow(false)}}>
                        <div style={{display:"flex", flexDirection: "column"}}>
                            {props.markerLocation.address}
                            <Button
                                onClick={()=>{

                                    addNewParkingHandler(props.markerLocation)

                                }}
                                variant="text"
                                color="secondary"
                                size="large"
                                className={classes.button}
                                startIcon={<AddIcon />}>
                                Add new parking
                            </Button>
                        </div>
                    </InfoWindow>
                )}
            </Marker>
            {markers(props.onToggleOpen, props.infoWindows, props.parkingData, props.isDraggable)}
        </GoogleMap>
    );


    const FullMap = compose(
        withProps(),
        withStateHandlers({
            draggableMarkerLocation: {
                latitude: locationData.latitude,
                longitude: locationData.longitude,
                address:  locationData.address
            },parkingData: [], infoWindows: [], isDraggable: initialLock === undefined ? true : initialLock, infoWindow: {show: false}
        },{
            onMarkerLocationChanged: ({draggableMarkerLocation}) => (newLat, newLng, address, city, country) => ({
                draggableMarkerLocation: {
                    latitude: newLat,
                    longitude: newLng,
                    address: address,
                    city: city,
                    country: country
                }
            }),
                toggleDraggableInfoWindow: ({draggableMarkerLocation}) => (show) => ({
                    infoWindow: {show: show}
                }),
                onParkingDataChange: ({parkingData}) => (parking) => ({
                    parkingData: parking.map(row=>{
                        return row
                    }),
                    infoWindows: parking.map(p => {
                        return { parkingId: p.parkingId, showInfo: false };
                    })
                }),
                onToggleOpen: ({ infoWindows }) => selectedIndex => ({
                    infoWindows: infoWindows.map((iw, i) => {
                        iw.showInfo = selectedIndex === iw.parkingId;
                        return iw;
                    })
                }),
               switchLock: ({isDraggable}) => (isLocked) =>({
                    isDraggable: isLocked
               })
            }
            )
    )(props=>
        <div className={classes.content}>
            <Autocomplete
                onKeyPress={(event)=>{handleKeyPress(event, props.onMarkerLocationChanged, props.onParkingDataChange)}}
                className={classes.autocomplete}
                onPlaceSelected={(place)=>{onPlaceSelected(place, props.onMarkerLocationChanged, props.onParkingDataChange)} }
                types={['(regions)']}
            />
            <IconButton aria-label="delete" className={classes.margin} size="small">
                <MyLocationIcon
                    fontSize="large"
                    color="primary"
                    onClick={()=>{
                        getCurrentPosition(props.onMarkerLocationChanged,
                            props.onParkingDataChange,
                            props.toggleDraggableInfoWindow)
                    }}

                />
            </IconButton>
            {initialParkingLoad(props.onParkingDataChange)}
            <MyMapComponent markerChanger={props.onMarkerLocationChanged}
                            markerLocation={props.draggableMarkerLocation}
                            onParkingDataChange={props.onParkingDataChange}
                            parkingData={props.parkingData}
                            onToggleOpen={props.onToggleOpen}
                            infoWindows={props.infoWindows}
                            isDraggable={props.isDraggable}
                            infoWindow={props.infoWindow}
                            toggleDraggableInfoWindow={props.toggleDraggableInfoWindow}
            />

            <div className={classes.root}>
                <FormControlLabel
                    control={<Switch />}
                    label="Lock"
                    checked={props.isDraggable}
                    onChange={()=>{
                        props.switchLock(!props.isDraggable)
                    }}
                />
                {props.isDraggable ?
                    <Alert  severity="error">Map is currently locked. If you want to do any changes unlock it.</Alert> : null}
                {/*<Grid container spacing={3}>*/}
                {/*    <Grid item xs={6}>*/}
                {/*       */}
                {/*    </Grid>*/}
                {/*    <Grid item xs={6}>*/}
                {/*       */}
                {/*    </Grid>*/}
                {/*</Grid>*/}
            </div>

        </div>
    );

    /**
     * Memoization of a component.
     */
    return useMemo(() => {
        return <FullMap/>;
    }, [])


}

export default withStyles(styles)(CustomMap);