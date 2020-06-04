import React, { useState, useCallback } from 'react';
import { useContext } from 'react';

export const SnackbarContext = React.createContext({
    config: null,
    addConfig: () => {},
    removeConfig: () => {}
});


export default function SnackbarProvider({ children }) {
    const [config, setConfig] = useState(null);

    const removeConfig = () => setConfig(null);
    const addConfig = (success, message) => setConfig({ success, message });

    const contextValue = {
        config,
        addConfig: (success, message) => addConfig(success, message),
        removeConfig: () => removeConfig()
    };

    return (
        <SnackbarContext.Provider value={contextValue}>
            {children}
        </SnackbarContext.Provider>
    );
}