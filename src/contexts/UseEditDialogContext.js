import React, {useContext} from "react";
import {EditDialogContext} from "./EditDialogContext";

export default function UseEditDialogContext() {
    const { dialogConfig, addEditDialogConfig, removeEditDialogConfig, dialogOpen, setDialogOpen } = useContext(EditDialogContext);
    return { dialogConfig, addEditDialogConfig, removeEditDialogConfig, dialogOpen, setDialogOpen };
}
