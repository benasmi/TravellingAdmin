import React from "react";
import {withStyles} from "@material-ui/core/styles";
import { createBrowserHistory } from "history";
import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import history from "../helpers/history";


const styles = theme => ({
    button: {
        margin: theme.spacing(1)
    }
});


function AddPlace(){
    return <div>
        Add place
    </div>
}


export default withStyles(styles)(AddPlace)

