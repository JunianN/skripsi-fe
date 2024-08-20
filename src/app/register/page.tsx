'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, MenuItem, Alert, Button, Container, TextField, Typography, Link as MuiLink, InputLabel, Select, SelectChangeEvent, OutlinedInput, Checkbox, ListItemText, FormControl } from '@mui/material';
import Link from 'next/link';
import axios from 'axios';
import { isAuthenticated } from '@/utils/auth';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

interface Language {
    code: string;
    name: string;
  }

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');
    const [role, setRole] = useState('user');
    const [proficientLanguages, setProficientLanguages] = useState<string[]>([]);
    const [languages, setLanguages] = useState<Language[]>([]);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchLanguages = async () => {
            try {
                const response = await axios.get('https://libretranslate.com/languages');
                setLanguages(response.data)
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    setError(`Error fetching languages: ${error.response.data.error}`);
                } else {
                    setError('Error fetching languages');
                }
            }
        }

        fetchLanguages();

        if (isAuthenticated()) {
            router.push('/');
        }
    }, [router]);

    const handleRegister = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');

        // Validate the inputs
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const response = await axios.post('https://doc-translation-api.onrender.com/api/register', {
                username,
                email,
                password,
                role,
                proficient_languages: role === 'translator' ? proficientLanguages : []
            });

            // Redirect to login page
            router.push('/login');
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setError(error.response.data.error);
            } else {
                setError('An unexpected error occured');
            }
        }
    };

    const handleLanguageChange = (event: SelectChangeEvent<typeof proficientLanguages>) => {
        const {
            target: { value },
        } = event;
        setProficientLanguages(
            typeof value === 'string' ? value.split(',') : value,
        );
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
                    Sign Up
                </Typography>
                <Box component="form" onSubmit={handleRegister} noValidate sx={{ mt: 1 }}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        autoFocus
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
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
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <TextField
                        select
                        label="Role"
                        fullWidth
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        margin="normal"
                    >
                        <MenuItem value="user">User</MenuItem>
                        <MenuItem value="translator">Translator</MenuItem>
                    </TextField>
                    {role === 'translator' && (
                        <FormControl sx={{ mt: 1, width: 400 }}>
                            <InputLabel id='proficient-languages-label'>Proficient Languages</InputLabel>
                            <Select
                                labelId='proficient-languages-label'
                                id='proficient-languages-checkbox'
                                multiple
                                value={proficientLanguages}
                                onChange={handleLanguageChange}
                                input={<OutlinedInput label="Proficient Languages" />}
                                renderValue={(selected) => selected?.join(',')}
                                MenuProps={MenuProps}
                                fullWidth
                            >
                                {languages?.map((language) => (
                                    <MenuItem key={language.code} value={language.name}>
                                        <Checkbox checked={proficientLanguages.indexOf(language.name) > -1} />
                                        <ListItemText primary={language.name} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}
                    {error && (<Alert severity="error">{error}</Alert>)}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign Up
                    </Button>
                    <Link href="/login" passHref>
                        <MuiLink variant="body2">
                            {"Already have an account? Sign in"}
                        </MuiLink>
                    </Link>
                </Box>
            </Box>
        </Container>
    );
};

export default RegisterPage;
