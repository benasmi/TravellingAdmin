// src/common/providers/APIErrorProvider/index.js
import React, { useState, useCallback } from 'react';

export const AlertDialogContext = React.createContext({
    alertConfig: null,
    addAlertConfig: () => {},
    removeAlertConfig: () => {}
});

export default function AlertDialogProvider({ children }) {
    const [alertConfig, setAlertConfig] = useState(null);
    const contextValue = {
        alertConfig,
        addAlertConfig: (title, message, actions, onClose = undefined) => setAlertConfig({ title, message, actions, onClose}),
        removeAlertConfig: () => setAlertConfig(null)
    };

    return (
        <AlertDialogContext.Provider value={contextValue}>
            {children}
        </AlertDialogContext.Provider>
    );
}