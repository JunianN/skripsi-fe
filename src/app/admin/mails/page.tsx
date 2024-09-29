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

const AdminContactSubmissionsPage = () => {
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get(
          'https://doc-translation-api.onrender.com/api/admin/mails',
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
            `Error fetching contact submissions: ${error.response.data.error}`
          );
        } else {
          setError(
            'An unexpected error occurred while fetching the contact submissions'
          );
        }
      }
    };

    fetchContacts();
  }, []);

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 6 }}>
        <Typography variant="h2" gutterBottom textAlign="center">
          Contact Form Submissions
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <Grid container spacing={4}>
          {contacts.map((contact) => (
            <Grid item xs={12} md={4} key={contact.ID}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {contact.Name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Email: {contact.Email}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Message: {contact.Message}
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
