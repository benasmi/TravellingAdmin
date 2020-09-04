import React, { useState} from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import DirectionsBikeIcon from '@material-ui/icons/DirectionsBike';
import FormControl from "@material-ui/core/FormControl";
import MetroIcon from '@material-ui/icons/DirectionsTransit';
import DirectionsBusIcon from '@material-ui/icons/DirectionsBus';
import CarIcon from '@material-ui/icons/DriveEta';
import TrainIcon from '@material-ui/icons/Train';
import FlightIcon from '@material-ui/icons/Flight';
import TramIcon from '@material-ui/icons/Tram';
import DirectionsWalkIcon from '@material-ui/icons/DirectionsWalk';
import NativeSelect from "@material-ui/core/NativeSelect";
import IconButton from "@material-ui/core/IconButton";
import RemoveIcon from "@material-ui/icons/Remove";
import Typography from "@material-ui/core/Typography";


const styles = theme => ({
    root: {
        display: "flex",
        flexFlow: "column wrap"
    },
    transportSelectWrapper: {
        display: "flex",
        alignItems: "center"
    },
    transportSelect: {
        marginLeft: theme.spacing(1),
        width: "100px"
    }
});

const transportTypes = [
    {
        icon: <MetroIcon/>,
        label: "Metro"
    },
    {
        icon: <DirectionsBikeIcon/>,
        label: "Bike"
    },
    {
        icon: <DirectionsBusIcon/>,
        label: "Bus"
    },
    {
        icon: <CarIcon/>,
        label: "Car"
    },
    {
        icon: <TrainIcon/>,
        label: "Train"
    },
    {
        icon: <FlightIcon/>,
        label: "Plane"
    },
    {
        icon: <DirectionsWalkIcon/>,
        label: "Walk"
    },
    {
        icon: <TramIcon/>,
        label: "Tram"
    }
]

function TransportItem({classes, transportId, transportChangeCallback}) {

    const [currentTransport, setCurrentTransport] = useState(transportId == null ? 0 : transportId)

    const handleTransportChange = (e) => {
        setCurrentTransport(e.target.value)
        transportChangeCallback({transport: parseInt(e.target.value)})
    }

    return (
        <div className={classes.root}>
            <MoreVertIcon/>
            <div className={classes.transportSelectWrapper}>
                {transportTypes[currentTransport].icon}
                <FormControl className={classes.transportSelect} >
                    <NativeSelect
                        value={currentTransport}
                        onChange={handleTransportChange}
                    >
                        {transportTypes.map((item, index) => {
                            return <option key={index} value={index}> {item.label}</option>
                        })}
                    </NativeSelect>
                </FormControl>
                {/*<Typography variant="subtitle2" style={{flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end'}}>*/}
                {/*    Estimated 15 min | 4km*/}
                {/*</Typography>*/}
            </div>
            <MoreVertIcon/>
        </div>
    )
}

export default withStyles(styles)(TransportItem)