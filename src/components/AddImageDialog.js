import {withStyles} from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import React, {useState} from "react";
import {Card} from "@material-ui/core";
import {DropzoneArea} from "material-ui-dropzone";
import Typography from "@material-ui/core/Typography";
import LinearProgress from "@material-ui/core/LinearProgress";
import PropTypes from "prop-types";
import API from "../Networking/API";
import axios from "axios";

const styles = theme => ({
});

const acceptedFileFormats = ['image/jpeg', 'image/png', 'image/bmp', 'image/jpg']

function AddImageDialog(props){

    const {onCloseCallback, open, onFinishCallback} = props
    const [loading, setIsLoading] = useState(false)

    function handleFileUpload(files) {
        setIsLoading(true)

        var imagefile = files[0]
        let formData = new FormData()
        formData.append("image", imagefile)

        // API.uploadPhoto(formData).then(response => {
        //     console.log(response)
        //     onFinishCallback(response)
        // }).catch(err => {
        //     onFinishCallback()
        // }).finally(() => {
        //     setIsLoading(false)
        // })
        axios.post('http://izbg.l.dedikuoti.lt:8080/api/v1/photo/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(response => {
                console.log(response)
                onFinishCallback(response.data)
        }).catch(() => {
                onFinishCallback()
        }).finally(() => {
                setIsLoading(false)
        })
    }

    return(
        <div>
            <Dialog aria-labelledby="customized-dialog-title" open={open} fullWidth={true}>
                <DialogTitle id="customized-dialog-title" >
                    Photo upload
                </DialogTitle>
                {loading && <LinearProgress variant="query" />}
                <DialogContent dividers>
                    <DropzoneArea
                        acceptedFiles={acceptedFileFormats}
                        dropzoneProps = {{disabled: loading}} filesLimit={1} onDrop={(files) => handleFileUpload(files)}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onCloseCallback} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
AddImageDialog.propTypes = {
    classes: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    onFinishCallback: PropTypes.func.isRequired,
};

export default withStyles(styles)(AddImageDialog)
