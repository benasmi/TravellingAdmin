import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import Typography from "@material-ui/core/Typography";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import React, {useState} from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";

const styles = theme => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
});

function AddDialog(props){

    function validateInput(){
        var error = false;
        if(text.length <= 3)
            error = true
        setError(error)
        return error
    }

    let {classes, open, onCloseCallback, header, description, textFieldLabel, action} = props
    const [text, setText] = useState("")
    const [error, setError] = useState(false)
    return(
        <div>
            <Dialog /*onClose={handleClose}*/ aria-labelledby="customized-dialog-title" open={open} fullWidth={true}>
                <DialogTitle id="customized-dialog-title" /*onClose={handleClose}*/>
                    {header}
                </DialogTitle>
                <DialogContent dividers>
                    <TextField error={error} onChange = {(ev) => {setText(ev.target.value)}}label={textFieldLabel} variant="outlined" fullWidth />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onCloseCallback} color="primary">
                        Cancel
                    </Button>
                    <Button autoFocus color="primary" onClick={() => {
                        !validateInput() && action(text)
                    }}>
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

AddDialog.propTypes = {
    classes: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    action: PropTypes.func.isRequired,
    onCloseCallback: PropTypes.func.isRequired
};
export default withStyles(styles)(AddDialog)
