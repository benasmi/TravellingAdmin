import React, {memo, useEffect, useMemo, useState} from 'react'
import Autocomplete from 'react-google-autocomplete';
import Geocode from "react-geocode";
import {compose, withProps, withStateHandlers} from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from "react-google-maps"
import withStyles from "@material-ui/core/styles/withStyles";
import {map} from "react-bootstrap/cjs/ElementChildren";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import history from "../helpers/history";
import AddIcon from "@material-ui/icons/Add";


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
    }
});

var markerData = {};
function CustomMap({classes, locationData, setLocationData, mapHeight, selectedParkingCallback, changedParkingMarkerCallback, addParkingCallback}){


    CustomMap.propTypes = {
        locationData: PropTypes.object,
        setLocationData: PropTypes.func,
        mapHeight: PropTypes.number
    };



    var parkingIcon = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/parking_lot_maps.png';

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

    const getCountry = (addressArray) =>{
        if(addressArray!=undefined){
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
    const markers = (onToggleOpen, infoWindows, parking) =>{
        return parking.map((location, i) => {

            const latitude = parseFloat(location.latitude);
            const longitude = parseFloat(location.longitude);

            return (
                <Marker
                    key={location.parkingId}
                    position={{ lat: latitude, lng: longitude}}
                    options={{icon: parkingIcon}}
                    onClick={()=>onToggleOpen(location.parkingId)}
                >

                    {infoWindows[i].showInfo && (
                        <InfoWindow >
                            <div style={{display:"flex", flexDirection: "column"}}>
                                {location.address}
                                <Button
                                    onClick={()=>{selectParkingHandler(location)}}
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


    /**
     * Map component that renders parking data and has draggable marker
     */
    const MyMapComponent = compose(
        withProps({
            containerElement: <div style={{ height: mapHeight }} />,
            mapElement: <div style={{ height: `100%` }} />,
        }),
        withStateHandlers({
                infoWindow: {show: false}
            },{
            toggleDraggableInfoWindow: ({draggableMarkerLocation}) => (show) => ({
                infoWindow: {show: show}
            })
            }
        ),
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
                draggable={true}
                onClick={()=>props.toggleDraggableInfoWindow(true)}
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

            {markers(props.onToggleOpen, props.infoWindows, props.parkingData)}
        </GoogleMap>
    );

    /**
     * Places autocomplete and map. This component holds it's inner states like draggableMarkerLocation, parkingData etc.
     */
    const FullMap = compose(
        withProps(),
        withStateHandlers({
            draggableMarkerLocation: {
                latitude: locationData.latitude,
                longitude: locationData.longitude,
                address:  locationData.address
            },parkingData: [], infoWindows: []
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
                })
            }
            )
    )(props=>
        <div className={classes.content}>
            <Autocomplete
                className={classes.autocomplete}
                onPlaceSelected={(place)=>{onPlaceSelected(place, props.onMarkerLocationChanged, props.onParkingDataChange)} }
                types={['(regions)']}
            />

            <MyMapComponent markerChanger={props.onMarkerLocationChanged}
                            markerLocation={props.draggableMarkerLocation}
                            onParkingDataChange={props.onParkingDataChange}
                            parkingData={props.parkingData}
                            onToggleOpen={props.onToggleOpen}
                            infoWindows={props.infoWindows}
            />


        </div>
    );

    /**
     * Memoization of a component.
     */
    return useMemo(() => {
        return <FullMap/>;
    }, [])

    //

}

export default withStyles(styles)(CustomMap);