import {withStyles} from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import React from "react";
import IconButton from "@material-ui/core/IconButton";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import RemoveIcon from '@material-ui/icons/Remove';
import CardHeader from "@material-ui/core/CardHeader";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import Alert from "@material-ui/lab/Alert";
import TransportItem from "./TransportItem";
import TextField from "@material-ui/core/TextField";

const styles = theme => ({
  cardRoot: {
    [theme.breakpoints.only("lg")]: {
      display: 'flex',
      // alignItems: "flex-start"
    },
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    flex: 5
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    [theme.breakpoints.down("lg")]: {
      height: "200px",
    },
    [theme.breakpoints.only("lg")]: {
      flex: 1,
      height: "auto",
    },
  },
  root: {
    display: "flex",
    flexFlow: "column wrap"
  },
  addParkingWrapper: {
    display: "inline-block"
  }
})


function TourPlaceComponent({classes, elementData, removeCallback, tourInfoReducer, currentDay, elementIndex, lastElement, handleEditPlace}) {

  function truncateText(text) {
    if (text == null)
      return ""
    if (text.length > 500) {
      return text.substring(0, 500) + "...";
    } else {
      return text
    }
  }

  const handleRemoveTransport = () => {

  }

  const handleChangeTransport = ({transport}) => {
    tourInfoReducer({
      type: 'UPDATE_ELEMENT',
      day: currentDay,
      index: elementIndex,
      data: {
        ...elementData,
        transport: {
          fk_transportId: transport
        }
      }
    })
  }

  const handleAddTransport = () => {
    tourInfoReducer({
      type: 'UPDATE_ELEMENT',
      day: currentDay,
      index: elementIndex,
      data: {
        ...elementData,
        transport: {
          fk_transportId: 1
        }
      }
    })
  }

  return (
      <div className={classes.root}>
        <Card className={classes.cardRoot} onClick={() => handleEditPlace(elementData.data.details.placeId)}>

          {elementData.data.details.photos != null && elementData.data.details.photos.length > 0 &&
          <CardMedia
              className={classes.cover}
              image={elementData.data.details.photos[0].url}

          />
          }

          <div className={classes.details}>
            <CardContent className={classes.content}>
              <Typography component="h5" variant="h5">
                {elementData.data.details.name}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                {truncateText(elementData.data.details.description)}
              </Typography>
            </CardContent>
          </div>
          <CardHeader
              onClick={e => {e.stopPropagation(); e.preventDefault()}}
              action={
                <IconButton aria-label="remove" onClick={() => removeCallback(elementData)}>
                  <RemoveIcon/>
                </IconButton>
              }
          />
        </Card>

        <TextField
            className={classes.descriptionInput}
            multiline
            value={elementData.data.note}
            label="Add a note"
            style={{marginTop: 10, marginBottom: 5}}
            variant="outlined"
            onChange={(e) => {
              tourInfoReducer({
                type: 'UPDATE_ELEMENT',
                day: currentDay,
                index: elementIndex,
                data: {
                  ...elementData,
                  note: e.target.value
                }
              })
            }}
        />

        {elementData.data.transport != null && !lastElement &&
        <TransportItem transportChangeCallback={handleChangeTransport}
                       transportId={elementData.data.transport.fk_transportId}/>}

      </div>

  )
}

TourPlaceComponent.propTypes = {
  elementData: PropTypes.object.isRequired,
  removeCallback: PropTypes.func.isRequired,
};

export default withStyles(styles)(TourPlaceComponent)
