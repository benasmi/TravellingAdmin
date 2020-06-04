import {withStyles} from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import React, {useState} from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import List from "@material-ui/core/List";

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
    }
});

function AddSourceDialog(props){

    function validateInput(){
        let error = false;
        if(text.length <= 3 || url.length <=3)
            error = true;
        setError(error);
        return error
    }

    let {classes, open, action, setDialogOpen} = props;
    const [text, setText] = useState("");
    const [url, setUrl] = useState("");
    const [error, setError] = useState(false);
    return(
        <div>
            <Dialog aria-labelledby="customized-dialog-title" open={open} fullWidth={true}>
                <DialogTitle id="customized-dialog-title">
                    Insert source
                </DialogTitle>
                <DialogContent dividers>
                        <TextField error={error} onChange = {(ev) => {setText(ev.target.value)}}
                                   label="Source name" variant="outlined" fullWidth />
                        <TextField style={{marginTop:"16px"}} error={error} onChange = {(ev) => {setUrl(ev.target.value)}}
                                   label="Source url" variant="outlined" fullWidth />

                </DialogContent>
                <DialogActions>
                    <Button onClick={()=>setDialogOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button autoFocus color="primary" onClick={() => {
                        !validateInput() && action(text, url);
                        setDialogOpen(false)
                    }}>
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
export default withStyles(styles)(AddSourceDialog)