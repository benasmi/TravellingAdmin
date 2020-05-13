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
        fontSize: "14px"
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


    const onPlaceSelected = (place, onMarkerLocationChanged, onParkingDataChanged) => {

        const address = place.formatted_address,
            addressArray =  place.address_components,
            city = getCity( addressArray ),
            area = getArea( addressArray ),
            state = getState( addressArray ),
            country = getCountry(addressArray),
            latValue = place.geometry.location.lat(),
            lngValue = place.geometry.location.lng();

        onMarkerLocationChanged(latValue, lngValue);
        changeLocationData(city,country,address,latValue,lngValue, onParkingDataChanged);

    };

    const onMarkerDragEnd = ( event, onMarkerLocationChanged, onParkingDataChanged) => {
        let newLat = event.latLng.lat(),
            newLng = event.latLng.lng();

        onMarkerLocationChanged(newLat, newLng);

        Geocode.fromLatLng( newLat , newLng ).then(
            response => {
                const address = response.results[0].formatted_address,
                    addressArray =  response.results[0].address_components,
                    city = getCity( addressArray ),
                    area = getArea( addressArray ),
                    state = getState( addressArray ),
                    country = getState( addressArray );

                    changeLocationData(city,country,address,newLat,newLng, onParkingDataChanged);


            },
            error => {
                console.error(error);
            }
        );
    };

    function changeLocationData(city,country,address,lat,lng, onParkingDataChanged) {
        let data = Object.assign({}, locationData, {});
        data['city'] = city;
        data['country'] = country;
        data['address'] = address;
        data['lat'] = lat;
        data['lng'] = lng;
        setLocationData(data);
        markerData = data;
        if (changedParkingMarkerCallback !== undefined){
            changedParkingMarkerCallback(city,address,country, lat,lng, onParkingDataChanged);
        }

    }

    /**
     * Get the city and set the city input value to the one selected
     *
     * @param addressArray
     * @return {string}
     */
    const getCity = ( addressArray ) => {
        let city = '';
        for( let i = 0; i < addressArray.length; i++ ) {
            if ( addressArray[ i ].types[0] && 'administrative_area_level_2' === addressArray[ i ].types[0] ) {
                city = addressArray[ i ].long_name;
                return city;
            }
        }
    };

    const getCountry = (addressArray) =>{
        let country = '';
        for( let i = 0; i < addressArray.length; i++ ) {
            if ( addressArray[ i ].types[0] && 'country' === addressArray[ i ].types[0] ) {
                country = addressArray[ i ].long_name;
                return country;
            }
        }
    };

    /**
     * Get the area and set the area input value to the one selected
     *
     * @param addressArray
     * @return {string}
     */
    const getArea = ( addressArray ) => {
        let area = '';
        for( let i = 0; i < addressArray.length; i++ ) {
            if ( addressArray[ i ].types[0]  ) {
                for ( let j = 0; j < addressArray[ i ].types.length; j++ ) {
                    if ( 'sublocality_level_1' === addressArray[ i ].types[j] || 'locality' === addressArray[ i ].types[j] ) {
                        area = addressArray[ i ].long_name;
                        return area;
                    }
                }
            }
        }
    };
    /**
     * Get the address and set the address input value to the one selected
     *
     * @param addressArray
     * @return {string}
     */
    const getState = ( addressArray ) => {
        let state = '';
        for( let i = 0; i < addressArray.length; i++ ) {
            for( let i = 0; i < addressArray.length; i++ ) {
                if ( addressArray[ i ].types[0] && 'administrative_area_level_1' === addressArray[ i ].types[0] ) {
                    state = addressArray[ i ].long_name;
                    return state;
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

            const lat = parseFloat(location.latitude);
            const lng = parseFloat(location.longitude);

            return (
                <Marker
                    key={location.parkingId}
                    position={{ lat: lat, lng: lng}}
                    options={{icon: parkingIcon}}
                    onClick={()=>onToggleOpen(location.parkingId)}
                >

                    {infoWindows[i].showInfo && (
                        <InfoWindow >
                            <div style={{display:"flex", flexDirection: "column"}}>
                                {location.address}
                                <Button
                                    onClick={()=>{selectedParkingCallback(location)}}
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

    const addNewParking = () => {

    };


    /**
     * Map component that renders parking data and has draggable marker
     */
    const MyMapComponent = compose(
        withProps({
            googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyDGFjZHSoRrZ2AEO0ONXvjuN4RiCmknXf8&v=3.exp&libraries=geometry,drawing,places",
            loadingElement: <div style={{ height: `100%` }} />,
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
        withScriptjs,
        withGoogleMap
    )(props =>

        <GoogleMap
            defaultZoom={12}
            center={{lat: props.markerLocation.lat, lng: props.markerLocation.lng }}
            defaultCenter={{ lat: props.markerLocation.lat, lng: props.markerLocation.lng }}
        >
            <Marker
                name={'Dolores park'}
                visible={true}
                draggable={true}
                onClick={()=>props.toggleDraggableInfoWindow(true)}
                onDragEnd={e=>onMarkerDragEnd(e, props.markerChanger, props.onParkingDataChange)}
                position={{ lat: props.markerLocation.lat, lng: props.markerLocation.lng }} >

                {props.infoWindow.show && addParkingCallback && (
                    <InfoWindow onCloseClick={()=>{props.toggleDraggableInfoWindow(false)}}>
                        <div style={{display:"flex", flexDirection: "column"}}>
                            {locationData.address}
                            <Button
                                onClick={()=>addParkingCallback(markerData)}
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
                lat: locationData!==undefined ? locationData.lat : 54.686047,
                lng: locationData!==undefined ? locationData.lng : 25.2775476
            },parkingData: [], infoWindows: []
        },{
            onMarkerLocationChanged: ({draggableMarkerLocation}) => (newLat, newLng) => ({
                draggableMarkerLocation: {
                    lat: newLat,
                    lng: newLng
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

}

export default withStyles(styles)(CustomMap);