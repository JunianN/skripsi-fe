'use client';

import React from 'react';
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from '../../theme';

const darktheme = createTheme({
    palette: {
        // mode: "dark",
        primary: {
            main: '#222831',
            dark: '#20252E'
        },
        secondary: {
            main: '#393E46'
        },
        background: {
            paper: '#EEEEEE',
            default: '#EEEEEE',
        },
        info: {
            main: '#00ADB5'
        },
    },
});

export default function MyThemeProvider({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider theme={darktheme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
}
