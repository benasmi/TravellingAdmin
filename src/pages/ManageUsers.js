import React, {useContext, useEffect, useState} from "react";
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";
import TableComponent from "../components/TableComponent";
import API from "../Networking/API";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add"
import Box from "@material-ui/core/Box";
import UseAlertDialogContext from "../contexts/UseAlertDialogContext";
import UseSnackbarContext from "../contexts/UseSnackbarContext";
import UpdateUserDialog from "../components/UpdateUserDialog";
import AddUserDialog from "../components/AddUserDialog";
import {AlertDialogContext} from "../contexts/AlertDialogContext";
import UseEditDialogContext from "../contexts/UseEditDialogContext";

const styles = theme => ({
    button: {
        margin: theme.spacing(2)
    },
    input: {
        display: "none"
    },
    root: {
        height: "100vh",
        width: "100%",
        overflow: "auto"
    },
    buttonsDiv: {
        backgroundColor: "red",
        justifyContent: "flex-end"
    },
    content: {
        display: 'flex',
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        [theme.breakpoints.down("lg")]: {
            padding: theme.spacing(1),
        },
        [theme.breakpoints.up("lg")]: {
            padding: theme.spacing(8),
        },
    },
    autocomplete: {
        width: '200px',
        height: '40px',
        fontSize: "14px",
        border: "0",
        borderBottom: "2px solid grey",
        outline: "0",
        marginBottom: "4px"
    }
});


const headCells = [
    {id: 'name', numeric: false, disablePadding: false, label: 'Name', isId: true},
    {id: 'surname', numeric: false, disablePadding: false, label: 'Surname', isId: false},
    {id: 'email', numeric: false, disablePadding: false, label: 'Contact email', isId: false},
    {id: 'phoneNumber', numeric: false, disablePadding: false, label: 'Phone number', isId: false},
    {id: 'parsedRoles', numeric: false, disablePadding: false, label: 'Roles', isId: false},
    {id: 'actions', numeric: false, disablePadding: false, label: 'Actions', isId: false}
];

function Places(props) {

    const [data, setData] = useState([]);
    const [selectedUser, setSelectedUser] = useState({});
    const [allRoles, setAllRoles] = useState([])
    const [pageData, setPageData] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const {classes} = props;

    const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
    const [openAddDialog, setOpenAddDialog] = useState(false);

    const {addEditDialogConfig} = UseEditDialogContext();

    // const {filterQuery} = useContext(PlacesFilterContext)
    const {addAlertConfig} = UseAlertDialogContext();
    const {addConfig} = UseSnackbarContext();


    useEffect(()=>{
        API.User.getAllRoles().then(roles=>{
            console.log(roles);
            setAllRoles(roles);
        }).catch(error=>{
            addConfig(false, error.message)
        })
    },[]);



    function requestUsers(p = 1, keyword = "") {
        getAllUsers("" + "?p=" + p + "&s=" + 10 + "&keyword=" + keyword);
    }

    function parseData(data) {

        setIsLoading(false);
        let usersData = [];
        data.list.map(row => {
            let rolesList = [];
            row.roles.map(role =>{
                rolesList.push(role.role)
            });
            row.parsedRoles = rolesList.join(',');
            usersData.push(row)
        });

        delete data.list;
        setData(usersData);
        console.log(usersData);
        setPageData(data);
    }

    function updatePlaceCallback(id) {
        data.map(row=>{
            if(row.id === id ){
                setSelectedUser(row)
            }
        });
        setOpenUpdateDialog(true)
    }

    const changePageCallback = (p = 0, keyword = "") => {
            setIsLoading(true);
            requestUsers(p, keyword)
    };

    const removeCallback = (id) => {
        addAlertConfig(
            "Warning",
            "Are you sure you want to remove this user?",
            [
                {
                    action: () => {
                        API.User.remove(id).then(() => {
                            addConfig(true, "User removed successfully")
                            setData(data => {
                                return data.filter(item => item.id !== id);
                            })
                        }).catch(() => {
                            addConfig(false, "Failed to remove user")
                        })
                    },
                    name: "Yes"
                }
            ]
        )
    }

    const changePasswordCallback = (id) => {
        const user = data.find(user => user.id === id)
        addEditDialogConfig({
            title: "Change password",
            explanation: `Type the new password for ${user.name} ${user.surname}`,
            onDoneCallback: (options, text) => {
                API.User.changePassword({
                    userId: id,
                    newPassword: text
                }).then(() => {
                    addConfig(true, "Password changed successfully")
                }).catch(() => {
                    addConfig(false, "Something went wrong")
                })
            },
            type: "password",
            validateInput: (input) => {return input.length > 5 ? 0 : 1},
            textFieldLabel: "Type in a secure password"
        })
    }

    return (
        <div className={classes.root}>
            <div className={classes.content}>

                {openUpdateDialog ? <UpdateUserDialog open={openUpdateDialog}
                                                      setOpen={setOpenUpdateDialog}
                                                      availableRoles={allRoles}
                                                      setAvailableRoles={setAllRoles}
                                                      userData={selectedUser}/>
                                                      :
                    null
                }

                {openAddDialog ? <AddUserDialog open={openAddDialog}
                                                availableRoles={allRoles}
                                                setOpen={setOpenAddDialog}/> : null}

                <TableComponent
                    title={"Users"}
                    headCells={headCells}
                    data={data}
                    pagingInfo={pageData}
                    checkable={false}
                    changePageCallback={changePageCallback}
                    updateCallback={updatePlaceCallback}
                    removeCallback={removeCallback}
                    actionButtonCallback={changePasswordCallback}
                    actionButtonText="Change password"
                    id={"id"}
                    isLoading={isLoading}
                />

                <Box display="flex" justifyContent="flex-end">
                    <Button
                        onClick={() => {
                                setOpenAddDialog(true)
                        }}
                        variant="text"
                        color="secondary"
                        size="large"
                        className={classes.button}
                        startIcon={<AddIcon/>}>
                        Add user
                    </Button>
                </Box>
            </div>
            <Button>
                Clear filters
            </Button>
        </div>
    );

    function getAllUsers(urlParams = "") {
        API.User.getAllUsers(urlParams).then(response=>{
            console.log(response)
                setIsLoading(false);
                parseData(response)
        }).catch(error=>{
                setIsLoading(false);
                console.log(error)
        })
    }
}

Places.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Places);

