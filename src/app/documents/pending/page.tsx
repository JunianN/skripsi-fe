'use client'

import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import Link from 'next/link';
import axios from 'axios';

const PendingDocumentsPage = () => {
    // Set the JWT token to the Authorization header
    const token = localStorage.getItem('token');
    const [documents, setDocuments] = useState([]);
    console.log("🚀 ~ PendingDocumentsPage ~ documents:", documents)
    useEffect(() => {
        // Fetch pending documents from the backend
        const fetchDocuments = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:3001/api/documents", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }); // Adjust the API endpoint as necessary
                setDocuments(response.data);
            } catch (error) {
                console.error("Error fetching pending documents:", error);
            }
        };

        fetchDocuments();
    }, [token]);

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
                Pending Documents
            </Typography>
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
                                <Box sx={{ mt: 2 }}>
                                    <Link href={`/documents/${document.ID}`} passHref>
                                        <Button variant="outlined" color="primary">
                                            View Details
                                        </Button>
                                    </Link>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default PendingDocumentsPage;
