import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import Rating from "@material-ui/lab/Rating";
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import FavoriteIcon from '@material-ui/icons/Favorite';
import moment from "moment";
import {Box} from "@material-ui/core";

const useStyles = makeStyles({
    root: {
        minWidth: 275,
        width: "20%",
        padding: "2px",
        marginRight: "16px"
    },

});
//                {moment(review.timeAdded).format('LL')}
export default function ReviewCard({review}) {
    const classes = useStyles();
    const bull = <span className={classes.bullet}>•</span>;

    return (
        <Card className={classes.root} variant="outlined">
            <CardContent>
                <div style={{display: "flex"}} >
                    <Avatar alt="Cindy Baker" src={false ? review.photoUrl : "/broken-image.jpg"} />
                    <div style={{display: "flex", flexDirection: "column", marginLeft:"8px"}}>
                        <Typography title="subtitle1">
                            {review.name} {review.surname}
                        </Typography>
                        <div style={{display: "flex", justifyContent: "space-between"}}>
                            <Rating size="small" name="read-only" value={review.rating} readOnly />
                            <Typography title="subtitle1">
                                {"+" + review.upvotes}
                            </Typography>
                        </div>
                    </div>
                </div>
                <Typography title="subtitle1">
                    {moment(review.timeAdded).format('LL')}
                </Typography>
                <div style={{marginTop: "16px"}}>
                    {review.title}
                </div>

                <Typography title="subtitle1">
                        {review.review}
                </Typography>

            </CardContent>
        </Card>
    );
}

