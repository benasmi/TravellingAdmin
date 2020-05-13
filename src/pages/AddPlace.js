import React, {useEffect, useState} from "react";
import {withStyles} from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete"
import Button from "@material-ui/core/Button";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import PropTypes from "prop-types";
import {Card, Paper} from '@material-ui/core';
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import AutocompleteChip from "../components/AutocompleteChip";
import API from "../Networking/API";
import CustomMap from "../components/CustomMap";
import {arrayMove, SortableContainer, SortableElement} from 'react-sortable-hoc';
import AddDialog from "../components/AddDialog";
import ReorderablePhotos from "../components/ReorderablePhotos";
import AddImageDialog from "../components/AddImageDialog";
import IconButton from "@material-ui/core/IconButton";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Schedule from "../components/Schedule";

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


function AddPlace(props){

    const {classes} = props;
    const [activeStep, setActiveStep] = useState(0);

    const [availableTags, setAvailableTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [dialogAddTagOpen, setDialogAddTagOpen] = useState(false);
    const [dialogAddCategoryOpen, setDialogAddCategoryOpen] = useState(false);
    const [photos, setPhotos] = useState([]);
    const [addImageDialogOpen, setAddImageDialogOpen] = useState(false);

    const [availableCategories, setAvailableCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);


    const [locationData, setLocationData] = useState({city: '', address: '', country: '', lat: 54.687157, lng: 25.279652});
    const [parkingMarkerData, setParkingMarkerData] = useState({city: '', address: '', country: '', lat: 54.687157, lng: 25.279652});

    const [allSelectedParkingData, setAllSelectedParkingData] = useState([]);


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

    const [workingScheduleEnabled, setWorkingScheduleEnabled] = React.useState(false);
    const [isPlacePermanentlyClosed, setIsPlacePermanentlyClosed] = React.useState(false);
    const [scheduleData, setScheduleData] = useState([
        {
            dayOfWeek: 0,
            openTime: "08:00",
            closeTime: "18:00",
            isClosed: false
        },
        {
            dayOfWeek: 1,
            openTime: "08:00",
            closeTime: "18:00",
            isClosed: false
        },
        {
            dayOfWeek: 2,
            openTime: "08:00",
            closeTime: "18:00",
            isClosed: false
        },
        {
            dayOfWeek: 3,
            openTime: "08:00",
            closeTime: "18:00",
            isClosed: false
        },
        {
            dayOfWeek: 4,
            openTime: "08:00",
            closeTime: "18:00",
            isClosed: false
        },
        {
            dayOfWeek: 5,
            openTime: "08:00",
            closeTime: "18:00",
            isClosed: false
        },
        {
            dayOfWeek: 6,
            openTime: "08:00",
            closeTime: "18:00",
            isClosed: false
        }
    ]);

    useEffect(()=>{
        updateTags();
        updateCategories();
        getClosestParking(parkingMarkerData.lat, parkingMarkerData.lng)
    },[]);




    const getClosestParking = (lat, lng, parkingDataChanged)=>{
        API.getParkingByLocation("?lat="+lat+"&lng="+lng).then(response=>{
            let placesData = [];
            response.map(row => {
                placesData.push(row)
            });
            parkingDataChanged(response);
        }).catch(error=>{
        })
    };

    let steps = getSteps();

    const handleNext = () => {
        setActiveStep((prevActiveStep) => Math.min(prevActiveStep + 1, steps.length));
    };
    const handleBack = () => {
        setActiveStep((prevActiveStep) => Math.max(0, prevActiveStep - 1));
    };

    function changeLocationData(event){
        const {name, value} = event.target;
        let data = Object.assign({}, locationData, {});
        data[name] = value;
        setLocationData(data)
    }

    function changedParkingMarkerCallback(city,address,country,lat,lng, parkingDataChanged) {
        getClosestParking(parseFloat(lat),parseFloat(lng), parkingDataChanged);
    }

    function addNewParking(markerData){
        console.log(markerData);
        markerData.latitude = markerData.lat;
        markerData.longitude = markerData.lng;
        API.insertNewParking([markerData]).then(response=>{
            console.log("Responsaaas", response);
            setAllSelectedParkingData(oldArray=>[...oldArray, response[0]])
        }).catch(error=>{
            console.log(error);
        })
    }


    const SortableItem = SortableElement(({value}) => (
        <Paper className={classes.paper} elevation={3}>
            <Typography>
                {value.address}
            </Typography>
            <IconButton aria-label="delete" className={classes.margin}
                        onClick={()=>setAllSelectedParkingData(allSelectedParkingData.filter((item) => item.parkingId !== value.parkingId))}>
                <DeleteIcon fontSize="small" />
            </IconButton>
        </Paper>
    ));

    const SortableList = SortableContainer(({items}) => {
        return (
            <ul>
                {items.map((value, index) => (
                <SortableItem key={index} index={index} value={value} />
                ))}
            </ul>
        );
    });

    const onSortEnd = ({oldIndex, newIndex}) => {
        setAllSelectedParkingData(arrayMove(allSelectedParkingData,oldIndex, newIndex))
    };

    function handleAddPhoto(file) {
        setAddImageDialogOpen(false);
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
                return <div>
                    <Typography variant="h6" >
                        Place location
                    </Typography>
                    <br/>
                    <Typography variant="subtitle1" >
                        Select place location from map
                    </Typography>
                    <br/>
                    <CustomMap mapHeight={200}
                               locationData={locationData}
                               setLocationData={setLocationData}
                    />
                    <br/>
                    <br/>
                    <Typography variant="subtitle1" >
                        Place location
                    </Typography>
                    <br/>
                    <TextField
                        label="Address"
                        style={{ margin: 8 }}
                        placeholder="Enter place address"
                        fullWidth
                        disabled
                        value={locationData['address']}
                        name='address'
                        onChange={e=>{changeLocationData(e)}}
                        variant="outlined"
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        label="City"
                        disabled
                        style={{ margin: 8 }}
                        placeholder="Enter place city"
                        fullWidth
                        value={locationData['city']}
                        name='city'
                        onChange={e=>{changeLocationData(e)}}
                        variant="outlined"
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        label="Country"
                        style={{ margin: 8 }}
                        placeholder="Enter place country"
                        fullWidth
                        disabled
                        value={locationData['country']}
                        name='country'
                        onChange={e=>{changeLocationData(e)}}
                        variant="outlined"
                        rows={4}
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </div>;
            case 2:
                return(
                    <div>
                        <Typography variant="h6" >
                            Add parking
                        </Typography>
                        <br/>
                        <Typography variant="subtitle1" >
                            Select parking
                        </Typography>
                        <CustomMap mapHeight={350}
                                   locationData={parkingMarkerData}
                                   setLocationData={setParkingMarkerData}
                                   selectedParkingCallback={(location)=>setAllSelectedParkingData(oldArray=> [...oldArray, location])}
                                   changedParkingMarkerCallback={changedParkingMarkerCallback}
                                   addParkingCallback={addNewParking}

                        />
                        
                        <br/>
                        <Typography variant="subtitle1" >
                            Selected parking locations
                        </Typography>

                        <SortableList distance={10} items={allSelectedParkingData} onSortEnd={onSortEnd} />

                    </div>
                );

            case 3:
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
            case 4:

                return(
                    <div>
                        <Typography variant="subtitle1" >
                            Working schedule
                        </Typography>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={workingScheduleEnabled}
                                    onChange={() => setWorkingScheduleEnabled(current => !current)}
                                    color="primary"
                                />
                            }
                            label="Enable working schedule for this place"
                        />
                        <br/>
                        {workingScheduleEnabled &&
                            <Card variant={"outlined"} className={classes.outline}>

                                <Schedule scheduleData={scheduleData} setScheduleData={setScheduleData}/>

                            </Card>
                        }
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


