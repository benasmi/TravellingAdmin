import withStyles from "@material-ui/core/styles/withStyles";
import React, {useState} from "react"
import ApiPlaceCard from "../components/ApiPlaceCard";
import API from "../Networking/API";
import CircularProgress from "@material-ui/core/CircularProgress";
import debounce from 'lodash/debounce'
import Masonry from "react-masonry-component";
import SearchInputComponent from "../components/SearchInputComponent";
import Strings from "../helpers/stringResources";
import Typography from "@material-ui/core/Typography";
import UseSnackbarContext from "../contexts/UseSnackbarContext";



const styles = theme => ({
    root:{
        overflow: 'scroll',
        width: "100%",
        padding: theme.spacing(1),
        height:`calc(100vh - 64px)`,
        paddingTop: "9vh",
    },
    topBar: {
        height: "8vh",
        position: "absolute",
        width: "60%",
        marginLeft: "auto",
        marginRight: "auto",
        left: 0,
        right: 0,
        justifyContent: "center",
        zIndex: 1
    },
    searchBox: {
        margin: theme.spacing(1)
    }
})

function ApiPlaces({classes}){

    const [data, setData] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const { addConfig } = UseSnackbarContext();

    const loadDataFunc = (query) => {
        setData([])
        setIsLoadingData(true)
        API.Places.searchApiPlaces("?keyword=" + encodeURI(query)).then(response => {
            setData([...response])
        }).catch(error => {
            addConfig(false, "The request did not go through.")
        }).finally(() => {
            setIsLoadingData(false)
        })
    }

    const handleSearch = (word) => {
        if(word.length > 3)
            loadDataFunc(word)
    }

    return(
        <div style={{position: "relative"}}>
            <div className = {classes.topBar}>
                <SearchInputComponent searchCallback={handleSearch} hint="Search api places" style={classes.searchBox} />
            </div>

            <div className={classes.root}>
                <Masonry
                    style={{margin: "0 auto"}}
                    elementType={'div'} // default 'div'
                    options={{
                        isFitWidth: true
                    }} // default {}
                    disableImagesLoaded={false} // default false
                    updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
                >

                    {data.map(item => {
                        return <ApiPlaceCard key={item.placeId} placeData = {item} style={{boxSizing: 'border-box'}}/>
                    })}

                    {
                        data.length === 0 && !isLoadingData &&
                        <Typography variant="subtitle1">No results</Typography>
                    }
                    {
                        isLoadingData &&
                        <CircularProgress  />
                    }

                </Masonry>


            </div>
        </div>
    )
}

export default withStyles(styles)(ApiPlaces)