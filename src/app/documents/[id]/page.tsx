'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { Box, Button, Container, Typography, Card, CardContent, TextField, Paper, Stepper, Step, StepLabel, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import axios from 'axios';

const statuses = ['Pending', 'Translating', 'Completed'];
const accountNumber = '1234567890'; // account number
const pricePerPage = 10; // price per page

const DocumentDetailsPage = () => {
    const { id } = useParams();
    const [file, setDocument] = useState(null);
    const [discussions, setDiscussions] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [error, setError] = useState('');
    const [open, setOpen] = useState(false); // State to handle modal visibility
    const router = useRouter();

    useEffect(() => {
        const fetchDocument = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:3001/api/documents/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setDocument(response.data);
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    setError(error.response.data.error);
                } else {
                    setError('An unexpected error occurred');
                }
            }
        };

        const fetchDiscussions = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:3001/api/documents/${id}/discussions`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setDiscussions(response.data);
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    setError(error.response.data.error);
                } else {
                    setError('An unexpected error occurred');
                }
            }
        };

        fetchDocument();
        fetchDiscussions();
    }, [id]);

    const handlePostMessage = async () => {
        if (!newMessage.trim()) {
            return;
        }

        try {
            const response = await axios.post(`http://127.0.0.1:3001/api/documents/${id}/discussions`, { message: newMessage }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
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

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDownload = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:3001/api/documents/${id}/download`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                responseType: 'blob',
            });

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
    if (file.Status === "Completed") {
        activeStep = 3
    }
    const totalPrice = file.NumberOfPages * pricePerPage;

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
                <Card>
                    <CardContent>
                        <Typography variant="h5" component="div">
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
                        {file.Status === 'Completed' && (
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={handleClickOpen}
                                sx={{ mt: 2, ml: 2 }}
                            >
                                View Payment Details
                            </Button>
                        )}
                        {file.Status === 'Completed' && file.PaymentConfirmed && (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleDownload}
                                    sx={{ mt: 2, ml: 2 }}
                                >
                                    Download Translated Document
                                </Button>
                        )}
                    </CardContent>
                </Card>

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
                        />
                        <Button variant="contained" color="primary" onClick={handlePostMessage} sx={{ ml: 2 }}>
                            Send
                        </Button>
                    </Box>
                </Box>

                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Payment Details</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Please transfer the amount of ${totalPrice} to the following account number:
                        </DialogContentText>
                        <Typography variant="h6" sx={{ mt: 2 }}>
                            Account Number: {accountNumber}
                        </Typography>
                        <DialogContentText sx={{ mt: 2 }}>
                            After completing the payment, please confirm the payment through the provided means.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Container>
    );
};

export default DocumentDetailsPage;
