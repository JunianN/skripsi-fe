import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#556cd6', // Custom primary color
        },
        secondary: {
            main: '#19857b', // Custom secondary color
        },
        error: {
            main: '#ff0000', // Custom error color
        },
        background: {
            default: '#f0f0f0', // Custom background color
        },
    },
    typography: {
        h4: {
            fontSize: '2.125rem',
        },
        body2: {
            fontSize: '1rem',
        },
    },
});

export default theme;
