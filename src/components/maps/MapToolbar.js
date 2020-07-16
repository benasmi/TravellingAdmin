import React, {useState} from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Autocomplete from "react-google-autocomplete";
import IconButton from "@material-ui/core/IconButton";
import MyLocationIcon from "@material-ui/icons/MyLocation";
import PropTypes from "prop-types";
import {geocodeFromAddress, geocodeFromLatLng} from "./MapGeolocation";
import LinearProgress from "@material-ui/core/LinearProgress";
import UseAlertDialogContext from "../../contexts/UseAlertDialogContext";

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

function MapToolbar({classes, isLocked, locationCallback}) {

    const [loading, setIsLoading] = useState(false);
    const { addAlertConfig } = UseAlertDialogContext();
    /**
     * Handle manual address and coordinates filling with key presses and return location
     * @param event
     * @return {boolean}
     */

    function errorParsingLocation(){
        addAlertConfig("Error parsing location!", "Make sure that address you provided is correct!",[])
    }

    function handleKeyPress(event){
        const value = event.target.value;
        if (event.which === 13 || event.keyCode === 13) {
            setIsLoading(true);
            if (/[a-zA-Z]+/.test(value)){
                geocodeFromAddress(value).then(location=>{
                    location!==null ? locationCallback(location) : errorParsingLocation();
                    setIsLoading(false)
                })
            }else{
                let position = value.split(/[ ,]+/);
                if(position.length === 2){
                    geocodeFromLatLng(parseFloat(position[0]), parseFloat(position[1])).then(location=>{
                        location!==null ? locationCallback(location) : errorParsingLocation();
                        setIsLoading(false)
                    })
                }
            }
            return false;
        }
        return true;
    }

    /**
     * Handle place selection from google maps autocomplete
     * @param place
     * @return {{country: (*|string), address: *, city: (*|string), latitude: *, longitude: *}|null}
     */
    const onPlaceSelected = (place) => {
        setIsLoading(true);
        const addressArray = place.address_components;
        if (addressArray !== undefined) {
            const lat = place.geometry.location.lat(),
                lng = place.geometry.location.lng();
            geocodeFromLatLng(lat, lng).then(location => {
                location !== null ? locationCallback(location) : errorParsingLocation();
                setIsLoading(false)
            });
        }
        return null
    };

    /**
     * Get current location
     */
    function getCurrentPosition(){
        setIsLoading(true)
        navigator.geolocation.getCurrentPosition(function(position) {
            let newLat = position.coords.latitude,
                newLng = position.coords.longitude;
            geocodeFromLatLng(newLat, newLng).then(location=>{
                location!==null ? locationCallback(location) : errorParsingLocation();

                setIsLoading(false)
            });
        }, error=>{
            setIsLoading(false)
            alert(error.message + "\n" + JSON.stringify(error))
        });
    }

    return <div className={classes.root}>
        <div className={classes.content}>
            <Autocomplete
                onKeyPress={(event)=>{if(!isLocked)handleKeyPress(event)}}
                onPlaceSelected={(place)=>{if(!isLocked)onPlaceSelected(place)} }
                className={classes.autocomplete}
                types={['(regions)']}
            />
            <IconButton aria-label="delete" className={classes.margin} size="small">
                <MyLocationIcon
                    onClick={()=>{if(!isLocked)getCurrentPosition()}}
                    fontSize="large"
                    color="primary"
                />
            </IconButton>
        </div>
        {loading ? <LinearProgress /> : null}

    </div>


}

MapToolbar.propTypes = {
    isLocked: PropTypes.bool.isRequired,
    locationCallback: PropTypes.func.isRequired
};

export default withStyles(styles)(MapToolbar)