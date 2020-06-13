import {arrayMove, SortableContainer, SortableElement} from "react-sortable-hoc";
import React, {useMemo, useState} from "react"
import {withStyles} from "@material-ui/core/styles";
import Gallery from "react-photo-gallery";
import CardMedia from "@material-ui/core/CardMedia";
import Delete from "@material-ui/icons/Delete"
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import CardActions from "@material-ui/core/CardActions";
import DeleteIcon from "@material-ui/icons/Delete";

const imgWithClick = {cursor: "pointer"};

const Photo = ({index, onItemDelete, photo, margin, direction, top, left}) => {

    const styles = {
        imgContainer: {
            margin: margin,
            display: 'inline',
            position: 'relative',
            width: '300px',
            height: '300px',
        }
    }
    if (direction === "column") {
        styles.imgContainer.position = "absolute";
        styles.imgContainer.imgStyle.left = left;
        styles.imgContainer.imgStyle.top = top;
    }

    const handleDelete = event => {
        onItemDelete(photo);
    }

    return (

        <Card style={styles.imgContainer}>
            <CardMedia
                style={{height: 0, paddingTop: '80%'}}
                image={photo.src}
            />
            <CardActions disableSpacing>
                <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<DeleteIcon/>}
                    onClick={(event) => {
                        handleDelete(event)
                    }}
                >
                    Delete
                </Button>
            </CardActions>

        </Card>
    )

};

const SortablePhoto = SortableElement((item) => <Photo {...item} />);
//const SortablePhoto = SortableElement(item => <img {...item}/>)
const SortableGallery = SortableContainer(({items, onItemDelete}) => (
    <Gallery photos={items} renderImage={props => <SortablePhoto {...props} onItemDelete={onItemDelete}/>}/>
));

function ReorderablePhotos(props) {
    let {setPhotos, photos, srcName, keyName} = props
    const onSortEnd = ({oldIndex, newIndex}) => {
        setPhotos(arrayMove(photos, oldIndex, newIndex));
    };

    function handleItemDelete(photo) {
        setPhotos(photos.filter(item => {
            return item[keyName].toString() !== photo.key
        }))
    }

    let modifiedData = photos.map(item => {
        return (
            {
                key: item[keyName].toString(),
                src: item[srcName],
                width: 1,
                height: 1
            })

    })
    return (
        <div>
            <SortableGallery pressDelay={200}
                             disableAutoscroll={false} items={modifiedData} onSortEnd={onSortEnd}
                             axis={"xy"} onItemDelete={handleItemDelete}/>
        </div>
    );

}


export default ReorderablePhotos