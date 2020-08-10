import React, {useEffect} from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import TextField from "@material-ui/core/TextField";
import PropTypes from "prop-types";
import AutoCompleteChip from "../AutocompleteChip";
import Typography from "@material-ui/core/Typography";
import green from "@material-ui/core/colors/green";
import Button from "@material-ui/core/Button";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

const styles = theme => ({
    root: {
        margin: theme.spacing(4),
    },
    nameField: {
        width: "100%"
    },
    descriptionField: {
        marginTop: theme.spacing(2),
        width: "100%",
        height: "auto"
    },
    publicityDiv: {
        width: "100%",

    },
    button: {
        margin: theme.spacing(2),
        color: "#ffffff"
    },
});

function TourInfoComponent({classes, tourInfo, tourInfoReducer, errorInfo, setErrorInfo, availableCategories, selectedCategories, setSelectedCategories, setAvailableCategories, tourId}) {

    const handleDescriptionChange = (e) => {
        tourInfoReducer({
            type: 'UPDATE_TOUR',
            data: {description: e.target.value}
        })
    }
    const handleTitleChange = (e) => {
        tourInfoReducer({
            type: 'UPDATE_TOUR',
            data:  {name: e.target.value}
        })
    }

    useEffect(()=>{
        if(tourInfo.name === "")
            setErrorInfo(state => {return {...state, errors: {...state.errors, titleMissing: true}}})
        else
            setErrorInfo(state => {return {...state, errors: {...state.errors, titleMissing: false}}})
    }, [tourInfo.name])

    let shouldDisplayTitleMissingError = errorInfo.showErrors && errorInfo.errors.titleMissing

    const verifyTour = () => {
        tourInfoReducer({
            type: 'UPDATE_TOUR',
            data:  {isVerified: true}
        })
    }

    const publishTour = () => {
        tourInfoReducer({
            type: 'UPDATE_TOUR',
            data:  {isPublished: !tourInfo.isPublished}
        })

    }

    const ColorButton = withStyles((theme) => ({
        root: {
            color: "white",
            backgroundColor: green[500],
            '&:hover': {
                backgroundColor: green[700],
            },
        },
    }))(Button);


    return (
        <div className={classes.root}>
            <TextField label="Tour name"
                       variant="outlined"
                       error={shouldDisplayTitleMissingError}
                       helperText={shouldDisplayTitleMissingError ? "Please provide a title for your tour" : ""}
                       value={tourInfo.name}
                       onChange={handleTitleChange}
                       defaultValue="My tour name" className={classes.nameField}/>
            <TextField
                className={classes.descriptionField}
                multiline
                label="Description"
                value={tourInfo.description}
                variant="outlined"
                onChange={handleDescriptionChange}
            />
            <br/><br/>
            <Typography component="h6" variant="h6">
                Categories for this tour
            </Typography>
            <AutoCompleteChip
                options={availableCategories}
                id="categoryId"
                setOptions={setAvailableCategories}
                setSelectedOptions={setSelectedCategories}
                selectedOptions={selectedCategories}
            />

            {tourId !== undefined &&
                <div className={classes.publicityDiv}>
                    {tourInfo.isVerified ?
                        <div>
                            <FormControlLabel
                                control={<Switch checked={tourInfo.isPublished} onChange={publishTour} name="isPublic"/>}
                                label="Make this tour public?"
                            />
                        </div>
                        :
                    <ColorButton
                        variant="contained"
                        color="primary"
                        onClick={verifyTour}
                        className={classes.button}
                    >
                        Verify tour
                    </ColorButton>
                    }


                </div>
            }

        </div>
    )
}

TourInfoComponent.propTypes = {
    tourInfo: PropTypes.object.isRequired,
    tourInfoReducer: PropTypes.func.isRequired,
    availableTags: PropTypes.array.isRequired,
    setAvailableTags: PropTypes.func.isRequired,
    selectedTags: PropTypes.array.isRequired,
    setSelectedTags: PropTypes.func.isRequired,
};

export default withStyles(styles)(TourInfoComponent)