import React, {useEffect, useState} from "react";
import {withStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import PropTypes, {func} from "prop-types";
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
import UseAlertDialogContext from "../contexts/UseAlertDialogContext";
import CircularProgress from "@material-ui/core/CircularProgress";
import LinearProgress from "@material-ui/core/LinearProgress";
import Strings from "../helpers/stringResources";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import green from "@material-ui/core/colors/green";
import ThemeProvider from "react-bootstrap/ThemeProvider";

const styles = theme => ({
    button: {
        margin: theme.spacing(2)
    },
    paperContent: {
        marginTop: theme.spacing(4),
        [theme.breakpoints.down("lg")]: {
            width: "95%",
            padding: theme.spacing(2),
        },
        [theme.breakpoints.up("lg")]: {
            width: "70%",
            padding: theme.spacing(4),
        },
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
        [theme.breakpoints.down("lg")]: {
            width: "100%",
            padding: theme.spacing(1),
        },
        [theme.breakpoints.up("lg")]: {
            width: "auto",
            padding: theme.spacing(8),
        },
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
    const [placeInfo, setPlaceInfo] = useState({placeId: "", name: "", description: "",website: "", phoneNumber: "", hasSchedule: false, isPublic: false, isVerified: true});

    const [selectedTags, setSelectedTags] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);

    const [photos, setPhotos] = useState([]);

    const [locationData, setLocationData] = useState({city: '', address: '', country: '', latitude: 54.687157, longitude: 25.279652});
    const [parkingMarkerData, setParkingMarkerData] = useState({city: '', address: '', country: '', latitude: 54.687157, longitude: 25.279652});
    const [allSelectedParkingData, setAllSelectedParkingData] = useState([]);

    const [scheduleData, setScheduleData] = useState(initialScheduleData);

    const [placeId, setPlaceId] = useState(match.params.placeId);

    const [firstTimeLoading, setFirstTimeLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);




    const { addConfig } = UseSnackbarContext();
    const { addAlertConfig } = UseAlertDialogContext();


    const ColorButton = withStyles((theme) => ({
        root: {
            color: theme.palette.getContrastText(green[500]),
            backgroundColor: green[500],
            '&:hover': {
                backgroundColor: green[700],
            },
        },
    }))(Button);

    useEffect(()=>{
        //Loaded place for editing
        if(placeId!==undefined){
            console.log("Getting place location");
            getPlaceInfo()
        }else{
            console.log("Came here to add new place");
            setFirstTimeLoading(false) //Just loaded add place window
        }

        //New Place has been just inserted, thus inserting other place info
        if(placeId!==undefined && firstTimeLoading===false){
            console.log("Just added new place");
            Promise.all([
                updateTagsData(placeId),
                updateParkingData(placeId),
                updateCategoriesData(placeId),
                updatePhotoData(placeId),
                updateSchedule(placeId)
            ]).then(responses=>{
                formFeedback(true, Strings.SNACKBAR_PLACE_INSERTED_SUCCESS)
            }).catch(error=>{
                formFeedback(false)
            })
        }

    },[placeId]);

    useEffect(()=>{
        if(firstTimeLoading === false){
            console.log("Making this place public");
            updateAll()
        }
    },[placeInfo['isPublic']]);

    function getPlaceInfo() {
        API.Places.getPlaceById("?full=true&p="+placeId).then(response=>{
            setAllData(response)

        }).catch(error=>{
            formFeedback(false)
        })
    }

    function setAllData(place){
        console.log(place)
        setPlaceInfo({
            placeId: place.placeId,
            name: place.name,
            description: place.description,
            website: place.website,
            phoneNumber: place.phoneNumber,
            hasSchedule: place.hasSchedule,
            isPublic: place.isPublic,
            isVerified: place.isVerified
        });

        setLocationData({city: place.city,
            address: place.address,
            country: place.country,
            latitude: place.latitude,
            longitude: place.longitude});

        setSelectedTags(place.tags);
        setSelectedCategories(place.categories);
        if(place.schedule.length > 0)
            setScheduleData(place.schedule);
        setAllSelectedParkingData(place.parking);
        setPhotos(place.photos)

        setFirstTimeLoading(false);

    }

    function formFeedback(success, message=Strings.SNACKBAR_ERROR){
        addConfig(success, message);
        setIsLoading(false)
    }

    function saveChanges(){
        if(placeId === undefined){
            addAlertConfig(Strings.DIALOG_PLACE_INSERT_TITLE,Strings.DIALOG_PLACE_INSERT,function () {
                setIsLoading(true);
                insertBasicPlaceInfo()
            });
        }else{
            addAlertConfig(Strings.DIALOG_PLACE_UPDATE_TITLE, Strings.DIALOG_PLACE_UPDATE, function () {
                setIsLoading(true)
                updateAll()
            })
        }
    }

    function updateAll(){
        Promise.all([
            updatePlaceInfo(),
            updateTagsData(placeId),
            updatePhotoData(placeId),
            updateCategoriesData(placeId),
            updateParkingData(placeId),
            updateSchedule(placeId)
        ]).then(response=>{
            formFeedback(true, Strings.SNACKBAR_CHANGES_SAVED);
        }).catch(err=>{
            formFeedback(false)
        })
    }

    function updatePlaceInfo() {
        API.Places.updatePlace(formPlaceInfo()).then(response=>{

        }).catch(error=>{

        })

    }

    function insertBasicPlaceInfo(){
            API.Places.insertPlace(formPlaceInfo()).then(placeId=>{
                setPlaceId(placeId)
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
        console.log(scheduleData);
        if(placeInfo['hasSchedule'])
            API.Schedule.updateScheduleForPlace(scheduleData, "?p="+id).then(response=>{}).catch(er=>{})
    }

    function formPlaceInfo(){
        let d = Object.assign(placeInfo, locationData)
        console.log(d);
        return d
    }


    function publishPlace(){
        addAlertConfig(Strings.DIALOG_PLACE_PUBLISH_TITLE, placeInfo['isPublic'] ? Strings.DIALOG_PLACE_UNPUBLISH_MESSAGE : Strings.DIALOG_PLACE_PUBLISH_MESSAGE, function(){
            let obj = Object.assign({}, placeInfo, {});
            obj['isPublic'] = !obj['isPublic'];
            setPlaceInfo(obj);
        })
    }

    function verifyPlace(){
        addAlertConfig(Strings.DIALOG_PLACE_VERIFY_TITLE, Strings.DIALOG_PLACE_VERIFY_MESSAGE, function(){
            let obj = Object.assign({}, placeInfo, {});
            obj['isPublic'] = 1;
            obj['isVerified'] = 1;
            setPlaceInfo(obj);
        })
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

                {

                    placeInfo['isVerified'] === false && placeId !== undefined ?
                        <ColorButton
                            variant="contained"
                            color="primary"
                            onClick={()=>{verifyPlace()}}
                            className={classes.button}
                        >
                            Verify place
                        </ColorButton>
                    :
                    <FormControlLabel
                    control={<Switch checked={placeInfo['isPublic']} onChange={()=> {
                        publishPlace()
                    }
                    } name="isPublic" />}
                    label="Make this place public"
                />}
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


