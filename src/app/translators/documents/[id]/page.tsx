'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Box,
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  Alert,
  TextField,
  Stepper,
  Step,
  StepLabel,
  Paper,
} from '@mui/material';
import axios from 'axios';

const statuses = ['Pending', 'Translating', 'Finished'];

const TranslatorDocumentDetailsPage = () => {
  const { id } = useParams();
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [translatedFile, setTranslatedFile] = useState(null);
  const router = useRouter();
  const [discussions, setDiscussions] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await axios.get(
          `https://doc-translation-api.onrender.com/api/translator/documents/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        setFile(response.data);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          setError(`Error fetching document: ${error.response.data.error}`);
        } else {
          setError('An unexpected error occurred while fetching the document');
        }
      }
    };

    fetchDocument();
  }, [id]);

  const handleDownloadDocument = async () => {
    try {
      const response = await axios.get(
        `https://doc-translation-api.onrender.com/api/translator/documents/${id}/download`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          responseType: 'blob',
        }
      );

      const contentDisposition = response.headers['content-disposition'];
      let filename = 'document';
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match && match.length === 2) {
          filename = match[1];
        }
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(`Download error: ${error.response.statusText}`);
      } else {
        setError('An unexpected error occurred during the download');
      }
    }
  };

  const handleApproveDocument = async () => {
    try {
      const response = await axios.post(
        `https://doc-translation-api.onrender.com/api/translator/documents/${id}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setSuccess(response.data.message);
      setError('');
      setFile({
        ...file,
        TranslatorApprovalStatus: 'Accepted',
        Status: 'Translating',
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(`Approval error: ${error.response.data.error}`);
      } else {
        setError('An unexpected error occurred during approval');
      }
    }
  };

  const handleDeclineDocument = async () => {
    try {
      const response = await axios.post(
        `https://doc-translation-api.onrender.com/api/translator/documents/${id}/decline`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setSuccess(response.data.message);
      setError('');
      setFile({ ...file, TranslatorApprovalStatus: 'Declined' });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(`Decline error: ${error.response.data.error}`);
      } else {
        setError('An unexpected error occurred during decline');
      }
    }
  };

  const handleFileChange = (event) => {
    setTranslatedFile(event.target.files[0]);
  };

  const handleUploadTranslatedDocument = async (event) => {
    event.preventDefault();
    if (!translatedFile) {
      setError('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('translated_document', translatedFile);

    try {
      const response = await axios.post(
        `https://doc-translation-api.onrender.com/api/translator/documents/${id}/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setSuccess(response.data.message);
      setError('');
      setFile({
        ...file,
        TranslatedApprovalStatus: 'Pending',
        TranslatedFilePath: response.data.filePath,
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(`Upload error: ${error.response.data.error}`);
      } else {
        setError('An unexpected error occurred during the upload');
      }
    }
  };

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

  if (!file) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4 }}>
          <Typography variant="h4" gutterBottom>
            Document Details
          </Typography>
          {error && <Alert severity="error">{error}</Alert>}
          <Typography>Loading...</Typography>
        </Box>
      </Container>
    );
  }

  var activeStep = statuses.indexOf(file.Status);
  if (file.Status === 'Finished') {
    activeStep = 3;
  }

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
              onClick={() => router.push('/translators/documents')}
              sx={{ mt: 2 }}
            >
              Back to Documents
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleDownloadDocument}
              sx={{ mt: 2, ml: 2 }}
            >
              Download Document
            </Button>
            {file.TranslatorApprovalStatus == 'Pending' && (
              <>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleApproveDocument}
                  sx={{ mt: 2, ml: 2 }}
                >
                  Accept
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleDeclineDocument}
                  sx={{ mt: 2, ml: 2 }}
                >
                  Decline
                </Button>
              </>
            )}
            {file.TranslatorApprovalStatus === 'Accepted' &&
              (file.TranslatedApprovalStatus === '' ||
                file.TranslatedApprovalStatus === 'Rejected') && (
                <form
                  onSubmit={handleUploadTranslatedDocument}
                  style={{ marginTop: '16px' }}
                >
                  {file.TranslatedApprovalStatus === 'Rejected' && (
                    <Alert severity="error">Rejected by Admin</Alert>
                  )}
                  <TextField
                    type="file"
                    onChange={handleFileChange}
                    fullWidth
                    variant="outlined"
                    sx={{ mt: 2 }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                  >
                    Submit
                  </Button>
                </form>
              )}
            {file.TranslatedApprovalStatus === 'Pending' && (
              <Alert severity="info" sx={{ mt: 2 }}>
                Translated document uploaded. Waiting for admin review.
              </Alert>
            )}
            {file.TranslatedApprovalStatus === 'Approved' && (
              <Alert severity="success" sx={{ mt: 2 }}>
                Translated document uploaded. Approved by Admin.
              </Alert>
            )}
          </CardContent>
        </Card>
      </Box>

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
    </Container>
  );
};

export default TranslatorDocumentDetailsPage;
