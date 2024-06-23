'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { Box, Button, Container, Typography, TextField, Card, CardContent, Alert } from '@mui/material';
import axios from 'axios';

const UploadPaymentReceiptPage = () => {
    const { id } = useParams();
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

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
            await axios.post(`http://127.0.0.1:3001/api/documents/${id}/upload-receipt`, formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            setSuccess('Payment receipt uploaded successfully');
            setError('');
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setError(`Error uploading receipt: ${error.response.data.error}`);
            } else {
                setError('An unexpected error occurred while uploading the receipt');
            }
            setSuccess('');
        }
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Upload Payment Receipt
                </Typography>
                {error && <Alert severity="error">{error}</Alert>}
                {success && <Alert severity="success">{success}</Alert>}
                <Card>
                    <CardContent>
                        <Typography variant="body1">
                            Please upload the payment receipt after you have transferred the payment to the account number provided.
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <input type="file" onChange={handleFileChange} />
                            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                                Upload Receipt
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
};

export default UploadPaymentReceiptPage;
