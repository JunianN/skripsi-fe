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

const AssignedDocumentsPage = () => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await axios.get(
          'https://doc-translation-api.onrender.com/api/translator/assigned-documents',
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
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
                Description: {doc.Description}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Source Language: {doc.SourceLanguage}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Target Language: {doc.TargetLanguage}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Number of Pages: {doc.NumberOfPages}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Status: {doc.Status}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => router.push(`documents/${doc.ID}`)}
                sx={{ mt: 2 }}
              >
                View Details
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
          Assigned Documents
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {files.length === 0 ? (
          <Typography>No documents assigned to you.</Typography>
        ) : (
          <>
            <Typography variant="h5" gutterBottom>
              Pending
            </Typography>
            {renderDocuments('Pending').length === 0 ? (
              <Alert severity="info">No document</Alert>
            ) : (
              <>
                <Grid container spacing={2}>
                  {renderDocuments('Pending')}
                </Grid>
              </>
            )}
            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              Translating
            </Typography>
            {renderDocuments('Translating').length === 0 ? (
              <Alert severity="info">No document</Alert>
            ) : (
              <>
                <Grid container spacing={2}>
                  {renderDocuments('Translating')}
                </Grid>
              </>
            )}
            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              Finished
            </Typography>
            {renderDocuments('Finished').length === 0 ? (
              <Alert severity="info">No document</Alert>
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
