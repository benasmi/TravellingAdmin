import {withStyles} from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import React, {useEffect, useState} from "react";
import {DropzoneArea} from "material-ui-dropzone";
import LinearProgress from "@material-ui/core/LinearProgress";
import PropTypes from "prop-types";
import API from "../Networking/API";

const styles = theme => ({
    dropzoneArea: {
        overflow: "hidden"
    }
});

const acceptedFileFormats = ['image/jpeg', 'image/png', 'image/bmp', 'image/jpg']

function AddImageDialog(props) {

    const {onCloseCallback, open, onFinishCallback, classes} = props
    const [loading, setIsLoading] = useState(false)
    const [selectedFiles, setSelectedFiles] = useState([])

    const submitCallback = () => {
        setIsLoading(true)

        Promise.all(selectedFiles.map(imagefile => {
            let formData = new FormData()
            formData.append("image", imagefile)
            return API.Photos.uploadPhoto(formData)
        })).then(response => {
            console.log(response)
            onFinishCallback(response)
        }).catch(error => {
            onFinishCallback()
        }).finally(() => {
            setIsLoading(false)
        })
    }

    const handleDrop = (files )=> {
        setSelectedFiles(existingFiles => [...existingFiles, ...files])
    }

    useEffect(() => {
        console.log(selectedFiles)

    }, [selectedFiles])

    const handleDelete = (file) => {
        console.log(file.name)
        setSelectedFiles(files => {return files.filter(existingFile => existingFile !== file)})
    }

    return (
        <div>
            <Dialog aria-labelledby="customized-dialog-title" open={open} fullWidth={true}>
                <DialogTitle id="customized-dialog-title">
                    Photo upload
                </DialogTitle>
                {loading && <LinearProgress variant="query"/>}
                <DialogContent dividers>
                    <DropzoneArea
                        className={classes.dropzoneArea}
                        acceptedFiles={acceptedFileFormats}
                        maxFileSize={25000000}
                        showAlerts={false}
                        dropzoneProps={{disabled: loading}} filesLimit={5} onDrop={handleDrop}
                    onDelete={handleDelete}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onCloseCallback} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={submitCallback} color="primary">
                        Submit
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
