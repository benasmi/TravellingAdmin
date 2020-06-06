import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import history from "./helpers/history";
import LoginPage from "./pages/LoginPage";
import { Router, Route, Link, Switch} from "react-router-dom";
import {AuthenticatedRoute} from "./components/AuthenticatedRoute";
import NotFoundPage from "./pages/NotFoundPage";
import Redirect from "react-router-dom/es/Redirect";
import SnackbarProvider from "./contexts/SnackbarContext";
import SnackbarFeedback from "./components/feedback/SnackbarFeedback";
import AlertDialogProvider from "./contexts/AlertDialogContext";
import AlertDialogFeedback from "./components/feedback/AlertDialogFeedback";
import {AuthProvider} from "./contexts/AuthContext";

require('dotenv').config();

ReactDOM.render(
    <AuthProvider>
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
        </Router>
    </AuthProvider>
   , document.getElementById('root'));
