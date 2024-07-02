'use client';

import React from 'react';
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from '../../theme';

const darktheme = createTheme({
    palette: {
        mode: "dark",
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
