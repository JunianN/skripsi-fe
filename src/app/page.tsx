'use client';

import React from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
} from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from './contexts/AuthContext';
import { useLanguage } from './contexts/LanguageContext';
import { landingPageTranslations } from './translations/landingPage';

const LandingPage = () => {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const { language } = useLanguage();
  console.log('Current language:', language);

  if (!language || !landingPageTranslations[language]) {
    console.error('Invalid language or translations not found');
    return null; // or return a loading state or error message
  }

  const t = landingPageTranslations[language];

  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Typography variant="h2" gutterBottom>
          {t.welcome}
        </Typography>
        <Typography variant="h5" color="textSecondary" paragraph>
          {t.subtitle}
        </Typography>
        <Link href={isLoggedIn ? '/submit-translation' : '/register'}>
          <Button variant="contained" color="primary" sx={{ mt: 2 }}>
            {isLoggedIn ? t.translateNow : t.getStarted}
          </Button>
        </Link>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 6 }}>
        <Typography variant="h4" gutterBottom textAlign="center">
          {t.features}
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {t.userAuth}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {t.userAuthDesc}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {t.docUpload}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {t.docUploadDesc}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {t.translationManagement}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {t.translationManagementDesc}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* How It Works Section */}
      <Box
        sx={{ py: 6, px: 2, backgroundColor: '#ffffff', borderRadius: '16px' }}
      >
        <Typography variant="h4" gutterBottom textAlign="center">
          {t.howItWorks}
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {t.step1}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {t.step1Desc}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {t.step2}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {t.step2Desc}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {t.step3}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {t.step3Desc}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ py: 6 }}>
        <Typography variant="h4" gutterBottom textAlign="center">
          {t.testimonials}
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
                  &quot;This platform has streamlined our document translation
                  process. It&apos;s efficient and easy to use!&quot;
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
                  &quot;A great tool for managing translations. Highly
                  recommended for businesses.&quot;
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
                  &quot;As a translator, this platform makes my job much easier.
                  It&apos;s well-organized and user-friendly.&quot;
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
            {t.readyToStart}
          </Typography>
          <Typography variant="h6" color="textSecondary" paragraph>
            {t.joinNow}
          </Typography>
          <Link href={'register'} passHref>
            <Button variant="contained" color="primary" sx={{ mt: 2 }}>
              {t.signUpNow}
            </Button>
          </Link>
        </Box>
      )}
    </Container>
  );
};

export default LandingPage;
