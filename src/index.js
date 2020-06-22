import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import history from "./helpers/history";
import LoginPage from "./pages/LoginPage";
import {Router, Route, Link, Switch} from "react-router-dom";
import {AuthenticatedRoute} from "./components/AuthenticatedRoute";
import NotFoundPage from "./pages/NotFoundPage";
import Redirect from "react-router-dom/es/Redirect";
import SnackbarProvider from "./contexts/SnackbarContext";
import SnackbarFeedback from "./components/feedback/SnackbarFeedback";
import AlertDialogProvider from "./contexts/AlertDialogContext";
import AlertDialogFeedback from "./components/feedback/AlertDialogFeedback";
import {AuthProvider} from "./contexts/AuthContext";
import {PlacesFilterProvider} from "./contexts/PlacesFilterContext";
import EditDialogProvider from "./contexts/EditDialogContext";
import {TextInputDialog} from "./components/feedback/TextInputDialog";

require('dotenv').config();

ReactDOM.render(
    <AuthProvider>
        <Router history={history}>
            <PlacesFilterProvider>
            <SnackbarProvider>
                <AlertDialogProvider>
                    <EditDialogProvider>
                        <SnackbarFeedback/>
                        <AlertDialogFeedback/>
                        <TextInputDialog/>
                        <Switch>
                            <Redirect exact from="/" to="/app"/>
                            <AuthenticatedRoute path="/app" component={App}/>
                            <Route path="/login" component={LoginPage}/>
                            <Route path="*" component={NotFoundPage}/>
                            <Redirect from="*" to="/404"/>
                        </Switch>
                    </EditDialogProvider>
                </AlertDialogProvider>
            </SnackbarProvider>
            </PlacesFilterProvider>
        </Router>
    </AuthProvider>
    , document.getElementById('root'));
