'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  Alert,
  Grid,
} from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../contexts/LanguageContext';
import { assignedDocumentsPageTranslations } from '../../translations/assignedDocumentsPageTranslations';
import { config } from '@/config/config';

const AssignedDocumentsPage = () => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const router = useRouter();
  const { language } = useLanguage();
  const t = assignedDocumentsPageTranslations[language];

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await axios.get(
          `${config.apiBaseUrl}/api/translator/assigned-documents`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        setFiles(response.data);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          setError(`${t.errorFetchingDocuments} ${error.response.data.error}`);
        } else {
          setError(t.unexpectedError);
        }
      }
    };

    fetchDocuments();
  }, [t]);

  const renderDocuments = (status) => {
    return files
      .filter((doc) => doc.Status === status)
      .map((doc) => (
        <Grid item xs={12} sm={6} md={4} key={doc.ID}>
          <Card>
            <CardContent>
              <Typography
                variant="h5"
                component="div"
                gutterBottom
                sx={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {doc.Title}
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {t.description}: {doc.Description}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {t.sourceLanguage}: {doc.SourceLanguage}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {t.targetLanguage}: {doc.TargetLanguage}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {t.numberOfPages}: {doc.NumberOfPages}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {t.status}: {doc.Status}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => router.push(`documents/${doc.ID}`)}
                sx={{ mt: 2 }}
              >
                {t.viewDetails}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ));
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          {t.pageTitle}
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {files.length === 0 ? (
          <Typography>{t.noDocuments}</Typography>
        ) : (
          <>
            <Typography variant="h5" gutterBottom>
              {t.pending}
            </Typography>
            {renderDocuments('Pending').length === 0 ? (
              <Alert severity="info">{t.noDocument}</Alert>
            ) : (
              <>
                <Grid container spacing={2}>
                  {renderDocuments('Pending')}
                </Grid>
              </>
            )}
            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              {t.translating}
            </Typography>
            {renderDocuments('Translating').length === 0 ? (
              <Alert severity="info">{t.noDocument}</Alert>
            ) : (
              <>
                <Grid container spacing={2}>
                  {renderDocuments('Translating')}
                </Grid>
              </>
            )}
            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              {t.finished}
            </Typography>
            {renderDocuments('Finished').length === 0 ? (
              <Alert severity="info">{t.noDocument}</Alert>
            ) : (
              <>
                <Grid container spacing={2}>
                  {renderDocuments('Finished')}
                </Grid>
              </>
            )}
          </>
        )}
      </Box>
    </Container>
  );
};

export default AssignedDocumentsPage;
