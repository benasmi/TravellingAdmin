import React, {useEffect, useState} from "react";
import API from "../Networking/API";
import * as moment from "moment";
import {func} from "prop-types";
export const PlacesFilterContext = React.createContext();
var buildUrl = require('build-url');


const initialDates = {
    insertionStart: moment(new Date('2020-05-01T21:11:54')).format("YYYY-MM-DD"),
    insertionEnd: moment(new Date()).format(),
    modificationStart: moment(new Date('2014-05-01T21:11:54')).format("YYYY-MM-DD"),
    modificationEnd: moment(new Date()).format()
}

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

    const [initialLoading, setInitialLoading] = useState(true);
    const [resetFilterOptions, setResetFilterOptions] = useState(false);

    const [filterOptions, setFilterOptions] = useState([
        {filterLabel: "Unverified", filter: false, filterName: "unverified"},
        {filterLabel: "Unpublished", filter: false, filterName: "unpublished"}]);

    const [dates, setDates] = useState(initialDates);

    const [filterQuery, setFilterQuery] = useState( buildUrl(null, {
        queryParams: {
            di: [dates.insertionStart, dates.insertionEnd],
            dm: [dates.modificationStart, dates.modificationEnd],
            filterOptions: parseFilterOptions(),
            categories: parseCategories(),
            countries: selectedCountries,
            cities: selectedCities
        }
    }));


    const getCategories = () => {
        API.Categories.getAllCategories().then(response=>{
            setCategories(response);
            console.log(response);
        }).catch(error=>{
            console.log(error)
        });
    };

    const getAllCities = () =>{
        API.Places.getAllCities().then(res=>{
            setCities(res)
        }).catch(err=>{
        })
    };

    const getAllCounties = () =>{
        API.Places.getAllCounties().then(res=>{
            setCounties(res)
        }).catch(err=>{
        })
    };

    const getAllCountries = () =>{
        API.Places.getAllCountries().then(res=>{
            setCountries(res)
        }).catch(err=>{
        })
    };

    const getAllMunicipalities = () =>{
        API.Places.getAllMunicipalities().then(res=>{
            setMunicipalities(res)
        }).catch(err=>{
        })
    };


    useEffect(()=>{
        console.log("Fetching...");
        Promise.all([
            getCategories(),
            getAllCities(),
            getAllCountries(),
            getAllCounties(),
            getAllMunicipalities()
        ]).then(response => {
            setInitialLoading(false);
            console.log("All data received!")
        }).catch(err => {
        })
    },[]);

    useEffect(()=>{
        if(!initialLoading){
            if(!resetFilterOptions){
                setFilterQuery(buildUrl(null, {
                    queryParams: {
                        di: [dates.insertionStart, dates.insertionEnd],
                        dm: [dates.modificationStart, dates.modificationEnd],
                        o: parseFilterOptions(),
                        c: parseCategories(),
                        countries: selectedCountries,
                        cities: selectedCities
                    }
                }))
            }else{
                console.log("Clearing filters");
                if(areFiltersCleared()){
                    console.log("All filters cleared");
                    setResetFilterOptions(false)
                }
            }
        }
    },[selectedCategories, selectedCities,selectedCountries,dates,filterOptions,resetFilterOptions]);

    function areFiltersCleared() {
        let filterOptionsCleared = true;
        filterOptions.map(row=>{
            if(row.filter){
                filterOptionsCleared = false
            }
        });
        return filterOptionsCleared &&
            selectedCategories.length === 0 &&
            selectedCities.length === 0 &&
            selectedCountries.length ===0 &&
            dates.insertionStart === initialDates.insertionStart &&
            dates.modificationStart === initialDates.modificationStart
    }

    function parseCategories(){
        let cats = [];
        selectedCategories.map(row=>{
            cats.push(row.name)
        });
        return cats
    }

    function parseFilterOptions(){
        let options = [];
        filterOptions.map(row=>{
            if(row.filter === true)
                options.push(row.filterName)
        });
        return options
    }

    const contextValue = {
        filterQuery,
        setResetFilterOptions,

        dates,
        setDates,

        filterOptions,
        setFilterOptions,

        categories,
        setCategories,
        selectedCategories,
        setSelectedCategories,

        counties,
        setCounties,
        selectedCounties,
        setSelectedCounties,

        cities,
        setCities,
        selectedCities,
        setSelectedCities,

        countries,
        setCountries,
        selectedCountries,
        setSelectedCountries,

        municipalities,
        setMunicipalities,
        selectedMunicipalities,
        setSelectedMunicipalities
    };

    return (
        <PlacesFilterContext.Provider value={contextValue}>
            {children}
        </PlacesFilterContext.Provider>
    );
};