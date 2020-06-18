import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";
import TableComponent from "../components/TableComponent";
import API from "../Networking/API";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add"
import Box from "@material-ui/core/Box";
import history from "../helpers/history";
import UseAlertDialogContext from "../contexts/UseAlertDialogContext";
import Strings from "../helpers/stringResources";
import UseSnackbarContext from "../contexts/UseSnackbarContext";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import FilterListIcon from "@material-ui/icons/FilterList";
import Popover from "@material-ui/core/Popover";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Autocomplete from "react-google-autocomplete";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import {KeyboardDatePicker} from "@material-ui/pickers";
import AutocompleteChip from "../components/AutocompleteChip";
import FilterBlock from "../components/add_place_components/FilterBlock";
import * as moment from "moment";

const styles = theme => ({
    button: {
        margin: theme.spacing(2)
    },
    input: {
        display: "none"
    },
    root:{
        height:"100vh",
        width:"100%",
        overflow: "auto"
    },
    buttonsDiv: {
        backgroundColor: "red",
        justifyContent: "flex-end"
    },
    content:{
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
    autocomplete:{
        width: '200px',
        height: '40px',
        fontSize: "14px",
        border: "0",
        borderBottom: "2px solid grey",
        outline:"0",
        marginBottom: "4px"
    }
});


const headCells = [
    { id: 'name', numeric: false, disablePadding: false, label: 'Place name', isId: true},
    { id: 'address', numeric: false, disablePadding: false, label: 'Address',isId: false},
    { id: 'city', numeric: false, disablePadding: false, label: 'City',isId: false },
    { id: 'country', numeric: false, disablePadding: false, label: 'Country',isId: false },
    { id: 'phoneNumber', numeric: false, disablePadding: false, label: 'Phone Number',isId: false },
    { id: 'actions', numeric: false, disablePadding: false, label: 'Actions', isId: false }
];

function Places(props) {

    const [data, setData] = useState([]);
    const [pageData, setPageData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { classes } = props;

    const [availableCategories, setAvailableCategories] = useState([]);


    const [filterQuery, setFilterQuery] = useState(
        {
            generalOptions: "",
            categories: "",
            insertionStart: moment(new Date('2020-05-01T21:11:54')).format("YYYY-MM-DD"),
            insertionEnd: moment(new Date()).format("YYYY-MM-DD"),
            modificationStart: moment(new Date('2014-05-01T21:11:54')).format("YYYY-MM-DD"),
            modificationEnd: moment(new Date()).format("YYYY-MM-DD")
        });


    const getCategories = () => {
        API.Categories.getAllCategories().then(response=>{
            setAvailableCategories(response);
            console.log(response);
        }).catch(error=>{
            console.log(error)
        });
    };

    useEffect(()=>{
        getCategories()
    },[]);

    const { addAlertConfig } = UseAlertDialogContext();
    const { addConfig } = UseSnackbarContext();

    useEffect(()=>{
        if(!isLoading){
            requestAllPlaces();
            console.log("Filter query", filterQuery);
        }
    },[filterQuery]);

    function getPlaceNameById(id){
        for(var i = 0; i<data.length; i++){
            if(data[i].placeId === id)
                return data[i].name
        }
    }

    function requestAllPlaces(p=1,keyword=""){
        getAllPlaces("?p="+p+"&s="+10+"&keyword="+keyword+"&o="+filterQuery.generalOptions+"&c="+filterQuery.categories+"&di="+filterQuery.insertionStart+","+filterQuery.insertionEnd+ "&dm="+filterQuery.modificationStart+","+filterQuery.modificationEnd);
    }

    function parseData(data){
        setIsLoading(false);
        let placesData = [];
        data.list.map(row => {
            placesData.push(row)
        });

        delete data.list;
        setData(placesData);
        setPageData(data);
    }

    function updatePlaceCallback(id){
        history.push("/app/addplace/"+id)
    }
    function removePlaceCallback(id){
        console.log("Name",getPlaceNameById(id));
        setIsLoading(true);
        addAlertConfig(Strings.DIALOG_PLACE_DELETE_TITLE +" - " + getPlaceNameById(id), Strings.DIALOG_PLACE_DELETE_MESSAGE, [{
            name: "Remove",
            action: () =>{
                    API.Places.removePlace("?p="+id).then(response=>{
                        let tmp = [];
                        data.map(row=>{
                            if(row.placeId !== id){
                                tmp.push(row)
                            }
                        });
                        setData(tmp);
                        addConfig(true, Strings.SNACKBAR_PLACE_REMOVE_SUCCESS)
                        setIsLoading(false)
                    }).catch(error=>{
                        setIsLoading(false);
                        addConfig(false, Strings.SNACKBAR_ERROR)
                    })
            }
        }], ()=>{setIsLoading(false)})
    }

    const changePageCallback = (p=0, keyword="") => {
        setIsLoading(true);
        requestAllPlaces(p, keyword)
        // getAllPlaces("?p="+p+"&s="+10+"&keyword="+keyword+"&o="+filterQuery.generalOptions)
    };


    //Sorting stuff
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };


    const customToolbarElements = () =>{
        return <div>
            <Tooltip aria-describedby={id} title="Filter list">
                <IconButton  aria-label="filter list" onClick={handleClick}>
                    <FilterListIcon />
                </IconButton>
            </Tooltip>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={()=>{setAnchorEl(null)}}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >

                <FilterBlock
                    filterQuery={filterQuery}
                    setFilterQuery={setFilterQuery}
                    availableCategories={availableCategories}
                    setAvailableCategories={setAvailableCategories}
                />


            </Popover>
        </div>
    };
    /*------------------------------------------------------------------------------------------------------*/

    return (
        <div className={classes.root}>
            <div className={classes.content} >
                <TableComponent
                    title={"Places"}
                    headCells={headCells}
                    data={data}
                    pagingInfo={pageData}
                    checkable={false}
                    changePageCallback={changePageCallback}
                    updateCallback={updatePlaceCallback}
                    removeCallback={removePlaceCallback}
                    id={"placeId"}
                    isLoading={isLoading}
                    customToolbarElements={customToolbarElements()}
                />

                <Box display="flex" justifyContent="flex-end">
                    <Button
                        onClick={()=>{history.push("/app/addplace")}}
                        variant="text"
                        color="secondary"
                        size="large"
                        className={classes.button}
                        startIcon={<AddIcon />}>
                        Add
                    </Button>
                </Box>
            </div>
            <Button>
                Clear filters
            </Button>
        </div>
    );

    function getAllPlaces(urlParams="") {
        API.Places.getAllPlacesAdmin(urlParams).then(response=>{
            console.log(response);
            parseData(response)
        }).catch(error=>{
            console.log(error)
        })
    }
}

Places.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Places);