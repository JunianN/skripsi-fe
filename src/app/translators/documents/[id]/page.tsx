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
  TextField,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Alert,
} from '@mui/material';
import axios from 'axios';
import { useLanguage } from '../../../contexts/LanguageContext';
import { translatorDocumentDetailsPageTranslations } from '../../../translations/translatorDocumentDetailsPageTranslations';
import { config } from '@/config/config';

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

const TranslatorDocumentDetailsPage = () => {
  const { id } = useParams();
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [translatedFile, setTranslatedFile] = useState(null);
  const router = useRouter();
  const [discussions, setDiscussions] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const { language } = useLanguage();
  const t = translatorDocumentDetailsPageTranslations[language];

  const statuses = [t.pending, t.translating, t.finished];

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await axios.get(
          `${config.apiBaseUrl}/api/translator/documents/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        setFile(response.data);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          setError(`${t.errorFetchingDocument} ${error.response.data.error}`);
        } else {
          setError(t.unexpectedErrorFetching);
        }
      }
    };

    fetchDocument();
  }, [id, t]);

  const handleDownloadDocument = async () => {
    try {
      const response = await axios.get(
        `${config.apiBaseUrl}/api/translator/documents/${id}/download`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          responseType: 'blob',
        }
      );

      // const contentDisposition = response.headers['content-disposition'];
      // let filename = 'document';
      // if (contentDisposition) {
      //   const match = contentDisposition.match(/filename="(.+)"/);
      //   if (match && match.length === 2) {
      //     filename = match[1];
      //   }
      // }
      const filename =
        response.headers['content-disposition'].split('filename=')[1];
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(`${t.downloadError} ${error.response.statusText}`);
      } else {
        setError(t.unexpectedErrorDownload);
      }
    }
  };

  const handleApproveDocument = async () => {
    try {
      const response = await axios.post(
        `${config.apiBaseUrl}/api/translator/documents/${id}/approve`,
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
        setError(`${t.approvalError} ${error.response.data.error}`);
      } else {
        setError(t.unexpectedErrorApproval);
      }
    }
  };

  const handleDeclineDocument = async () => {
    try {
      const response = await axios.post(
        `${config.apiBaseUrl}/api/translator/documents/${id}/decline`,
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
        setError(`${t.declineError} ${error.response.data.error}`);
      } else {
        setError(t.unexpectedErrorDecline);
      }
    }
  };

  const handleFileChange = (event) => {
    setTranslatedFile(event.target.files[0]);
  };

  const handleUploadTranslatedDocument = async (event) => {
    event.preventDefault();
    if (!translatedFile) {
      setError(t.selectFileToUpload);
      return;
    }

    const formData = new FormData();
    formData.append('translated_document', translatedFile);

    try {
      const response = await axios.post(
        `${config.apiBaseUrl}/api/translator/documents/${id}/upload`,
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
        setError(`${t.uploadError} ${error.response.data.error}`);
      } else {
        setError(t.unexpectedErrorUpload);
      }
    }
  };

  const handlePostMessage = async () => {
    if (!newMessage.trim()) {
      return;
    }

    try {
      const response = await axios.post(
        `${config.apiBaseUrl}/api/documents/${id}/discussions`,
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

  if (!file) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4 }}>
          <Typography variant="h4" gutterBottom>
            {t.pageTitle}
          </Typography>
          {error && <Alert severity="error">{error}</Alert>}
          <Typography>{t.loading}</Typography>
        </Box>
      </Container>
    );
  }

  var activeStep = getStatusIndex(file.Status);
  if (getStatusIndex(file.Status) === 2) {
    activeStep = 3;
  }

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
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => router.push('/translators/documents')}
                  sx={{ mt: 2 }}
                >
                  {t.backToDocuments}
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleDownloadDocument}
                  sx={{ mt: 2, ml: 2 }}
                >
                  {t.downloadDocument}
                </Button>
              </div>
              {file.TranslatorApprovalStatus == 'Pending' && (
                <div>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleApproveDocument}
                    sx={{ mt: 2, ml: 2 }}
                  >
                    {t.accept}
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleDeclineDocument}
                    sx={{ mt: 2, ml: 2 }}
                  >
                    {t.decline}
                  </Button>
                </div>
              )}
            </div>
            {file.TranslatorApprovalStatus === 'Accepted' &&
              (file.TranslatedApprovalStatus === '' ||
                file.TranslatedApprovalStatus === 'Rejected') && (
                <form
                  onSubmit={handleUploadTranslatedDocument}
                  style={{ marginTop: '16px' }}
                >
                  {file.TranslatedApprovalStatus === 'Rejected' && (
                    <Alert severity="error">{t.rejectedByAdmin}</Alert>
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
                    {t.submit}
                  </Button>
                </form>
              )}
            {file.TranslatedApprovalStatus === 'Pending' && (
              <Alert severity="info" sx={{ mt: 2 }}>
                {t.waitingForAdminReview}
              </Alert>
            )}
            {file.TranslatedApprovalStatus === 'Approved' && (
              <Alert severity="success" sx={{ mt: 2 }}>
                {t.approvedByAdmin}
              </Alert>
            )}
          </CardContent>
        </Card>
      </Box>

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

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          {t.discussion}
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
