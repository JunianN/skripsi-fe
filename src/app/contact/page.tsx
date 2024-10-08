'use client';

import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
} from '@mui/material';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';
import { contactPageTranslations } from '../translations/contactPageTranslations';

const ContactPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const { language } = useLanguage();
  const t = contactPageTranslations[language];

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        'https://doc-translation-api.onrender.com/api/mail',
        { name, email, message }
      );
      setSuccess(t.successMessage);
      setError('');
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.error);
      } else {
        setError(t.unexpectedError);
      }
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 6 }}>
        <Typography variant="h2" gutterBottom textAlign="center">
          {t.pageTitle}
        </Typography>
        <Typography
          variant="h5"
          color="textSecondary"
          paragraph
          textAlign="center"
        >
          {t.pageDescription}
        </Typography>
        {success && <Alert severity="success">{success}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label={t.name}
                variant="outlined"
                fullWidth
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label={t.email}
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
                label={t.message}
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
              {t.sendMessage}
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default ContactPage;
