import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import React, {useEffect, useState} from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import UseEditDialogContext from "../../contexts/UseEditDialogContext";
import AutoCompleteChip from "../AutocompleteChip";
import API from "../../Networking/API";


export const AbstractionCategoryDialog = () => {

    const {dialogConfig, removeEditDialogConfig, dialogOpen, setDialogOpen} = UseEditDialogContext();
    const [inputText, setInputText] = useState("")
    const [error, setError] = useState(0)

    const [options, setOptions] = useState();
    const [selectedOptions, setSelectedOptions] = useState();


    const deInit = () => {
        setError(0)
        setDialogOpen(false);
        setInputText("")
    };


    useEffect(()=>{
        if(dialogConfig.payload.type === 'SUPER_CAT'){
            setInputText(dialogConfig.defaultText)
            API.Categories.abstractedCategoriesLeftOver().then((options)=>{
                console.log("Opcionais", options)
                setOptions(options)
            }).catch((err)=>{

            }).finally(()=>{

            })
            setSelectedOptions(dialogConfig.payload.selectedOptions);
        }
    },[dialogConfig.payload]);

    const handleClose = () => {
        deInit()
    };

    const handleDone = () => {
        let errorCode = dialogConfig.validateInput(inputText)
        console.log("Error", errorCode)
        setError(errorCode);
        if(errorCode !== 0) return;

        if(dialogConfig.onDoneCallback !== undefined)
            dialogConfig.onDoneCallback(selectedOptions, inputText);
        deInit()
    };
    const handleInput = (e) => {
        setInputText(e.target.value)
    };

    return (
        <div>
            <Dialog open={dialogOpen} aria-labelledby="form-dialog-title" fullWidth>
                <DialogTitle id="form-dialog-title">{dialogConfig.title}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {dialogConfig.explanation}
                    </DialogContentText>
                    <TextField
                        autoFocus
                        helperText={error !== 0 && dialogConfig.errorMessages[error] !== null ? dialogConfig.errorMessages[error] : ""}
                        error={error !== 0}
                        margin="dense"
                        id="name"
                        onInput={handleInput}
                        label={dialogConfig.textFieldLabel}
                        defaultValue={dialogConfig.defaultText}
                        type={dialogConfig.type}
                        fullWidth
                    />

                    <br/>
                    <br/>
                    {options && selectedOptions && <AutoCompleteChip
                        label="Select categories to include in abstraction"
                        id="categoryId"
                        options={options}
                        setOptions={setOptions}
                        selectedOptions={selectedOptions}
                        setSelectedOptions={setSelectedOptions}
                    />}

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDone} color="primary">
                        Done
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}