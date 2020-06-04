import React, { Component } from 'react';
import Appbar from './components/Appbar.js';
import AppBarTitleProvider from "./contexts/AppBarTitleContext";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';

class App extends Component {
    render() {
        return (
            <React.Fragment>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <AppBarTitleProvider>
                        <Appbar />
                    </AppBarTitleProvider>
                    </MuiPickersUtilsProvider>
            </React.Fragment>
        );
    }
}
export default App;