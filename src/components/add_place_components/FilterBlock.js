import React, {useContext, useEffect, useState} from "react";
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
import {PlacesFilterContext} from "../../contexts/PlacesFilterContext";

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



function FilterBlock({classes}) {
    const {
        categories, setCategories, selectedCategories, setSelectedCategories,
        cities, setCities, selectedCities, setSelectedCities,
        countries, setCountries, selectedCountries, setSelectedCountries,
        filterOptions, setFilterOptions, setResetFilterOptions,
        dates, setDates} = useContext(PlacesFilterContext);

    const filterOptionsChanged = (name) =>{
        let generalOptions = Object.assign([], filterOptions);
        generalOptions.map(row=>{
            if(row.filterName === name){
                row.filter = !row.filter
            }
        });
        setFilterOptions(generalOptions)
    };

    function filterDateChange(date, id) {
        let cDate = Object.assign( {}, dates);
        cDate[id] = moment(date).format('YYYY-MM-DD');
        setDates(cDate)
    }

    function clearFilters() {
        setResetFilterOptions(true);

        setSelectedCities([]);
        setSelectedCountries([]);
        setSelectedCategories([]);

        let filters = Object.assign(filterOptions, []);
        filters.map(row=>{
            row.filter = false
        });
        setFilterOptions(filters);

        setDates({
            insertionStart: moment(new Date('2020-05-01T21:11:54')).format("YYYY-MM-DD"),
            insertionEnd: moment(new Date()).format(),
            modificationStart: moment(new Date('2014-05-01T21:11:54')).format("YYYY-MM-DD"),
            modificationEnd: moment(new Date()).format()
        })
    }



    return <div className={classes.filterDiv}>
        <div className={classes.sortingButtons}>
            {filterOptions.map(row=>{
                return <FormControlLabel
                    control={<Checkbox
                        checked={row.filter}
                        onChange={()=>filterOptionsChanged(row.filterName)}
                        name={row.filterName} />}
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
                    value={dates.insertionStart}
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
                    value={dates.insertionEnd}
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
                    value={dates.modificationStart}
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
                    value={dates.modificationEnd}
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
                              options={categories}
                              setOptions={setCategories}
                              selectedOptions={selectedCategories}
                              setSelectedOptions={setSelectedCategories}/>

                              <br/>
                              <br/>
            <Typography variant="h6">
                Filter by countries
            </Typography>
            <AutocompleteChip label="Select countries"
                              options={countries}
                              setOptions={setCountries}
                              selectedOptions={selectedCountries}
                              setSelectedOptions={setSelectedCountries}/>
            <br/>
            <br/>

            <Typography variant="h6">
                Filter by cities
            </Typography>
            <AutocompleteChip label="Select cities"
                              options={cities}
                              setOptions={setCities}
                              selectedOptions={selectedCities}
                              setSelectedOptions={setSelectedCities}/>
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