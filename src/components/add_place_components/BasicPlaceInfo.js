import React, {useState} from "react";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import {withStyles} from "@material-ui/core";
import Slider from "@material-ui/core/Slider";
import {priceRange} from "../../helpers/priceRange";
import {averageTimeSpent} from "../../helpers/averageTimeSpent"
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";


const styles = theme => ({

});

function BasicPlaceInfo({classes, placeInfo, setPlaceInfo}) {

    const updatePlaceInfo = (event) =>{
        console.log("s")
      const {name, value} = event.target;
        let place = Object.assign({}, placeInfo, {})
        place[name] = value;
       setPlaceInfo(place)
    };

    const [hasPrice, setHasPrice] = useState(false);
    const [hasAverageTime, setHasAverageTime] = useState(false);

    function valuetext(value) {
        return `${value}°C`;
    }

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
        <TextField
            label="Source"
            style={{ margin: 8 }}
            placeholder="Enter information source"
            fullWidth
            name="source"
            value={placeInfo['source']}
            onChange={e=>updatePlaceInfo(e)}
            variant="outlined"
            margin="normal"
            InputLabelProps={{
                shrink: true,
            }}
        />

            <br/>
            <br/>
            <div style={{display: "flex"}}>
                <FormControlLabel
                    control={
                        <Switch
                            checked={hasPrice}
                            onChange={()=>{setHasPrice(old=>!old)}}
                            name="price"
                            color="primary"
                        />
                    }
                    label="Price"
                    labelPlacement="start"
                />

                <Slider
                    onChange={(e)=>updatePlaceInfo(e)}
                    name="price"
                    disabled={!hasPrice}
                    style={{width: "60%", marginLeft: "48px"}}
                    defaultValue={0}
                    getAriaValueText={valuetext}
                    aria-labelledby="discrete-slider-always"
                    step={25}
                    marks={priceRange}
                />
            </div>
            <br/>
            <br/>
            <div style={{display: "flex"}}>
            <FormControlLabel
                control={
                    <Switch
                        checked={hasAverageTime}
                        onChange={()=>setHasAverageTime(old=>{
                           return !old
                        })}
                        name="checkedB"
                        color="primary"
                    />
                }
                label="Average time Spent"
                labelPlacement="start"
            />

            <Slider
                onChange={(e)=>updatePlaceInfo(e)}
                name="averageTimeSpent"
                disabled={!hasAverageTime}
                style={{width: "60%", marginLeft: "48px"}}
                defaultValue={30}
                getAriaValueText={(value)=>{return value}}
                aria-labelledby="discrete-slider-always"
                step={30}
                max={260}
                min={30}
                valueLabelDisplay="auto"
                marks={averageTimeSpent}

            />
        </div>


        </div>
}

export default withStyles(styles)(BasicPlaceInfo)