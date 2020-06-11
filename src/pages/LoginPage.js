import React, {useContext, useEffect, useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Cookies from 'js-cookie'
import * as firebase from "firebase";
import history from "../helpers/history";
import UseSnackbarContext from "../contexts/UseSnackbarContext";
import LinearProgress from "@material-ui/core/LinearProgress";
import app from "../helpers/firebaseInit";
import {AuthContext} from "../contexts/AuthContext";
import Redirect from "react-router-dom/es/Redirect";
import CircularProgress from "@material-ui/core/CircularProgress";
import {isAuthenticated} from "../helpers/tokens";

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
                Traveldirection {' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    loaderMain: {
        width: "100%",
        height: "100%",
        alignItems:"center",
        justifyContent: "center",
        backgroundColor: "red"
    }
}));


export default function LoginPage() {
    const classes = useStyles();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setIsLoading] = useState(false);
    const { addConfig } = UseSnackbarContext();
    const { currentUser, isLoading } = useContext(AuthContext);


    const handleLogin = () =>{
        setIsLoading(true);
        app.auth().signInWithEmailAndPassword(email , password)
            .then(function(user) {
                setIsLoading(false)
                app.auth().currentUser.getIdToken(true).then(function (idToken) {
                    console.log("Getting new access token");
                    Cookies.set("access_token", idToken);
                    history.push("/app");
                }).catch(function (error) {
                    addConfig(false, "Error receiving access token")
                });
            })
            .catch(function(error) {
                setIsLoading(false);
                addConfig(false, error.message)
            });
    };


    if (isAuthenticated()) {
        return <Redirect to="/app" />;
    }

    const handleKeyPress = (event) =>{
        if (event.which === 13 || event.keyCode === 13) {
            handleLogin();
            return false;
        }
        return true;
    };

    return <Container component="main" maxWidth="xs" onKeyPress={(e)=>handleKeyPress(e)}>

                            {loading && <LinearProgress />}
                            <CssBaseline />
                            <div className={classes.paper}>
                                <Avatar className={classes.avatar}>
                                    <LockOutlinedIcon />
                                </Avatar>
                                <Typography component="h1" variant="h5">
                                    Sign in
                                </Typography>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    value={email}
                                    onChange={(e)=>{setEmail(e.target.value)}}
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    autoFocus
                                />
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    value={password}
                                    onChange={(e)=>{setPassword(e.target.value)}}
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                />
                                <Button
                                    onClick={()=>{handleLogin()}}
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className={classes.submit}
                                >
                                    Sign In
                                </Button>
                            </div>
                            <Box mt={8}>
                                <Copyright />
                            </Box>
                        </Container>

}