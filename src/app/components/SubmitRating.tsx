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
import { useLanguage } from '../contexts/LanguageContext';
import { submitRatingTranslations } from '../translations/submitRatingTranslations';
import { config } from '@/config/config';

const SubmitRating = ({ translatorId, documentId }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const { language } = useLanguage();
  const t = submitRatingTranslations[language];

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      if (rating === 0) {
        setError(t.rateTranslator);
        setSuccess('');
        return;
      }

      const response = await axios.post(
        `${config.apiBaseUrl}/api/ratings`,
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

      setSuccess(t.successMessage);
      setError('');
    } catch (error) {
      setError(t.failedSubmission);
      setSuccess('');
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t.pageTitle}
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
          label={t.comment}
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
          {t.submitRating}
        </Button>
      </form>
    </Box>
  );
};

export default SubmitRating;
