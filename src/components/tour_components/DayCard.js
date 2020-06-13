import {withStyles} from "@material-ui/core/styles";
import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import Radio from "@material-ui/core/Radio";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import CardHeader from "@material-ui/core/CardHeader";
import IconButton from "@material-ui/core/IconButton";
import RemoveIcon from '@material-ui/icons/Remove';
import Button from "@material-ui/core/Button";


const styles = theme => ({
    root: {
        display: "flex",
        margin: theme.spacing(1)
    },
    radioButtonArea: {
    },
    cardArea: {
        flex: 1,
        display: "flex"
    },
    content: {
        flex: '1 1 auto',
    },
    descriptionInput: {
        marginTop: theme.spacing(2),
        width: "100%",
        height: "auto"
    },
    headerWrap: {}
})

function DayCard({classes, onSelectCallback, index, currentDay, tourInfoReducer, description, handleRemoveDay}) {

    const updateDescriptionGlobally = (e) => {
        tourInfoReducer({
            type: 'UPDATE_DAY',
            day: index,
            data: {
                description: e
            }
        })
    }

    return (
        <div className={classes.root}>
            <div className={classes.radioButtonArea}>
                <Radio checked={index === currentDay} onChange={(e) => {
                    onSelectCallback(index)
                }}/>
            </div>
            <Card className={classes.cardArea}>
                <CardContent className={classes.content}>
                    <Typography component="h5" variant="h5">
                        Day {index + 1}
                    </Typography>

                    <TextField
                        className={classes.descriptionInput}
                        multiline
                        label="Description"
                        value={description}
                        variant="outlined"
                        onChange={(e) => {
                            updateDescriptionGlobally(e.target.value)
                        }}
                    />
                </CardContent>
                <CardHeader
                    action={
                        <Button startIcon={<RemoveIcon/>} aria-label="remove" onClick={() => handleRemoveDay(index)}/>
                    }
                />
            </Card>
        </div>
    )
}

DayCard.propTypes = {
    onSelectCallback: PropTypes.func.isRequired,
    tourInfoReducer: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    currentDay: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
};

export default withStyles(styles)(DayCard)
