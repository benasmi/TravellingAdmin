import React, { Component } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Appbar from './components/Appbar.js';

class App extends Component {
    render() {
        return (
            <React.Fragment>
                <Appbar />
            </React.Fragment>
        );
    }
}

export default App;