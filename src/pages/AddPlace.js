import React from "react";
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


const styles = theme => ({
    button: {
        margin: theme.spacing(2),
        // backgroundColor: "black"
    },
    bottomBar: {
        position: 'fixed',
        bottom: 0,
         right: 10,
         left: 10,
         //width: '100%',
        display: 'flex',
        justifyContent: 'flex-end'
    },
    content: {
        // width: '90%',
        // margin: 'auto',
        margin: theme.spacing(1),
        padding: theme.spacing(4),
    }
});

function getSteps() {
    return ['Basic place info', 'Parking', 'Place discovery settings'];
}


function AddPlace(props){
    const {classes} = props
    const [activeStep, setActiveStep] = React.useState(0);

    let steps = getSteps()

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
                    </div>
                )
            case 1:
                return(
                    <div>
                        <Typography variant="h6" >
                            Add parking
                        </Typography>
                    </div>
                )
            case 2:
                return(
                    <div>
                        <Typography variant="h6" >
                            Place discovery settings
                        </Typography>
                    </div>
                )
        }
    }

    return (
        <div>

            <Paper elevation = {1} className={classes.content}>
                {getStep(activeStep)}
            </Paper>

            <Paper elevation = {3} className = {classes.bottomBar}>

                <Stepper activeStep={activeStep} style={{ backgroundColor: "transparent", width: '80%' }}>
                    {steps.map((label, index) => {
                        return(
                            <Step key={index}>
                                <StepLabel>{label}</StepLabel>
                            </Step>)
                    })}
                </Stepper>

                <Button
                    style={{width: '10%'}}
                    variant="contained"
                    color="primary"
                    onClick={handleBack}
                    className={classes.button}
                >Previous step</Button>
                <Button
                    style={{width: '10%'}}
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    className={classes.button}
                >Next step</Button>
            </Paper>
        </div>
    )
}
AddPlace.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(AddPlace)

