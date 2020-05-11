import React, {useEffect, useState} from "react";
import {withStyles} from "@material-ui/core/styles";
import { createBrowserHistory } from "history";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete"
import Button from "@material-ui/core/Button";

import history from "../helpers/history";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Box from "@material-ui/core/Box";
import PropTypes from "prop-types";
import {Card, Paper} from '@material-ui/core';
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import TableComponent from "../components/TableComponent";
import AutocompleteChip from "../components/AutocompleteChip";
import API from "../Networking/API";
import AddDialog from "../components/AddDialog";
import ReorderablePhotos from "../components/ReorderablePhotos";
import { DropzoneArea } from 'material-ui-dropzone';
import AddImageDialog from "../components/AddImageDialog";
import CardHeader from "@material-ui/core/CardHeader";
import IconButton from "@material-ui/core/IconButton";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";

const initialPhotos = [
    {
        src: "https://source.unsplash.com/2ShvY8Lf6l0/800x599",
        width: 1,
        height: 1
    },
    {
        src: "https://source.unsplash.com/Dm-qxdynoEc/800x799",
        width: 1,
        height: 1
    },
    {
        src: "https://source.unsplash.com/qDkso9nvCg0/600x799",
        width: 1,
        height: 1
    },
    {
        src: "https://source.unsplash.com/iecJiKe_RNg/600x799",
        width: 1,
        height: 1
    },
    {
        src: "https://source.unsplash.com/epcsn8Ed8kY/600x799",
        width: 1,
        height: 1
    },
    {
        src: "https://source.unsplash.com/NQSWvyVRIJk/800x599",
        width: 1,
        height: 1
    },
    {
        src: "https://source.unsplash.com/zh7GEuORbUw/600x799",
        width: 1,
        height: 1
    },
    {
        src: "https://source.unsplash.com/PpOHJezOalU/800x599",
        width: 1,
        height: 1
    },
    {
        src: "https://source.unsplash.com/I1ASdgphUH4/800x599",
        width: 1,
        height: 1
    }
];

const styles = theme => ({
    button: {
        margin: theme.spacing(2),
        // backgroundColor: "black"
    },
    bottomBar: {
        // position: 'fixed',
        //width: '95%',
        margin: theme.spacing(2),
         // left: 10,
         //width: '100%',
        display: 'flex',
        justifyContent: 'flex-end'
    },
    content: {
        // width: '90%',
        // margin: 'auto',
        margin: theme.spacing(1),
        padding: theme.spacing(4),
    },
    root:{
        width: '100%'
    },
    outline: {
        margin: theme.spacing(1),
        padding: theme.spacing(1),
        width: '100%'
    },
    addFromUrlWrapper: {
        margin: theme.spacing(1),
        padding: theme.spacing(1),
        display: 'flex',
    }
});

function getSteps() {
    return ['Basic place info', 'Parking', 'Place discovery settings'];
}


function AddPlace(props){

    const {classes} = props;
    const [activeStep, setActiveStep] = useState(0);

    const [availableTags, setAvailableTags] = useState([])
    const [selectedTags, setSelectedTags] = useState([]);
    const [dialogAddTagOpen, setDialogAddTagOpen] = useState(false);
    const [dialogAddCategoryOpen, setDialogAddCategoryOpen] = useState(false);
    const [photos, setPhotos] = useState([]);
    const [addImageDialogOpen, setAddImageDialogOpen] = useState(false);

    const updateTags = () => {
        API.getAllTags().then(response=>{
            setAvailableTags(response)
        }).catch(error=>{
            console.log(error)
        })
    }
    const updateCategories = () => {
        API.getAllCategories().then(response=>{
            setAvailableCategories(response)
        }).catch(error=>{
            console.log(error)
        });
    }

    const handleAddTag = (value) => {
        API.addTag([{name: value}]).then(response=>{
            let newTag = {tagId: response[0], name: value}
            setAvailableTags(
                [
                    ...availableTags,
                    newTag
                ]
            )
            setSelectedTags([
                ...selectedTags,
                newTag
            ])
            setDialogAddTagOpen(false)

        }).catch(error=>{
                console.log(error)
            })
    }

    const handleAddCategory = (value) => {
        API.addCategory([{name: value}]).then(response=>{
            let newCat = {categoryId: response[0], name: value}
            setAvailableCategories(
                [
                    ...availableCategories,
                    newCat
                ]
            )
            setSelectedCategories([
                ...selectedCategories,
                newCat
            ])
            setDialogAddCategoryOpen(false)

        }).catch(error=>{
                console.log(error)
            })
    }

    const [availableCategories, setAvailableCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);

    useEffect(()=>{
        updateTags()
        updateCategories()
        },[]);

    let steps = getSteps();

    const handleNext = () => {
        setActiveStep((prevActiveStep) => Math.min(prevActiveStep + 1, steps.length));
    };
    const handleBack = () => {
        setActiveStep((prevActiveStep) => Math.max(0, prevActiveStep - 1));
    };

    function handleAddPhoto(file) {
        setAddImageDialogOpen(false)
        if(file == null)
            return;
        setPhotos([
            ...photos,
            file]
        )
    }

    const getStep = (step) =>{

        switch(step){
            case 0:
                return(
                    <div>
                        <Typography variant="h6" >
                            Basic place information
                        </Typography>
                        <br/>
                        <TextField
                            label="Place name"
                            style={{ margin: 8 }}
                            placeholder="Enter the place name"
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            label="Place description"
                            style={{ margin: 8 }}
                            placeholder="Describe the place thoroughly"
                            fullWidth
                            multiline
                            variant="outlined"
                            rows={4}
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            label="Phone number"
                            style={{ margin: 8 }}
                            placeholder="Enter phone number"
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            label="Website"
                            style={{ margin: 8 }}
                            placeholder="Enter website"
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
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
                );
            case 1:
                return(
                    <div>
                        <Typography variant="h6" >
                            Add parking
                        </Typography>
                    </div>
                );
            case 2:

                return(
                    <div>
                        <Typography variant="h6" >
                            Place discovery settings
                        </Typography>
                        <br/>
                        <Typography variant="subtitle1" >
                            Select tags
                        </Typography>
                        <AutocompleteChip label="Select tags" id="tagId" options={availableTags} selectedOptions={selectedTags} setSelectedOptions ={setSelectedTags}/>
                        <Button
                            variant="text"
                            color="primary"
                            size="small"
                            className={classes.button}
                            onClick={() => setDialogAddTagOpen(true)}
                            startIcon={<AddIcon />}>
                            Add missing tag
                        </Button>
                        <AddDialog action={handleAddTag} textFieldLabel="Name" open={dialogAddTagOpen} onCloseCallback={() => setDialogAddTagOpen(false)} header = "Add a new tag" />

                        <br/>
                        <br/>
                        <Typography variant="subtitle1" >
                            Select categories
                        </Typography>
                        <AutocompleteChip label="Select categories" id="categoryId" options={availableCategories} selectedOptions={selectedCategories} setSelectedOptions={setSelectedCategories}/>
                        <Button
                            variant="text"
                            color="primary"
                            size="small"
                            className={classes.button}
                            onClick={() => setDialogAddCategoryOpen(true)}
                            startIcon={<AddIcon />}>
                            Add a category
                        </Button>
                        <AddDialog action={handleAddCategory} textFieldLabel="Name" open={dialogAddCategoryOpen} onCloseCallback={() => setDialogAddCategoryOpen(false)} header = "Add a new category" />

                    </div>
                )
        }
    };



    return (
        <div className={classes.root}>

            <Paper elevation = {2} className={classes.content}>
                {getStep(activeStep)}
            </Paper>

            <Paper elevation = {2} className = {classes.bottomBar}>

                <Stepper activeStep={activeStep} style={{ backgroundColor: "transparent", width: '100%' }}>
                    {steps.map((label, index) => {
                        return(
                            <Step key={index}>
                                <StepLabel>{label}</StepLabel>
                            </Step>)
                    })}
                </Stepper>

                <Button
                    // style={{width: '15%'}}
                    variant="contained"
                    color="primary"
                    onClick={handleBack}
                    className={classes.button}
                >Back</Button>
                <Button
                    // style={{width: '15%'}}
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    className={classes.button}
                >Next</Button>
            </Paper>
        </div>
    )
}
AddPlace.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(AddPlace)

