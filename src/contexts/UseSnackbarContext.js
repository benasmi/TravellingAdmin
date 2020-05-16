import { useContext } from 'react';
import {SnackbarContext} from "./SnackbarContext";

export default function UseSnackbarContext() {
    const { config, addConfig, removeConfig } = useContext(SnackbarContext);
    return { config, addConfig, removeConfig };
}
