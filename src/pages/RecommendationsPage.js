import React, {useContext, useEffect, useState} from "react";
import { withStyles } from "@material-ui/core/styles";
import { ReactSortable } from "react-sortablejs";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import API from "../Networking/API";
import Recommendation from "../components/recomendation/Recommendation";
import Alert from "@material-ui/lab/Alert";
import EditRecommendationDialog from "../components/recomendation/EditRecommendationDialog";
import {EditRecommendationContext} from "../contexts/EditRecommendationContext";
import TextField from "@material-ui/core/TextField";
import debounce from "lodash/debounce";
import Button from "@material-ui/core/Button";
import UseSnackbarContext from "../contexts/UseSnackbarContext";

const styles = theme => ({
    root:{
        flexWrap: 'wrap',
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        width: '100%',
        height: '100%'
    },
    left: {
        width: '50%',
        height: '100%',
        padding: 16,
    },
    leftTop:{
        alignItems: 'flex-start',
        height: '10%',
        display: 'flex',
        flexDirection: 'column',
    },
    leftContent:{
        padding: 16,
        borderStyle: 'dashed',
        height: '80%',
        overflowY: 'auto',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
    },
    right:{
        width: '50%',
        height: '100%',
        padding: 16,
    },
    rightTop: {
        alignItems: 'flex-start',
        height: '10%',
        display: 'flex',
        flexDirection: 'column',
    },

    rightContent: {
        padding: 16,
        borderStyle: 'dashed',
        height: '80%',
        overflowY: 'auto',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
    }
});

function RecommendationsPage({classes}) {

    const [recommendations, setRecommendations] = useState([]);
    const [homeRecommendations, setHomeRecommendations] = useState([]);

    const [keyword, setKeyword] = useState('')
    const [loading, setLoading] = useState(true)
    const [pagingData, setPagingData] = useState({pageNum: 1})

    const { startEditing } = useContext(EditRecommendationContext)
    const {addConfig} = UseSnackbarContext();

    function getRecommendations(page, keywordChange = false) {
        API.Recommendation.getAllRecommendations("?full=true&p="+page+"&keyword="+keyword).then(response=>{
            if(keywordChange){
                setRecommendations(unique(response.list, homeRecommendations))
            }else{
                setRecommendations(old=>[...old, ...unique(response.list, homeRecommendations)])
            }

            delete response.list
            setPagingData(response)
        }).catch(()=>{

        }).finally(()=>{

            setLoading(false)
        })
    }

    useEffect(()=>{
        setLoading(true)
        Promise.all([
            API.Explore.getExplorePage("?s=100"),
            API.Recommendation.getAllRecommendations("?full=true")
        ]).then((responses)=>{
            setHomeRecommendations(responses[0].list)
            setRecommendations(unique(responses[1].list, responses[0].list))
        }).catch(()=>{

        }).finally(()=>{
            setLoading(false)
        })

    },[])


    useEffect(()=>{
        if(!loading){
            getRecommendations(1, true)
        }
    }, [keyword])

    function unique(newList, existingRecommendations){
        const uniqueList = []
        let found = false;
        for(let i = 0; i<newList.length; i++){
            for(let j = 0; j<existingRecommendations.length; j++){
                if(newList[i].id === existingRecommendations[j].id){
                    found = true
                    break;
                }
            }
            if(!found){
                uniqueList.push(newList[i])
            }
            found = false
        }


        return uniqueList
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



    function updateExplorePage() {
        const explorable = []
        homeRecommendations.map(row=>{
            explorable.push(row.id)
        })

        setLoading(true)
        API.Explore.updateExplorePage(explorable).then(()=>{
            addConfig(true, "Updated explore page successfully!")

        }).catch(()=>{
            addConfig(false, "Unexpected error!")
        }).finally(()=>{
            setLoading(false)
        })
    }

    return (
        <div className={classes.root}>
            <div className={classes.left}>
                <div className={classes.leftTop}>
                    <Typography variant="h4">
                        Home recommendations
                    </Typography>

                    <Button
                        onClick={updateExplorePage}
                        variant="contained"
                        color="primary">
                        Save feed
                    </Button>
                </div>
                <div className={classes.leftContent}>

                    <ReactSortable
                        style={{width: '100%', height: '100%'}}
                        list={homeRecommendations}
                        setList={setHomeRecommendations}
                        animation={150}
                        group="cards"
                        onChange={(order, sortable, evt) => {}}
                        onEnd={evt => {}}
                    >
                        {homeRecommendations.map(rec => (
                            <Recommendation
                                key={rec.id}
                                recommendation={rec}
                                onEditCallback={()=> {
                                    startEditing(rec, homeRecommendations, setHomeRecommendations)
                                }}
                            />
                        ))}
                    </ReactSortable>

                </div>

            </div>

            <div className={classes.right}>
                <div className={classes.rightTop}>
                    <Typography variant="h4">
                        Existing recommendations
                    </Typography>

                </div>
                <div className={classes.rightContent} onScroll={handleScroll}>
                    <TextField id="standard-search" label="Search" value={keyword} type="search" onChange={e=>{
                        setKeyword(e.target.value)
                    }} />
                    <ReactSortable
                        style={{width: '100%', height: '100%'}}
                        list={recommendations}
                        setList={setRecommendations}
                        animation={150}
                        group="cards"
                        onChange={(order, sortable, evt) => {}}
                        onEnd={evt => {}}
                    >
                        {recommendations.map(rec => (
                            <Recommendation
                                onEditCallback={()=>{
                                    startEditing(rec, recommendations, setRecommendations)
                                }}
                                key={rec.id}
                                recommendation={rec}/>
                        ))}
                    </ReactSortable>
                </div>
            </div>

            <EditRecommendationDialog />
        </div>
    )
}


export default withStyles(styles)(RecommendationsPage);
