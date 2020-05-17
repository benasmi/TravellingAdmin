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
import * as $ from "expect";
import UseSnackbarContext from "../contexts/UseSnackbarContext";


const styles = theme => ({
    button: {
        margin: theme.spacing(2)
    },
    // bottomBar: {
    //     margin: theme.spacing(2),
    //     display: 'flex',
    //     justifyContent: 'flex-end'
    // },
    paperContent: {
        width: "70%",
        marginTop: theme.spacing(4),
        padding: theme.spacing(4),
    },
    root:{
        height:"100vh"
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

function getSteps() {
    return ['Basic place info', "Place location", 'Parking', 'Place discovery settings', 'Working schedule'];
}


function AddPlace({classes, match}){
    const [placeInfo, setPlaceInfo] = useState({placeId: "", name: "", description: "",website: "", phoneNumber: ""});
    const [selectedTags, setSelectedTags] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [photos, setPhotos] = useState([]);
    const [locationData, setLocationData] = useState({city: '', address: '', country: '', latitude: 54.687157, longitude: 25.279652});
    const [parkingMarkerData, setParkingMarkerData] = useState({city: '', address: '', country: '', latitude: 54.687157, longitude: 25.279652});
    const [allSelectedParkingData, setAllSelectedParkingData] = useState([]);
    const [scheduleData, setScheduleData] = useState(initialScheduleData);

    const [isPublished, setIsPublished] = useState(false);

    const [placeId, setPlaceId] = useState(match.params.placeId);

    useEffect(()=>{
        console.log(placeId);
        if(placeId!==undefined){
            getPlaceInfo()
        }
    },[placeId]);

    function getPlaceInfo() {
        console.log("calls");
        API.Places.getPlaceById("?full=true&p="+placeId).then(response=>{
            console.log(response);
            setAllData(response)
        }).catch(error=>{

        })
    }

    function setAllData(place){
        setPlaceInfo({
            placeId: place.placeId,
            name: place.name,
            description: place.description,
            website: place.website,
            phoneNumber: place.phoneNumber
        });

        setLocationData({city: place.city,
            address: place.address,
            country: place.country,
            latitude: place.latitude,
            longitude: place.longitude});

        setSelectedTags(place.tags);
        setSelectedCategories(place.categories);
        setScheduleData(place.schedule);
        setAllSelectedParkingData(place.parking);
        setPhotos(place.photos)
    }


    function saveChanges(){
        if(placeId === undefined){
            Promise.all([
                insertBasicPlaceInfo()
            ]).then(responses=>{
                console.log("All information was updated")
            }).catch(error=>{

            })
        }else{
            Promise.all([
                updatePlaceInfo(),
                updateTagsData(placeId),
                updatePhotoData(placeId),
                updateCategoriesData(placeId),
                updateParkingData(placeId)
            ]).then(response=>{
                console.log("Information was updated successfully!")
            }).catch(err=>{

            })
        }
    }

    function updatePlaceInfo() {
        console.log(formPlaceInfo())
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

    function formPlaceInfo(){
        return Object.assign(placeInfo, locationData)
    }

    function addPlaceId(data){
        if(data.length === 0) return data;
        return data.map(row=>{
            return row.placeId = placeId
        })
    }


    useEffect(()=>{

    },[placeId]);

    return(
        <div className={classes.root}>
            <div className={classes.content}>
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
                        scheduleData={scheduleData}
                        setScheduleData={setScheduleData}/>
                </Paper>
            </div>

            <Paper elevation={1} className={classes.bottom}>

                <FormControlLabel
                    control={<Switch checked={isPublished} onChange={()=>setIsPublished(!isPublished)} name="isPublished" />}
                    label="Publish"
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


