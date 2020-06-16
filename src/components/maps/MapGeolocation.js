import React from "react";
import Geocode from "react-geocode";

Geocode.setApiKey("AIzaSyDGFjZHSoRrZ2AEO0ONXvjuN4RiCmknXf8");
Geocode.enableDebug();

/**
 * Get country from google maps address array
 * @param addressArray
 * @returns {*|string}
 */
export const getCountry = (addressArray) =>{
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
 * Get country from google maps address array
 * @param addressArray
 * @returns {*|string}
 */
export const getCity = ( addressArray ) => {
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

/**
 * Geocode location from string address
 * @param address
 * @type string
 * @return location object
 */
export function geocodeFromAddress(address){
    return Geocode.fromAddress( address ).then(
        response => {
            const { lat, lng } = response.results[0].geometry.location;
            const address = response.results[0].formatted_address;
            const addressArray =  response.results[0].address_components;
            if(addressArray!==undefined){
                const city = getCity( addressArray ),
                    country = getCountry( addressArray );
                let loc = {address: address, city: city, country: country, latitude: lat, longitude: lng};
                return loc
            }
            return null
        },
        error => {
            console.log(error);
        }
    );
}

/**
 * Geocode location from latitude and longitude
 * @param newLat
 * @param newLng
 * @return location object
 */
export function geocodeFromLatLng(newLat, newLng){
    return Geocode.fromLatLng( newLat , newLng ).then(
        response => {
            const address = response.results[0].formatted_address
            const addressArray =  response.results[0].address_components
            if(addressArray!==undefined){
                const city = getCity( addressArray ),
                    country = getCountry( addressArray );
                let loc = {address: address, city: city, country: country, latitude: newLat, longitude: newLng};
                return loc;
            }
            return null
        },
        error => {
            console.error(error);
        }
    );
}