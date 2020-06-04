import React, {useState} from 'react';
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
}));


export default function LoginPage() {
    const classes = useStyles();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setIsLoading] = useState(false)
    const { addConfig } = UseSnackbarContext();


    const handleLogin = () =>{
        setIsLoading(true);
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
            setIsLoading(false)
            addConfig(false, error.message)
        });

        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                firebase.auth().currentUser.getIdToken(false).then(function(idToken) {
                    Cookies.set("access_token", idToken);
                    history.push("/app");
                    setIsLoading(false)
                }).catch(function(error) {
                    setIsLoading(false);
                    addConfig(false, "Unable to recieve access token")
                });
            } else {
                setIsLoading(false);
                addConfig(false, "Wrong credentials")
            }
        });
    };

    return (
        <Container component="main" maxWidth="xs">
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
    );
}