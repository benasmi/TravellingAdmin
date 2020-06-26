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
        console.log("Address array", addressArray);
        let city = '';
        for( let i = 0; i < addressArray.length; i++ ) {
            if ( addressArray[ i ].types[0] && 'locality' === addressArray[ i ].types[0] ) {
                city = addressArray[ i ].long_name;
                return city;
            }
        }
        return city;
    }
};

/**
 * Get district from google maps address array
 * @param addressArray
 * @returns {*|string}
 */
export const getCounty = ( addressArray ) => {
        if(addressArray !== undefined){
            let county = '';
            for( let i = 0; i < addressArray.length; i++ ) {
                if ( addressArray[ i ].types[0] && 'administrative_area_level_1' === addressArray[ i ].types[0] ) {
                    county = addressArray[ i ].long_name;
                    return county;
                }
            }
            return county
        }
    };
/**
 * Get district from google maps address array
 * @param addressArray
 * @returns {*|string}
 */
export const getMunicipality = ( addressArray ) => {
    if(addressArray !== undefined){
        let municipality = '';
        for( let i = 0; i < addressArray.length; i++ ) {
            if ( addressArray[ i ].types[0] && 'administrative_area_level_2' === addressArray[ i ].types[0] ) {
                municipality = addressArray[ i ].long_name;
                return municipality;
            }
        }
        return municipality;
    }
};

/**
 * Geocode location from address
 * @param address
 * @type string
 * @return location object
 */
export function geocodeFromAddress(address){
    return Geocode.fromAddress( address ).then(
        response => {
            const { lat, lng } = response.results[0].geometry.location;
            if(lat !== undefined && lng !== undefined){
                return geocodeFromLatLng(lat, lng).then(loc=>{
                    return loc
                })
            }else{
                return null
            }
        },
        err=>{
            return null
        }
    )
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
                    country = getCountry( addressArray ),
                    county = getCounty(addressArray),
                    municipality = getMunicipality(addressArray);
                let loc = {address: address, city: city, country: country, latitude: newLat, longitude: newLng, county: county, municipality: municipality};
                return loc;
            }
            return null
        },
        error => {
            return null
        }
    );
}