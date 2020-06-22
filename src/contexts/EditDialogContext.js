import React, { useState, useCallback } from 'react';

export const EditDialogContext = React.createContext({
    dialogConfig: null,
    dialogOpen: null,
    setDialogOpen: null,
    addEditDialogConfig: () => {},
    removeEditDialogConfig: () => {}
});

const defaultOptions = {
    title: "Sample title",
    explanation: "Sample explanation",
    onCloseCallback: () => {},
    onDoneCallback: () => {},
    textFieldLabel: "Type here",
    validateInput: (input) => true,
    defaultText: ""
}

export default function EditDialogProvider({ children }) {
    const [dialogConfig, setDialogConfig] = useState(defaultOptions);
    const [dialogOpen, setDialogOpen] = useState(false);
    const contextValue = {
        dialogConfig,
        dialogOpen: dialogOpen,
        setDialogOpen: setDialogOpen,
        addEditDialogConfig: (options) => {
            setDialogConfig({
                ...defaultOptions,
                ...options
            })
            setDialogOpen(true)
        },
        removeEditDialogConfig: () => setDialogConfig(null)
    };

    return (
        <EditDialogContext.Provider value={contextValue}>
            {children}
        </EditDialogContext.Provider>
    );
}