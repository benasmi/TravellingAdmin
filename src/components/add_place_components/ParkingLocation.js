import React, {useEffect} from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import CustomMap from "../CustomMap";
import API from "../../Networking/API";
import {arrayMove, SortableContainer, SortableElement} from 'react-sortable-hoc';
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete"

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

function ParkingLocation({classes, parkingMarkerData, setParkingMarkerData, allSelectedParkingData, setAllSelectedParkingData}) {

    const onSortEnd = ({oldIndex, newIndex}) => {
        setAllSelectedParkingData(arrayMove(allSelectedParkingData,oldIndex, newIndex))
    };

    function changedParkingMarkerCallback(city,address,country,lat,lng, parkingDataChanged) {
        getClosestParking(parseFloat(lat),parseFloat(lng), parkingDataChanged);
    }

    function addNewParking(markerData){
        markerData.latitude = markerData.lat;
        markerData.longitude = markerData.lng;
        API.Parking.insertNewParking([markerData]).then(response=>{
            setAllSelectedParkingData(oldArray=>[...oldArray, response[0]])
        }).catch(error=>{
            console.log(error);
        })
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
        getClosestParking(parkingMarkerData.lat, parkingMarkerData.lng)
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
}

export default withStyles(styles)(ParkingLocation)