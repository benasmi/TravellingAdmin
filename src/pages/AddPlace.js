import React, {useEffect, useState} from "react";
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
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import API from "../Networking/API";
import UseSnackbarContext from "../contexts/UseSnackbarContext";
import CircularProgress from "@material-ui/core/CircularProgress";
import LinearProgress from "@material-ui/core/LinearProgress";


const styles = theme => ({
    button: {
        margin: theme.spacing(2)
    },
    paperContent: {
        width: "70%",
        marginTop: theme.spacing(4),
        padding: theme.spacing(4),
    },
    root:{
        height:"100vh"
    },
    loader:{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100vw",
        height: "100vh"
    },
    content:{
        display:"flex",
        flexDirection: "column",
        alignItems: "center",
        height:`calc(93vh - 64px)`,
        padding: theme.spacing(8),
        overflowY: "auto"
    },
    bottom:{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        padding: theme.spacing(1),
        height: "7vh"
    }
});

function AddPlace({classes, match}){
    const [placeInfo, setPlaceInfo] = useState({placeId: "", name: "", description: "",website: "", phoneNumber: "", hasSchedule: false, isPublic: false});

    const [selectedTags, setSelectedTags] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);

    const [photos, setPhotos] = useState([]);

    const [locationData, setLocationData] = useState({city: '', address: '', country: '', latitude: '', longitude: ''});
    const [parkingMarkerData, setParkingMarkerData] = useState({city: '', address: '', country: '', latitude: 54.687157, longitude: 25.279652});
    const [allSelectedParkingData, setAllSelectedParkingData] = useState([]);

    const [scheduleData, setScheduleData] = useState(initialScheduleData);

    const [placeId, setPlaceId] = useState(match.params.placeId);

    const [firstTimeLoading, setFirstTimeLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);



    const { addConfig } = UseSnackbarContext();

    useEffect(()=>{
        if(placeId!==undefined){
            getPlaceInfo()
        }
    },[placeId]);

    function getPlaceInfo() {
        API.Places.getPlaceById("?full=true&p="+placeId).then(response=>{
            setAllData(response)
        }).catch(error=>{
            formFeedback(false)
        })
    }

    function setAllData(place){
        setPlaceInfo({
            placeId: place.placeId,
            name: place.name,
            description: place.description,
            website: place.website,
            phoneNumber: place.phoneNumber,
            hasSchedule: place.hasSchedule,
            isPublic: place.isPublic
        });

        setLocationData({city: place.city,
            address: place.address,
            country: place.country,
            latitude: place.latitude,
            longitude: place.longitude});

        setSelectedTags(place.tags);
        setSelectedCategories(place.categories);
        console.log("Schedule", place.schedule);
        if(place.schedule.length > 0)
            setScheduleData(place.schedule);
        setAllSelectedParkingData(place.parking);
        setPhotos(place.photos)

        setFirstTimeLoading(false);

    }

    function formFeedback(success, message="Something went wrong!"){
        addConfig(success, message);
        setIsLoading(false)
    }

    function saveChanges(){
        setIsLoading(true);
        if(placeId === undefined){
            Promise.all([
                insertBasicPlaceInfo()
            ]).then(responses=>{
                formFeedback(true, "Place inserted successfully!")
            }).catch(error=>{
                formFeedback(false)
            })
        }else{
            Promise.all([
                updatePlaceInfo(),
                updateTagsData(placeId),
                updatePhotoData(placeId),
                updateCategoriesData(placeId),
                updateParkingData(placeId),
                updateSchedule(placeId)
            ]).then(response=>{
                formFeedback(true, "All changes saved!");
            }).catch(err=>{
                formFeedback(false)
            })
        }
    }

    function updatePlaceInfo() {
        API.Places.updatePlace(formPlaceInfo()).then(response=>{

        }).catch(error=>{

        })

    }


    function insertBasicPlaceInfo(){
            return API.Places.insertPlace(formPlaceInfo()).then(placeId=>{
                updateTagsData(placeId);
                updateParkingData(placeId);
                updateCategoriesData(placeId);
                updatePhotoData(placeId);
                updateSchedule(placeId);
                return placeId
            }).catch(error=>{

            })
    }

    function updateParkingData(id) {
        API.ParkingPlace.updateParkingForPlace(allSelectedParkingData, "?p="+id).then(response=>{

        }).catch(error=>{

        })
    }

    function updateTagsData(id) {
        API.TagsPlace.updateTagsForPlace(selectedTags, "?p="+id).then(response=>{

        }).catch(error=>{

        })
    }

    function updateCategoriesData(id) {
        API.CategoriesPlace.updateCategoriesForPlace(selectedCategories, "?p="+id).then(response=>{

        }).catch(error=>{

        })
    }

    function updatePhotoData(id) {
        API.PhotoPlace.updatePhotoForPlace(photos, "?p="+id).then(response=>{

        }).catch(error=>{

        })
    }

    function updateSchedule(id){
        console.log("Id", id);
        console.log("Schedule datacka", scheduleData);
        API.Schedule.updateScheduleForPlace(scheduleData, "?p="+id).then(response=>{}).catch(er=>{})
    }

    function formPlaceInfo(){
        return Object.assign(placeInfo, locationData)
    }


    return(
        <div className={classes.root}>
            {firstTimeLoading ? <div className={classes.loader}><CircularProgress /></div> : <div className={classes.content}>
                <Paper elevation = {4} className={classes.paperContent}>
                    <BasicPlaceInfo
                        placeInfo={placeInfo}
                        setPlaceInfo={setPlaceInfo}
                    />
                </Paper>

                <Paper elevation = {4} className={classes.paperContent}>
                    <PhotosInfo
                        photos={photos}
                        setPhotos={setPhotos}
                    />
                </Paper>
                <Paper elevation = {4} className={classes.paperContent}>
                    <PlaceLocation
                        locationData={locationData}
                        setLocationData={setLocationData}/>
                </Paper>
                <Paper elevation = {4} className={classes.paperContent}>
                    <ParkingLocation
                        allSelectedParkingData={allSelectedParkingData}
                        setAllSelectedParkingData={setAllSelectedParkingData}
                        parkingMarkerData={parkingMarkerData}
                        setParkingMarkerData={setParkingMarkerData}/>
                </Paper>
                <Paper elevation = {4} className={classes.paperContent}>
                    <PlaceDiscovery
                        selectedTags={selectedTags}
                        setSelectedTags={setSelectedTags}
                        selectedCategories={selectedCategories}
                        setSelectedCategories={setSelectedCategories}/>
                </Paper>

                <Paper elevation = {4} className={classes.paperContent}>
                    <WorkingSchedule
                        workingScheduleEnabled={placeInfo}
                        setWorkingScheduleEnabled={setPlaceInfo}
                        scheduleData={scheduleData}
                        setScheduleData={setScheduleData}/>
                </Paper>
            </div> }

            {isLoading ? <LinearProgress/> : null}

            <Paper elevation={1} className={classes.bottom}>

                <FormControlLabel
                    control={<Switch checked={placeInfo['isPublic']} onChange={()=> {
                            var obj = Object.assign({}, placeInfo, {});
                            obj['isPublic'] = !obj['isPublic']
                            setPlaceInfo(obj);
                        }
                    } name="isPublic" />}
                    label="Make this place public"
                />

                <Button
                    variant="contained"
                    color="primary"
                    onClick={()=>saveChanges()}
                    className={classes.button}>
                    Save
                </Button>
            </Paper>
        </div>)

}

AddPlace.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(AddPlace)


