import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit'
import TextField from "@material-ui/core/TextField"
import useDebounce from "../helpers/debounce";
import LinearProgress from "@material-ui/core/LinearProgress";
import Button from "@material-ui/core/Button";


/**
 * Table head
 * @param headCells
 * @returns {*}
 * @constructor
 */
function EnhancedTableHead({headCells}) {
    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right'  : 'left' }
                        padding={'default'}
                    >
                        {headCell.label}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    headCells: PropTypes.object.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85),
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark,
            },
    title: {
        flex: '1 1 100%',
    },
}));

const EnhancedTableToolbar = (props) => {
    const classes = useToolbarStyles();
    const { title, changePageCallback, keyword, setKeyword, customToolbarElements} = props;
    const debouncedSearch = useDebounce(keyword, 300);


    useEffect( () => {
            changePageCallback(1,keyword)
        },
        [debouncedSearch]
    );

    return (
        <Toolbar>
            <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
                <div>
                    {customToolbarElements !== undefined ? customToolbarElements : null}
                </div>
                <div style={{display: "flex", width: '100%', alignItems: "center", justifyContent: 'space-between'}}>
                    <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
                        {title}
                    </Typography>
                    <TextField id="standard-basic" label="Search" value={keyword} onChange={ event =>{setKeyword(event.target.value)}}/>
                </div>
            </div>

        </Toolbar>
    );
};

EnhancedTableToolbar.propTypes = {
    title: PropTypes.string.isRequired,
};



const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2),
    },
    table: {
        minWidth: 750,
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
    centerCell: {
        textAlign: "center",
        width: '100%'
    },
    rowNotPublished:{
        backgroundColor: "#ffcdd2"
    },
    rowNotVerified:{
        backgroundColor: "#fff9c4"
    },
    rowBasic: {
        backgroundColor: "#FFFFFF"
    }

}));

export default function TableComponent({title,
                                           searchFunction,
                                           headCells,
                                           pagingInfo,
                                           data,
                                           changePageCallback,
                                           updateCallback,
                                           removeCallback,
                                            actionButtonCallback,
                                            actionButtonText,
                                           id,
                                           isLoading,
                                           customToolbarElements,
                                           initialKeyword
}) {
    TableComponent.propTypes = {
        title: PropTypes.string.isRequired,
        headCells: PropTypes.object.isRequired,
        pagingInfo: PropTypes.object,
        data: PropTypes.object.isRequired,
        checkable: PropTypes.bool.isRequired,
        changePageCallback: PropTypes.func,
        updateCallback: PropTypes.func,
        removeCallback: PropTypes.func,
        actionButtonCallback: PropTypes.func,
        actionButtonText: PropTypes.string,
        id: PropTypes.string.isRequired,
        isLoading: PropTypes.bool,
        customToolbarElements: PropTypes.object,
        initialKeyword: PropTypes.string,
    };

    TableComponent.defaultProps = {
        initialKeyword: ''
    };

    const classes = useStyles();
    const rowsPerPage = 10;

    const [page, setPage] = useState(0);
    const [keyword, setKeyword] = useState(initialKeyword);

    const handleClick = (event, rowId) => {
        if(updateCallback !== undefined){
            updateCallback(rowId)
        }
    };
    const handleChangePage = (event, newPage) => {
        pagingInfo !==null ? changePageCallback(newPage + 1, keyword) : setPage(newPage)
    };
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <div style={{height: 8}}>
                    {isLoading ? <LinearProgress/> : null }
                </div>
                <EnhancedTableToolbar
                    title={title}
                    changePageCallback={changePageCallback}
                    keyword={keyword}
                    setKeyword={setKeyword}
                    customToolbarElements={customToolbarElements}
                />
                 <TableContainer>
                    <Table
                        className={classes.table}
                        aria-labelledby="tableTitle"
                        size={'medium'}
                        aria-label="enhanced table"
                    >
                        <EnhancedTableHead headCells={headCells}/>
                        <TableBody>
                            {data
                                .filter(item => searchFunction === undefined ? true : searchFunction(keyword, item))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {

                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    const rowStyle = row['isVerified'] !== undefined  && row['isVerified'] === false ? classes.rowNotVerified :
                                        row['isPublic'] !== undefined && row['isPublic'] === false ? classes.rowNotPublished :  classes.rowBasic;

                                    return (
                                        <TableRow
                                            className={rowStyle}
                                            hover
                                            onClick={(event) => handleClick(event, row[id])}
                                            role="checkbox"
                                            tabIndex={-1}
                                            key={row[id]}
                                        >

                                            {headCells.map(header=>{
                                                if(header.isId){
                                                    return <TableCell component="th" id={labelId} scope="row" >
                                                            {row[header.id]}
                                                        </TableCell>
                                                }else if(header.id === 'actions' ){
                                                        return <TableCell >
                                                            <div onClick={e => {e.stopPropagation(); e.preventDefault()}}>
                                                                {updateCallback !== undefined ? <IconButton onClick={(event)=>{
                                                                    updateCallback(row[id]);
                                                                    return 0
                                                                }} size="small" aria-label="edit" >
                                                                    <EditIcon fontSize="small" />
                                                                </IconButton> : null}

                                                                {removeCallback !== undefined ? <IconButton size="small" aria-label="delete" onClick={()=>removeCallback(row[id])}>
                                                                    <DeleteIcon  fontSize="small" />
                                                                </IconButton> : null}
                                                            </div>
                                                            </TableCell>
                                                }else{
                                                    return <TableCell align={header.numeric ? "right" : "left" }>{row[header.id]}</TableCell>
                                                }

                                            })}
                                            {actionButtonCallback != null && <TableCell onClick={e => {e.stopPropagation(); e.preventDefault()}}><Button onClick={() => actionButtonCallback(row[id])} variant="outlined">{actionButtonText}</Button></TableCell>}

                                        </TableRow>
                                    );
                                })}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: 53 * emptyRows}}>

                                    {data.length > 0 ? <TableCell colSpan={6} /> : !isLoading &&
                                        <TableCell colSpan={6} className={classes.centerCell}>
                                            <Typography variant="h6" noWrap>
                                                No results
                                            </Typography>
                                        </TableCell>}
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    rowsPerPageOptions={[10]}
                    component="div"
                    count={pagingInfo!==null ? pagingInfo.total : data.length}
                    rowsPerPage={rowsPerPage}
                    page={pagingInfo!==null ? pagingInfo.pageNum-1 : page}
                    onChangePage={handleChangePage}
                />
            </Paper>
        </div>
    );
}