import React, { useState, useCallback } from 'react';

export const EditDialogContext = React.createContext({
    dialogConfig: null,
    dialogOpen: null,
    setDialogOpen: null,
    addEditDialogConfig: () => {},
    removeEditDialogConfig: () => {}
});

const defaultOptions = {

    /**
     * The dialog's title.
     */
    title: "Sample title",

    /**
     * Object, that defines an error message for each error returned by validateInput function.
     * Should follow this structure: {errorCode: "message", differentErrorCode: "Message"}
     * Keys of this object are integers (that represent the error code)
     */
    errorMessages: {},

    /**
     * Explanation text for this dialog.
     */
    explanation: "Sample explanation",

    /**
     * A callback for when user presses cancel.
     */
    onCloseCallback: () => {},

    /**
     * A callback for when the user input passes error checks and done button is pressed
     * @param input is the input text
     */
    onDoneCallback: (input) => {},

    /**
     * The label text to be displayed above textfield
     */
    textFieldLabel: "Type here",

    /**
     * Should return 0 if input is valid.
     * If the input is not valid, it should return an error code.
     * Any returned code, that is not 0 is considered to be an error.
     * The error code returned may have a message in errorMessages prop.
     * @param input
     * @returns {number}
     */
    validateInput: (input) => 0,

    /**
     * The default text to be displayed in TextField
     */
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