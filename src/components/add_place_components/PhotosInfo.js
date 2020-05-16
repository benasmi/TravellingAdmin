import React, {useState} from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import ReorderablePhotos from "../ReorderablePhotos";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import AddImageDialog from "../AddImageDialog";
import {Card} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";

const styles = theme => ({
    outline: {
        margin: theme.spacing(1),
        padding: theme.spacing(1),
        width: '100%'
    },
    button: {
        margin: theme.spacing(2)
    }
});

function PhotosInfo({classes, setPhotos, photos}) {
    const [addImageDialogOpen, setAddImageDialogOpen] = useState(false);

    function handleAddPhoto(file) {
        setAddImageDialogOpen(false);
        if(file == null)
            return;
        setPhotos([
            ...photos,
            file]
        )
    }

    return(
        <div>
            <Typography variant="h6" >
                Photos
            </Typography>
            <Card variant={"outlined"} className={classes.outline}>

                {photos.length > 0 && <ReorderablePhotos keyName="photoId" srcName = "url" setPhotos = {setPhotos} photos = {photos} />}


                <Button
                    variant="text"
                    color="primary"
                    size="small"
                    style={{width: '15%'}}
                    className={classes.button}
                    onClick={() => setAddImageDialogOpen(true)}
                    startIcon={<AddIcon />}>
                    Add photo
                </Button>

                <AddImageDialog open={addImageDialogOpen} onFinishCallback={(file) => handleAddPhoto(file)} onCloseCallback={() => setAddImageDialogOpen(false)}/>


            </Card>
        </div>

    )
}

export default withStyles(styles)(PhotosInfo)


