'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Box, Button, Container, Typography, Card, CardContent, TextField, Paper, Stepper, Step, StepLabel, MenuItem, Select, FormControl, InputLabel, Alert } from '@mui/material';
import axios from 'axios';

const statuses = ['Pending', 'In Progress', 'Completed'];

const AdminDocumentDetailsPage = () => {
    const { id } = useParams();
    const [file, setFile] = useState(null);
    console.log("🚀 ~ AdminDocumentDetailsPage ~ file:", file)
    const [discussions, setDiscussions] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [error, setError] = useState('');
    const [translators, setTranslators] = useState([]);
    const [selectedTranslator, setSelectedTranslator] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchDocument = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:3001/api/admin/documents/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setFile(response.data);
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
                const response = await axios.get(`http://127.0.0.1:3001/api/documents/${id}/discussions`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setDiscussions(response.data);
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    setError(`Error fetching discussions: ${error.response.data.error}`);
                } else {
                    setError('An unexpected error occurred while fetching discussions');
                }
            }
        };

        const fetchTranslators = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:3001/api/admin/translators', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });
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
        fetchTranslators();
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
                setError(`Error posting message: ${error.response.data.error}`);
            } else {
                setError('An unexpected error occurred while posting the message');
            }
        }
    };

    const handleDownload = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:3001/api/admin/documents/${id}/download`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));

            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'submitted_document.pdf'); // Specify the filename
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

    const handleDownloadTranslated = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:3001/api/admin/documents/${id}/translated/download`, {
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
            await axios.post(`http://127.0.0.1:3001/api/admin/documents/${id}/translated/approve`, {}, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });
            setFile({ ...file, TranslatedApprovalStatus: 'Approved', Status: 'Completed' });
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setError(`Error approving translated document: ${error.response.data.error}`);
            } else {
                setError('An unexpected error occurred during the approval');
            }
        }
    };

    const handleRejectTranslated = async () => {
        try {
            await axios.post(`http://127.0.0.1:3001/api/admin/documents/${id}/translated/reject`, {}, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });
            setFile({ ...file, TranslatedApprovalStatus: 'Rejected' });
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setError(`Error rejecting translated document: ${error.response.data.error}`);
            } else {
                setError('An unexpected error occurred during the rejection');
            }
        }
    };

    const handleApprove = async () => {
        try {
            await axios.post(`http://127.0.0.1:3001/api/admin/documents/${id}/approve`, {}, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });
            setFile({ ...file, ApprovalStatus: 'Approved' });
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
            await axios.post(`http://127.0.0.1:3001/api/admin/documents/${id}/reject`, {}, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });
            setFile({ ...file, ApprovalStatus: 'Rejected' });
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
            await axios.post(`http://127.0.0.1:3001/api/admin/documents/${id}/assign`, { translator_id: selectedTranslator }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });
            setFile({ ...file, Status: 'In Progress', TranslatorID: selectedTranslator });
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setError(`Error assigning document: ${error.response.data.error}`);
            } else {
                setError('An unexpected error occurred during the assignment');
            }
        }
    };

    const handleDownloadPaymentReceipt = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:3001/api/admin/documents/${id}/payment-receipt`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                responseType: 'blob',
            });

            const filename = response.headers['content-disposition'].split('filename=')[1];
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.log(error)
            if (axios.isAxiosError(error) && error.response) {
                setError(`Download error: ${error.response.data.error}`);
            } else {
                setError('An unexpected error occurred during the download');
            }
        }
    };

    const handleApprovePayment = async () => {
        try {
            await axios.post(`http://127.0.0.1:3001/api/admin/documents/${id}/payment-approve`, {}, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });
            setSuccess('Payment approved successfully');
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
                    <Typography>Loading...</Typography>
                </Box>
            </Container>
        );
    }

    const activeStep = statuses.indexOf(file.Status);

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
                            onClick={() => router.push('/admin/documents')}
                            sx={{ mt: 2 }}
                        >
                            Back to Document List
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleDownload}
                            sx={{ mt: 2, ml: 2 }}
                        >
                            Download Submitted Document
                        </Button>
                        {file.TranslatedFilePath && (
                            <>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleDownloadTranslated}
                                    sx={{ mt: 2, ml: 2 }}
                                >
                                    Download Translated Document
                                </Button>
                                {file.TranslatedApprovalStatus === 'Pending' && (
                                    <>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleApproveTranslated}
                                            sx={{ mt: 2, ml: 2 }}
                                        >
                                            Approve Translated Document
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={handleRejectTranslated}
                                            sx={{ mt: 2, ml: 2 }}
                                        >
                                            Reject Translated Document
                                        </Button>
                                    </>
                                )}
                            </>
                        )}
                        {file.ApprovalStatus === 'Pending' && (
                            <>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleApprove}
                                    sx={{ mt: 2, ml: 2 }}
                                >
                                    Approve
                                </Button>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={handleReject}
                                    sx={{ mt: 2, ml: 2 }}
                                >
                                    Reject
                                </Button>
                            </>
                        )}
                        {file.ApprovalStatus === 'Approved' && file.Status === 'Pending' && (
                            <FormControl fullWidth sx={{ mt: 2 }}>
                                <InputLabel id="translator-select-label">Select Translator</InputLabel>
                                <Select
                                    labelId="translator-select-label"
                                    id="translator-select"
                                    value={selectedTranslator}
                                    label="Select Translator"
                                    onChange={(e) => setSelectedTranslator(e.target.value)}
                                >
                                    {translators.map((translator) => (
                                        <MenuItem key={translator.ID} value={translator.ID}>
                                            {translator.Username}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleAssign}
                                    sx={{ mt: 2 }}
                                >
                                    Assign to Translator
                                </Button>
                            </FormControl>
                        )}
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleDownloadPaymentReceipt}
                            sx={{ mt: 2, ml: 2 }}
                        >
                            Download Payment Receipt
                        </Button>
                        {!file.PaymentConfirmed && (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleApprovePayment}
                                sx={{ mt: 2, ml: 2 }}
                            >
                                Approve Payment
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
            </Box>
        </Container>
    );
};

export default AdminDocumentDetailsPage;
