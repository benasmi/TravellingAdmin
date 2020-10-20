import React, {useEffect, useMemo, useState} from "react";
import {withStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import PropTypes from "prop-types";
import {Paper} from '@material-ui/core';
import shortid from 'shortid';
import BasicPlaceInfo from "../components/add_place_components/BasicPlaceInfo";
import PhotosInfo from "../components/add_place_components/PhotosInfo";
import PlaceLocation from "../components/add_place_components/PlaceLocation";
import ParkingLocation from "../components/add_place_components/ParkingLocation";
import PlaceDiscovery from "../components/add_place_components/PlaceDiscovery";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import API from "../Networking/API";
import UseSnackbarContext from "../contexts/UseSnackbarContext";
import UseAlertDialogContext from "../contexts/UseAlertDialogContext";
import CircularProgress from "@material-ui/core/CircularProgress";
import LinearProgress from "@material-ui/core/LinearProgress";
import Strings from "../helpers/stringResources";
import green from "@material-ui/core/colors/green";
import Reviews from "../components/add_place_components/Reviews";
import UseAppBarTitleContext from "../contexts/UseAppBarTitleContext";
import RecommendationListDialog from "../components/recomendation/RecommendationListDialog";
import {RecommendationType} from "../components/recomendation/Recommendation";
import SchedulesContainer, {defaultScheduleData} from "../components/schedule_components/SchedulesContainer";
import moment from "moment";

const styles = theme => ({
  button: {
    margin: theme.spacing(2)
  },
  paperContent: {
    marginTop: theme.spacing(4),
    [theme.breakpoints.down("lg")]: {
      width: "95%",
      padding: theme.spacing(2),
    },
    [theme.breakpoints.up("lg")]: {
      width: "70%",
      padding: theme.spacing(4),
    },
  },
  root: {
    height: "100vh",
    [theme.breakpoints.down("lg")]: {
      height: "100%",
    },
  },
  loader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100vw",
    height: "100vh"
  },
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: `calc(93vh - 64px)`,
    [theme.breakpoints.down("lg")]: {
      width: "100%",
      padding: theme.spacing(1),
    },
    [theme.breakpoints.up("lg")]: {
      width: "auto",
      padding: theme.spacing(8),
    },
    overflowY: "auto"
  },
  bottom: {
    [theme.breakpoints.down("lg")]: {
      position: "fixed",
      height: "7vh",
      bottom: 0,
      right: 0,
    },
    width: "100%",
    zIndex: 5,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    padding: theme.spacing(1),
  }
});


function AddPlace({classes, match}) {
  const [placeInfo, setPlaceInfo] = useState({
    placeId: "",
    name: "", description: "", website: "", phoneNumber: "",
    isPublic: false, isVerified: true, overallStarRating: 0, totalReviews: 0,
    source: "", price: "", averageTimeSpent: "0", grade: 50
  });


  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [scheduleData, setScheduleData] = useState(defaultScheduleData);
  const [scheduleOpenIndex, setScheduleOpenIndex] = useState(0);
  const [seasonalScheduleEnabled, setSeasonalScheduleEnabled] = useState(false);
  const [lastAccommodation, setLastAccommodation] = useState(null);

  const [photos, setPhotos] = useState([]);

  const [locationData, setLocationData] = useState({
    city: '',
    address: '',
    country: '',
    latitude: 54.687157,
    longitude: 25.279652,
    county: '',
    municipality: ''
  });
  const [parkingMarkerData, setParkingMarkerData] = useState({
    city: '',
    address: '',
    country: '',
    latitude: 54.687157,
    longitude: 25.279652,
    county: '',
    municipality: ''
  });
  const [allSelectedParkingData, setAllSelectedParkingData] = useState([]);

  const [sources, setSources] = useState([]);

  const [isScheduleEnabled, setIsScheduleEnabled] = useState(false);

  const [placeId, setPlaceId] = useState(match.params.placeId);

  const [firstTimeLoading, setFirstTimeLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState({name: false});
  const [checkErrors, setCheckErrors] = useState(false);

  const [showRecommendationDialog, setShowRecommendationDialog] = useState(false)

  const {addConfig} = UseSnackbarContext();
  const {addAlertConfig} = UseAlertDialogContext();

  const {title, setTitle} = UseAppBarTitleContext();

  const ColorButton = withStyles((theme) => ({
    root: {
      color: "white",
      backgroundColor: green[500],
      '&:hover': {
        backgroundColor: green[700],
      },
    },
  }))(Button);

  useEffect(() => {
    if (placeId !== undefined) {
      getPlaceInfo()
    }
  }, []);

  useEffect(() => {
    //Loaded place for editing
    if (placeId === undefined) {
      setTitle("Add new place");
      setFirstTimeLoading(false) //Just loaded add place window
    }
    //New Place has been just inserted, thus inserting other place info
    if (placeId !== undefined && firstTimeLoading === false) {
      Promise.all([
        updateTagsData(placeId),
        updateParkingData(placeId),
        updateCategoriesData(placeId),
        updatePhotoData(placeId),
        updateSchedule(placeId),
        updateSources(placeId)
      ]).then(responses => {
        formFeedback(true, Strings.SNACKBAR_PLACE_INSERTED_SUCCESS)
      }).catch(error => {
        formFeedback(false)
      })
    }

  }, [placeId]);

  useEffect(() => {
    if (firstTimeLoading === false) {
      updateAll()
    }
  }, [placeInfo['isPublic']]);

  function addToRecommendation() {
    setShowRecommendationDialog(true)
  }

  function getPlaceInfo() {
    API.Places.getPlaceById("?full=true&p=" + placeId).then(response => {
      setAllData(response)
      setTitle("Editing place/" + response.name);
    }).catch(error => {
      formFeedback(false)
    })
  }

  const parseScheduleData = (data) => {

    data.some(schedule => {
      return schedule.periods.some(period => {
        if (period.lastAccommodation != null) {
          setLastAccommodation(moment(period.lastAccommodation, 'HH:mm').minutes() - moment(period.closeTime, 'HH:mm').minutes())
          return true
        }
        return false
      })
    })

    if (data.length > 1 || data.some(schedule => schedule.from != null && schedule.to != null))
      setSeasonalScheduleEnabled(true)

    return (data.map(schedule => {
      const newData = {...schedule}
      newData.periods = newData.periods.map(period => {
        const newPeriod = {...period}
        newPeriod.elementId = shortid.generate()
        return newPeriod
      })
      return newData
    }))
  }

  const convertSchedule = (data) => {
    return (data.map(schedule => {
      const newSchedule = {...schedule}
      if (!seasonalScheduleEnabled) {
        delete newSchedule.from;
        delete newSchedule.to;
      }
      newSchedule.periods = newSchedule.periods.map(period => {
        const newPeriod = {...period}
        if (lastAccommodation != null)
          newPeriod.lastAccommodation = moment(newPeriod.closeTime, 'HH:mm').subtract(lastAccommodation, 'minutes').format('HH:mm')
        newPeriod.closeDay = newPeriod.openDay
        return newPeriod
      })

      newSchedule.scheduleDefault = false;
      console.log(newSchedule)
      return newSchedule
    }))
  }

  function setAllData(place) {
    setPlaceInfo({
      placeId: place.placeId,
      name: place.name,
      description: place.description,
      website: place.website,
      phoneNumber: place.phoneNumber,
      hasSchedule: place.hasSchedule,
      isPublic: place.isPublic,
      isVerified: place.isVerified,
      overallStarRating: place.overallStarRating,
      totalReviews: place.totalReviews,
      price: place.price,
      averageTimeSpent: place.averageTimeSpent,
      bookInAdvance: place.bookInAdvance,
      grade: place.grade
    });

    setLocationData({
      city: place.city,
      address: place.address,
      country: place.country,
      latitude: place.latitude,
      longitude: place.longitude,
      county: place.county,
      municipality: place.municipality,
    });

    setParkingMarkerData({
      city: place.city,
      address: place.address,
      country: place.country,
      latitude: place.latitude,
      longitude: place.longitude,
      county: place.county,
      municipality: place.municipality,
    });

    setScheduleData(place.schedule.length === 0 ? defaultScheduleData : parseScheduleData(place.schedule))
    if (place.schedule.length === 0)
      setIsScheduleEnabled(false)
    else
      setIsScheduleEnabled(true)

    setSources(place.sources);
    setSelectedTags(place.tags);
    setSelectedCategories(place.categories);

    setAllSelectedParkingData(place.parking);
    setPhotos(place.photos);
    setFirstTimeLoading(false)
  }

  function formFeedback(success, message = Strings.SNACKBAR_ERROR) {
    addConfig(success, message);
    setIsLoading(false)
  }

  function saveChanges() {
    if (placeId === undefined) {
      addAlertConfig(Strings.DIALOG_PLACE_INSERT_TITLE, Strings.DIALOG_PLACE_INSERT, [{
        name: "Insert", action: () => {
          setIsLoading(true);
          insertBasicPlaceInfo()
        }
      }])
    } else {
      addAlertConfig(Strings.DIALOG_PLACE_UPDATE_TITLE, Strings.DIALOG_PLACE_UPDATE, [{
        name: "save and publish", action: () => {
          let plc = Object.assign({}, placeInfo, {});
          plc.isPublic = 1;
          setPlaceInfo(plc);
          setIsLoading(true);
          updateAll()
        }
      }, {
        name: "save", action: () => {
          setIsLoading(true);
          updateAll()
        }
      }])
    }
  }

  function updateAll() {
    Promise.all([
      updatePlaceInfo(),
      updateTagsData(placeId),
      updatePhotoData(placeId),
      updateCategoriesData(placeId),
      updateParkingData(placeId),
      updateSchedule(placeId),
      updateSources(placeId)
    ]).then(response => {
      formFeedback(true, Strings.SNACKBAR_CHANGES_SAVED);
    }).catch(err => {
      formFeedback(false)
    })
  }

  function updatePlaceInfo() {
    API.Places.updatePlace(formPlaceInfo()).then(response => {

    }).catch(error => {

    })

  }

  function insertBasicPlaceInfo() {
    API.Places.insertPlace(formPlaceInfo()).then(placeId => {
      setPlaceId(placeId)
    }).catch(error => {

    })
  }

  function updateParkingData(id) {
    API.ParkingPlace.updateParkingForPlace(allSelectedParkingData, "?p=" + id).then(response => {

    }).catch(error => {

    })
  }

  function updateTagsData(id) {
    API.TagsPlace.updateTagsForPlace(selectedTags, "?p=" + id).then(response => {

    }).catch(error => {

    })
  }

  function updateSources(id) {
    API.SourcePlace.updateSourcesForPlace(sources, "?p=" + id).then(response => {
    }).catch(error => {

    })
  }


  function updateCategoriesData(id) {
    API.CategoriesPlace.updateCategoriesForPlace(selectedCategories, "?p=" + id).then(response => {

    }).catch(error => {

    })
  }

  function updatePhotoData(id) {
    API.PhotoPlace.updatePhotoForPlace(photos, "?p=" + id).then(response => {

    }).catch(error => {

    })
  }


  function updateSchedule(id) {
    API.Schedule.updateScheduleForPlace(isScheduleEnabled ? convertSchedule(scheduleData) : [], "?id=" + id).then(response => {
    }).catch(er => {
    })

  }

  function formPlaceInfo() {
    let d = Object.assign(placeInfo, locationData);
    return d
  }


  function publishPlace() {
    addAlertConfig(Strings.DIALOG_PLACE_PUBLISH_TITLE, placeInfo['isPublic'] ? Strings.DIALOG_PLACE_UNPUBLISH_MESSAGE : Strings.DIALOG_PLACE_PUBLISH_MESSAGE,
        [{
          name: "Agree", action: () => {
            let obj = Object.assign({}, placeInfo, {});
            obj['isPublic'] = !obj['isPublic'];
            setPlaceInfo(obj);
          }
        }])

  }

  function verifyPlace() {
    addAlertConfig(Strings.DIALOG_PLACE_VERIFY_TITLE, Strings.DIALOG_PLACE_VERIFY_MESSAGE, [{
      name: "agree", action: () => {
        let obj = Object.assign({}, placeInfo, {});
        obj['isPublic'] = 1;
        obj['isVerified'] = 1;
        setPlaceInfo(obj);
      }
    }])
  }

  const basicPlaceInfo = useMemo(() => {
    return <Paper elevation={4} className={classes.paperContent}>
      <BasicPlaceInfo
          error={error}
          setError={setError}
          checkErrors={checkErrors}
          placeInfo={placeInfo}
          setPlaceInfo={setPlaceInfo}
          selectedSources={sources}
          setSelectedSources={setSources}
      />
    </Paper>
  }, [placeInfo.name,
    placeInfo.description,
    placeInfo.averageTimeSpent,
    placeInfo.phoneNumber,
    placeInfo.price,
    placeInfo.website,
      placeInfo.bookInAdvance,
    sources
  ])

  const placePhotos = useMemo(() => {
    return (
        <Paper elevation={4} className={classes.paperContent}>
          <PhotosInfo
              photos={photos}
              setPhotos={setPhotos}
          />
        </Paper>
    )
  }, [photos])

  const placeLocation = useMemo(() => {
    return (
        <Paper elevation={4} className={classes.paperContent}>
          <PlaceLocation
              placeInfo={placeInfo}
              locationData={locationData}
              setParkingLocation={setParkingMarkerData}
              setLocationData={setLocationData}/>
        </Paper>
    )
  }, [locationData])

  const parkingLocation = useMemo(() => {
    return (
        <Paper elevation={4} className={classes.paperContent}>
          <ParkingLocation
              placeInfo={placeInfo}
              allSelectedParkingData={allSelectedParkingData}
              setAllSelectedParkingData={setAllSelectedParkingData}
              locationData={parkingMarkerData}
              setLocationData={setParkingMarkerData}/>
        </Paper>
    )
  }, [allSelectedParkingData, parkingMarkerData])

  const placeDiscovery = useMemo(() => {
    return (
        <Paper elevation={4} className={classes.paperContent}>
          <PlaceDiscovery
              placeInfo={placeInfo}
              setPlaceInfo={setPlaceInfo}
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}/>
        </Paper>
    )
  }, [selectedCategories, selectedTags, placeInfo])


  const scheduleContainer = useMemo(() => {
    return (
        <Paper elevation={4} className={classes.paperContent}>
          {<SchedulesContainer scheduleData={scheduleData} setScheduleData={setScheduleData}
                               scheduleOpenIndex={scheduleOpenIndex}
                               setScheduleOpenIndex={setScheduleOpenIndex}
                               seasonalScheduleEnabled={seasonalScheduleEnabled}
                               setSeasonalScheduleEnabled={setSeasonalScheduleEnabled}
                               setLastAccommodation={setLastAccommodation}
                               isScheduleEnabled={isScheduleEnabled}
                               setIsScheduleEnabled={setIsScheduleEnabled}
                               lastAccommodation={lastAccommodation}/>}
        </Paper>
    )
  }, [scheduleData, scheduleOpenIndex, lastAccommodation, seasonalScheduleEnabled, isScheduleEnabled])

  return (
      <div className={classes.root}>

        {firstTimeLoading ? <div className={classes.loader}><CircularProgress/></div> :
            <div className={classes.content}>

              {basicPlaceInfo}

              {placeId !== undefined ?
                  <Paper elevation={4} className={classes.paperContent}>
                    <Reviews
                        placeInfo={placeInfo}
                    />
                  </Paper>
                  : null}

              {placePhotos}
              {placeLocation}
              {parkingLocation}
              {placeDiscovery}
              {scheduleContainer}
            </div>}


        {isLoading ? <LinearProgress/> : null}

        <Paper elevation={1} className={classes.bottom}>

          {
            placeInfo['isVerified'] === false && placeId !== undefined ?
                <ColorButton
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      verifyPlace()
                    }}
                    className={classes.button}
                >
                  Verify place
                </ColorButton>
                :
                <FormControlLabel
                    control={<Switch checked={placeInfo['isPublic']} onChange={() => {
                      publishPlace()
                    }
                    } name="isPublic"/>}
                    label="Make this place public"
                />}
          <Button
              variant="contained"
              color="primary"
              onClick={() => saveChanges()}
              className={classes.button}>
            Save
          </Button>

          {placeId != null ?
              <Button
                  variant="contained"
                  color="primary"
                  onClick={() => addToRecommendation()}
                  className={classes.button}>
                Add to recommendation
              </Button> : null
          }


          <RecommendationListDialog
              open={showRecommendationDialog}
              setOpen={setShowRecommendationDialog}
              objectId={placeInfo.placeId}
              type={RecommendationType.place}
          />

        </Paper>
      </div>)

}

AddPlace.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(AddPlace)


