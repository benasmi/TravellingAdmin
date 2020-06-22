import React, {useEffect, useState} from "react";
import app from "../helpers/firebaseInit"
import Cookies from "js-cookie"
export const PlacesFilterContext = React.createContext();

export const PlacesFilterProvider = ({children}) => {
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);

    const [cities, setCities] = useState([]);
    const [selectedCities, setSelectedCities] = useState([]);

    const [countries, setCountries] = useState([]);
    const [selectedCountries, setSelectedCountries] = useState([]);

    const [municipalities, setMunicipalities] = useState([]);
    const [selectedMunicipalities, setSelectedMunicipalities] = useState([]);

    const [counties, setCounties] = useState([]);
    const [selectedCounties, setSelectedCounties] = useState([]);

    const contextValue = {

    };

    useEffect(()=>{

    });
    return (
        <PlacesFilterContext.Provider value={contextValue}>
            {children}
        </PlacesFilterContext.Provider>
    );
};