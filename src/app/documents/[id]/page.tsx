'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { Box, Button, Container, Typography, Card, CardContent, TextField, Paper } from '@mui/material';
import axios from 'axios';

const DocumentDetailsPage = () => {
    const { id } = useParams();
    const [document, setDocument] = useState(null);
    console.log("🚀 ~ DocumentDetailsPage ~ document:", document)
    const [discussions, setDiscussions] = useState([]);
    console.log("🚀 ~ DocumentDetailsPage ~ discussions:", discussions)
    const [newMessage, setNewMessage] = useState('');
    console.log("🚀 ~ DocumentDetailsPage ~ newMessage:", newMessage)
    const [error, setError] = useState('');
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

    if (!document) {
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
                            {document.Title}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Description: {document.Description}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Source Language: {document.SourceLanguage}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Target Language: {document.TargetLanguage}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Number of Pages: {document.NumberOfPages}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Status: {document.Status}
                        </Typography>
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => router.push('/documents')}
                            sx={{ mt: 2 }}
                        >
                            Back to Document List
                        </Button>
                    </CardContent>
                </Card>

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

export default DocumentDetailsPage;
