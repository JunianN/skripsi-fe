'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Modal,
  Typography,
  TextField,
  Card,
  CardContent,
  Alert,
} from '@mui/material';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';
import { paymentDetailsModalTranslations } from '../translations/paymentDetailsModalTranslations';
import { config } from '@/config/config';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const PaymentDetailsModal = ({ open, handleClose, documentId, totalPrice }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [receiptUploaded, setReceiptUploaded] = useState(false);
  const { language } = useLanguage();
  const t = paymentDetailsModalTranslations[language];

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await axios.get(
          `${config.apiBaseUrl}/api/documents/${documentId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        if (response.data.PaymentReceiptContent) {
          setReceiptUploaded(true);
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          setError(`${t.uploadError} ${error.response.data.error}`);
        } else {
          setError(t.unexpectedError);
        }
      }
    };

    if (open) {
      fetchDocument();
    }
  }, [documentId, open, t]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      setError(t.selectFile);
      return;
    }

    const formData = new FormData();
    formData.append('receipt', selectedFile);

    try {
      await axios.post(
        `${config.apiBaseUrl}/api/documents/${documentId}/upload-receipt`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setError('');
      setReceiptUploaded(true);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(`${t.uploadError} ${error.response.data.error}`);
      } else {
        setError(t.unexpectedError);
      }
      setSuccess('');
    }
  };

  function formatCurrency(value) {
    const formatter = new Intl.NumberFormat(
      language === 'en' ? 'en-US' : 'id-ID',
      {
        style: 'currency',
        currency: 'IDR',
      }
    );

    const numericValue = parseFloat(value);

    return formatter.format(numericValue);
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="payment-details-modal-title"
      aria-describedby="payment-details-modal-description"
    >
      <Box sx={style}>
        <Typography
          id="payment-details-modal-title"
          variant="h6"
          component="h2"
        >
          {t.paymentDetails}
        </Typography>
        <Typography id="payment-details-modal-description" sx={{ mt: 2 }}>
          {t.transferInstructions}
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          {t.accountNumber}: 123456789
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          {t.amount}: {formatCurrency(totalPrice)}
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {success}
          </Alert>
        )}
        {receiptUploaded ? (
          <Alert severity="success" sx={{ mt: 2 }}>
            {t.receiptUploaded}
          </Alert>
        ) : (
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileChange} />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                >
                  {t.uploadReceipt}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
        <Button
          onClick={handleClose}
          variant="contained"
          color="secondary"
          sx={{ mt: 2 }}
        >
          {t.close}
        </Button>
      </Box>
    </Modal>
  );
};

export default PaymentDetailsModal;
