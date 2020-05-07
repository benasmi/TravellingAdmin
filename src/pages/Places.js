import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import {makeStyles, withStyles} from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import TableComponent from "../components/TableComponent";
import API from "../Networking/API";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add"
import Box from "@material-ui/core/Box";
import history from "../helpers/history";


const styles = theme => ({
    button: {
        margin: theme.spacing(1)
    },
    input: {
        display: "none"
    },
    buttonsDiv: {
        display: 'flex',
        backgroundColor: "red",
        justifyContent: "flex-end"
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




/*
{
    "total": 12,
    "list": [
        {
            "placeId": 1,

            "name": "Gedimino pilies bokštas",
            "description": "Šis triaukštis mūrinis bokštas – buvusios pilies, pastatytos XV a., dalis.",
            "averageTimeSpent": "00:01:00",
            "latitude": 54.4112,
            "longitude": 25.1727,
            "address": "Arsenalo g. 5, 01143",
            "country": "Lithuania",
            "city": "Vilnius",
            "phoneNumber": "(8-5) 261 7453",
            "website": "lnm.lt"
        },
        {
            "placeId": 1,
            "name": "Gedimino pilies bokštas",
            "description": "Šis triaukštis mūrinis bokštas – buvusios pilies, pastatytos XV a., dalis.",
            "averageTimeSpent": "00:01:00",
            "latitude": 54.4112,
            "longitude": 25.1727,
            "address": "Arsenalo g. 5, 01143",
            "country": "Lithuania",
            "city": "Vilnius",
            "phoneNumber": "(8-5) 261 7453",
            "website": "lnm.lt"
        }
    ],
    "pageNum": 1,
    "pageSize": 10,
    "size": 10,
    "startRow": 1,
    "endRow": 10,
    "pages": 2,
    "prePage": 0,
    "nextPage": 2,
    "isFirstPage": true,
    "isLastPage": false,
    "hasPreviousPage": false,
    "hasNextPage": true,
    "navigatePages": 8,
    "navigatepageNums": [
        1,
        2
    ],
    "navigateFirstPage": 1,
    "navigateLastPage": 2
}
 */



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
        console.log(data)
    }

    function updatePlaceCallback(id){
        console.log(id)
    }


    const changePageCallback = (p=0, keyword="") => {
        setIsLoading(true)
        getAllPlaces("?p="+p+"&s="+10+"&keyword="+keyword)
    };



    return (
        <div className={classes.root}>
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
    );

    function getAllPlaces(urlParams="") {
        API.getAllPlaces(urlParams).then(response=>{
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