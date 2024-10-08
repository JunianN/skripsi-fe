'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
} from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../contexts/LanguageContext';
import { submitTranslationPageTranslations } from '../translations/submitTranslationPageTranslations';

const pricePerPage = 100000; // Price per page

function formatCurrency(value: number, locale: string) {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'IDR',
  });

  return formatter.format(value);
}

interface Language {
  code: string;
  name: string;
}

const languages: Language[] = [
  { code: 'id', name: 'Indonesian' },
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'French' },
  { code: 'es', name: 'Spanish' },
  { code: 'ru', name: 'Russian' },
  { code: 'ar', name: 'Arabic' },
  { code: 'zh', name: 'Chinese' },
  { code: 'hi', name: 'Hindi' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'it', name: 'Italian' },
];

const SubmitTranslationPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [sourceLanguage, setSourceLanguage] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('');
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { language } = useLanguage();
  const t = submitTranslationPageTranslations[language];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (
      !title ||
      !description ||
      !file ||
      !sourceLanguage ||
      !targetLanguage ||
      !numberOfPages
    ) {
      setError(t.fillAllFields);
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('document', file);
    formData.append('sourceLanguage', sourceLanguage);
    formData.append('targetLanguage', targetLanguage);
    formData.append('numberOfPages', numberOfPages.toString());

    try {
      const response = await axios.post(
        'https://doc-translation-api.onrender.com/api/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.status === 200) {
        setOpen(true);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(`Error: ${error.response.data.error}`);
      } else {
        setError(t.failedSubmission);
      }
    }
  };

  const estimatedPrice = numberOfPages * pricePerPage;

  const handleClose = () => {
    setOpen(false);
    router.push('/documents');
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          {t.pageTitle}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="title"
            label={t.title}
            name="title"
            autoComplete="title"
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="description"
            label={t.description}
            name="description"
            autoComplete="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            select
            label={t.sourceLanguage}
            value={sourceLanguage}
            onChange={(e) => setSourceLanguage(e.target.value)}
          >
            {languages?.map((lang) => (
              <MenuItem key={lang.code} value={lang.code}>
                {lang.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            select
            label={t.targetLanguage}
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
          >
            {languages?.map((lang) => (
              <MenuItem key={lang.code} value={lang.code}>
                {lang.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            type="number"
            id="numberOfPages"
            label={t.numberOfPages}
            name="numberOfPages"
            value={numberOfPages}
            onChange={(e) => setNumberOfPages(parseInt(e.target.value))}
            InputProps={{ inputProps: { min: 1 } }}
          />
          <Typography variant="body1" sx={{ mt: 2 }}>
            {t.estimatedPrice}{' '}
            {isNaN(estimatedPrice)
              ? formatCurrency(0, t.currency)
              : formatCurrency(estimatedPrice, t.currency)}
          </Typography>
          <input
            accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            style={{ display: 'none' }}
            id="document"
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="document">
            <Button
              variant="outlined"
              component="span"
              fullWidth
              sx={{ mt: 2 }}
            >
              {file ? file.name : t.uploadDocument}
            </Button>
          </label>
          {error && (
            <Alert sx={{ mt: 2 }} severity="error">
              {error}
            </Alert>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {t.submit}
          </Button>
        </Box>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{t.successTitle}</DialogTitle>
          <DialogContent>
            <DialogContentText>{t.successMessage}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary" autoFocus>
              {t.goToDocumentList}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default SubmitTranslationPage;
