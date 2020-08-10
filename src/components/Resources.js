import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";
import React, {useEffect, useState} from "react";
import TableComponent from "./TableComponent";
import API from "../Networking/API";
import UseAlertDialogContext from "../contexts/UseAlertDialogContext";
import Strings from "../helpers/stringResources";
import UseSnackbarContext from "../contexts/UseSnackbarContext";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import history from "../helpers/history";
import AddIcon from "@material-ui/icons/Add";
import AddDialog from "./AddDialog";
import UseEditDialogContext from "../contexts/UseEditDialogContext";

const styles = theme => ({
    root: {
        height: "100vh",
        width: "100%",
        overflow: "auto",
    },
    content: {
        display: 'flex',
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        [theme.breakpoints.down("lg")]: {
            padding: theme.spacing(1),
        },
        [theme.breakpoints.up("lg")]: {
            padding: theme.spacing(8),
        },
    },
    buttonWrapper: {
        display: "flex",
        justifyContent: "flex-end",
        width: "100%",
    }
})

const categoriesHeadCells = [
    {id: 'name', numeric: false, disablePadding: false, label: 'Category name', isId: false},
    {id: 'actions', numeric: false, disablePadding: false, label: 'Actions', isId: false}
]
const tagsHeadCells = [
    {id: 'name', numeric: false, disablePadding: false, label: 'Tag name', isId: false},
    {id: 'actions', numeric: false, disablePadding: false, label: 'Actions', isId: false}
]

function Resources({classes}) {

    const {addAlertConfig} = UseAlertDialogContext();
    const {addConfig} = UseSnackbarContext();
    const {addEditDialogConfig} = UseEditDialogContext();

    const [loading, setIsLoading] = useState({
        categories: false,
        tags: false
    })

    const [categories, setCategories] = useState([])
    const [tags, setTags] = useState([])

    useEffect(() => {
        setIsLoading({categories: true, tags: true})
        Promise.all([
                API.Categories.getAllCategories(),
                API.Tags.getAllTags()
            ]
        ).then(response => {
            setCategories(response[0])
            setTags(response[1])
        }).catch(() => {
            addConfig(false, "Could not retrieve data!")
        }).finally(() => {
            setIsLoading(oldData => {return{ ...oldData, categories: false, tags: false}})
        })
    }, [])

    const handleAddCategory = () => {
        addEditDialogConfig({
            title: "Add category",
            explanation: "Type the category name",
            onDoneCallback: (text) => {
               API.Categories.addCategory([{name: text}]).then((response)=>{
                   addConfig(true, "Category inserted successfully")
                   setCategories(oldData => [...oldData, {name: text, categoryId: response[0]}])
                }).catch(error=>{
                   addConfig(false, "Failed to add category.")
               })
            },
            validateInput: (input) => {return input.length > 0 ? 0 : 1},
            textFieldLabel: "Restaurants, hiking, etc..."
        })
    }

    const removeCategoryCallback = (categoryId) => {
        let categoryName = categories.filter(item => item.categoryId === categoryId)[0].name
        addAlertConfig("Warning", "Are you sure you want the category, named '" + categoryName + "'?", [{
            name: "yes", action: () => {
                setIsLoading(oldData => {
                    return {...oldData, categories: true}
                })
                API.Categories.removeCategory([{categoryId: categoryId}]).then(() => {
                    addConfig(true, "Category successfully removed.")
                    setCategories(oldData => oldData.filter(item => item.categoryId !== categoryId))
                }).catch(() => {
                    addConfig(false, "An error has occurred while removing category.")
                }).finally(() => {
                    setIsLoading(oldData => {
                        return {...oldData, categories: false}
                    })
                })
            }
        }], () => {
        })
    }

    const updateCategoryHandler = (categoryId) => {
        let categoryName = categories.filter(item => item.categoryId === categoryId)[0].name
        addEditDialogConfig({
            title: "Edit category",
            explanation: "Type the category name",
            defaultText: categoryName,
            onDoneCallback: (text) => {
                API.Categories.updateCategory([{name: text, categoryId: categoryId}]).then(()=>{
                    addConfig(true, "Category updated successfully")
                    setCategories(oldData => {return oldData.map(item => {
                        if(item.categoryId === categoryId)
                            return {...item, name: text}
                        else return item
                    })})
                }).catch(()=>{
                    addConfig(false, "Failed to update category.")
                })
            },
            validateInput: (input) => {return input.length > 0 ? 0 : 1},
            textFieldLabel: "Restaurants, hiking, etc..."
        })
    }

    const updateTagHandler = (id) => {
        let tagName = tags.filter(item => item.tagId === id)[0].name
        addEditDialogConfig({
            title: "Edit tag",
            explanation: "Type the tag name",
            defaultText: tagName,
            onDoneCallback: (text) => {
                API.Tags.updateTags([{name: text, tagId: id}]).then(()=>{
                    addConfig(true, "Tag updated successfully")
                    setTags(oldData => {return oldData.map(item => {
                        if(item.tagId === id)
                            return {...item, name: text}
                        else return item
                    })})
                }).catch(()=>{
                    addConfig(false, "Failed to update tag.")
                })
            },
            validateInput: (input) => {return input.length > 0 ? 0 : 1},
            textFieldLabel: "Warm, quick, cozy..."
        })
    }

    const removeTagHandler = (id) => {
        let tagName = tags.filter(item => item.tagId === id)[0].name
        addAlertConfig("Warning", "Are you sure you want the tag, named '" + tagName + "'?", [{
            name: "yes", action: () => {
                setIsLoading(oldData => {
                    return {...oldData, tags: true}
                })
                API.Tags.removeTags([{tagId: id}]).then(() => {
                    addConfig(true, "Tag successfully removed.")
                    setTags(oldData => oldData.filter(item => item.tagId !== id))
                }).catch(() => {
                    addConfig(false, "An error has occurred while removing tag.")
                }).finally(() => {
                    setIsLoading(oldData => {
                        return {...oldData, tags: false}
                    })
                })
            }
        }], () => {
        })
    }

    const handleAddTag = () => {
        addEditDialogConfig({
            title: "Add tag",
            explanation: "Type the tag name",
            onDoneCallback: (text) => {
                API.Tags.addTag([{name: text}]).then((response)=>{
                    addConfig(true, "Tag inserted successfully")
                    setTags(oldData => [...oldData, {name: text, tagId: response[0]}])
                }).catch(()=>{
                    addConfig(false, "Failed to add tag.")
                })
            },
            validateInput: (input) => {return input.length > 0 ? 0 : 1},
            textFieldLabel: "Warm, quick, cozy..."
        })
    }

    const searchFunction = (keyword, item) => {
        if(keyword.length < 1) return true
        return item.name.includes(keyword)
    }

    return (
        <div className={classes.root}>
            <div className={classes.content}>

                <TableComponent
                    title={"Categories"}
                    headCells={categoriesHeadCells}
                    data={categories}
                    pagingInfo={null}
                    checkable={false}
                    searchFunction={searchFunction}
                    changePageCallback={() => {}}
                    updateCallback={updateCategoryHandler}
                    removeCallback={removeCategoryCallback}
                    id={"categoryId"}
                    isLoading={loading.categories}
                />

                <Box className={classes.buttonWrapper}>
                    <Button
                        variant="text"
                        color="secondary"
                        size="large"
                        onClick={handleAddCategory}
                        startIcon={<AddIcon/>}>
                        Add a new category
                    </Button>
                </Box>

                <br/>

                <TableComponent
                    title={"Tags"}
                    headCells={tagsHeadCells}
                    data={tags}
                    pagingInfo={null}
                    checkable={false}
                    searchFunction={searchFunction}
                    changePageCallback={() => {}}
                    updateCallback={updateTagHandler}
                    removeCallback={removeTagHandler}
                    id={"tagId"}
                    isLoading={loading.tags}
                />

                <Box className={classes.buttonWrapper}>
                    <Button
                        variant="text"
                        color="secondary"
                        size="large"
                        onClick={handleAddTag}
                        startIcon={<AddIcon/>}>
                        Add a new tag
                    </Button>
                </Box>
            </div>

        </div>
    )
}

Resources.propTypes = {
};

export default withStyles(styles)(Resources)
