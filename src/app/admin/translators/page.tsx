'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Alert,
  Chip,
} from '@mui/material';
import axios from 'axios';
import { useLanguage } from '../../contexts/LanguageContext';
import { adminTranslatorsPageTranslations } from '../../translations/adminTranslatorsPageTranslations';
import { config } from '@/config/config';

interface Translator {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  Username: string;
  Email: string;
  Role: string;
  ProficientLanguages: string[];
  Ratings: any | null;
  Status: string;
}

const AdminTranslatorsPage = () => {
  const [translators, setTranslators] = useState<Translator[]>([]);
  const [error, setError] = useState('');
  const router = useRouter();
  const { language } = useLanguage();
  const t = adminTranslatorsPageTranslations[language];

  useEffect(() => {
    const fetchTranslators = async () => {
      try {
        const response = await axios.get<Translator[]>(
          `${config.apiBaseUrl}/api/admin/translators`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        setTranslators(response.data);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          setError(error.response.data.error);
        } else {
          setError(t.unexpectedError);
        }
      }
    };

    fetchTranslators();
  }, [t]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'working':
        return 'success';
      case 'inactive':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getLanguageName = (code: string) => {
    const languages = {
      en: language === 'id' ? 'Inggris' : 'English',
      id: language === 'id' ? 'Indonesia' : 'Indonesian',
      // Add more languages as needed
    };
    return languages[code] || code;
  };

  const renderTranslators = () => {
    return translators.map((translator) => (
      <Grid item xs={12} sm={6} md={4} key={translator.ID}>
        <Card>
          <CardContent>
            <Typography
              variant="h6"
              component="div"
              sx={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
              gutterBottom
            >
              {translator.Username}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {t.name}: {translator.Username}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {t.email}: {translator.Email}
            </Typography>
            <Box sx={{ mt: 1, mb: 1 }}>
              <Chip
                label={translator.Status}
                color={getStatusColor(translator.Status)}
                size="small"
              />
            </Box>
            <Typography variant="body2" color="textSecondary">
              {t.languages}:{' '}
              {translator.ProficientLanguages.map(getLanguageName).join(', ')}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              {t.joinedDate}: {formatDate(translator.CreatedAt)}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => router.push(`translators/${translator.ID}`)}
              sx={{ mt: 2 }}
            >
              {t.viewProfile}
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
          {t.pageTitle}
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {translators.length === 0 ? (
          <Alert severity="info">{t.noTranslators}</Alert>
        ) : (
          <Grid container spacing={2}>
            {renderTranslators()}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default AdminTranslatorsPage; 