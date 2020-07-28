import React, {useContext, useEffect, useState} from "react";
import UseSnackbarContext from "../../contexts/UseSnackbarContext";
import UseAlertDialogContext from "../../contexts/UseAlertDialogContext";
import Dialog from "@material-ui/core/Dialog";
import LinearProgress from "@material-ui/core/LinearProgress";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import withStyles from "@material-ui/core/styles/withStyles";
import {arrayMove, SortableContainer, SortableElement} from "react-sortable-hoc";
import ApiPlaceCard from "../ApiPlaceCard";
import Alert from "@material-ui/lab/Alert";
import {EditRecommendationContext} from "../../contexts/EditRecommendationContext";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from '@material-ui/icons/Delete';
import API from "../../Networking/API";
import {func} from "prop-types";

const styles = theme => ({
    root: {
        margin: theme.spacing(2),
        display: "flex",
        flexDirection: "column"
    },
    textField:{
        marginTop: 16
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    recommendedPlaceCard: {
        width: 300,
        height: 300,
        padding: 16,
        display: "flex",
        flexDirection: 'column',
        alignContent: 'flex-end',
        zIndex: 999999
    }

});

const RecommendationPlaceSortable = SortableElement(({classes, place, removeObjectFromRecommendation}) => (
    <div className={classes.recommendedPlaceCard}>
        <ApiPlaceCard
            placeData={place}
            renderActionArea={() => {
                return (
                    <div>
                        <IconButton aria-label="delete" onClick={()=>removeObjectFromRecommendation(place.id)}>
                            <DeleteIcon color="secondary" fontSize="small" />
                        </IconButton>
                    </div>
                )
            }
            }
        />
    </div>)
)

const RecommendationPlaceSortableContainer = SortableContainer(({classes, config, removeObjectFromRecommendation}) => {
    return (
        <div style={{display:"flex", flexDirection: "row"}}>
            {config.currentlyEditing.objects.length > 0 ?

                config.currentlyEditing.objects.map((place, index)=>{
                    delete place.description

                    return <RecommendationPlaceSortable
                        classes={classes}
                        removeObjectFromRecommendation={removeObjectFromRecommendation}
                        key={place.id}
                        index={index}
                        place={place}
                    />
                }) :

                <Alert severity="info">This recommendation does not have any objects attached. You can attach
                    Places or Tours by browsing in Places and Tours tables
                </Alert>
            }

        </div>
    )
});

function EditRecommendationDialog({classes}){


    const {addConfig} = UseSnackbarContext();
    const {addAlertConfig} = UseAlertDialogContext();

    const { config, setRecommendation, finishEditing, removeRecommendation } = useContext(EditRecommendationContext)

    const [loading, setLoading] = useState(false)

    const dataChanged = (event) => {
        const {name, value} = event.target;
        let recData = {...config.currentlyEditing}
        recData[name] = value

        setRecommendation(recData)
    };

    const onSortEnd = ({oldIndex, newIndex}) => {
        console.log("OnSortEnd")
        let data = { ...config.currentlyEditing }
        data.objects = arrayMove(data.objects, oldIndex, newIndex)

        setRecommendation(data)
    }

    function removeObjectFromRecommendation(placeId) {
        addAlertConfig("Remove object from recommendation", "Are you sure you want to remove this object from recommendation?", [{
            name: "Yes",
            action: () => {
                setLoading(true)
                API.Recommendation.removePlaceFromRecommendation(
                    {id: placeId,
                        recommendationId: config.currentlyEditing.id,
                        type: config.currentlyEditing.type}
                ).then(()=>{
                    addConfig(true, "Object removed from recommendation")
                    finishEditing(true, placeId)
                }).catch(()=>{
                    addConfig(false, "Something went wrong!")
                }).finally(()=>{
                    setLoading(false)
                })
            }
        }])

    }

    function deleteRecommendation(){
        addAlertConfig("Remove recommendation", "Are you sure you want to remove this recommendation?", [{
            name: "Yes",
            action: () => {
                setLoading(true);
                API.Recommendation.removeRecommendation(config.currentlyEditing.id).then(()=>{
                    addConfig(true, "Removed recommendation successfully")
                    removeRecommendation()
                }).catch(()=>{
                    addConfig(false, "Something went wrong. Please try again!")
                }).finally(()=>{
                    setLoading(false)
                })
            }
        }])
    }

    function constructRecommendationForUpdate(){
        let rec = { ...config.currentlyEditing }
        const objects = []
        config.currentlyEditing.objects.map(row=>{
            objects.push({id: row.id, type: rec.type})
        })

        rec.objects = objects

        return rec
    }


    function editRecommendation(){
        addAlertConfig("Edit recommendation", "Are you sure you want to edit this recommendation?", [{
            name: "Yes",
            action: () => {
                setLoading(true);
                const rec = constructRecommendationForUpdate()
                API.Recommendation.updateRecommendation(rec).then(()=>{
                    addConfig(true, "Updated recommendation successfuly")
                    finishEditing(true)
                }).catch(()=>{
                    addConfig(false, "Something went wrong. Please try again!")
                }).finally(()=>{
                    setLoading(false)
                })
            }
        }])
    }


    return(
        <Dialog
            open={config.open}
            fullWidth={true}
            maxWidth={"md"}
            onClose={()=>{
                finishEditing()
            }}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            {loading ? <LinearProgress /> : null}
            <DialogTitle id="alert-dialog-title">Edit recommendation</DialogTitle>
            <DialogContent>
                {config.currentlyEditing !== undefined ? <div className={classes.root}>
                    <TextField id="outlined-basic"
                               required
                               label="Title"
                               name="name"
                               value={config.currentlyEditing['name']}
                               onChange={dataChanged}
                               variant="outlined"
                               className={classes.textField}
                    />

                    <TextField id="outlined-basic"
                               required
                               label="Subtitle"
                               name="subtitle"
                               value={config.currentlyEditing['subtitle']}
                               onChange={dataChanged}
                               variant="outlined"
                               className={classes.textField}
                    />
                    <TextField id="outlined-basic"
                               required
                               label="Description"
                               name="description"
                               value={config.currentlyEditing['description']}
                               onChange={dataChanged}
                               variant="outlined"
                               className={classes.textField}
                    />

                    <div style={{display: "flex", flexDirection: 'row', overflowX: 'auto', width: '100%'}}>
                        <RecommendationPlaceSortableContainer
                            removeObjectFromRecommendation={removeObjectFromRecommendation}
                            classes={classes}
                            config={config}
                            axis={'xy'}
                            pressDelay={200}
                            disableAutoscroll={false}
                            onSortEnd={onSortEnd}/>
                    </div>
                </div> : null }

            </DialogContent>
            <DialogActions>
                <Button onClick={()=>finishEditing()}
                        color="primary">
                    Close
                </Button>

                <Button
                    color="primary"
                    onClick={()=>{
                        editRecommendation()
                    }}
                >
                    Save
                </Button>

                <Button
                    variant="contained"
                    color="secondary"
                    onClick={()=>{
                        deleteRecommendation()
                    }}
                >
                    Delete recommendation
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default withStyles(styles)(EditRecommendationDialog)