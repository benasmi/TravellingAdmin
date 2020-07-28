import React, { useState, useCallback } from 'react';
import { useContext } from 'react';

export const EditRecommendationContext = React.createContext()


export default function EditRecommendationProvider({ children }) {
    const [config, setConfig] = useState({
        open: false,
        currentlyEditing: undefined,
        rootList: [],
        setRootList: ()=>{}
    });

    function startEditing(recommendation, rootList, setRootList) {
        let conf = { ...config }

        conf.open = true
        conf.currentlyEditing = recommendation

        conf.rootList = rootList
        conf.setRootList = setRootList

        setConfig(conf)
    }

    function removeRecommendation(){
        let conf = { ...config }
        conf.open = false

        let tempRootList = [...conf.rootList]
        for(let i = 0; i<tempRootList.length; i++){
            console.log(tempRootList[i].id)
            if(tempRootList[i].id === conf.currentlyEditing.id){
                tempRootList.splice(i, 1)
            }
        }
        config.setRootList(tempRootList)
        setConfig(conf)
    }

    function finishEditing(success=false, removedId= undefined) {
        let conf = { ...config }
        conf.open = false

        if(removedId !== undefined){
            for(let i = 0; i<conf.currentlyEditing.objects.length; i++){
                if(conf.currentlyEditing.objects[i].id === removedId){
                    conf.currentlyEditing.objects.splice(i, 1)
                }
            }
        }

        if(success){
            let tempRootList = [...config.rootList]
            for(let i = 0; i<tempRootList.length; i++){
                if(tempRootList[i].id === conf.currentlyEditing.id){
                    tempRootList[i] = conf.currentlyEditing
                    break;
                }
            }
            config.setRootList(tempRootList)
        }

        setConfig(conf)
    }

    function setRecommendation(newRec){
        let conf = { ...config }
        conf.currentlyEditing = newRec

        setConfig(conf)
    }

    return (
        <EditRecommendationContext.Provider value={{
            config,
            startEditing,
            finishEditing,
            removeRecommendation,
            setRecommendation
        }}>
            {children}
        </EditRecommendationContext.Provider>
    );
}