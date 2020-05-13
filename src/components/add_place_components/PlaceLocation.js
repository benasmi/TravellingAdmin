import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import CustomMap from "../CustomMap";
import TextField from "@material-ui/core/TextField";


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

function PlaceLocation({locationData, setLocationData}) {

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
    </div>
}

export default withStyles(styles)(PlaceLocation)