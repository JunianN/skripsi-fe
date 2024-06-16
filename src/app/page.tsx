'use client';

import React, { useEffect, useState } from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const LandingPage = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Check if the user is authenticated
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        router.push('/');
    };

    return (
        <Container maxWidth="md">
            <Box textAlign="center" my={4}>
                <Typography variant="h4" gutterBottom>
                    Welcome to Our Translation Management System
                </Typography>
                <Typography variant="subtitle1">
                    Helping you manage your translation needs with ease and efficiency.
                </Typography>
                <Box mt={2}>
                    {isAuthenticated ? (
                        <>
                            <Link href="/submit-translation" passHref>
                                <Button variant="contained" color="primary">
                                    Submit Translation Request
                                </Button>
                            </Link>
                            <Button variant="outlined" color="secondary" onClick={handleLogout} sx={{ ml: 2 }}>
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" passHref>
                                <Button variant="contained" color="primary">
                                    Login
                                </Button>
                            </Link>
                            <Link href="/register" passHref>
                                <Button variant="outlined" color="primary" sx={{ ml: 2 }}>
                                    Register
                                </Button>
                            </Link>
                        </>
                    )}
                </Box>
            </Box>
        </Container>
    );
};

export default LandingPage;
