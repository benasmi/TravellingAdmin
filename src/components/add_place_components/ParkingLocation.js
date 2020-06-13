import React, {useCallback, useEffect, useRef, useState} from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import CustomMap from "../CustomMap";
import API from "../../Networking/API";
import {arrayMove, SortableContainer, SortableElement} from 'react-sortable-hoc';
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete"
import UseSnackbarContext from "../../contexts/UseSnackbarContext";
import Button from "@material-ui/core/Button";
import Alert from "@material-ui/lab/Alert";

const styles = theme => ({
    outline: {
        margin: theme.spacing(1),
        padding: theme.spacing(1),
        width: '100%'
    },
    button: {
        margin: theme.spacing(2)
    },
    paper:{
        padding: theme.spacing(2),
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: "8px"
    },
});

function ParkingLocation({classes, parkingMarkerData, setParkingMarkerData, allSelectedParkingData, setAllSelectedParkingData, placeInfo}) {
    const { addConfig } = UseSnackbarContext();

    const onSortEnd = ({oldIndex, newIndex}) => {
        setAllSelectedParkingData(arrayMove(allSelectedParkingData,oldIndex, newIndex))
    };

    function changedParkingMarkerCallback(city,address,country,lat,lng, parkingDataChanged) {
        getClosestParking(parseFloat(lat),parseFloat(lng), parkingDataChanged);
    }

    function addNewParking(markerData){
        if(!parkingExists(markerData)){
            API.Parking.insertNewParking([markerData]).then(response=>{
                setAllSelectedParkingData(oldArray=> [...oldArray, response[0]]);
                addConfig(true)
            }).catch(error=>{
                addConfig(false)
            })
        }
    }

    function parkingExists(markerData){
        for(let i = 0; i<allSelectedParkingData.length; i++){
            if(allSelectedParkingData[i].address === markerData.address){
                addConfig(false, "This parking is already attached!");
                return true;
            }
        }
        return false
    }

    const getClosestParking = (lat, lng, parkingDataChanged)=>{
        API.Parking.getParkingByLocation("?lat="+lat+"&lng="+lng).then(response=>{
            let placesData = [];
            response.map(row => {
                placesData.push(row)
            });
            parkingDataChanged(response);
        }).catch(error=>{
        })
    };

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

    useEffect(()=>{
        getClosestParking(parkingMarkerData.latitude, parkingMarkerData.longitude)
    },[]);

    const SortableList = SortableContainer(({items}) => {
        return (
            <ul>
                {items.map((value, index) => (
                <SortableItem key={index} index={index} value={value} />
                ))}
            </ul>
        );
    });

    return <div>
        <Typography variant="h6" >
            Add parking
        </Typography>
        <br/>
        <Typography variant="subtitle1" >
            Select parking
        </Typography>
        <CustomMap mapHeight={350}
                   initialLock={placeInfo['placeId'] !== ""}
                   locationData={parkingMarkerData}
                   setLocationData={setParkingMarkerData}
                   selectedParkingCallback={(location)=>{
                       if(!parkingExists(location)){
                           setAllSelectedParkingData(oldArray=> [...oldArray, location])
                       }
                       }}
                   changedParkingMarkerCallback={changedParkingMarkerCallback}
                   addParkingCallback={addNewParking}
        />
        <br/>
        <Typography variant="subtitle1" >
            Selected parking locations
        </Typography>
        {allSelectedParkingData.length === 0 ? <Alert severity="error">
            This place has no selected parking! To select parking for this place do the following:
            <br/>
            1. Select your current location or any other location
            <br/>
            2. Select already existing nearby parking locations and click add
            <br/>
            3. If none of the location is valid, click on the orange marker and add new parking
            </Alert> :
            <SortableList pressDelay={200} disableAutoscroll={false} items={allSelectedParkingData} onSortEnd={onSortEnd} />
        }


    </div>
}

export default withStyles(styles)(ParkingLocation)