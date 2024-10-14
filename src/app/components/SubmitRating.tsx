'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
  Rating as MuiRating,
} from '@mui/material';
import axios from 'axios';

const SubmitRating = ({ translatorId, documentId }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      if (rating === 0) {
        setError('Please rate the translator');
        setSuccess('');
        return;
      }

      const response = await axios.post(
        'https://doc-translation-api.onrender.com/api/ratings',
        {
          translator_id: translatorId,
          document_id: documentId,
          rating,
          comment,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      setSuccess('Rating submitted successfully');
      setError('');
    } catch (error) {
      setError('Failed to submit rating. Please try again.');
      setSuccess('');
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Submit Rating
      </Typography>
      {success && <Alert severity="success">{success}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <MuiRating
          name="rating"
          value={rating}
          onChange={(event, newValue) => setRating(newValue)}
        />
        <TextField
          label="Comment"
          fullWidth
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          margin="normal"
          multiline
          rows={4}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Submit Rating
        </Button>
      </form>
    </Box>
  );
};

export default SubmitRating;
