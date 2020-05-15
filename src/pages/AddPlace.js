import React, {useState} from "react";
import {withStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import PropTypes from "prop-types";
import {Paper} from '@material-ui/core';
import BasicPlaceInfo from "../components/add_place_components/BasicPlaceInfo";
import PhotosInfo from "../components/add_place_components/PhotosInfo";
import PlaceLocation from "../components/add_place_components/PlaceLocation";
import ParkingLocation from "../components/add_place_components/ParkingLocation";
import PlaceDiscovery from "../components/add_place_components/PlaceDiscovery";
import initialScheduleData from "../components/add_place_components/initialScheduleData";
import WorkingSchedule from "../components/add_place_components/WorkingSchedule";


const styles = theme => ({
    button: {
        margin: theme.spacing(2)
    },
    bottomBar: {
        margin: theme.spacing(2),
        display: 'flex',
        justifyContent: 'flex-end'
    },
    content: {
        margin: theme.spacing(1),
        padding: theme.spacing(4),
    },
    paper:{
        padding: theme.spacing(2),
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: "8px"
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
    return ['Basic place info', "Place location", 'Parking', 'Place discovery settings', 'Working schedule'];
}


function AddPlace({classes}){
    const [activeStep, setActiveStep] = useState(0);

    const [placeInfo, setPlaceInfo] = useState({name: "", description: "",website: "", phoneNumber: ""});
    const [selectedTags, setSelectedTags] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [photos, setPhotos] = useState([]);
    const [locationData, setLocationData] = useState({city: '', address: '', country: '', lat: 54.687157, lng: 25.279652});
    const [parkingMarkerData, setParkingMarkerData] = useState({city: '', address: '', country: '', lat: 54.687157, lng: 25.279652});
    const [allSelectedParkingData, setAllSelectedParkingData] = useState([]);
    const [scheduleData, setScheduleData] = useState(initialScheduleData);

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
                return <React.Fragment>
                        <BasicPlaceInfo
                            placeInfo={placeInfo}
                            setPlaceInfo={setPlaceInfo}
                        />
                        <PhotosInfo
                            photos={photos}
                            setPhotos={setPhotos}
                        />
                </React.Fragment>;

            case 1:
                return  <PlaceLocation
                    locationData={locationData}
                    setLocationData={setLocationData}/>;
            case 2:
                return <ParkingLocation
                        allSelectedParkingData={allSelectedParkingData}
                        setAllSelectedParkingData={setAllSelectedParkingData}
                        parkingMarkerData={parkingMarkerData}
                        setParkingMarkerData={setParkingMarkerData}/>;
            case 3:
                return <PlaceDiscovery
                    selectedTags={selectedTags}
                    setSelectedTags={setSelectedTags}
                    selectedCategories={selectedCategories}
                    setSelectedCategories={setSelectedCategories}/>;
            case 4:
                return <WorkingSchedule
                    scheduleData={scheduleData}
                    setScheduleData={setScheduleData}/>
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
                    variant="contained"
                    color="primary"
                    onClick={handleBack}
                    className={classes.button}
                >Back</Button>
                <Button
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


