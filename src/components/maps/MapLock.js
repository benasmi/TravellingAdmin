import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Alert from "@material-ui/lab/Alert";


const styles = theme =>({
    root: {
        display:"flex",
        flexDirection: "column",
        marginTop: "8px",
        padding: theme.spacing(1)
    }
});

function MapLock({classes, isLocked, setIsLocked}) {
    return <div className={classes.root}>
        <FormControlLabel
            control={<Switch />}
            label="Lock"
            checked={isLocked}
            onChange={()=>{
               setIsLocked(old=>!old)
            }}
        />
        {isLocked ?
            <Alert  severity="error">Map is currently locked. If you want to do any changes unlock it.</Alert> : null}
    </div>
}

export default withStyles(styles)(MapLock)