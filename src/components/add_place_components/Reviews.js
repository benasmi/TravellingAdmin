import React, {useEffect, useState} from "react";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import withStyles from "@material-ui/core/styles/withStyles";
import Rating from '@material-ui/lab/Rating';
import ReviewCard from "../ReviewCard";
import API from "../../Networking/API";
import debounce from "lodash/debounce";
import LinearProgress from "@material-ui/core/LinearProgress";
import FilterListIcon from '@material-ui/icons/FilterList';
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Popover from "@material-ui/core/Popover";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";

const styles = theme => ({
    reviewsInfo:{
        display: "flex",
    },
    reviews:{
        display: "flex",
        width: "100%",
        margin: theme.spacing(2),
        overflowX: "scroll"
    },
    sortingButtons: {
        padding: theme.spacing(2)
    }
});

function Reviews({classes, placeInfo}) {

    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const [filterBy, setFilterBy] = useState('mostRated');

    function getReviewsForPlace(urlParams = "?p="+placeInfo.placeId) {
        API.Reviews.getPlaceReviews(urlParams).then(response=>{
            setReviews(old=>[...old, ...response.list]);
            setIsLoading(false)
        }).catch(error=>{
            setIsLoading(false)
        })
    }

    //Get ordered by new filter
    useEffect(()=>{
            getReviewsForPlace("?p="+placeInfo.placeId+"&page=1&o="+filterBy)
    },[filterBy]);


    const handleScrollDebounced = (e) => {
        const scrollOffset = 0;
        const bottom = Math.round(e.target.scrollWidth - e.target.scrollLeft - scrollOffset)  <= e.target.clientWidth;
        if (bottom && !isLoading && reviews.length>0 && reviews.length<placeInfo.totalReviews) {
            setIsLoading(true);
            setPage(old=>{
                getReviewsForPlace("?p="+placeInfo.placeId+"&page="+(old+1)+"&o="+filterBy);
                return old+1
            });
        }
    };

    const debounceScroll = debounce(e => handleScrollDebounced(e), 200);

    const handleScroll = (e) => {
        e.persist();
        debounceScroll(e)
    };


    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };


    function changeSorting(e){
        const {name, value} = e.target;
        setFilterBy(value);
        setReviews([]);
        setPage(1);
        handleClose()
    }


    return <div>
        <Typography variant="h6" >
            Reviews
            <br/>
            {
               reviews.length > 0 ?
                   <React.Fragment>
                       <div style={{display:"flex", justifyContent: "space-between"}}>
                           <div className={classes.reviewsInfo}>
                               <Rating name="read-only" value={placeInfo.overallStarRating} precision={0.2} readOnly />
                               <Typography style={{marginLeft:"8px"}} variant="subtitle1">
                                   {placeInfo.totalReviews} reviews
                               </Typography>
                           </div>
                           <Tooltip aria-describedby={id} title="Filter list">
                               <IconButton  aria-label="filter list" onClick={handleClick}>
                                   <FilterListIcon />
                               </IconButton>
                           </Tooltip>
                           <Popover
                               id={id}
                               open={open}
                               anchorEl={anchorEl}
                               onClose={handleClose}
                               anchorOrigin={{
                                   vertical: 'bottom',
                                   horizontal: 'center',
                               }}
                               transformOrigin={{
                                   vertical: 'top',
                                   horizontal: 'center',
                               }}
                           >
                               <RadioGroup className={classes.sortingButtons} aria-label="gender" value={filterBy} name="gender1"  onChange={changeSorting}>
                                   <FormControlLabel value="mostRated" control={<Radio />} label="Most rated" />
                                   <FormControlLabel value="newest" control={<Radio />} label="Newest" />
                               </RadioGroup>
                           </Popover>
                       </div>

                       <div style={{display: "flex", justifyContent: "space-between"}}>
                           <Typography>
                               Showing: {reviews.length} out of {placeInfo.totalReviews}
                           </Typography>
                           <Typography>
                               Sorting by: {filterBy}
                           </Typography>
                       </div>
                       <div className={classes.reviews} onScroll={e=>handleScroll(e)}>
                           {reviews.map(row=>{
                               return <ReviewCard review={row}/>
                           })}
                       </div>
                   </React.Fragment> : <Typography> No reviews for this place</Typography>
            }

        </Typography>
        <br/>
        {isLoading ? <LinearProgress/> : null }
    </div>
}

export default withStyles(styles)(Reviews)