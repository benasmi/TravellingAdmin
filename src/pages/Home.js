import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import app from "../helpers/firebaseInit";
import Cookies from "js-cookie";

const styles = theme => ({
    button: {
        margin: theme.spacing(1)
    },
    input: {
        display: "none"
    }
});






const Home = props => {
    const { classes } = props;

    return (
        <div>

        </div>
    );
};

Home.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Home);