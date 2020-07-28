import React, {useEffect, useState} from "react";
import UseSnackbarContext from "../../contexts/UseSnackbarContext";
import UseAlertDialogContext from "../../contexts/UseAlertDialogContext";
import Dialog from "@material-ui/core/Dialog";
import LinearProgress from "@material-ui/core/LinearProgress";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import withStyles from "@material-ui/core/styles/withStyles";
import API from "../../Networking/API";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import history from "../../helpers/history";
import AddIcon from "@material-ui/icons/Add";
import Box from "@material-ui/core/Box";
import AddRecommendationDialog from "./AddRecommendationDialog";
import Alert from "@material-ui/lab/Alert";
import debounce from "lodash/debounce";
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import ListItemIcon from "@material-ui/core/ListItemIcon";

const styles = theme => ({
    root: {
        width: '100%',
        display: "flex",
        flexDirection: "column",
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    }
});

function RecommendationListDialog({classes, open, setOpen, objectId, type}){

    const {addConfig} = UseSnackbarContext();
    const {addAlertConfig} = UseAlertDialogContext();

    const [recommendations, setRecommendations] = useState([]);
    const [pagingData, setPagingData] = useState({pageNum: 1})

    const [loading, setLoading] = useState(false)
    const [showAddNewRecommendation, setShowAddNewRecommendation] = useState(false)
    const [keyword, setKeyword] = useState('')

    function getRecommendations(page, keywordChange = false) {
        API.Recommendation.getAllRecommendations("?p="+page+"&keyword="+keyword+"&type="+type).then(response=>{
            if(keywordChange){
                setRecommendations(response.list)
            }else{
                setRecommendations(old=>[...old, ...response.list])
            }
            delete response.list
            setPagingData(response)
        }).catch().finally(()=>{
            setLoading(false)
        })
    }

    const handleScrollDebounced = (e) => {
        console.log("Handle scroll")
        const scrollOffset = 0;
        const bottom = Math.round(e.target.scrollHeight - e.target.scrollTop - scrollOffset)  <= e.target.clientHeight;
        if (bottom && !loading && recommendations.length>0 && pagingData.pageNum<pagingData.pages) {
            setLoading(true);
            console.log("Requesting new page")
            getRecommendations(pagingData.pageNum+1);
        }
    };

    const debounceScroll = debounce(e => handleScrollDebounced(e), 200);
    const handleScroll = (e) => {
        e.persist();
        debounceScroll(e)
    };

    useEffect(()=>{
        console.log("Keyword changed")
        getRecommendations(1, true);
    }, [keyword])


    function addPlaceToRecommendation(rec) {
      API.Recommendation.addObjectToRecommendation({id: objectId, recommendationId: rec.id}).then(()=>{
              addConfig(true, "Added object to recommendation successfully!")
      }).catch(()=>{
              addConfig(true, "Failed to add!")
          }
      ).finally(()=>{
          setOpen(false)
      })
    }

    function addNewRecommendationCallback(recommendation){
        let recData = { ...recommendations }
        recData.unshift(recommendation)

        setRecommendations(recData)
    }

    return(
        <Dialog
            open={open}
            fullWidth={true}
            maxWidth={"sm"}
            onClose={()=>{setOpen(false)}}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            {loading ? <LinearProgress /> : null}
            <DialogTitle id="alert-dialog-title">Add to recommendation</DialogTitle>
            <DialogContent>
                <div className={classes.root}>
                    <div className={classes.root} >
                        <TextField id="standard-search" label="Search field" value={keyword} type="search" onChange={e=>{
                            setKeyword(e.target.value)
                        }} />
                        {recommendations.length > 0 ?
                            <React.Fragment>
                                <List component="nav" style={{ overflowY: "scroll", width: '100%', maxHeight: 400}} onScroll={handleScroll} aria-label="main mailbox folders">
                                    {recommendations.map(row=>{
                                        return <ListItem style={{width: '100%'}} button onClick={()=>{addPlaceToRecommendation(row)}}>
                                            <ListItemIcon>
                                                <CheckBoxOutlineBlankIcon />
                                            </ListItemIcon>
                                            <ListItemText primary={row.name} />
                                        </ListItem>
                                    })}

                                </List>
                            </React.Fragment>
                            :

                            <Alert severity="info">Recommendations list is empty. You can add new recommendation below.</Alert>
                        }


                    </div>
                    <Divider style={{width: '100%'}} />
                    <Button
                        onClick={()=>setShowAddNewRecommendation(true)}
                        variant="text"
                        color="secondary"
                        size="large"
                        startIcon={<AddIcon/>}>
                        Create new recommendation
                    </Button>
                </div>
            <AddRecommendationDialog
                open={showAddNewRecommendation}
                setOpen={setShowAddNewRecommendation}
                addCallback={addNewRecommendationCallback}
            />
            </DialogContent>
            <DialogActions>
                <Button onClick={()=>setOpen(false)}
                        color="primary">
                    Close
                </Button>

            </DialogActions>
        </Dialog>
    )
}

export default withStyles(styles)(RecommendationListDialog)
