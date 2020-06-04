import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Avatar from "@material-ui/core/Avatar";
import Rating from "@material-ui/lab/Rating";
import moment from "moment";
const useStyles = makeStyles({
    root: {
        minWidth: 275,
        width: "20%",
        padding: "2px",
        marginRight: "16px"
    },

});
export default function ReviewCard({review}) {
    const classes = useStyles();

    return (
        <Card className={classes.root} variant="outlined">
            <CardContent>
                <div style={{display: "flex"}} >
                    <Avatar alt="Cindy Baker" src={!!review.photoUrl ? review.photoUrl : "/broken-image.jpg"} />
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

