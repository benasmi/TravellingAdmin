import React, {useEffect, useState} from 'react';

export const AppStateStorageContext = React.createContext();

export default function AppStateStorageProvider({ children }) {

    const [placesPageConfig, setPlacesPageConfig] = useState({keyword: '', page: 1})

    function savePlacesTableInfo(keyword, page){
        const config = { ...placesPageConfig }
        config.keyword = keyword;
        config.page = page;
        console.log("Saving", {keyword, page})
        setPlacesPageConfig(config)
    }


    return (
        <AppStateStorageContext.Provider value={{
            savePlacesTableInfo,
            placesPageConfig

        }}>
            {children}
        </AppStateStorageContext.Provider>
    );
}