import Route from "react-router-dom/es/Route";
import React from "react";
import Redirect from "react-router-dom/es/Redirect";
import {isAuthenticated} from '../helpers/auth'

export const AuthenticatedRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
        isAuthenticated() === true
            ? <Component {...props} />
            : <Redirect to='/login' />
    )} />
);