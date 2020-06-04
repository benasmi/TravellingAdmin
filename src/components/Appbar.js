import React, {Fragment, useEffect, useState} from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Router, Route, Link, Switch } from "react-router-dom";
import Home from "../pages/Home";
import Places from "../pages/Places";
import AddPlace from "../pages/AddPlace";
import history from "../helpers/history";
import ApiPlaces from "../pages/ApiPlaces";
import UseSnackbarContext from "../contexts/UseSnackbarContext";
import UseAppBarTitleContext from "../contexts/UseAppBarTitleContext";
import NotFoundPage from "../pages/NotFoundPage";
import Redirect from "react-router-dom/es/Redirect";

const drawerWidth = 240;


const useStyles = makeStyles((theme) => ({
    root1: {
        overflow: "hidden",
        display: 'flex',
        height: "100vh",
        background: "#F1F1F1"
    },
    appBar: {
        height: "64px",
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    content: {
        width: "100vw",
        height: "100%",
        //padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
    },
    contentShift: {
        width: "100vw",
        height: "100%",
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0
    },
}));


export default function Appbar(props) {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const { title, setTitle } = UseAppBarTitleContext();

    console.log(props)

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <div className={classes.root1}>
            <CssBaseline />
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.menuButton, open && classes.hide)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap>
                        {title}
                    </Typography>
                </Toolbar>
            </AppBar>

            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="left"
                open={open}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <div className={classes.drawerHeader}>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </div>

                <Divider />
                <List>
                    <ListItem button component={Link} to="/app/" onClick={()=>setTitle("Home")}>
                        <ListItemText>Home</ListItemText>
                    </ListItem>
                    <Divider light />
                    <ListItem button component={Link} to="/app/places" onClick={()=>setTitle("Places")} >
                        <ListItemText>Places</ListItemText>
                    </ListItem>
                    <ListItem button component={Link} to="/app/apiplaces" onClick={()=>setTitle("Api places")} >
                        <ListItemText>Explore API places</ListItemText>
                    </ListItem>
                    <ListItem button component={Link} to="/app/addplace" onClick={()=>setTitle("Add Place")} >
                        <ListItemText>Add place</ListItemText>
                    </ListItem>
                </List>
            </Drawer>
            <main
                className={clsx(classes.content, {
                    [classes.contentShift]: open,
                })}
            >
                <div className={classes.drawerHeader} />
                <Switch>
                    <Route exact path="/app" component={Home} />
                    <Route path="/app/places" component={Places} />
                    <Route path="/app/addplace/:placeId?" component={AddPlace} />
                    <Route path="/app/apiplaces" component={ApiPlaces} />
                    <Route path="/app/addplace" component={AddPlace} />
                    <Redirect from="*" to="/404"/>
                </Switch>

            </main>
        </div>
    );
}
