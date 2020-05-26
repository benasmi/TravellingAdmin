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
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import Checkbox from "@material-ui/core/Checkbox";
import {forEach} from "react-bootstrap/cjs/ElementChildren";
import UseAppBarTitleContext from "../contexts/UseAppBarTitleContext";


const styles = theme => ({
    button: {
        margin: theme.spacing(2)
    },
    input: {
        display: "none"
    },

    sortingButtons: {
        padding: theme.spacing(2),
        display: "flex",
        flexDirection: "column"

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


    const [filterOptions, setFilterOptions] = useState([
        {filterLabel: "Unverified", filter: false, filterName: "unverified"},
        {filterLabel: "Unpublished", filter: false, filterName: "unpublished"}]);

    const [filterQuery, setFilterQuery] = useState("");


    const { addAlertConfig } = UseAlertDialogContext();
    const { addConfig } = UseSnackbarContext();

    useEffect(()=>{
        console.log("Filter query", filterQuery);
        getAllPlaces("?o="+filterQuery)
    },[filterQuery]);

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
        history.push("/addplace/"+id)
    }
    function removePlaceCallback(id){
        setIsLoading(true);
        addAlertConfig(Strings.DIALOG_PLACE_DELETE_TITLE, Strings.DIALOG_PLACE_DELETE_MESSAGE, function () {
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
        }, ()=>{setIsLoading(false)})
    }

    const changePageCallback = (p=0, keyword="") => {
        setIsLoading(true);
        getAllPlaces("?p="+p+"&s="+10+"&keyword="+keyword+"&o="+filterQuery)
    };


    //Sorting stuff
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const filterOptionsChanged = (name) =>{
        let filters = [];
        let fq = [];
        filterOptions.map(row=>{
            if(row.filterName === name){
                row.filter = !row.filter
            }
            if(row.filter){
                fq.push(row.filterName)
            }
            filters.push(row)
        });

        setFilterQuery(fq.join(","));
        setFilterOptions(filters)
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
                <div className={classes.sortingButtons}>
                    {filterOptions.map(row=>{
                        return <FormControlLabel
                            control={<Checkbox checked={row.filter} onChange={()=>filterOptionsChanged(row.filterName)} name={row.filterName} />}
                            label={row.filterLabel}
                        />
                    })}
                </div>

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
                        onClick={()=>{history.push("/addplace")}}
                        variant="text"
                        color="secondary"
                        size="large"
                        className={classes.button}
                        startIcon={<AddIcon />}>
                        Add
                    </Button>
                </Box>
            </div>

        </div>
    );

    function getAllPlaces(urlParams="") {
        API.Places.getAllPlacesAdmin(urlParams).then(response=>{
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