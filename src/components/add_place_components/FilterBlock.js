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
import CloseIcon from '@material-ui/icons/Close';
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";

const style = theme =>({
    filterDiv: {
        display: "flex",
        flexDirection: "row",
    },
    sortingButtons: {
        display: "flex",
        flexDirection: "column",
        padding: theme.spacing(1),
        height: "100%"

    },
    rightLayout: {
        boxShadow: "0 0 1px 0 #666",
        display: "flex",
        flexDirection: "column",
        padding: theme.spacing(1)
    },
    datesLayout:{
        padding: theme.spacing(1),
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    root: {
        flexGrow: 1,
        width: "100%",
        marginBottom: "8px",
        boxShadow: "0 0 1px 0 #666",
        padding: theme.spacing(1)
    },
    paper: {
        display: "flex",
        flexDirection: "column",
        padding: theme.spacing(2),
        textAlign: 'center'

    }
});



function FilterBlock({classes, setOpen}) {
    const {
        categories, setCategories, selectedCategories, setSelectedCategories,
        cities, setCities, selectedCities, setSelectedCities,
        countries, setCountries, selectedCountries, setSelectedCountries,
        municipalities, setMunicipalities, selectedMunicipalities, setSelectedMunicipalities,
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
        setSelectedMunicipalities([]);

        let filters = Object.assign(filterOptions, []);
        filters.map(row=>{
            row.filter = false
        });
        setFilterOptions(filters);

        setDates({
            insertionStart: moment(new Date('2020-05-01T21:11:54')).format("YYYY-MM-DD"),
            insertionEnd: moment(new Date()).add(1,'day').format(),
            modificationStart: moment(new Date('2014-05-01T21:11:54')).format("YYYY-MM-DD"),
            modificationEnd: moment(new Date()).add(1,'day').format()
        })
    }

    return <Paper className={classes.root}>
        <Grid container direction="row" spacing={3}>
            <Grid item xs={12} sm={4}>
                <Paper className={classes.paper}>
                    <Typography variant="h6">
                        General options
                    </Typography>
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
                    <Typography variant="h6">
                        Filter by categories
                    </Typography>
                    <AutocompleteChip label="Select categories"
                                      id="categoryId"
                                      options={categories}
                                      setOptions={setCategories}
                                      selectedOptions={selectedCategories}
                                      setSelectedOptions={setSelectedCategories}/>

                </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
                <Paper className={classes.paper}>
                            <Typography variant="h6">
                                Filter by dates
                            </Typography>
                            <Typography variant="subtitle1">
                                Insertion dates
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
                    <Typography variant="subtitle1">
                        Modification dates
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
                </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
                <Paper className={classes.paper}>
                    <Typography variant="h6">
                        Filter by countries
                    </Typography>
                    <AutocompleteChip label="Select countries"
                                      options={countries}
                                      setOptions={setCountries}
                                      selectedOptions={selectedCountries}
                                      setSelectedOptions={setSelectedCountries}/>
                            <Typography variant="h6">
                                Filter by municipalities
                            </Typography>
                            <AutocompleteChip label="Select municipalities"
                                              options={municipalities}
                                              setOptions={setMunicipalities}
                                              selectedOptions={selectedMunicipalities}
                                              setSelectedOptions={setSelectedMunicipalities}/>
                            <Typography variant="h6">
                                Filter by cities
                            </Typography>
                            <AutocompleteChip label="Select cities"
                                              options={cities}
                                              setOptions={setCities}
                                              selectedOptions={selectedCities}
                                              setSelectedOptions={setSelectedCities}/>
                </Paper>
            </Grid>
        </Grid>
        <Button
            style={{marginTop: 8}}
            variant="contained"
            color="primary"
            onClick={() => clearFilters()}>
            Clear filters
        </Button>
    </Paper>
}

export default withStyles(style)(FilterBlock)