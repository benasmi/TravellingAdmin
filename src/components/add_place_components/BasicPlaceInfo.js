import React from "react";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import {withStyles} from "@material-ui/core";


const styles = theme => ({

});

function BasicPlaceInfo({classes, placeInfo, setPlaceInfo}) {

    const updatePlaceInfo = (event) =>{
      const {name, value} = event.target
        let place = Object.assign({}, placeInfo, {})
        place[name] = value;
       setPlaceInfo(place)
    };


    return <div>
            <Typography variant="h6" >
                Basic place information
            </Typography>
            <br/>
            <TextField
                label="Place name"
                style={{ margin: 8 }}
                placeholder="Enter the place name"
                fullWidth
                value={placeInfo['name']}
                name="name"
                onChange={e=>updatePlaceInfo(e)}
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
                name="description"
                value={placeInfo['description']}
                onChange={e=>updatePlaceInfo(e)}
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
                name="phoneNumber"
                value={placeInfo['phoneNumber']}
                onChange={e=>updatePlaceInfo(e)}
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
                name="website"
                value={placeInfo['website']}
                onChange={e=>updatePlaceInfo(e)}
                variant="outlined"
                margin="normal"
                InputLabelProps={{
                    shrink: true,
                }}
            />
        </div>
}

export default withStyles(styles)(BasicPlaceInfo)