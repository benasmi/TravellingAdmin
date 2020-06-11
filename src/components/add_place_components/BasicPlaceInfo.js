import React, {useEffect, useState} from "react";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import {withStyles} from "@material-ui/core";
import Slider from "@material-ui/core/Slider";
import {priceRange} from "../../helpers/priceRange";
import {averageTimeSpent} from "../../helpers/averageTimeSpent"
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import AutoCompleteChip from "../AutocompleteChip";
import API from "../../Networking/API";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import AddSourceDialog from "../AddSourceDialog";


const styles = theme => ({});
let previousPrice = "";

function BasicPlaceInfo({classes, placeInfo, setPlaceInfo, selectedSources, setSelectedSources}) {

    const updatePlaceInfo = (event, newValue) => {
        const {name, value, id} = event.target;
        let place = Object.assign({}, placeInfo, {});
        if (id !== "") {
            place[id] = valuetext(newValue[0]);
        } else {
            place[name] = value
        }
        console.log("Updated place", place);
        setPlaceInfo(place)
    };

    const getSources = () =>{
        API.Source.getSources().then(response=>{
            setAvailableSources(response)
        }).catch(error=>{

        })
    };

    const handleAddSource = (name, url) =>{
        API.Source.addSource({name: name, url: url}).then(response=>{
            setAvailableSources(
                [
                    ...availableSources,
                    response
                ]
            );
            setSelectedSources([
                ...selectedSources,
                response
            ]);
        }).catch(error=>{
            console.log(error)
        })
    };

    useEffect(()=>{
        getSources()
    },[]);


    const [dialogOpen, setDialogOpen] = useState(false);
    const [availableSources, setAvailableSources] = useState([]);

    function valuetext(value) {
        let val = "";
        priceRange.map(row => {
            if (row.value === value)
                val = row.label
        });
        return val
    }

    return <div>
        <Typography variant="h6">
            Basic place information
        </Typography>
        <br/>
        <TextField
            required
            label="Place name"
            style={{margin: 8}}
            placeholder="Enter the place name"
            fullWidth
            value={placeInfo['name']}
            name="name"
            onChange={e => updatePlaceInfo(e)}
            variant="outlined"
            margin="normal"
            InputLabelProps={{
                shrink: true,
            }}
        />
        <TextField
            label="Place description"
            style={{margin: 8}}
            placeholder="Describe the place thoroughly"
            fullWidth
            multiline
            name="description"
            value={placeInfo['description']}
            onChange={e => updatePlaceInfo(e)}
            variant="outlined"
            rows={4}
            margin="normal"
            InputLabelProps={{
                shrink: true,
            }}
        />
        <TextField
            label="Phone number"
            style={{margin: 8}}
            placeholder="Enter phone number"
            fullWidth
            name="phoneNumber"
            value={placeInfo['phoneNumber']}
            onChange={e => updatePlaceInfo(e)}
            variant="outlined"
            margin="normal"
            InputLabelProps={{
                shrink: true,
            }}
        />
        <TextField
            label="Website"
            style={{margin: 8}}
            placeholder="Enter website"
            fullWidth
            name="website"
            value={placeInfo['website']}
            onChange={e => updatePlaceInfo(e)}
            variant="outlined"
            margin="normal"
            InputLabelProps={{
                shrink: true,
            }}
        />

        <br/>
        <br/>
       <AutoCompleteChip
                id="source"
                label="Select sources"
                options={availableSources}
                setOptions={setAvailableSources}
                setSelectedOptions={setSelectedSources}
                selectedOptions={selectedSources}
       />
        <Button
            variant="text"
            color="primary"
            size="small"
            className={classes.button}
            onClick={() => setDialogOpen(true)}
            startIcon={<AddIcon />}>
            Add missing source
        </Button>
        <AddSourceDialog
            action={handleAddSource}
            open={dialogOpen}
            setDialogOpen={setDialogOpen}
        />

        <br/>
        <br/>
        <br/>
        <br/>
        <div style={{display: "flex"}}>
            <Typography>
                Price
            </Typography>
            <Slider
                id="price"
                onChange={updatePlaceInfo}
                value={priceRange.map(row => {
                    if (row.label === placeInfo['price']) return row.value
                })}
                style={{width: "60%", marginLeft: "48px"}}
                defaultValue={0}
                getAriaValueText={valuetext}
                aria-labelledby="discrete-slider-always"
                step={25}
                max={125}
                marks={priceRange}
            />
        </div>
        <br/>
        <br/>
        <div style={{display: "flex"}}>
            <Typography>
                Average time spent
            </Typography>
            <FormControl variant="outlined" style={{width: "60%", marginLeft: "48px"}}>
                <InputLabel>Minutes</InputLabel>
                <Select
                    native
                    value={parseInt(placeInfo['averageTimeSpent'], 10)}
                    onChange={updatePlaceInfo}
                    label="Average Time spent"
                    inputProps={{
                        name: 'averageTimeSpent'
                    }}
                >
                    <option value="-1">None</option>
                    {
                        averageTimeSpent.map(row=>{
                            return <option value={parseInt(row.value, 10)}> {row.value}</option>
                        })
                    }
                </Select>
            </FormControl>
        </div>
    </div>
}

export default withStyles(styles)(BasicPlaceInfo)