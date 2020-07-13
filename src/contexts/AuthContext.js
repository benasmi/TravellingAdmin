import React, {useEffect, useState} from "react";
import {getRefreshToken} from "../helpers/tokens";
import API from "../Networking/API";
export const AuthContext = React.createContext();

export const AuthProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        console.log("user data", currentUser)
    }, [currentUser])

    useEffect(()=>{
        let refreshToken = getRefreshToken();
        if(refreshToken !== "" && refreshToken !== undefined){
                API.User.getUserProfile().then(user=>{
                    console.log("Fetched user", user);
                    setCurrentUser(user);
                    setIsLoading(false)
                }).catch(error=>{
                    console.log(error);
                    setIsLoading(false)
                })
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