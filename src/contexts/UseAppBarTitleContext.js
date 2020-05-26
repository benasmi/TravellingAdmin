import React, {useContext} from "react";
import {AppBarTitleContext} from "./AppBarTitleContext";

export default function UseAppBarTitleContext() {
    const { title, setTitle } = useContext(AppBarTitleContext);
    return { title, setTitle };
}
