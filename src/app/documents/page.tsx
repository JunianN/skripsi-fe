'use client';

import React, { useEffect, useState } from 'react';
import { Box, Button, Container, Typography, Grid, Card, CardContent } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const DocumentListPage = () => {
    const [documents, setDocuments] = useState([]);
    console.log("🚀 ~ DocumentListPage ~ documents:", documents)
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:3001/api/documents', {
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
                    My Documents
                </Typography>
                {error && (
                    <Typography color="error" variant="body2" align="center">
                        {error}
                    </Typography>
                )}
                <Grid container spacing={3}>
                    {documents.map((document) => (
                        <Grid item xs={12} sm={6} md={4} key={document.ID}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h5" component="div">
                                        {document.Title}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {document.Description}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Status: {document.Status}
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => router.push(`/documents/${document.ID}`)}
                                        sx={{ mt: 2 }}
                                    >
                                        View Details
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Container>
    );
};

export default DocumentListPage;
