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

const statuses = ['Pending', 'Translating', 'Finished'];
const pricePerPage = 100000; // price per page

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
          setError('An unexpected error occurred');
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
          setError('An unexpected error occurred 2');
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
          setError('An unexpected error occurred 3');
        }
      }
    };

    fetchDocument();
    fetchDiscussions();
    fetchRating();
  }, [id]);

  const handlePostMessage = async () => {
    if (!newMessage.trim()) {
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
        setError('An unexpected error occurred');
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
        setError('An unexpected error occurred 5');
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
            Document Details
          </Typography>
          {error && (
            <Typography color="error" variant="body2" align="center">
              {error}
            </Typography>
          )}
          <Typography>Loading...</Typography>
        </Box>
      </Container>
    );
  }

  var activeStep = statuses.indexOf(file.Status);
  if (file.Status === 'Finished') {
    activeStep = 3;
  }

  const totalPrice = file.NumberOfPages * pricePerPage;

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Document Details
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
        <Card>
          <CardContent>
            <Typography variant="h5" component="div" gutterBottom>
              {file.Title}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Description: {file.Description}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Source Language: {file.SourceLanguage}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Target Language: {file.TargetLanguage}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Number of Pages: {file.NumberOfPages}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Status: {file.Status}
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => router.push('/documents')}
              sx={{ mt: 2 }}
            >
              Back to Document List
            </Button>
            {file.Status === 'Finished' && !file.PaymentConfirmed && (
              <Button
                variant="contained"
                color="secondary"
                onClick={handleOpenModal}
                sx={{ mt: 2, ml: 2 }}
              >
                View Payment Details
              </Button>
            )}
            {file.Status === 'Finished' && file.PaymentConfirmed && (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleDownload}
                  sx={{ mt: 2, ml: 2 }}
                >
                  Download Translated Document
                </Button>
              </>
            )}
          </CardContent>
        </Card>
        {file.PaymentConfirmed && rating.length === 0 && (
          <SubmitRating translatorId={file.TranslatorID} documentId={file.ID} />
        )}
        {file.PaymentConfirmed && rating.length !== 0 && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Rating has been submitted
          </Alert>
        )}

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Status Progress
          </Typography>
          <Stepper activeStep={activeStep}>
            {statuses.map((status, index) => (
              <Step key={index}>
                <StepLabel>{status}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {file.Status !== 'Pending' && averageRating !== null && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Translator&apos;s Rating
            </Typography>
            <MuiRating value={averageRating} precision={0.1} readOnly />
            <Typography variant="body1">
              {averageRating.toFixed(1)} / 5.0
            </Typography>
          </Box>
        )}

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Discussion
          </Typography>
          {discussions.map((discussion) => (
            <Paper key={discussion.ID} sx={{ p: 2, mb: 2 }}>
              <Typography variant="body1">{discussion.Message}</Typography>
              <Typography variant="body2" color="textSecondary">
                {discussion.UserRole === 'admin' ? 'Admin' : 'User'}
              </Typography>
            </Paper>
          ))}
          <Box sx={{ display: 'flex', mt: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              label="New Message"
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
              Send
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
