import React, {useEffect, useState} from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import AutocompleteChip from "../AutocompleteChip";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import API from "../../Networking/API";
import UseEditDialogContext from "../../contexts/UseEditDialogContext";
import UseSnackbarContext from "../../contexts/UseSnackbarContext";
import Slider from "@material-ui/core/Slider";
import Input from "@material-ui/core/Input";


const styles = theme => ({
  outline: {
    margin: theme.spacing(1),
    padding: theme.spacing(1),
    width: '100%'
  },
  button: {
    margin: theme.spacing(2)
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "8px"
  },
  slider:{
    flex: 1,
    marginRight: 10
  },
  sliderContainer: {
    display: 'flex',
    flexDirection: 'row'
  },
  sliderInput: {

  },
});

function PlaceDiscovery({classes, selectedTags, setSelectedTags, selectedCategories, setSelectedCategories, placeInfo, setPlaceInfo}) {

  const [availableCategories, setAvailableCategories] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);

  const grade = placeInfo.grade
  const setGrade = (value) => {
    setPlaceInfo(info => {
      return {...info, grade: value}
    })
  }

  const {addEditDialogConfig} = UseEditDialogContext();
  const {addConfig} = UseSnackbarContext();

  const updateTags = () => {
    API.Tags.getAllTags().then(response => {
      setAvailableTags(response);
    }).catch(error => {
      console.log(error)
    })
  };
  const updateCategories = () => {
    API.Categories.getAllCategories().then(response => {
      setAvailableCategories(response)
    }).catch(error => {
      console.log(error)
    });
  };

  useEffect(() => {
    updateTags();
    updateCategories();
  }, []);


  const promptAddTag = () => {
    addEditDialogConfig({
      title: "Add tag",
      explanation: "Type the tag name",
      onDoneCallback: (tagName) => {
        API.Tags.addTag([{name: tagName}]).then(response => {
          let newTag = {tagId: response[0], name: tagName}
          setAvailableTags(
              [
                ...availableTags,
                newTag
              ]
          );
          setSelectedTags([
            ...selectedTags,
            newTag
          ]);

        }).catch(() => {
          addConfig(false, "Failed to add tag.")
        })
      },
      errorMessages: {
        1: "The tag name is too short",
        2: "A tag with identical name already exists. You should choose the existing tag instead"
      },
      validateInput: (input) => {
        if (input.length < 0) {
          return 1 //Input too short
        } else if (availableTags.filter(item => item.name === input).length !== 0) {
          return 2 //Identical tag already exists
        }
        return 0
      },
      textFieldLabel: "Warm, quick, cozy..."
    })
  }

  const promptAddCategory = () => {
    addEditDialogConfig({
      title: "Add category",
      explanation: "Type the category name",
      onDoneCallback: (categoryName) => {
        API.Categories.addCategory([{name: categoryName}]).then(response => {
          let newCat = {categoryId: response[0], name: categoryName};
          setAvailableCategories(
              [
                ...availableCategories,
                newCat
              ]
          );
          setSelectedCategories([
            ...selectedCategories,
            newCat
          ]);
        }).catch(error => {
          addConfig(false, "Failed to add category.")
        })
      },
      errorMessages: {
        1: "The category name is too short",
        2: "A category with identical name already exists. You should choose the existing category instead"
      },
      validateInput: (input) => {
        if (input.length < 0) {
          return 1 //Input too short
        } else if (availableCategories.filter(item => item.name === input).length !== 0) {
          return 2 //Identical category already exists
        }
        return 0
      },
      textFieldLabel: "Restaurant, hotel, hiking..."
    })
  }

  return <div>
    <Typography variant="h6">
      Place discovery settings
    </Typography>
    <br/>
    <Typography variant="subtitle1">
      Select tags
    </Typography>
    <AutocompleteChip label="Select tags"
                      id="tagId"
                      options={availableTags}
                      setOptions={setAvailableTags}
                      selectedOptions={selectedTags}
                      setSelectedOptions={setSelectedTags}/>

    <Button
        variant="text"
        color="primary"
        size="small"
        className={classes.button}
        onClick={promptAddTag}
        startIcon={<AddIcon/>}>
      Add missing tag
    </Button>

    <br/>
    <br/>
    <Typography variant="subtitle1">
      Select categories
    </Typography>
    <AutocompleteChip label="Select categories"
                      id="categoryId"
                      options={availableCategories}
                      setOptions={setAvailableCategories}
                      selectedOptions={selectedCategories}
                      setSelectedOptions={setSelectedCategories}/>
    <Button
        variant="text"
        color="primary"
        size="small"
        className={classes.button}
        onClick={promptAddCategory}
        startIcon={<AddIcon/>}>
      Add missing category
    </Button>

    <br/>
    <Typography variant="subtitle1">
      Grade this place
    </Typography>

    <div className={classes.sliderContainer}>
      <Slider
          className={classes.slider}
          value={grade}
          onChange={(event, value) => {
            setGrade(value)
          }
          }
          max={100}
          min={0}
          aria-labelledby="input-slider"
      />

      <Input
          className={classes.sliderInput}
          value={grade}
          margin="dense"
          onChange={(event) => {
            setGrade(event.target.value === '' ? '' : Number(event.target.value));
          }}
          onBlur={() => {
            if (grade < 0) {
              setGrade(0);
            } else if (grade > 100) {
              setGrade(100);
            }
          }}
          inputProps={{
            step: 1,
            min: 0,
            max: 100,
            type: 'number',
            'aria-labelledby': 'input-slider',
          }}
      />
    </div>
  </div>
}

export default withStyles(styles)(PlaceDiscovery)