import React, {useEffect, useState} from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import AutocompleteChip from "../AutocompleteChip";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import AddDialog from "../AddDialog";
import API from "../../Networking/API";


const styles = theme => ({
    outline: {
        margin: theme.spacing(1),
        padding: theme.spacing(1),
        width: '100%'
    },
    button: {
        margin: theme.spacing(2)
    },
    paper:{
        padding: theme.spacing(2),
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: "8px"
    },
});

function PlaceDiscovery({classes, selectedTags, setSelectedTags, selectedCategories, setSelectedCategories}) {

    const [dialogAddTagOpen, setDialogAddTagOpen] = useState(false);
    const [dialogAddCategoryOpen, setDialogAddCategoryOpen] = useState(false);

    const [availableCategories, setAvailableCategories] = useState([]);
    const [availableTags, setAvailableTags] = useState([]);


    const updateTags = () => {
        API.Tags.getAllTags().then(response=>{
            setAvailableTags(response);
            console.log(response);
        }).catch(error=>{
            console.log(error)
        })
    };
    const updateCategories = () => {
        API.Categories.getAllCategories().then(response=>{
            setAvailableCategories(response)
            console.log(response);
        }).catch(error=>{
            console.log(error)
        });
    };

    useEffect(()=>{
        console.log("ParsiunciaasdasdkasfkjlasdnfoasdFJasdfn;FN;")
        updateTags();
        updateCategories();
    },[]);

    const handleAddCategory = (value) => {
        API.Categories.addCategory([{name: value}]).then(response=>{
            let newCat = {categoryId: response[0], name: value};
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
            setDialogAddCategoryOpen(false)

        }).catch(error=>{
            console.log(error)
        })
    };



    const handleAddTag = (value) => {
        API.Tags.addTag([{name: value}]).then(response=>{
            let newTag = {tagId: response[0], name: value}
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
            setDialogAddTagOpen(false)

        }).catch(error=>{
            console.log(error)
        })
    };

    return <div>
        <Typography variant="h6" >
            Place discovery settings
        </Typography>
        <br/>
        <Typography variant="subtitle1" >
            Select tags
        </Typography>
        <AutocompleteChip label="Select tags" id="tagId" options={availableTags} selectedOptions={selectedTags} setSelectedOptions ={setSelectedTags}/>
        <Button
            variant="text"
            color="primary"
            size="small"
            className={classes.button}
            onClick={() => setDialogAddTagOpen(true)}
            startIcon={<AddIcon />}>
            Add missing tag
        </Button>
        <AddDialog action={handleAddTag} textFieldLabel="Name" open={dialogAddTagOpen} onCloseCallback={() => setDialogAddTagOpen(false)} header = "Add a new tag" />

        <br/>
        <br/>
        <Typography variant="subtitle1" >
            Select categories
        </Typography>
        <AutocompleteChip label="Select categories" id="categoryId" options={availableCategories} selectedOptions={selectedCategories} setSelectedOptions={setSelectedCategories}/>
        <Button
            variant="text"
            color="primary"
            size="small"
            className={classes.button}
            onClick={() => setDialogAddCategoryOpen(true)}
            startIcon={<AddIcon />}>
            Add missing category
        </Button>
        <AddDialog action={handleAddCategory} textFieldLabel="Name" open={dialogAddCategoryOpen} onCloseCallback={() => setDialogAddCategoryOpen(false)} header = "Add a new category" />

    </div>
}

export default withStyles(styles)(PlaceDiscovery)