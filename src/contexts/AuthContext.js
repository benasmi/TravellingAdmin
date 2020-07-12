import React, {useEffect, useState} from "react";
import app from "../helpers/firebaseInit"
import Cookies from "js-cookie"
import API from "../Networking/API";
import {getAccessToken, getRefreshToken} from "../helpers/tokens";
export const AuthContext = React.createContext();

export const AuthProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(()=>{
        let refreshToken = getRefreshToken();
        console.log("Refresh token", refreshToken);
        if(refreshToken !== "" && refreshToken !== undefined){
            console.log("Refresh token is not empty. Retrieving user on load", refreshToken);
            API.Auth.refreshToken({refreshToken: refreshToken, provider: "local"}).then(response=>{
                let accessToken = response.access_token;
                localStorage.setItem("access_token", accessToken);
                API.Auth.getUserProfile(accessToken).then(user=>{
                    console.log("Fetched user", user);
                    setCurrentUser(user);
                    setIsLoading(false)
                }).catch(error=>{
                    console.log(error);
                    setIsLoading(false)
                })
            }).then().catch(error=>{
                console.log(error);
                setIsLoading(false)
            });
        }else{
            console.log("Refresh token is empty. No actions taken.")
        }
    },[]);


    return (
        <AuthContext.Provider
            value={{
                currentUser,
                setCurrentUser,
                isLoading
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};