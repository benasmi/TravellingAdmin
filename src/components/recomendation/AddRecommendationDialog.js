import React, {useEffect, useState} from "react";
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
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import API from "../../Networking/API";


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
    }

});

function AddRecommendationDialog({classes, open, setOpen, addCallback}){


    const {addConfig} = UseSnackbarContext();
    const {addAlertConfig} = UseAlertDialogContext();

    const [data, setData] = useState({name: "", subtitle: "", description: "", type: "1"});
    const [error, setError] = useState({name: false, subtitle: false, description: false});

    const [loading, setLoading] = useState(false)

    const dataChanged = (event) => {
        const {name, value} = event.target;
        let recData = { ...data }
        recData[name] = value
        setData(recData)
    };

    function addRecommendation(){
        if(checkErrors()){
            return
        }
        setLoading(true)
        addAlertConfig("Add new recommendation", "Are you sure you want to add this recommendation?", [{
            name: "Yes",
            action: () => {
                setLoading(true);
                API.Recommendation.createRecommendation(data).then(id=>{
                    let insertedData = { ...data }
                    insertedData.id = id
                    addConfig(true, "Recommendation added successfully")
                    addCallback(insertedData)
                    setOpen(false)
                }).catch(()=>{
                    addConfig(false, "Something went wrong. Please try again.")
                }).finally(()=>{
                    setLoading(false)
                })
            }
        }])
    }


    function checkErrors(){
        let errors = Object.assign({}, error)
        let hasErrors = false;
        for (let key in data) {
            errors[key] = data[key] === "" || data[key] === -1;
            if(errors[key] === true){
                hasErrors = true
            }
        }
        setError(errors);
        return hasErrors
    }

    function recommendationTypeChanged(event) {
        let recData = { ...data }
        recData.type = event.target.value

        setData(recData)
    }

    return(
        <Dialog
            open={open}
            fullWidth={true}
            maxWidth={"md"}
            onClose={()=>{setOpen(false)}}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            {loading ? <LinearProgress /> : null}
            <DialogTitle id="alert-dialog-title">Add new recommendation</DialogTitle>
            <DialogContent>
                <div className={classes.root}>
                    <TextField id="outlined-basic"
                               error={error.title}
                               required
                               label="Title"
                               name="name"
                               value={data['name']}
                               onChange={dataChanged}
                               variant="outlined"
                               className={classes.textField}
                    />

                    <TextField id="outlined-basic"
                               required
                               error={error.subtitle}
                               label="Subtitle"
                               name="subtitle"
                               value={data['subtitle']}
                               onChange={dataChanged}
                               variant="outlined"
                               className={classes.textField}
                    />
                    <TextField id="outlined-basic"
                               required
                               error={error.description}
                               label="Description"
                               name="description"
                               value={data['description']}
                               onChange={dataChanged}
                               variant="outlined"
                               className={classes.textField}
                    />

                    <FormControl component="fieldset" style={{marginTop: 32}}>
                        <FormLabel component="legend">Recommendation type</FormLabel>
                        <RadioGroup aria-label="rec" name="rec1" value={data.type} onChange={recommendationTypeChanged}>
                            <FormControlLabel value="1" control={<Radio />} label="Places recommendation" />
                            <FormControlLabel value="2" control={<Radio />} label="Tours recommendation" />
                        </RadioGroup>
                    </FormControl>
                </div>

            </DialogContent>
            <DialogActions>
                <Button onClick={()=>setOpen(false)}
                        color="primary">
                    Close
                </Button>
                <Button
                    color="primary"
                    onClick={()=>{
                        addRecommendation()
                    }}
                >
                    Create recommendation
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default withStyles(styles)(AddRecommendationDialog)
