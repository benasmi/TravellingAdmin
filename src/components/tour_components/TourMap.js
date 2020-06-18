import React, {useEffect, useMemo, useState} from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow, DirectionsRenderer } from "react-google-maps"
import {ElementType} from "./Tour";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import CardMedia from "@material-ui/core/CardMedia";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";

const styles = theme => ({
    root: {
        margin: theme.spacing(4),
    },cover: {
        [theme.breakpoints.down("lg")]: {
            height: "200px",
        },
        [theme.breakpoints.only("lg")]: {
            flex: 1,
            height: "auto",
        },
    },
});



/*
Example of getting 0th place and 0th day lat and lng
let lat = tourInfo.days[0].tour[0].details.latitude
let lng = tourInfo.days[0].tour[0].details.longitude

Keep in mind, that you want to only look for elements, that are of place (not of transport) type.
So you'd do something like this to get current day's places:
let places = tourInfo.days[currentDay].tour.filter(item => item.type === ElementType.place)
and then something like this
places.forEach(item => {
    let lat = item.details.latitude
    let lng = item.details.longitude
})
*/


const google = window.google;

const MyMapComponent = withGoogleMap(props =>
    <GoogleMap
        defaultZoom={8}
        defaultCenter={{lat: -34.397, lng: 150.644}}>

        <DirectionsRenderer
            options={{suppressMarkers: true, draggable: false}}
            draggable={false}
            directions={props.directions}/>

        {props.places.map((marker, index) => {
            const position = { lat: marker.latitude, lng: marker.longitude };
            return <Marker key={index} position={position} label={`${index+1}`} onClick={
                ()=>{
                    let info = Object.assign({}, props.infoWindows, {});
                    info[index] = true;
                    props.setInfoWindows(info);
                }
            }>
                {props.infoWindows[index] && (
                <InfoWindow onCloseClick={()=>{
                    let info = Object.assign({}, props.infoWindows, {});
                    info[index] = false;
                    props.setInfoWindows(info);
                }}>
                    <div style={{display:"flex", flexDirection: "column"}}>
                        <Card>
                            <Typography>
                                {marker.name}
                            </Typography>
                            {marker.photo ? <CardMedia
                                style={{"height": "150px"}}
                                image={marker.photo}
                            />: null}
                        </Card>
                    </div>
                </InfoWindow>
                )}
            </Marker>
        })}
    </GoogleMap>
);

function TourMap({classes, tourInfo, currentDay}) {

    const [directions, setDirection ] = useState();
    const [infoWindows, setInfoWindows] = useState([]);
    const [places, setPlaces] = useState([]);

    const constructPlaceData = () =>{
        let p = tourInfo.days[currentDay].tour.filter(item => item.type === ElementType.place);
        let places = [];
        let markersInfo = [];
        p.forEach(item => {
            let lat = item.data.details.latitude;
            let lng = item.data.details.longitude;
            let name = item.data.details.name;
            let photos = item.data.details.photos;
            places.push({latitude: lat, longitude: lng,name: name, photo: photos.length > 0 ? photos[0].url : null});
            markersInfo.push(false);
        });
        setInfoWindows(markersInfo);
        setPlaces(places);
        return places
    };

    useEffect(()=>{
        const places = constructPlaceData();
        if(places.length>0){
            const waypoints = places.map(p =>({
                location: {lat: p.latitude, lng:p.longitude},
                stopover: true
            }));
            const origin = waypoints.shift().location;
            let destination = null
            if(waypoints.length > 0)
                destination = waypoints.pop().location;
            else
                destination = origin

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
        }
    },[currentDay, tourInfo.days]);


    return (
        <div className={classes.root}>
            <MyMapComponent
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={<div style={{ height: `400px` }} />}
                    mapElement={<div style={{ height: `100%` }} />}
                    directions={directions}
                    places={places}
                    infoWindows={infoWindows}
                    setInfoWindows={setInfoWindows}
                />

        </div>
    )
}

TourMap.propTypes = {
    tourInfo: PropTypes.object.isRequired,
    currentDay: PropTypes.number.isRequired,
};

export default withStyles(styles)(TourMap)


