import React, {useState} from "react";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import UseSnackbarContext from "../../contexts/UseSnackbarContext";


export default function SnackbarFeedback(props){

    const { config, removeConfig } = UseSnackbarContext();

    return(
        <Snackbar anchorOrigin={{vertical:'bottom', horizontal:'left'}} open={!!config} autoHideDuration={4000} onClose={removeConfig}>
            <Alert onClose={removeConfig} severity={!!config ? (config.success ? "success" : "danger") : ""}>
                {!!config && config.message}
            </Alert>
        </Snackbar>
    )
}
