import React, {useContext} from "react";
import {AlertDialogContext} from "./AlertDialogContext";

export default function UseAlertDialogContext() {
    const { alertConfig, addAlertConfig, removeAlertConfig } = useContext(AlertDialogContext);
    return { alertConfig, addAlertConfig, removeAlertConfig };
}
