import withStyles from "@material-ui/core/styles/withStyles";
import React, {useState} from "react"
import ApiPlaceCard from "../components/ApiPlaceCard";
import API from "../Networking/API";
import CircularProgress from "@material-ui/core/CircularProgress";
import debounce from 'lodash/debounce'
import Masonry from "react-masonry-component";
import SearchInputComponent from "../components/SearchInputComponent";
import Strings from "../helpers/stringResources";



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
    const [after, setAfter] = useState(null);
    const [searchQuery, setSearchQuery] = useState("Kaunas");

    const loadDataFunc = (query, after) => {
        // console.log(data)
        setIsLoadingData(true)
        API.Places.searchApiPlaces("?keyword=" + encodeURI(query) + (after != null ? "&after=" + after : "")).then(response => {
            setData(currentData => [...currentData, ...(response.data)])
            setAfter(response.after)
        }).catch(error => {
        }).finally(() => {
            setIsLoadingData(false)
        })
    }

    const handleScrollDebounced = (e) => {
        const scrollOffset = 100 //px
        const bottom = Math.round(e.target.scrollHeight - e.target.scrollTop - scrollOffset)  <= e.target.clientHeight;
        if (bottom && !isLoadingData) {
            loadDataFunc(
                searchQuery, after)
        }
    }

    const debounceScroll = debounce(e => handleScrollDebounced(e), 200)

    const handleScroll = (e) => {
        e.persist()
        debounceScroll(e)
    }

    const handleSearch = (query) => {
        setData([])
        loadDataFunc(searchQuery, null)
        setSearchQuery(query)
    }

    return(
        <div style={{position: "relative"}}>
            <div className = {classes.topBar}>
                <SearchInputComponent searchCallback={handleSearch} hint="Search api places" style={classes.searchBox} />
            </div>

            <div className={classes.root} onScroll={(e) => handleScroll(e)}>
                <Masonry
                    // className={'my-gallery-class'} // default ''
                    style={{margin: "0 auto"}}
                    elementType={'div'} // default 'div'
                    options={{
                        isFitWidth: true
                    }} // default {}
                    disableImagesLoaded={false} // default false
                    updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
                    // imagesLoadedOptions={} // default {}
                >

                    {data.map(item => {
                        return <ApiPlaceCard key={item.placeId} placeData = {item} style={{boxSizing: 'border-box'}}/>
                    })}
                </Masonry>
                {
                    isLoadingData &&
                    <CircularProgress  />
                }
            </div>
        </div>
    )
}

export default withStyles(styles)(ApiPlaces)