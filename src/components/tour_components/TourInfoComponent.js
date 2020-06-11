import React, {useEffect} from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import TextField from "@material-ui/core/TextField";
import CardContent from "@material-ui/core/CardContent";
import PropTypes from "prop-types";

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

function TourInfoComponent({classes, tourInfo, tourInfoReducer, errorInfo, setErrorInfo}) {

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
        </div>
    )
}

TourInfoComponent.propTypes = {
    tourInfo: PropTypes.object.isRequired,
    tourInfoReducer: PropTypes.func.isRequired,
};

export default withStyles(styles)(TourInfoComponent)