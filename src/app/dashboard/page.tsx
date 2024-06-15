import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import Link from 'next/link';

const DashboardPage = () => {
    return (
        <Container maxWidth="lg">
            <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
                Dashboard
            </Typography>
            <Grid container spacing={3}>
                {/* Document Summary Card */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Documents Pending
                            </Typography>
                            <Typography variant="body2">
                                You have 5 documents waiting for translation.
                            </Typography>
                            <Box sx={{ mt: 2 }}>
                                <Link href="/documents/pending" passHref>
                                    <Button variant="outlined" color="primary">
                                        View Details
                                    </Button>
                                </Link>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Tasks Card */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Translation Progress
                            </Typography>
                            <Typography variant="body2">
                                3 documents are currently being translated.
                            </Typography>
                            <Box sx={{ mt: 2 }}>
                                <Link href="/documents/in-progress" passHref>
                                    <Button variant="outlined" color="primary">
                                        View Details
                                    </Button>
                                </Link>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Messages Card */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Recent Messages
                            </Typography>
                            <Typography variant="body2">
                                You have 2 new messages from translators.
                            </Typography>
                            <Box sx={{ mt: 2 }}>
                                <Link href="/messages" passHref>
                                    <Button variant="outlined" color="primary">
                                        View Messages
                                    </Button>
                                </Link>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default DashboardPage;
