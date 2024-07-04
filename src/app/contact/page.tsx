'use client';

import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Grid, Alert } from '@mui/material';
import axios from 'axios';

const ContactPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            const response = await axios.post('http://127.0.0.1:3001/api/mail', { name, email, message });
            setSuccess(response.data.message);
            setError('');
            setName('');
            setEmail('');
            setMessage('');
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setError(error.response.data.error);
            } else {
                setError('An unexpected error occurred while fetching the document');
            }
        }
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ py: 6 }}>
                <Typography variant="h2" gutterBottom textAlign="center">
                    Contact Us
                </Typography>
                <Typography variant="h5" color="textSecondary" paragraph textAlign="center">
                    We would love to hear from you. Please fill out the form below to get in touch with us.
                </Typography>
                {success && <Alert severity="success">{success}</Alert>}
                {error && <Alert severity="error">{error}</Alert>}
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Name"
                                variant="outlined"
                                fullWidth
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Email"
                                type="email"
                                variant="outlined"
                                fullWidth
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Message"
                                variant="outlined"
                                fullWidth
                                required
                                multiline
                                rows={4}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                        </Grid>
                    </Grid>
                    <Box sx={{ textAlign: 'center', mt: 4 }}>
                        <Button type="submit" variant="contained" color="primary">
                            Send Message
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
};

export default ContactPage;