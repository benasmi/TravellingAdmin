import React, { useState, useCallback } from 'react';

export const SnackbarContext = React.createContext({
    config: null,
    addConfig: () => {},
    removeConfig: () => {}
});

export default function SnackbarProvider({ children }) {
    const [config, setConfig] = useState(null);

    const removeConfig = () => setConfig(null);
    const addConfig = (success) => setConfig({ success });

    const contextValue = {
        config,
        addConfig: (success) => addConfig(success),
        removeConfig: () => removeConfig()
    };

    return (
        <SnackbarContext.Provider value={contextValue}>
            {children}
        </SnackbarContext.Provider>
    );
}