'use client';

import React from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
} from '@mui/material';
import { useLanguage } from '../contexts/LanguageContext';
import { aboutPageTranslations } from '../translations/aboutPageTranslations';

const AboutPage = () => {
  const { language } = useLanguage();
  const t = aboutPageTranslations[language];

  return (
    <Container maxWidth="lg">
      {/* About Us Section */}
      <Box sx={{ py: 6 }}>
        <Typography variant="h2" gutterBottom textAlign="center">
          {t.aboutUs}
        </Typography>
        <Typography
          variant="h5"
          color="textSecondary"
          paragraph
          textAlign="center"
        >
          {t.aboutUsDescription}
        </Typography>
      </Box>

      {/* Our Mission Section */}
      <Box sx={{ py: 6, backgroundColor: '#f9f9f9' }}>
        <Typography variant="h4" gutterBottom textAlign="center">
          {t.ourMission}
        </Typography>
        <Typography
          variant="body1"
          color="textSecondary"
          paragraph
          textAlign="center"
          sx={{ mx: 4 }}
        >
          {t.ourMissionDescription}
        </Typography>
      </Box>

      {/* Our Team Section */}
      <Box sx={{ py: 6 }}>
        <Typography variant="h4" gutterBottom textAlign="center">
          {t.meetOurTeam}
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Avatar
                  sx={{ bgcolor: 'primary.main', mb: 2, width: 56, height: 56 }}
                >
                  J
                </Avatar>
                <Typography variant="h6" gutterBottom>
                  John Doe
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {t.ceoFounder}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Avatar
                  sx={{ bgcolor: 'primary.main', mb: 2, width: 56, height: 56 }}
                >
                  M
                </Avatar>
                <Typography variant="h6" gutterBottom>
                  Mary Smith
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {t.headOfOperations}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Avatar
                  sx={{ bgcolor: 'primary.main', mb: 2, width: 56, height: 56 }}
                >
                  A
                </Avatar>
                <Typography variant="h6" gutterBottom>
                  Alex Johnson
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {t.leadDeveloper}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Contact Us Section */}
      <Box sx={{ py: 6, backgroundColor: '#f9f9f9' }}>
        <Typography variant="h4" gutterBottom textAlign="center">
          {t.contactUs}
        </Typography>
        <Typography
          variant="body1"
          color="textSecondary"
          paragraph
          textAlign="center"
        >
          {t.contactUsDescription}
        </Typography>
        <Typography variant="h6" gutterBottom textAlign="center">
          {t.contactEmail}
        </Typography>
      </Box>
    </Container>
  );
};

export default AboutPage;
