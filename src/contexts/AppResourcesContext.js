import React, {useEffect, useState} from 'react';
import API from "../Networking/API";

export const AppResourcesContext = React.createContext();

export default function AppResourcesProvider({ children }) {
    const [globalCategories, setGlobalCategories] = useState([]);
    const [globalTags, setGlobalTags] = useState([]);


    const getCategories = () => {
        API.Categories.getAllCategories().then(setGlobalCategories).catch(error=>{
        });
    };

    const getTags = () =>{
        API.Tags.getAllTags().then(setGlobalTags).catch(err=>{
        })
    };


    useEffect(()=>{
        getCategories();
        getTags();
    },[]);

    return (
        <AppResourcesContext.Provider value={{
            globalCategories,
            globalTags

        }}>
            {children}
        </AppResourcesContext.Provider>
    );
}