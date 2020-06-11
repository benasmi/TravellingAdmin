import React, {useEffect, useState} from "react";
import app from "../helpers/firebaseInit"
export const AuthContext = React.createContext();

export const AuthProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(()=>{
        app.auth().onAuthStateChanged(function (user) {
            if (user) {
                setCurrentUser(user);

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