'use client';

import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, Button, Grid, Card, CardContent, Avatar } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from './contexts/AuthContext';

const LandingPage = () => {
    // const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();
    const { user, isLoggedIn, logout } = useAuth();

    // useEffect(() => {
    //     // Check if the user is authenticated
    //     const token = localStorage.getItem('token');
    //     if (token) {
    //         setIsAuthenticated(true);
    //     }
    // }, []);

    return (
        <Container maxWidth="lg">
            {/* Hero Section */}
            <Box sx={{ textAlign: 'center', py: 6 }}>
                <Typography variant="h2" gutterBottom>
                    Welcome to Document Translation Manager
                </Typography>
                <Typography variant="h5" color="textSecondary" paragraph>
                    Your one-stop solution for managing and translating documents efficiently.
                </Typography>
                <Link href={isLoggedIn ? '/submit-translation' : '/register'}>
                    <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                        {isLoggedIn ? 'Translate Now' : 'Get Started'}
                    </Button>
                </Link>
            </Box>

            {/* Features Section */}
            <Box sx={{ py: 6 }}>
                <Typography variant="h4" gutterBottom textAlign="center">
                    Features
                </Typography>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" gutterBottom>
                                    User Authentication
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Secure login and registration for all users including admins, translators, and regular users.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" gutterBottom>
                                    Document Upload
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Easily upload documents for translation and track their status.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" gutterBottom>
                                    Translation Management
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Manage translations with ease, assign tasks to translators, and track progress.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>

            {/* How It Works Section */}
            <Box sx={{ py: 6, px: 2, backgroundColor: '#ffffff', borderRadius: '16px' }}>
                <Typography variant="h4" gutterBottom textAlign="center">
                    How It Works
                </Typography>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" gutterBottom>
                                    Step 1: Register
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Create an account to get started. Choose your role as a user, translator, or admin.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" gutterBottom>
                                    Step 2: Upload Document
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Upload the document you need to translate and specify the source and target languages.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" gutterBottom>
                                    Step 3: Track Progress
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Monitor the translation progress and communicate with translators through our platform.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>

            {/* Testimonials Section */}
            <Box sx={{ py: 6 }}>
                <Typography variant="h4" gutterBottom textAlign="center">
                    Testimonials
                </Typography>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Avatar sx={{ bgcolor: 'primary.main', mb: 2 }}>A</Avatar>
                                <Typography variant="h6" gutterBottom>
                                    Alice Johnson
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    &quot;This platform has streamlined our document translation process. It&apos;s efficient and easy to use!&quot;
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Avatar sx={{ bgcolor: 'primary.main', mb: 2 }}>B</Avatar>
                                <Typography variant="h6" gutterBottom>
                                    Bob Smith
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    &quot;A great tool for managing translations. Highly recommended for businesses.&quot;
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Avatar sx={{ bgcolor: 'primary.main', mb: 2 }}>C</Avatar>
                                <Typography variant="h6" gutterBottom>
                                    Carol White
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    &quot;As a translator, this platform makes my job much easier. It&apos;s well-organized and user-friendly.&quot;
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>

            {/* Call to Action Section */}
            {!isLoggedIn && (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                    <Typography variant="h4" gutterBottom>
                        Ready to Get Started?
                    </Typography>
                    <Typography variant="h6" color="textSecondary" paragraph>
                        Join Document Translation Manager today and experience seamless document translation management.
                    </Typography>
                    <Link href={'register'} passHref>
                        <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                            Sign Up Now
                        </Button>
                    </Link>
                </Box>
            )}
        </Container>
    );
};
// return (
//     <Container maxWidth="md">
//         <Box textAlign="center" my={4}>
//             <Typography variant="h4" gutterBottom>
//                 Welcome to Our Translation Management System
//             </Typography>
//             <Typography variant="subtitle1">
//                 Helping you manage your translation needs with ease and efficiency.
//             </Typography>
//             <Box mt={2}>
//                 {isAuthenticated ? (
//                     <>
//                         <Link href="/submit-translation" passHref>
//                             <Button variant="contained" color="primary">
//                                 Submit Translation Request
//                             </Button>
//                         </Link>
//                     </>
//                 ) : (
//                     <>
//                         <Link href="/login" passHref>
//                             <Button variant="contained" color="primary">
//                                 Login
//                             </Button>
//                         </Link>
//                         <Link href="/register" passHref>
//                             <Button variant="outlined" color="primary" sx={{ ml: 2 }}>
//                                 Register
//                             </Button>
//                         </Link>
//                     </>
//                 )}
//             </Box>
//         </Box>
//     </Container>
// );

export default LandingPage;
