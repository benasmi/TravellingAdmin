import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import React, {useEffect, useState} from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import AutoCompleteChip from "../AutocompleteChip";
import API from "../../Networking/API";


export const AbstractionCategoryDialog = ({dialogConfig, setDialogConfig, onDoneCallback}) => {



    const [inputText, setInputText] = useState("")
    const [error, setError] = useState(0)

    const [options, setOptions] = useState();
    const [selectedOptions, setSelectedOptions] = useState();


    const deInit = () => {
        setError(0)
        setDialogConfig(oldVal=>{
            return {
                ...oldVal,
                open:false
            }
        });
        setInputText("")
    };


    useEffect(()=>{
        console.log(dialogConfig)
            setInputText(dialogConfig.category.name);
            API.Categories.abstractedCategoriesLeftOver().then((options)=>{
                console.log("Opcionais", options)
                setOptions(options)
            }).catch((err)=>{

            }).finally(()=>{

            });
            setSelectedOptions(dialogConfig.payload.selectedOptions);
    },[dialogConfig]);

    const handleClose = () => {
        deInit()
    };

    const handleDone = () => {
        let errorCode = validateInput(inputText);
        setError(errorCode);
        if(errorCode !== 0) return;
        onDoneCallback(selectedOptions, inputText, dialogConfig.category.categoryId);
        deInit()
    };

    function validateInput(input){
        return input.length > 0 ? 0 : 1
    }
    const handleInput = (e) => {
        setInputText(e.target.value)
    };

    return (
        <div>
            <Dialog open={dialogConfig.open} aria-labelledby="form-dialog-title" fullWidth>
                <DialogTitle id="form-dialog-title">Edit abstraction category</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Type the abstraction category name
                    </DialogContentText>
                    <TextField
                        autoFocus
                        helperText={error !== 0 ? "Contains errors" : ""}
                        error={error !== 0}
                        margin="dense"
                        id="name"
                        onInput={handleInput}
                        label="Restaurants, hiking, etc..."
                        defaultValue={dialogConfig.category.name}
                        type="email"

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