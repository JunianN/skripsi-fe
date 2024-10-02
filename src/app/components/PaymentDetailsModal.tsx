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

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await axios.get(
          `https://doc-translation-api.onrender.com/api/documents/${documentId}`,
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
          setError(`Error fetching document: ${error.response.data.error}`);
        } else {
          setError('An unexpected error occurred while fetching the document');
        }
      }
    };

    if (open) {
      fetchDocument();
    }
  }, [documentId, open]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('receipt', selectedFile);

    try {
      await axios.post(
        `https://doc-translation-api.onrender.com/api/documents/${documentId}/upload-receipt`,
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
        setError(`Error uploading receipt: ${error.response.data.error}`);
      } else {
        setError('An unexpected error occurred while uploading the receipt');
      }
      setSuccess('');
    }
  };

  function formatCurrency(value) {
    const formatter = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    });

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
          Payment Details
        </Typography>
        <Typography id="payment-details-modal-description" sx={{ mt: 2 }}>
          Please transfer the amount to the following account number and upload
          the payment receipt.
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Account Number: 123456789
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Amount: {formatCurrency(totalPrice)}
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
            Payment receipt has been uploaded. Waiting for confirmation from the
            admin.
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
                  Upload Receipt
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
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default PaymentDetailsModal;
