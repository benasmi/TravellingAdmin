import React, {Fragment, useEffect, useState} from "react";
import Typography from "@material-ui/core/Typography";
import {withStyles} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import ApiPlaceCard from "../ApiPlaceCard";
import Paper from "@material-ui/core/Paper";
import {arrayMove, SortableContainer, SortableElement} from "react-sortable-hoc";
import Alert from "@material-ui/lab/Alert";
import Chip from "@material-ui/core/Chip";


const styles = theme => ({
    paperContent: {
        marginTop: theme.spacing(4),
        width: "100%",
        padding: theme.spacing(2)
    },
});

export const RecommendationType = {
    place: 1,
    tour: 2
}

function Recommendation({classes, recommendation, onEditCallback}) {

    return <Paper elevation = {4} className={classes.paperContent}>
            <Chip
                label={recommendation.type === 1 ? "Place recommendation" : "Tour recommendation"} />
            <Typography variant="h6">
                {recommendation.name}
            </Typography>
            <Typography variant="subtitle1">
                {recommendation.subtitle}
            </Typography>

            <div style={{display: "flex", flexDirection: 'row', overflowX: 'auto', width: '100%'}}>
                <div style={{display:"flex", flexDirection: "row"}}>
                    {recommendation.objects.length > 0 ?

                        recommendation.objects.map((place, index)=>{
                            delete place.description

                            return <div style={{width: 300, padding: 16}}>
                                <ApiPlaceCard placeData={place}/>
                            </div>
                        }) :

                        <Alert severity="info">This recommendation does not have any objects attached. You can attach
                            Places or Tours by browsing in Places and Tours tables
                        </Alert>
                    }

                </div>
            </div>

        <Fragment>
            <Button
                style={{marginTop: 16}}
                variant="outlined"
                color="primary"
                onClick={() => onEditCallback()}
                className={classes.button}>
                Edit
            </Button>
        </Fragment>

        </Paper>


}

export default withStyles(styles)(Recommendation)