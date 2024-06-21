'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Container, Typography, Card, CardContent, Paper } from '@mui/material';
import axios from 'axios';

const AdminDocumentsPage = () => {
    const [documents, setDocuments] = useState([]);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:3001/api/admin/documents', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setDocuments(response.data);
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    setError(error.response.data.error);
                } else {
                    setError('An unexpected error occurred');
                }
            }
        };

        fetchDocuments();
    }, []);

    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 4, mb: 2 }}>
                <Typography variant="h4" gutterBottom>
                    All Submitted Documents
                </Typography>
                {error && (
                    <Typography color="error" variant="body2" align="center">
                        {error}
                    </Typography>
                )}
                {documents.map((document) => (
                    <Card key={document.ID} sx={{ mb: 2 }}>
                        <CardContent>
                            <Typography variant="h5" component="div">
                                {document.Title}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Description: {document.Description}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Status: {document.Status}
                            </Typography>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => router.push(`/admin/documents/${document.ID}`)}
                                sx={{ mt: 2 }}
                            >
                                View Details
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </Box>
        </Container>
    );
};

export default AdminDocumentsPage;
