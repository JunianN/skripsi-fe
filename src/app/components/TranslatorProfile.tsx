'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Box, Container, Typography, Alert } from '@mui/material';
import axios from 'axios';
import Rating from '@mui/material/Rating';

const TranslatorProfile = () => {
    const { id } = useParams();
    const [averageRating, setAverageRating] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAverageRating = async () => {
            try {
                const response = await axios.get(`/api/translator/${id}/average-rating`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setAverageRating(response.data.average_rating);
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    setError(`Error fetching average rating: ${error.response.data.error}`);
                } else {
                    setError('An unexpected error occurred while fetching the average rating');
                }
            }
        };

        fetchAverageRating();
    }, [id]);

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Translator Profile
                </Typography>
                {error && <Alert severity="error">{error}</Alert>}
                {averageRating !== null ? (
                    <>
                        <Typography variant="h6">Average Rating</Typography>
                        <Rating value={averageRating} precision={0.1} readOnly />
                        <Typography variant="body1">{averageRating.toFixed(1)} / 5.0</Typography>
                    </>
                ) : (
                    <Typography>Loading...</Typography>
                )}
            </Box>
        </Container>
    );
};

export default TranslatorProfile;
