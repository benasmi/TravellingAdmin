import React, {useState} from "react";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import UseSnackbarContext from "../../contexts/UseSnackbarContext";


export default function SnackbarFeedback(props){

    const { config, removeConfig } = UseSnackbarContext();

    const MESSAGES = {
        SUCCESS: "Your request to server went successfully!",
        ERROR: "Something went wrong! Please try again later."
    };

    return(
        <Snackbar anchorOrigin={{vertical:'bottom', horizontal:'left'}} open={!!config} autoHideDuration={3000} onClose={removeConfig}>
            <Alert onClose={removeConfig} severity={!!config ? (config.success ? "success" : "danger") : ""}>
                {!!config ? (config.success ? MESSAGES.SUCCESS : MESSAGES.ERROR)  : ""}
            </Alert>
        </Snackbar>
    )
}
