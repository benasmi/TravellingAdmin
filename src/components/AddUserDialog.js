import React, {useEffect, useState} from "react";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from "@material-ui/core/Typography";
import AutoCompleteChip from "./AutocompleteChip";
import API from "../Networking/API";
import UseSnackbarContext from "../contexts/UseSnackbarContext";
import UseAlertDialogContext from "../contexts/UseAlertDialogContext";
import Strings from "../helpers/stringResources";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import withStyles from "@material-ui/core/styles/withStyles";
import Divider from "@material-ui/core/Divider";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import {averageTimeSpent} from "../helpers/averageTimeSpent";
import Alert from "@material-ui/lab/Alert";
import FormLabel from "@material-ui/core/FormLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import LinearProgress from "@material-ui/core/LinearProgress";
import {load} from "dotenv";

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

function AddUserDialog({classes, open, setOpen, availableRoles}){


    const {addConfig} = UseSnackbarContext();
    const {addAlertConfig} = UseAlertDialogContext();

    const [user, setUser] = useState({name: "", surname: "", password: "", email: "", role: -1});
    const [error, setError] = useState({name: false, surname: false, password: false, email: false, role: false});

    const [loading, setLoading] = useState(false)

    const userDataChanged = (event) => {
        const {name, value} = event.target;
        let userData = Object.assign({}, user);
        userData[name] = value
        setUser(userData)
    };

    function parseRoleFromId(id){
        return availableRoles.map(row=>{
            if(row.roleId===id){
                return  row.role + " - " + row.description
            }
        })
    }

    function checkErrors(){
        let errors = Object.assign({}, error)
        let hasErrors = false;
        for (let key in user) {
            errors[key] = user[key] === "" || user[key] === -1;
            if(errors[key] === true){
                hasErrors = true
            }
        }
        setError(errors);
        return hasErrors
    }

    function addUser(){
        if(checkErrors()){
            return
        }
        addAlertConfig("Add new editor", "Are you sure you want to add new editor?. This user has role: " + parseRoleFromId(user.role), [{
            name: "Yes",
            action: () => {
                setLoading(true);
                API.Auth.register(user).then(userId=>{
                    API.User.setRoles({userId: userId, roles: [user.role]}).then(response=>{
                        addConfig(true, "User was added successfully!")
                        setOpen(false);
                        setLoading(false)
                    }).catch(error=>{
                        setOpen(false);
                        addConfig(false, "Could not map user permissions!");
                        setLoading(false)
                    })
                }).catch(error=>{
                    addConfig(false, error.message);
                    setLoading(false)
                })
            }
        }])
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
            <DialogTitle id="alert-dialog-title">Add new editor</DialogTitle>
            <DialogContent>
                    <div className={classes.root}>
                        <TextField id="outlined-basic"
                                   error={error.name}
                                   required
                                   label="Name"
                                   name="name"
                                   value={user['name']}
                                   onChange={userDataChanged}
                                   variant="outlined"
                                   className={classes.textField}
                        />

                        <TextField id="outlined-basic"
                                   required
                                   error={error.surname}
                                   label="Surname"
                                   name="surname"
                                   value={user['surname']}
                                   onChange={userDataChanged}
                                   variant="outlined"
                                   className={classes.textField}
                        />
                        <TextField id="outlined-basic"
                                   required
                                   error={error.email}
                                   label="Email"
                                   name="email"
                                   value={user['email']}
                                   onChange={userDataChanged}
                                   variant="outlined"
                                   className={classes.textField}
                        />
                        <TextField id="outlined-basic"
                                   required
                                   error={error.password}
                                   autoComplete='new-password'
                                   label="Password"
                                   name="password"
                                   value={user['password']}
                                   onChange={userDataChanged}
                                   variant="outlined"
                                   type="password"
                                   className={classes.textField}
                        />
                        <br/>
                        <Alert severity="info">
                            Make sure to use secure password as it will give access to modify data in admin panel.
                            <br/>
                            *Password must contain between 8 and 30 characters
                            <br/>
                            *Password must have atleast one digit
                            <br/>
                            *Password must have atleast one upper character
                        </Alert>

                        <Divider className={classes.textField} medium />

                        <FormControl error={error.role} variant="outlined" className={classes.textField}>
                            <InputLabel>User role</InputLabel>
                            <Select
                                onChange={(e, value) =>{
                                    let userTmp = Object.assign({},user);
                                    userTmp.role = value.props.value
                                    setUser(userTmp)
                                }}
                                value={user.role}
                                label="Select user role"
                            >
                                <option value="-1">None</option>
                                {
                                    availableRoles.map(row=>{
                                        return <option value={row.roleId}> {row.role}</option>
                                    })
                                }
                            </Select>
                            <FormHelperText>Select one of the available user roles</FormHelperText>
                        </FormControl>

                        {user.role === 1 ? <Alert className={classes.textField}
                            severity="warning">
                            ROLE_ADMIN will have full access to the system. Make sure you know this person!
                            </Alert> :
                        null
                        }

                        <Typography variant="h6" style={{marginTop: 48}}>
                            Available roles
                        </Typography>
                        <div className={classes.textField}>
                            {
                                availableRoles.map(row=>{
                                    return (
                                        <Typography variant="subtitle1" gutterBottom>
                                            {row.role} - {row.description}
                                        </Typography>
                                    )

                                })
                            }
                        </div>

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
                        addUser()
                    }}
                >
                    Add user
                </Button>
            </DialogActions>
        </Dialog>
    )
};

export default withStyles(styles)(AddUserDialog)
