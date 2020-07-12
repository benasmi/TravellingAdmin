import React, {useEffect, useState} from "react";
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