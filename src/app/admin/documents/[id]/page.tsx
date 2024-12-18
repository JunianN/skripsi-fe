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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
} from '@mui/material';
import { Star, FiberManualRecord } from '@mui/icons-material';
import axios from 'axios';
import { useLanguage } from '@/app/contexts/LanguageContext';
import { adminDocumentDetailsPageTranslations } from '../../../translations/adminDocumentDetailsPageTranslations';
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

const AdminDocumentDetailsPage = () => {
  const { id } = useParams();
  const [file, setFile] = useState(null);
  const [discussions, setDiscussions] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');
  const [translators, setTranslators] = useState([]);
  const [selectedTranslator, setSelectedTranslator] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const { language } = useLanguage();
  const t = adminDocumentDetailsPageTranslations[language];

  const statuses = [t.pending, t.translating, t.finished];

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await axios.get(
          `${config.apiBaseUrl}/api/admin/documents/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        setFile(response.data);
        fetchTranslators(
          response.data.SourceLanguage,
          response.data.TargetLanguage
        );
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          setError(`Error fetching document: ${error.response.data.error}`);
        } else {
          setError('An unexpected error occurred while fetching the document');
        }
      }
    };

    const fetchDiscussions = async () => {
      try {
        const response = await axios.get(
          `${config.apiBaseUrl}/api/documents/${id}/discussions`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        setDiscussions(response.data);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          setError(`Error fetching discussions: ${error.response.data.error}`);
        } else {
          setError('An unexpected error occurred while fetching discussions');
        }
      }
    };

    const fetchTranslators = async (source, target) => {
      try {
        const response = await axios.get(
          `${config.apiBaseUrl}/api/admin/translators/by-language`,
          {
            params: { source, target },
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        setTranslators(response.data);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          setError(`Error fetching translators: ${error.response.data.error}`);
        } else {
          setError('An unexpected error occurred while fetching translators');
        }
      }
    };

    fetchDocument();
    fetchDiscussions();
  }, [id]);

  const handleDownload = async () => {
    try {
      const response = await axios.get(
        `${config.apiBaseUrl}/api/admin/documents/${id}/download`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          responseType: 'blob',
        }
      );

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
        setError(`Download error: ${error.response.data.error}`);
      } else {
        setError('An unexpected error occurred during the download');
      }
    }
  };

  const handleApprove = async () => {
    try {
      const response = await axios.post(
        `${config.apiBaseUrl}/api/admin/documents/${id}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setFile({ ...file, ApprovalStatus: 'Approved' });
      setSuccess(response.data.message);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(`Error approving document: ${error.response.data.error}`);
      } else {
        setError('An unexpected error occurred during the approval');
      }
    }
  };

  const handleReject = async () => {
    try {
      const response = await axios.post(
        `${config.apiBaseUrl}/api/admin/documents/${id}/reject`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setFile({ ...file, ApprovalStatus: 'Rejected' });
      setSuccess(response.data.message);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(`Error rejecting document: ${error.response.data.error}`);
      } else {
        setError('An unexpected error occurred during the rejection');
      }
    }
  };

  const handleAssign = async () => {
    if (!selectedTranslator) {
      setError('Please select a translator');
      return;
    }

    try {
      const response = await axios.post(
        `${config.apiBaseUrl}/api/admin/documents/${id}/assign`,
        { translator_id: selectedTranslator },
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
        TranslatorID: selectedTranslator,
        TranslatorApprovalStatus: 'Pending',
        AssignmentTime: new Date().toISOString(),
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(`Error assigning document: ${error.response.data.error}`);
      } else {
        setError(
          `An unexpected error occurred during the assignment: ${error}`
        );
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
        setError(`Error posting message: ${error.response.data.error}`);
      } else {
        setError('An unexpected error occurred while posting the message');
      }
    }
  };

  const handleDownloadTranslated = async () => {
    try {
      const response = await axios.get(
        `${config.apiBaseUrl}/api/admin/documents/${id}/translated/download`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          responseType: 'blob',
        }
      );

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
        setError(`Download error: ${error.response.data.error}`);
      } else {
        setError('An unexpected error occurred during the download');
      }
    }
  };

  const handleApproveTranslated = async () => {
    try {
      await axios.post(
        `${config.apiBaseUrl}/api/admin/documents/${id}/translated/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setFile({
        ...file,
        TranslatedApprovalStatus: 'Approved',
        Status: 'Finished',
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(
          `Error approving translated document: ${error.response.data.error}`
        );
      } else {
        setError('An unexpected error occurred during the approval');
      }
    }
  };

  const handleRejectTranslated = async () => {
    try {
      await axios.post(
        `${config.apiBaseUrl}/api/admin/documents/${id}/translated/reject`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setFile({ ...file, TranslatedApprovalStatus: 'Rejected' });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(
          `Error rejecting translated document: ${error.response.data.error}`
        );
      } else {
        setError('An unexpected error occurred during the rejection');
      }
    }
  };

  const handleDownloadPaymentReceipt = async () => {
    try {
      const response = await axios.get(
        `${config.apiBaseUrl}/api/admin/documents/${id}/payment-receipt`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          responseType: 'blob',
        }
      );

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
      console.log(error);
      if (axios.isAxiosError(error) && error.response) {
        setError(`Download error: ${error.response.data.error}`);
      } else {
        setError('An unexpected error occurred during the download');
      }
    }
  };

  const handleApprovePayment = async () => {
    try {
      await axios.post(
        `${config.apiBaseUrl}/api/admin/documents/${id}/payment-approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setError('');
      setFile({ ...file, PaymentConfirmed: true });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(`Error approving payment: ${error.response.data.error}`);
      } else {
        setError('An unexpected error occurred during the payment approval');
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
                  onClick={() => router.push('/admin/documents')}
                  sx={{ mt: 2 }}
                >
                  {t.backToDocumentList}
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleDownload}
                  sx={{ mt: 2, ml: 2 }}
                >
                  {t.downloadSubmittedDocument}
                </Button>
              </div>
              {file.ApprovalStatus === '' && (
                <div>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleApprove}
                    sx={{ mt: 2, ml: 2 }}
                  >
                    {t.approve}
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleReject}
                    sx={{ mt: 2, ml: 2 }}
                  >
                    {t.reject}
                  </Button>
                </div>
              )}
            </div>
            {((file.ApprovalStatus === 'Approved' &&
              file.Status === 'Pending' &&
              file.TranslatorApprovalStatus === '') ||
              file.TranslatorApprovalStatus === 'Declined') && (
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel id="translator-select-label">
                  {t.selectTranslator}
                </InputLabel>
                <Select
                  labelId="translator-select-label"
                  id="translator-select"
                  value={selectedTranslator}
                  label={t.selectTranslator}
                  onChange={(e) => setSelectedTranslator(e.target.value)}
                >
                  {translators?.length === 0 ? (
                    <Alert severity="error" sx={{ mt: 2 }}>
                      {t.noTranslatorsFound}
                    </Alert>
                  ) : (
                    translators?.map((translator) => (
                      <MenuItem
                        key={translator.ID}
                        value={translator.ID}
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Box>
                          {translator.Username}{' '}
                          <FiberManualRecord sx={{ fontSize: 10, mx: 1 }} />{' '}
                          {translator.Status}
                        </Box>
                        <Box sx={{ display: 'flex' }}>
                          <Typography sx={{ mr: 0.5, pt: 0.2 }}>
                            {translator.average_rating.toFixed(1)}
                          </Typography>
                          <Star sx={{ color: 'orange' }} />
                        </Box>
                      </MenuItem>
                    ))
                  )}
                </Select>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAssign}
                  sx={{ mt: 2 }}
                >
                  {t.assign}
                </Button>
              </FormControl>
            )}
            {file.TranslatorApprovalStatus === 'Pending' && (
              <Alert severity="info" sx={{ mt: 2 }}>
                {t.translatorAssigned}
              </Alert>
            )}
            {file.TranslatedFileContent && file.Status === 'Translating' && (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleDownloadTranslated}
                  sx={{ mt: 2 }}
                >
                  {t.downloadTranslatedDocument}
                </Button>
                {file.TranslatedApprovalStatus === 'Pending' && (
                  <Box>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={handleApproveTranslated}
                      sx={{ mt: 2 }}
                    >
                      {t.approve}
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={handleRejectTranslated}
                      sx={{ mt: 2, ml: 2 }}
                    >
                      {t.reject}
                    </Button>
                  </Box>
                )}
              </>
            )}
            {file.TranslatedApprovalStatus === 'Approved' &&
              file.PaymentReceiptContent === null && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  {t.waitingForPayment}
                </Alert>
              )}
            <div>
              {file.Status === 'Finished' &&
                file.PaymentReceiptContent !== null && (
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleDownloadPaymentReceipt}
                    sx={{ mt: 2, ml: 2 }}
                  >
                    {t.downloadPaymentReceipt}
                  </Button>
                )}
            </div>
            {!file.PaymentConfirmed &&
              file.Status === 'Finished' &&
              file.PaymentReceiptContent !== null && (
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleApprovePayment}
                  sx={{ mt: 2, ml: 2 }}
                >
                  {t.approvePayment}
                </Button>
              )}
            {file.PaymentConfirmed && (
              <Alert severity="success" sx={{ mt: 2 }}>
                {t.paymentConfirmed}
              </Alert>
            )}
          </CardContent>
        </Card>

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
                {discussion.UserRole === 'admin' ? 'Admin' : t.client}
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
    </Container>
  );
};

export default AdminDocumentDetailsPage;
