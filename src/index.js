import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import history from "./helpers/history";
import * as firebase from "firebase";
import LoginPage from "./pages/LoginPage";
import { Router, Route, Link, Switch} from "react-router-dom";
import Places from "./pages/Places";
import AddPlace from "./pages/AddPlace";
import {AuthenticatedRoute} from "./components/AuthenticatedRoute";
import NotFoundPage from "./pages/NotFoundPage";
import Redirect from "react-router-dom/es/Redirect";
import SnackbarProvider from "./contexts/SnackbarContext";
import SnackbarFeedback from "./components/feedback/SnackbarFeedback";
import {MuiPickersUtilsProvider} from "@material-ui/pickers";
import AlertDialogProvider from "./contexts/AlertDialogContext";
import AlertDialogFeedback from "./components/feedback/AlertDialogFeedback";

var firebaseConfig = {
    apiKey: "AIzaSyBRhTGXvKq0RD-ajkbOndOIK9c03wg9vRo",
    authDomain: "travel-fd76c.firebaseapp.com",
    databaseURL: "https://travel-fd76c.firebaseio.com",
    projectId: "travel-fd76c",
    storageBucket: "travel-fd76c.appspot.com",
    messagingSenderId: "654752782594",
    appId: "1:654752782594:web:478b4a1d8a17c52975ca1b"
};
firebase.initializeApp(firebaseConfig);

ReactDOM.render(
    <Router history={history}>
        <SnackbarProvider>
            <AlertDialogProvider>
                <SnackbarFeedback/>
                <AlertDialogFeedback/>
                <Switch>
                    <Redirect exact from="/" to="/app"/>
                    <AuthenticatedRoute path="/app" component={App} />
                    <Route path="/login" component={LoginPage} />
                    <Route path="*" component={NotFoundPage}/>
                    <Redirect from="*" to="/404" />
                </Switch>
            </AlertDialogProvider>
        </SnackbarProvider>
    </Router>, document.getElementById('root'));
