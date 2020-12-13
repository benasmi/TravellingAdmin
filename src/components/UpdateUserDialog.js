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

const UpdateUserDialog = ({open, setOpen, userData, availableRoles, setAvailableRoles}) => {

    const [selectedRoles, setSelectedRoles] = useState([]);

    const {addConfig} = UseSnackbarContext();
    const {addAlertConfig} = UseAlertDialogContext();

    useEffect(()=>{
        setSelectedRoles(userData.roles)
    },[userData.roles]);

    function setRoles() {
        addAlertConfig("Update user", "Are you sure you want to update this user's permissions?", [{
            name: "Yes",
            action: () => {
                let roles = []
                selectedRoles.map(row=>{
                    roles.push(row.roleId)
                });
                API.User.setRoles({userId: userData.id, roles: roles}).then(response=>{
                    addConfig(true, "Updated user successfully");
                    setOpen(false)
                }).catch(error=>{
                    addConfig(false, "Could not update user")
                })
            }
        }])
    }

    const renderRoles = <div>

    </div>

    return(
        <Dialog
            open={open}
            fullWidth={true}
            maxWidth={'lg'}
            onClose={()=>{setOpen(false)}}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">Update user - {userData.name + " " + userData.surname}</DialogTitle>
            <DialogContent>
                <Typography variant="h6">
                    Change user permissions
                </Typography>

                <AutoCompleteChip
                    id="roleId"
                    name="role"
                    label="Select role"
                    options={availableRoles.map(role => {
                        const newRole = {...role}
                        newRole.name = newRole.role;
                        return newRole;
                    })}
                    setOptions={setAvailableRoles}
                    setSelectedOptions={setSelectedRoles}
                    selectedOptions={selectedRoles}
                />

                {
                    selectedRoles.map(row=>{
                        return <div>
                            <b>{row.role}</b> - {row.description}
                            <br/>
                        </div>
                    })
                }


            </DialogContent>
            <DialogActions>
                <Button onClick={()=>setOpen(false)}
                        color="primary">
                    Close
                </Button>

                <Button onClick={()=>setRoles()}
                        color="primary">
                    Update user
                </Button>
            </DialogActions>
        </Dialog>
    )
};


export default UpdateUserDialog
