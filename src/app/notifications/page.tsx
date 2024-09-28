'use client';

import React, { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Alert,
} from '@mui/material';
import axios from 'axios';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          'https://doc-translation-api.onrender.com/api/notifications',
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        setNotifications(response.data);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          setError(
            `Error fetching notifications: ${error.response.data.error}`
          );
        } else {
          setError('An unexpected error occurred while fetching notifications');
        }
      }
    };

    fetchNotifications();
  }, []);

  const handleMarkAsRead = async () => {
    try {
      await axios.post(
        'https://doc-translation-api.onrender.com/api/notifications/read',
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setNotifications(
        notifications.map((notification) => ({ ...notification, Read: true }))
      );
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(
          `Error marking notifications as read: ${error.response.data.error}`
        );
      } else {
        setError(
          'An unexpected error occurred while marking notifications as read'
        );
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 6 }}>
        <Typography variant="h4" gutterBottom>
          Notifications
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <List>
          {notifications.map((notification) => (
            <ListItem
              key={notification.ID}
              sx={{
                backgroundColor: notification.Read ? '#f5f5f5' : '#ffffff',
              }}
            >
              <ListItemText
                primary={notification.Message}
                secondary={new Date(notification.CreatedAt).toLocaleString()}
              />
            </ListItem>
          ))}
        </List>
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleMarkAsRead}
          >
            Mark All as Read
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default NotificationsPage;
