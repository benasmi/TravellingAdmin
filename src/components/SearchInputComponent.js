import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import DirectionsIcon from '@material-ui/icons/Directions';
import {debounce} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        margin: theme.spacing(2)
        // width: 400,
    },
    iconButton: {
        padding: 10,
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    divider: {
        // height: 28,
        margin: 4,
    },
}));

export default function SearchInputComponent({hint, searchCallback}) {
    const classes = useStyles();

    const debouncedInput = (event) => {
        searchCallback(event.target.value)
    }

    const debounceInput = debounce(event => debouncedInput(event), 300)

    const handleInput = (event) => {
        event.persist()
        debounceInput(event)
    }

    return (
        <Paper component="form" className={classes.root}>
            <InputBase
                className={classes.input}
                placeholder={hint}
                inputProps={{ 'aria-label': hint }}
                onChange={handleInput}
            />
            <IconButton className={classes.iconButton} aria-label="search">
                <SearchIcon />
            </IconButton>
            <Divider className={classes.divider} orientation="vertical" />
        </Paper>
    );
}