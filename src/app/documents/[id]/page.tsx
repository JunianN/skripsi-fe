'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import {
  Box,
  Alert,
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Rating as MuiRating,
} from '@mui/material';
import axios from 'axios';
import PaymentDetailsModal from '@/app/components/PaymentDetailsModal';
import SubmitRating from '@/app/components/SubmitRating';
import { useLanguage } from '../../contexts/LanguageContext';
import { documentDetailsPageTranslations } from '../../translations/documentDetailsPageTranslations';

const pricePerPage = 100000; // price per page

const getStatusIndex = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 0;
    case 'translating':
      return 1;
    case 'finished':
      return 2;
    default:
      return 0;
  }
};

const DocumentDetailsPage = () => {
  const { id } = useParams();
  const [file, setDocument] = useState(null);
  const [discussions, setDiscussions] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [averageRating, setAverageRating] = useState(null);
  const [rating, setRating] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const router = useRouter();
  const { language } = useLanguage();
  const t = documentDetailsPageTranslations[language];

  const statuses = [t.pending, t.translating, t.finished];

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await axios.get(
          `https://doc-translation-api.onrender.com/api/documents/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        setDocument(response.data);

        if (response.data.TranslatorID !== 0) {
          const ratingResponse = await axios.get(
            `https://doc-translation-api.onrender.com/api/${response.data.TranslatorID}/average-rating`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            }
          );
          setAverageRating(ratingResponse.data.average_rating);
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          // setError(error.response.data.error);
        } else {
          setError(t.unexpectedError);
        }
      }
    };

    const fetchRating = async () => {
      try {
        const response = await axios.get(
          `https://doc-translation-api.onrender.com/api/documents/${id}/rating`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        setRating(response.data);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          setError(error.response.data.error);
        } else {
          setError(t.unexpectedError);
        }
      }
    };

    const fetchDiscussions = async () => {
      try {
        const response = await axios.get(
          `https://doc-translation-api.onrender.com/api/documents/${id}/discussions`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        setDiscussions(response.data);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          setError(error.response.data.error);
        } else {
          setError(t.unexpectedError);
        }
      }
    };

    fetchDocument();
    fetchDiscussions();
    fetchRating();
  }, [id, t]);

  const handlePostMessage = async () => {
    if (!newMessage.trim()) {
      setError('Please fill in the message');
      return;
    }

    try {
      const response = await axios.post(
        `https://doc-translation-api.onrender.com/api/documents/${id}/discussions`,
        { message: newMessage },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setDiscussions([...discussions, response.data]);
      setNewMessage('');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.error);
      } else {
        setError(t.unexpectedError);
      }
    }
  };

  const handleDownload = async () => {
    try {
      const response = await axios.get(
        `https://doc-translation-api.onrender.com/api/documents/${id}/download`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          responseType: 'blob',
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'translated_document.pdf'); // Specify the filename
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.error);
      } else {
        setError(t.unexpectedError);
      }
    }
  };

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  if (!file) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4 }}>
          <Typography variant="h4" gutterBottom>
            {t.pageTitle}
          </Typography>
          {error && (
            <Typography color="error" variant="body2" align="center">
              {error}
            </Typography>
          )}
          <Typography>{t.loading}</Typography>
        </Box>
      </Container>
    );
  }

  var activeStep = getStatusIndex(file.Status);
  if (getStatusIndex(file.Status) === 2) {
    activeStep = 3;
  }

  const totalPrice = file.NumberOfPages * pricePerPage;

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          {t.pageTitle}
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
        <Card>
          <CardContent>
            <Typography variant="h5" component="div" gutterBottom>
              {file.Title}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {t.description}: {file.Description}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {t.sourceLanguage}: {file.SourceLanguage}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {t.targetLanguage}: {file.TargetLanguage}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {t.numberOfPages}: {file.NumberOfPages}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {t.status}: {file.Status}
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => router.push('/documents')}
              sx={{ mt: 2 }}
            >
              {t.backToDocumentList}
            </Button>
            {getStatusIndex(file.Status) === 2 && !file.PaymentConfirmed && (
              <Button
                variant="contained"
                color="secondary"
                onClick={handleOpenModal}
                sx={{ mt: 2, ml: 2 }}
              >
                {t.viewPaymentDetails}
              </Button>
            )}
            {getStatusIndex(file.Status) === 2 && file.PaymentConfirmed && (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleDownload}
                  sx={{ mt: 2, ml: 2 }}
                >
                  {t.downloadTranslatedDocument}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
        {file.PaymentConfirmed && rating?.length === 0 && (
          <SubmitRating translatorId={file.TranslatorID} documentId={file.ID} />
        )}
        {file.PaymentConfirmed && rating?.length !== 0 && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {t.ratingSubmitted}
          </Alert>
        )}

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            {t.statusProgress}
          </Typography>
          <Stepper activeStep={activeStep}>
            {statuses.map((status, index) => (
              <Step key={index}>
                <StepLabel>{status}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {getStatusIndex(file.Status) !== 0 && averageRating !== null && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              {t.translatorRating}
            </Typography>
            <MuiRating value={averageRating} precision={0.1} readOnly />
            <Typography variant="body1">
              {averageRating.toFixed(1)} / 5.0
            </Typography>
          </Box>
        )}

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            {t.discussion}
          </Typography>
          {discussions.map((discussion) => (
            <Paper key={discussion.ID} sx={{ p: 2, mb: 2 }}>
              <Typography variant="body1">{discussion.Message}</Typography>
              <Typography variant="body2" color="textSecondary">
                {discussion.UserRole === 'admin' ? t.admin : t.user}
              </Typography>
            </Paper>
          ))}
          <Box sx={{ display: 'flex', mt: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              label={t.newMessage}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              sx={{
                backgroundColor: 'white',
                '& .MuiFilledInput-root': {
                  backgroundColor: 'white',
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                  },
                  '&.Mui-focused': {
                    backgroundColor: '#f0f0f0',
                  },
                },
              }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handlePostMessage}
              sx={{ ml: 2 }}
            >
              {t.send}
            </Button>
          </Box>
        </Box>
      </Box>
      <PaymentDetailsModal
        open={modalOpen}
        handleClose={handleCloseModal}
        documentId={id}
        totalPrice={totalPrice}
      />
    </Container>
  );
};

export default DocumentDetailsPage;
