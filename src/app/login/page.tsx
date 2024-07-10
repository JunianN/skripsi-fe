'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Container, TextField, Typography, Link as MuiLink } from '@mui/material';
import Link from 'next/link';
import axios from 'axios';
import { isAuthenticated } from '@/utils/auth';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated()) {
            router.push('/');
        }
    }, [router])


    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');

        try {
            const response = await axios.post('http://127.0.0.1:3001/api/login', { email, password });
            const { token, username, userRole } = response.data;

            login(token, { username, userRole })

            if (userRole === 'translator') {
                router.push('/translators/assigned-documents');
            } else if (userRole === 'admin') {
                router.push('/admin/documents');
            } else {
                router.push('/');
            }
        } catch (error) {
            console.log("🚀 ~ handleLogin ~ error:", error)
            if (axios.isAxiosError(error) && error.response) {
                setError(error.response.data.error);
            } else {
                setError('An unexpected error occurred');
            }
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {error && (
                        <Typography color="error" variant="body2" align="center">
                            {error}
                        </Typography>
                    )}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign In
                    </Button>
                    <Link href="/register" passHref>
                        <MuiLink variant="body2">
                            {"Don't have an account? Sign Up"}
                        </MuiLink>
                    </Link>
                </Box>
            </Box>
        </Container>
    );
};

export default LoginPage;
