import React, {useEffect, useState} from "react";
import {withStyles} from "@material-ui/core/styles";
import { createBrowserHistory } from "history";
import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";

import history from "../helpers/history";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Box from "@material-ui/core/Box";
import PropTypes from "prop-types";
import { Paper } from '@material-ui/core';
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import TableComponent from "../components/TableComponent";
import AutocompleteChip from "../components/AutocompleteChip";
import API from "../Networking/API";


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

    const [availableCategories, setAvailableCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);



    useEffect(()=>{
        API.getAllTags().then(response=>{
            setAvailableTags(response.map(item => {
                return {name: item.name, tagId: item.tagId}
            }))
        }).catch(error=>{
            console.log(error)
        });

        API.getAllCategories().then(response=>{
            setAvailableCategories(response.map(item => {
                return {name: item.name, categoryId: item.categoryId}
            }))
        }).catch(error=>{
            console.log(error)
        });


    },[]);

    let steps = getSteps();

    const handleNext = () => {
        setActiveStep((prevActiveStep) => Math.min(prevActiveStep + 1, steps.length));
    };
    const handleBack = () => {
        setActiveStep((prevActiveStep) => Math.max(0, prevActiveStep - 1));
    };

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
                            startIcon={<AddIcon />}>
                            Add missing tag
                        </Button>

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
                            startIcon={<AddIcon />}>
                            Add missing category
                        </Button>
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

