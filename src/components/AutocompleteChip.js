
import React, {useState} from 'react';
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
})

function AutoCompleteChip(props){

    const {options, selectedOptions, setSelectedOptions, classes} = props
    const [getCurrentVal, setCurrentVal] = useState({"title": ""})
    const [viableOptions, setViableOptions] = useState(options.filter(item => !selectedOptions.includes(item)))

    function handleDelete(data) {
        setSelectedOptions(selectedOptions.filter(item => item !== data));
        setViableOptions(
            [
                ...viableOptions,
                data
            ]
        )
    }

    function handleInput(event, value){
        setCurrentVal({"title": ""})
        console.log("HandleInpust")
        setSelectedOptions(
            [
                ...selectedOptions,
                value
            ]
        )
        setViableOptions(viableOptions.filter(item => item !== value))
    }

    return(
        <div>
            <Box  className={classes.autoCompleteChipContainer}>
                {selectedOptions.length !== 0 &&
                <Box component="ul" className={classes.root}>
                    {
                        selectedOptions.map(option => {
                            return(
                                <li key={option.id}>
                                    <Chip
                                        variant="outlined"
                                        label={option.title}
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
                    options={viableOptions}
                    onChange={handleInput}
                    disableClearable
                    getOptionLabel={(option) =>  option.title}
                    renderInput={(params) => <TextField {...params} label="Enter tag name" variant="outlined" />}
                />
            </Box>
        </div>
    )
}

AutoCompleteChip.propTypes = {
    setSelectedOptions: PropTypes.func.isRequired,
    options: PropTypes.array.isRequired,
    selectedOptions: PropTypes.array.isRequired,
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(AutoCompleteChip)