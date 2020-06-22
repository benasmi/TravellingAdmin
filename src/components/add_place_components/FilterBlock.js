import React, {useEffect, useState} from "react";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import {KeyboardDatePicker} from "@material-ui/pickers";
import AutocompleteChip from "../AutocompleteChip";
import withStyles from "@material-ui/core/styles/withStyles";
import moment from "moment";
import DateFnsUtils from "@date-io/date-fns";
import MuiPickersUtilsProvider from "@material-ui/pickers/MuiPickersUtilsProvider";
import Button from "@material-ui/core/Button";

const style = theme =>({
    filterDiv: {
        display: "flex",
        flexDirection: "row",
    },
    sortingButtons: {
        display: "flex",
        flexDirection: "column",
        padding: theme.spacing(2),
        height: "100%"

    },
    rightLayout: {
        boxShadow: "0 0 1px 0 #666",
        display: "flex",
        flexDirection: "column",
        padding: theme.spacing(2)
    },
    datesLayout:{
        padding: theme.spacing(2),
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"
    }
});



function FilterBlock({classes,
                         filterQuery,
                         setFilterQuery,
                         availableCategories,
                         setAvailableCategories}) {
    const [initialFiltering, setInitialFiltering] = useState(Object.assign({},filterQuery));
    const options = [
        {filterLabel: "Unverified", filter: false, filterName: "unverified"},
        {filterLabel: "Unpublished", filter: false, filterName: "unpublished"}];

    const [filterOptions, setFilterOptions] = useState(()=>{
        if(filterQuery.generalOptions.length !== 0){

            filterQuery.generalOptions.split(",").map(row=>{
                options.map(op=>{
                    if(op.filterName===row){
                        op.filter = true
                    }
                })
            })
        }
        return options

    });

    const [selectedCategories, setSelectedCategories] = useState(()=>{
            let cats = [];
            if(filterQuery.categories.length !== 0){
                filterQuery.categories.split(",").map(row=>{
                    cats.push({name: row})
                });
            }
            console.log("Categories", cats);
        return cats
    });


    const [initialLoad, setInitialLoad]=  useState(true);

    const filterOptionsChanged = (name) =>{
        let fq = [];
        filterOptions.map(row=>{
            if(row.filterName === name){
                row.filter = !row.filter
            }
            if(row.filter){
                fq.push(row.filterName)
            }
        });

        let generalOptions = Object.assign({}, filterQuery);
        generalOptions.generalOptions = fq.join(",");
        setFilterQuery(generalOptions);
    };

    useEffect(()=>{
        if(!initialLoad){
            let catsFilter = [];
            selectedCategories.map(row=>{
                catsFilter.push(row.name)
            });
            let cats = Object.assign({}, filterQuery);
            cats.categories = catsFilter.join(",");
            setFilterQuery(cats);
        }
        setInitialLoad(false)
    },[selectedCategories]);


    function filterDateChange(date, id) {
        let cDate = Object.assign( {},filterQuery);
        cDate[id] = moment(date).format('YYYY-MM-DD');
        setFilterQuery(cDate)
    }

    function clearFilters() {
        setFilterOptions(options);
        setSelectedCategories([]);
        console.log(initialFiltering)
        setFilterQuery(initialFiltering)
    }

    return <div className={classes.filterDiv}>
        <div className={classes.sortingButtons}>
            {filterOptions && filterOptions.map(row=>{
                return <FormControlLabel
                    control={<Checkbox checked={row.filter} onChange={()=>filterOptionsChanged(row.filterName)} name={row.filterName} />}
                    label={row.filterLabel}
                />
            })}
        </div>
        <div className={classes.rightLayout}>
            <Typography variant="h6">
                Filter by dates
            </Typography>
            <Typography variant="subtitle1">
                Insertion dates between
            </Typography>
            <Grid container justify="space-around">
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="MM-dd-yyyy"
                    margin="normal"
                    id="insertionStart"
                    onChange={(date)=>filterDateChange(date,"insertionStart")}
                    value={filterQuery.insertionStart}
                    label="Date start"
                    KeyboardButtonProps={{
                        'aria-label': 'change date',
                    }}
                />
                <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="MM-dd-yyyy"
                    margin="normal"
                    value={filterQuery.insertionEnd}
                    onChange={(date)=>filterDateChange(date,"insertionEnd")}
                    id="insertionEnd"
                    label="Date end"
                    KeyboardButtonProps={{
                        'aria-label': 'change date',
                    }}
                />
                </MuiPickersUtilsProvider>
            </Grid>
            <br/>
            <br/>
            <Typography variant="subtitle1">
                Modification dates between
            </Typography>
            <Grid container justify="space-around">
                <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="MM-dd-yyyy"
                    margin="normal"
                    value={filterQuery.modificationStart}
                    onChange={(date)=>filterDateChange(date,"modificationStart")}
                    id="modificationStart"
                    label="Date start"
                    KeyboardButtonProps={{
                        'aria-label': 'change date',
                    }}
                />
                <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="MM-dd-yyyy"
                    margin="normal"
                    value={filterQuery.modificationEnd}
                    onChange={(date)=>filterDateChange(date,"modificationEnd")}
                    id="modificationEnd"
                    label="Date end"
                    KeyboardButtonProps={{
                        'aria-label': 'change date',
                    }}
                />
            </Grid>
            <br/>
            <Typography variant="h6">
                Filter by categories
            </Typography>
            <AutocompleteChip label="Select categories"
                              id="categoryId"
                              options={availableCategories}
                              setOptions={setAvailableCategories}
                              selectedOptions={selectedCategories}
                              setSelectedOptions={setSelectedCategories}/>

                              <br/>
                              <br/>
            <Button
                variant="contained"
                color="primary"
                onClick={() => clearFilters()}>
                Clear filters
            </Button>
        </div>

    </div>

}

export default withStyles(style)(FilterBlock)