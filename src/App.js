import './App.css';
import { Button, Grid, Paper, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useCallback, useState } from 'react';
import PasukButtons from './Components/PasukButtons';
import { calcPossibilities } from './Utils/bdidaUtils';
import PossibilitiesTable from './Components/PossibilitiesTable';

const App = () => {
    const [pasuk, setPasuk] = useState('');
    const [possibilities, setPossibilites] = useState([]);

    const onPasukChange = useCallback(event => {
        setPasuk(event.target.value);
    }, []);

    const onPasukButtonClick = useCallback(char => {
        setPasuk(prevPasuk => prevPasuk + char);
    }, []);

    const onCalcClick = useCallback(() => {
        try {
            setPossibilites(calcPossibilities(pasuk));
        } catch (error) {
            alert('Oops, your pasuk is dumb');
        }
    }, [pasuk]);

    return (
        <Box sx={{ minHeight: '100vh', paddingTop: '20vh' }}>
            <Typography textAlign='center' variant='h1'>
                Bdidush
            </Typography>

            <Box sx={{ width: '80%', marginX: 'auto' }}>
                <TextField
                    value={pasuk}
                    onChange={onPasukChange}
                    label='Pasuk'
                    fullWidth
                    variant='outlined'
                />
            </Box>
            <Box sx={{ width: '10%', marginX: 'auto', marginY: 3 }}>
                <Button fullWidth variant='contained' onClick={onCalcClick}>
                    Calc
                </Button>
            </Box>
            <Box sx={{ width: '80%', marginX: 'auto' }}>
                <PasukButtons onClick={onPasukButtonClick} />
            </Box>
            {possibilities.length > 0 && (
                <PossibilitiesTable possibilities={possibilities} />
            )}
        </Box>
    );
};

export default App;
