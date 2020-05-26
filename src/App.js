import React, { Component } from 'react';
import Appbar from './components/Appbar.js';
import SnackbarProvider from "./contexts/SnackbarContext";
import SnackbarFeedback from "./components/feedback/SnackbarFeedback";
import AlertDialogProvider from "./contexts/AlertDialogContext";
import AlertDialogFeedback from "./components/feedback/AlertDialogFeedback";
import AppBarTitleProvider from "./contexts/AppBarTitleContext";

class App extends Component {
    render() {
        return (
            <React.Fragment>
                <AlertDialogProvider>
                <SnackbarProvider>
                    <AppBarTitleProvider>
                        <Appbar />
                    </AppBarTitleProvider>
                    <SnackbarFeedback/>
                    <AlertDialogFeedback/>
                </SnackbarProvider>
                </AlertDialogProvider>
            </React.Fragment>
        );
    }
}
export default App;