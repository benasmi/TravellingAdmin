import withStyles from "@material-ui/core/styles/withStyles";
import React, {Fragment, useState} from "react"
import Typography from "@material-ui/core/Typography";
import InfoIcon from '@material-ui/icons/Info';
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import CardHeader from "@material-ui/core/CardHeader";
import Card from "@material-ui/core/Card";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import red from "@material-ui/core/colors/red";
import CardActions from "@material-ui/core/CardActions";
import EditIcon from '@material-ui/icons/Edit';
import PropTypes from "prop-types";
import clsx from "clsx";
import Rating from "@material-ui/lab/Rating";
import Chip from "@material-ui/core/Chip";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";

const styles = theme => ({
    root: {

    },
    media: {
        height: 0,
            paddingTop: '56.25%', // 16:9
    },
    expand: {
        transform: 'rotate(0deg)',
            marginLeft: 'auto',
            transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        backgroundColor: red[500],
    },
})

function CategoriesDisplay({categories}){
    return(
        categories != null &&
        <Box component="ul"  style={{
            display: 'flex',
            justifyContent: 'left',
            flexWrap: 'wrap',
            listStyle: 'none',
            padding: '0px'
        }}>
            {categories.map((data, index) => {
                return (
                    <li key={index}>
                        <Chip
                            variant="outlined"
                            style={{margin: "5px"}}
                            label={data.name}
                        />
                    </li>

                );
            })}
        </Box>
    )
}

function SubheaderDisplay({city, address, priceRange, rating}){
    return(
        <div>
            {rating != null &&
            <Fragment><Rating
                readOnly={true}
                value={rating}
            /><br/></Fragment>}
            {(address != null ? address : "") + " " + (city != null ? city: "")} <div style={{color: "green"}}>{priceRange}</div>

        </div>
    )
}

function ApiPlaceCard({classes, placeData, renderActionArea}){

    function truncateText(text){
        if(text == null)
            return ""
        if(text.length > 500){
            return text.substring(0, 500) + "...";
        }else{
            return text
        }
    }

    return(
        <Card className={classes.root}>
            <CardHeader
                action={
                    renderActionArea != null && renderActionArea()
                }
                title={placeData.name}
                subheader={<SubheaderDisplay  city={placeData.city} address={placeData.address} priceRange={placeData.priceRange} rating={placeData.overallStarRating}/>}

            />
            {placeData.photos != null && placeData.photos.length > 0 &&
            <CardMedia
                className={classes.media}
                image={placeData.photos[0].url}
            />}
            <CardContent>
                <Typography variant="body2" color="textSecondary" component="p">
                    {truncateText(placeData.description)}
                </Typography>

                <CategoriesDisplay categories={placeData.categories}/>
                <Typography variant="body2" color="textSecondary" component="p">

                {placeData.website}
                </Typography>

            </CardContent>
            <CardActions disableSpacing>
            </CardActions>
        </Card>
    )
}

ApiPlaceCard.propTypes = {
    placeData: PropTypes.object.isRequired,
    renderActionArea: PropTypes.func
};

export default withStyles(styles)(ApiPlaceCard)