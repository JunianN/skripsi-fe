'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Container, Typography, Card, CardContent, Grid, Alert } from '@mui/material';
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

    const renderDocuments = (status) => {
        return documents
            .filter((doc) => doc.Status === status)
            .map((doc) => (
                <Grid item xs={12} sm={6} md={4} key={doc.ID}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5" component="div">
                                {doc.Title}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Description: {doc.Description}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Source Language: {doc.SourceLanguage}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Target Language: {doc.TargetLanguage}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Number of Pages: {doc.NumberOfPages}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Status: {doc.Status}
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => router.push(`documents/${doc.ID}`)}
                                sx={{ mt: 2 }}
                            >
                                View Details
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            ));
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 4, mb: 2 }}>
                <Typography variant="h4" gutterBottom>
                    All Submitted Documents
                </Typography>
                {error && (<Alert severity="error">{error}</Alert>)}
                <Typography variant="h5" gutterBottom>
                    Pending
                </Typography>
                <Grid container spacing={2}>
                    {renderDocuments('Pending')}
                </Grid>
                <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
                    Translating
                </Typography>
                <Grid container spacing={2}>
                    {renderDocuments('Translating')}
                </Grid>
                <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
                    Finished
                </Typography>
                <Grid container spacing={2}>
                    {renderDocuments('Finished')}
                </Grid>
            </Box>
        </Container>
    );
};

export default AdminDocumentsPage;
