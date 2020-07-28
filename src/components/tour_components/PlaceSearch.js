import {withStyles} from "@material-ui/core/styles";
import React, {useState} from "react";
import SearchInputComponent from "../SearchInputComponent";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import Tooltip from "@material-ui/core/Tooltip";
import LocalLibraryIcon from "@material-ui/icons/LocalLibrary";
import DnsIcon from "@material-ui/icons/Dns";
import ApiPlaceCard from "../ApiPlaceCard";
import API from "../../Networking/API";

const styles = theme => ({
    searchInputComponent: {

    },
    placeCard: {
        margin: theme.spacing(1, 8, 1, 8),
    },
})


function PlaceSearch({classes, addPlaceCallback, apiPlacesFound, setApiPlacesFound, localPlacesFound, setLocalPlacesFound}) {

    // const [apiPlacesLoading, setApiPlacesLoading] = useState(false)
    const [localPlacesLoading, setLocalPlacesLoading] = useState(false)

    const placeType = {
        local: 0,
        api: 1
    }

    const generatePlaceCards = () => {
        let genProps = (placeInfo, type) => {
            return {
                classes: {root: classes.placeCard},
                key: placeInfo.placeId,
                renderActionArea: () => {
                    return (
                        <div>
                            <Button color="primary" onClick={() => addPlaceCallback(placeInfo, type)}>
                                <AddIcon/>
                            </Button>
                            <Tooltip title={type === placeType.local ? "This place is from our database" : "This place is from API"} aria-label="add">
                                {type === placeType.local ? <LocalLibraryIcon/> : <DnsIcon/>}
                            </Tooltip>
                        </div>
                    )
                },
                placeData : placeInfo
            }
        }

        let mappedPlaces = []
        localPlacesFound.forEach(item => {
            mappedPlaces.push(<ApiPlaceCard {...genProps(item, placeType.local)}/>)
        })
        // apiPlacesFound.forEach(item => {
        //     mappedPlaces.push( <ApiPlaceCard {...genProps(item, placeType.api)}/>)
        // })
        return mappedPlaces
    }

    const searchCallback = (keyword) => {
        if(keyword.length < 3)
            return;
        setLocalPlacesFound([])
        setApiPlacesFound([])
        // setApiPlacesLoading(true)
        setLocalPlacesLoading(true)
        API.Places.getAllPlacesAdmin("?keyword=" + keyword).then(response=>{
            setLocalPlacesFound(response.list)
            setLocalPlacesLoading(false)
        }).catch(error=>{
            console.log(error)
        })

        // API.Places.searchApiPlaces("?keyword=" + keyword).then(response => {
        //     setApiPlacesFound(response)
        //     setApiPlacesLoading(false)
        // }).catch(error => {
        //     console.log(error)
        // })
    }

    return(
        <React.Fragment>
            <SearchInputComponent hint="Search for a place" searchCallback={searchCallback} className={classes.searchInputComponent}/>
            {(localPlacesLoading) ?
                <CircularProgress  /> :
                <React.Fragment>
                    {generatePlaceCards()}
                </React.Fragment>
            }
        </React.Fragment>
    )
}

export default withStyles(styles)(PlaceSearch)
