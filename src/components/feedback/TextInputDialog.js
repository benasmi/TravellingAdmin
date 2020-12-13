import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import React, {useState} from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import UseEditDialogContext from "../../contexts/UseEditDialogContext";


export const TextInputDialog = () => {

    const {dialogConfig, removeEditDialogConfig, dialogOpen, setDialogOpen} = UseEditDialogContext();
    const [inputText, setInputText] = useState("")
    const [error, setError] = useState(0)

    const deInit = () => {
        setError(0)
        setDialogOpen(false)
        setInputText("")
    }

    const handleClose = () => {
        deInit()
    }

    const handleDone = () => {
        let errorCode = dialogConfig.validateInput(inputText)
        setError(errorCode)
        if(errorCode !== 0) return

        if(dialogConfig.onDoneCallback !== undefined){
            dialogConfig.onDoneCallback(inputText)
            console.log("Input", inputText)
        }else{
            console.log("On done in undefined")
        }
        deInit()
    }
    const handleInput = (e) => {
        setInputText(e.target.value)
    }

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
                        type="email"
                        fullWidth
                    />
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