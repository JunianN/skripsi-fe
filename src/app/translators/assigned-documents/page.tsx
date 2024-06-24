'use client';

import React, { useEffect, useState } from 'react';
import { Box, Button, Container, Typography, Card, CardContent, Alert } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const AssignedDocumentsPage = () => {
    const [files, setFiles] = useState([]);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:3001/api/translator/assigned-documents', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setFiles(response.data);
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    setError(`Error fetching documents: ${error.response.data.error}`);
                } else {
                    setError('An unexpected error occurred while fetching the documents');
                }
            }
        };

        fetchDocuments();
    }, []);

    return (
        <Container maxWidth="md">
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Assigned Documents
                </Typography>
                {error && <Alert severity="error">{error}</Alert>}
                {files.length === 0 ? (
                    <Typography>No documents assigned to you.</Typography>
                ) : (
                    files.map((file) => (
                        <Card key={file.ID} sx={{ mb: 2 }}>
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
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => router.push(`/translators/documents/${file.ID}`)}
                                    sx={{ mt: 2 }}
                                >
                                    View Document
                                </Button>
                            </CardContent>
                        </Card>
                    ))
                )}
            </Box>
        </Container>
    );
};

export default AssignedDocumentsPage;
