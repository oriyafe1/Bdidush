import { Button, Grid } from '@mui/material';
import { allowedCharacters } from '../Utils/bdidaUtils';

const PasukButtonGridItem = ({ char, onClick }) => (
    <Grid item xs={1}>
        <Button variant='outlined' onClick={onClick}>
            {char}
        </Button>
    </Grid>
);
const PasukButtons = ({ onClick }) => {
    return (
        <Grid container spacing={1}>
            {[...allowedCharacters].map(char => (
                <PasukButtonGridItem
                    char={char}
                    onClick={() => onClick(char)}
                />
            ))}
        </Grid>
    );
};

export default PasukButtons;
