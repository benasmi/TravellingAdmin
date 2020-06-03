import React from "react";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import UseAlertDialogContext from "../../contexts/UseAlertDialogContext"

const AlertDialogFeedback = () => {

    const {alertConfig, removeAlertConfig} = UseAlertDialogContext();

    function remove() {
        if(alertConfig.onClose !== undefined)
            alertConfig.onClose()
        removeAlertConfig()
    }

    return(
        <Dialog
            open={!!alertConfig}
            onClose={remove}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{!!alertConfig ? alertConfig.title : ""}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {!!alertConfig ? alertConfig.message : ""}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={remove}
                        color="primary">
                    Close
                </Button>
                <Button onClick={!!alertConfig ? ()=>{
                    removeAlertConfig();
                    alertConfig.func()} : {}
                } color="primary" autoFocus>
                    Agree
                </Button>
            </DialogActions>
        </Dialog>
    )
};


export default AlertDialogFeedback
