'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { Box, Button, Container, Typography, Card, CardContent, TextField, Paper, Stepper, Step, StepLabel } from '@mui/material';
import axios from 'axios';

const statuses = ['Pending', 'In Progress', 'Completed'];

const AdminDocumentDetailsPage = () => {
    const { id } = useParams();
    const [file, setDocument] = useState(null);
    const [discussions, setDiscussions] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchDocument = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:3001/api/admin/documents/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setDocument(response.data);
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
