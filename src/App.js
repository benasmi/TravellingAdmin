import React, { Component } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Appbar from './components/Appbar.js';
import SnackbarProvider from "./contexts/SnackbarContext";
import SnackbarFeedback from "./components/feedback/SnackbarFeedback";

class App extends Component {
    render() {
        return (
            <React.Fragment>
                <SnackbarProvider>
                    <Appbar />
                    <SnackbarFeedback/>
                </SnackbarProvider>
            </React.Fragment>
        );
    }
}

export default App;