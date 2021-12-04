import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from '@mui/material';
import { useMemo } from 'react';
import { POS_RESULT_KEY } from '../Utils/bdidaUtils';

const PossibilitiesTable = ({ possibilities }) => {
    const pars = useMemo(
        () =>
            Object.keys(possibilities[0]).filter(par => par !== POS_RESULT_KEY),
        [possibilities]
    );

    return (
        <Table>
            <TableHead>
                <TableRow>
                    {pars.map(par => (
                        <TableCell>{par}</TableCell>
                    ))}
                    <TableCell>Result</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {possibilities.map(poss => (
                    <TableRow>
                        {pars.map(par => (
                            <TableCell>{poss[par] ? 'T' : 'F'}</TableCell>
                        ))}
                        <TableCell>
                            {poss[POS_RESULT_KEY] ? 'T' : 'F'}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default PossibilitiesTable;
