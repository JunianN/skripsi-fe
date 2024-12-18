'use client';

import React, { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Alert,
} from '@mui/material';
import axios from 'axios';
import { useLanguage } from '../../contexts/LanguageContext';
import { adminContactSubmissionsPageTranslations } from '../../translations/adminContactSubmissionsPageTranslations';
import { config } from '@/config/config';

const AdminContactSubmissionsPage = () => {
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState('');
  const { language } = useLanguage();
  const t = adminContactSubmissionsPageTranslations[language];

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get(
          `${config.apiBaseUrl}/api/admin/mails`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        setContacts(response.data);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          setError(
            `${t.errorFetchingSubmissions} ${error.response.data.error}`
          );
        } else {
          setError(t.unexpectedError);
        }
      }
    };

    fetchContacts();
  }, [t]);

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 6 }}>
        <Typography variant="h2" gutterBottom textAlign="center">
          {t.pageTitle}
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <Grid container spacing={4}>
          {contacts.map((contact) => (
            <Grid item xs={12} md={4} key={contact.ID}>
              <Card sx={{ height: '200px' }}>
                <CardContent
                  sx={{
                    height: '100%',
                    overflow: 'auto',
                    '&::-webkit-scrollbar': {
                      width: '8px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: '#888',
                      borderRadius: '4px',
                    },
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    {contact.Name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {t.email}: {contact.Email}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {t.message}: {contact.Message}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default AdminContactSubmissionsPage;
