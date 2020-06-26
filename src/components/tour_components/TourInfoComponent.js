import React, {useEffect} from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import TextField from "@material-ui/core/TextField";
import CardContent from "@material-ui/core/CardContent";
import PropTypes from "prop-types";
import AutoCompleteChip from "../AutocompleteChip";
import Typography from "@material-ui/core/Typography";

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
    }
});

function TourInfoComponent({classes, tourInfo, tourInfoReducer, errorInfo, setErrorInfo, availableTags, selectedTags, setSelectedTags, setAvailableTags}) {

    const handleDescriptionChange = (e) => {
        tourInfoReducer({
            type: '<CustomControlsManager position={window.google.maps.ControlPosition.TOP_CENTER}>\n' +
                '            <div>\n' +
                '                <Button variant="contained"\n' +
                '                        color="primary"\n' +
                '                        onClick={() => {\n' +
                '                            setCenter({\n' +
                '                                lat: refMap.current.getCenter().lat(),\n' +
                '                                lng: refMap.current.getCenter().lng()\n' +
                '                            })\n' +
                '                        }}\n' +
                '                >\n' +
                '                    Search area...\n' +
                '                </Button>\n' +
                '            </div>\n' +
                '        </CustomControlsManager>UPDATE_TOUR',
            data: {description: e.target.value}
        })
    }
    const handleTitleChange = (e) => {
        tourInfoReducer({
            type: 'UPDATE_TOUR',
            data:  {name: e.target.value}
        })
    }

    useEffect(() => {
        console.log("TAGAI", availableTags)
    }, [availableTags])

    useEffect(()=>{
        if(tourInfo.name === "")
            setErrorInfo(state => {return {...state, errors: {...state.errors, titleMissing: true}}})
        else
            setErrorInfo(state => {return {...state, errors: {...state.errors, titleMissing: false}}})
    }, [tourInfo.name])

    let shouldDisplayTitleMissingError = errorInfo.showErrors && errorInfo.errors.titleMissing

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
                Tags for this tour
            </Typography>
            <AutoCompleteChip
                options={availableTags}
                id="tagId"
                setOptions={setAvailableTags}
                setSelectedOptions={setSelectedTags}
                selectedOptions={selectedTags}
            />
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