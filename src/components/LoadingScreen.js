import React, {useContext} from "react";
import {AuthContext} from "../contexts/AuthContext";



export default function LoadingScreen() {
    const { currentUser } = useContext(AuthContext);

    return (currentUser === undefined || currentUser === null) ? <div style={{background: 'red', width: "100%", height: "100%"}}>

    </div> : null

}