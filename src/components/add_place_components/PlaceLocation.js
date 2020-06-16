import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import PlaceMap from "../maps/PlaceMap";


const styles = theme => ({
    outline: {
        margin: theme.spacing(1),
        padding: theme.spacing(1),
        width: '100%'
    },
    button: {
        margin: theme.spacing(2)
    }
});

function PlaceLocation({locationData, setLocationData, placeInfo}) {

    function changeLocationData(event){
        const {name, value} = event.target;
        let data = Object.assign({}, locationData, {});
        data[name] = value;

        setLocationData(data)
    }

    return <div>
        <Typography variant="h6" >
            Place location
        </Typography>
        <br/>
        <Typography variant="subtitle1" >
            Select place location from map
        </Typography>
        <br/>
        <PlaceMap
            placeInfo={placeInfo}
            locationMarker={locationData}
            setLocationMarker={setLocationData}
        />
        <br/>
        <br/>
        <Typography variant="subtitle1" >
            Place location
        </Typography>
        <br/>
        <TextField
            required
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
            required
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
            required
            label="County"
            disabled
            style={{ margin: 8 }}
            placeholder="Enter place county"
            fullWidth
            value={locationData['county']}
            name='county'
            onChange={e=>{changeLocationData(e)}}
            variant="outlined"
            margin="normal"
            InputLabelProps={{
                shrink: true,
            }}
        />
        <TextField
            required
            label="Municipality"
            disabled
            style={{ margin: 8 }}
            placeholder="Enter place municipality"
            fullWidth
            value={locationData['municipality']}
            name='municipality'
            onChange={e=>{changeLocationData(e)}}
            variant="outlined"
            margin="normal"
            InputLabelProps={{
                shrink: true,
            }}
        />
        <TextField
            required
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
    </div>
}

export default withStyles(styles)(PlaceLocation)