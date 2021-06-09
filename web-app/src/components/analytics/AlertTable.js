import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

function createData(time, analytics, parameter, score) {
    return {time, analytics, parameter, score};
}

const rows = [
    createData('12/12/2012 10:10:10', "object_detector", "<10", 4),
    createData('12/12/2012 10:10:10', "object_detector", "5>", 6),
    createData('12/12/2012 10:10:10', "object_detector", "=5", 5),
];

export default function AlertTable() {
    const classes = useStyles();

    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>time</TableCell>
                        <TableCell align="right">analytics</TableCell>
                        <TableCell align="right">Parameter</TableCell>
                        <TableCell align="right">score</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.time}>
                            <TableCell component="th" scope="row">
                                {row.time}
                            </TableCell>
                            <TableCell align="right">{row.analytics}</TableCell>
                            <TableCell align="right">{row.parameter}</TableCell>
                            <TableCell align="right">{row.score}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}