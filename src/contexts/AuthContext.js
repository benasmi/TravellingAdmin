import React, {useEffect, useState} from "react";
import app from "../helpers/firebaseInit"
import Cookies from "js-cookie"
import {getAccessToken} from "../helpers/tokens";
export const AuthContext = React.createContext();

export const AuthProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(()=>{
        app.auth().onAuthStateChanged(function (user) {
            if (user) {
                setCurrentUser(user);
                console.log(getAccessToken())
                // app.auth().currentUser.getIdToken(true).then(function (idToken) {
                //     console.log("Getting new access token");
                //     Cookies.set("access_token", idToken);
                // }).catch(function (error) {
                //
                // });
            }
            setIsLoading(false)
        });
    },[]);


    return (
        <AuthContext.Provider
            value={{
                currentUser,
                isLoading
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};