import React, {useEffect, useState} from "react";
import API from "../Networking/API";
import {getAccessToken, getRefreshToken} from "../helpers/tokens";
export const AuthContext = React.createContext();

export const AuthProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

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