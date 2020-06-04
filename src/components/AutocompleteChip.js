
import React, {useEffect, useState} from 'react';
import TextField from "@material-ui/core/TextField";
import Autocomplete from '@material-ui/lab/Autocomplete';
import Paper from "@material-ui/core/Paper";
import {withStyles} from "@material-ui/core/styles";
import PropTypes from "prop-types";
import Chip from "@material-ui/core/Chip";
import Box from "@material-ui/core/Box";

const styles = theme => ({
    autoComplete: {
        margin: theme.spacing(1)
    },
    chip: {
        margin: theme.spacing(0.5),
    },
    root: {
        display: 'flex',
        justifyContent: 'left',
        flexWrap: 'wrap',
        listStyle: 'none',
        padding: theme.spacing(1),
        margin: 0,
    },
    autoCompleteChipContainer: {
        padding: theme.spacing(1)
    }
});

function AutoCompleteChip(props){

    const {options, setOptions, selectedOptions, setSelectedOptions, classes, label, id} = props;
    const [getCurrentVal, setCurrentVal] = useState({"name": ""});
    const [firstLoad, setFirstLoad] = useState(true);

    function handleDelete(data) {
        setSelectedOptions(selectedOptions.filter(item => item !== data));
        setOptions(
            [
                ...options,
                data
            ]
        )
    }

    useEffect(()=>{
        if(firstLoad && options.length>0){
            let data = [];
            options.map(row=>{
                let found = false;
                selectedOptions.map(row1=>{
                    if(JSON.stringify(row) === JSON.stringify(row1)){
                        found = true
                    }
                });
                if(!found){
                   data.push(row)
                }
            });
            setOptions(data);
            setFirstLoad(false)
        }
    },[options]);

    function handleInput(event, value){
        setCurrentVal({"name": ""});
        setSelectedOptions(
            [
                ...selectedOptions,
                value
            ]
        );
        setOptions(options.filter(item => item !== value))
    }

    return(
        <div>
            <Box  className={classes.autoCompleteChipContainer}>
                {selectedOptions.length !== 0 &&
                <Box component="ul" className={classes.root}>
                    {
                        selectedOptions.map(option => {
                            return(
                                <li key={option[id]}>
                                    <Chip
                                        variant="outlined"
                                        label={option.name}
                                        onDelete={() => handleDelete(option)}
                                        className={classes.chip}
                                    />
                                </li>
                            )
                        })
                    }
                </Box>
                }

                <Autocomplete
                    className={classes.autoComplete}
                    value={getCurrentVal}
                    options={options}
                    onChange={handleInput}
                    disableClearable
                    getOptionLabel={(option) =>  option.name}
                    renderInput={(params) => <TextField {...params} label={label} variant="outlined" />}
                />
            </Box>
        </div>
    )
}

AutoCompleteChip.propTypes = {
    setSelectedOptions: PropTypes.func.isRequired,
    options: PropTypes.array.isRequired,
    setOptions: PropTypes.func.isRequired,
    selectedOptions: PropTypes.array.isRequired,
    classes: PropTypes.object.isRequired,
    label: PropTypes.string.isRequired
};

export default withStyles(styles)(AutoCompleteChip)