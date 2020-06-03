import React, { useState } from 'react';

export const AppBarTitleContext = React.createContext({
    title: "",
    setTitle: () => {},
});

export default function AppBarTitleProvider({ children }) {
    const [title, setTitle] = useState("Home");

    const contextValue = {
        title,
        setTitle: (title) => setTitle(title)
    };

    return (
        <AppBarTitleContext.Provider value={contextValue}>
            {children}
        </AppBarTitleContext.Provider>
    );
}