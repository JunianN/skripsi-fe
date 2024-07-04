'use client';

import React from 'react';
import { Container, Box, Typography, Grid, Card, CardContent, Avatar } from '@mui/material';

const AboutPage = () => {
    return (
        <Container maxWidth="lg">
            {/* About Us Section */}
            <Box sx={{ py: 6 }}>
                <Typography variant="h2" gutterBottom textAlign="center">
                    About Us
                </Typography>
                <Typography variant="h5" color="textSecondary" paragraph textAlign="center">
                    We are dedicated to providing the best document translation management services.
                </Typography>
            </Box>

            {/* Our Mission Section */}
            <Box sx={{ py: 6, backgroundColor: '#f9f9f9' }}>
                <Typography variant="h4" gutterBottom textAlign="center">
                    Our Mission
                </Typography>
                <Typography variant="body1" color="textSecondary" paragraph textAlign="center">
                    Our mission is to streamline the translation process, ensuring efficiency and quality in every project. We strive to support businesses and individuals in overcoming language barriers by providing reliable and accurate translation services.
                </Typography>
            </Box>

            {/* Our Team Section */}
            <Box sx={{ py: 6 }}>
                <Typography variant="h4" gutterBottom textAlign="center">
                    Meet Our Team
                </Typography>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Avatar sx={{ bgcolor: 'primary.main', mb: 2, width: 56, height: 56 }}>J</Avatar>
                                <Typography variant="h6" gutterBottom>
                                    John Doe
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    CEO & Founder
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Avatar sx={{ bgcolor: 'primary.main', mb: 2, width: 56, height: 56 }}>M</Avatar>
                                <Typography variant="h6" gutterBottom>
                                    Mary Smith
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Head of Operations
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Avatar sx={{ bgcolor: 'primary.main', mb: 2, width: 56, height: 56 }}>A</Avatar>
                                <Typography variant="h6" gutterBottom>
                                    Alex Johnson
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Lead Developer
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>

            {/* Contact Us Section */}
            <Box sx={{ py: 6, backgroundColor: '#f9f9f9' }}>
                <Typography variant="h4" gutterBottom textAlign="center">
                    Contact Us
                </Typography>
                <Typography variant="body1" color="textSecondary" paragraph textAlign="center">
                    If you have any questions or need further information, feel free to reach out to us at:
                </Typography>
                <Typography variant="h6" gutterBottom textAlign="center">
                    support@documenttranslationmanager.com
                </Typography>
            </Box>
        </Container>
    );
};

export default AboutPage;