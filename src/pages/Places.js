import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";
import TableComponent from "../components/TableComponent";
import API from "../Networking/API";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add"
import Box from "@material-ui/core/Box";
import history from "../helpers/history";


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

    useEffect(()=>{
        getAllPlaces()
    },[]);



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

    const changePageCallback = (p=0, keyword="") => {
        setIsLoading(true);
        getAllPlaces("?p="+p+"&s="+10+"&keyword="+keyword)
    };



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
                    id={"placeId"}
                    isLoading={isLoading}
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