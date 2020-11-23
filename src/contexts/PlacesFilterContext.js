import React, {useContext, useEffect, useState} from "react";
import API from "../Networking/API";
import * as moment from "moment";
import {AppStateStorageContext} from "./AppStateStorageContext";
import {AppResourcesContext} from "./AppResourcesContext";
export const PlacesFilterContext = React.createContext();
var buildUrl = require('build-url');


const initialDates = {
    insertionStart: moment(new Date('2020-05-01T21:11:54')).format("YYYY-MM-DD"),
    insertionEnd: moment(new Date()).add(1,'day').format(),
    modificationStart: moment(new Date('2014-05-01T21:11:54')).format("YYYY-MM-DD"),
    modificationEnd: moment(new Date()).add(1,'day').format()
};

export const PlacesFilterProvider = ({children}) => {
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);

    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);

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

    const {globalCategories, globalTags} = useContext(AppResourcesContext);

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
            tags: parseTags(),
            countries: selectedCountries,
            cities: selectedCities,
            municipalities: selectedMunicipalities
        }
    }));


    useEffect(()=>{
        setCategories(JSON.parse(JSON.stringify(globalCategories)))
    },[globalCategories]);

    useEffect(()=>{
        setTags(JSON.parse(JSON.stringify(globalTags)))
    },[globalTags]);


    const getAllCities = (restrictions="") =>{
        API.Places.getAllCities(restrictions).then(res=>{
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

    const getAllMunicipalities = (restrictions="") =>{
        API.Places.getAllMunicipalities(restrictions).then(res=>{
            setMunicipalities(res)
        }).catch(err=>{
        })
    };



    useEffect(()=>{
        if(!initialLoading){
            getAllMunicipalities(buildUrl(null, {
                queryParams: {
                    countryRestrictions: selectedCountries
                }
            }));
            getAllCities(buildUrl(null, {
                queryParams: {
                    munRestrictions: selectedMunicipalities,
                    countryRestrictions: selectedCountries
                }
            }))
        }
    },[selectedCountries]);


    useEffect(()=>{
        if(!initialLoading){
            getAllCities(buildUrl(null, {
                queryParams: {
                    munRestrictions: selectedMunicipalities,
                    countryRestrictions: selectedCountries
                }
            }))
        }
    }, [selectedMunicipalities]);

    useEffect(()=>{
        Promise.all([
            getAllCities(),
            getAllCountries(),
            getAllCounties(),
            getAllMunicipalities()
        ]).then(response => {
            setInitialLoading(false);
            // console.log("All data received!")
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
                        tags: parseTags(),
                        countries: selectedCountries,
                        cities: selectedCities,
                        municipalities: selectedMunicipalities
                    }
                }))
            }else{
                if(areFiltersCleared()){
                    setResetFilterOptions(false)
                }
            }
        }
    },[selectedCategories, selectedTags, selectedCities,selectedCountries,selectedMunicipalities,dates,filterOptions,resetFilterOptions]);

    function areFiltersCleared() {
        let filterOptionsCleared = true;
        filterOptions.map(row=>{
            if(row.filter){
                filterOptionsCleared = false
            }
        });
        return filterOptionsCleared &&
            selectedCategories.length === 0 &&
            selectedTags.length === 0 &&
            selectedCities.length === 0 &&
            selectedCountries.length ===0 &&
            dates.insertionStart === initialDates.insertionStart &&
            dates.modificationStart === initialDates.modificationStart
    }

    function parseCategories(){
        return selectedCategories.map(row => row.categoryId);
    }

    function parseTags(){
        return selectedTags.map(row => row.tagId);
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

        tags,
        setTags,
        selectedTags,
        setSelectedTags,

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