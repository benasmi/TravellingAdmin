import Route from "react-router-dom/es/Route";
import React, {useContext} from "react";
import Redirect from "react-router-dom/es/Redirect";
import {isAuthenticated} from "../helpers/tokens";

export const AuthenticatedRoute = ({ component: Component, ...rest }) => {
    return (
        <Route
            {...rest}
            render={routeProps =>
                isAuthenticated() === true ? (
                    <Component {...routeProps} />
                ) : (
                    <Redirect to={"/login"} />
                )
            }
        />
    );
};