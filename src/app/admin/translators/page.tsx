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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Snackbar,
  IconButton,
  DialogContentText,
} from '@mui/material';
import axios from 'axios';
import { useLanguage } from '../../contexts/LanguageContext';
import { adminTranslatorsPageTranslations } from '../../translations/adminTranslatorsPageTranslations';
import { config } from '@/config/config';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

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

interface NewTranslator {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  proficientLanguages: string[];
  categories: string[];
}

interface Language {
  code: string;
  name: string;
}

const AdminTranslatorsPage = () => {
  const [translators, setTranslators] = useState<Translator[]>([]);
  const [error, setError] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedTranslator, setSelectedTranslator] = useState<Translator | null>(null);
  const [newTranslator, setNewTranslator] = useState<NewTranslator>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    proficientLanguages: [],
    categories: [],
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const router = useRouter();
  const { language } = useLanguage();
  const t = adminTranslatorsPageTranslations[language];

  const languages: Language[] = [
    { code: 'id', name: t.indonesian },
    { code: 'en', name: t.english },
    { code: 'fr', name: t.french },
    { code: 'es', name: t.spanish },
    { code: 'ru', name: t.russian },
    { code: 'ar', name: t.arabic },
    { code: 'zh', name: t.chinese },
    { code: 'hi', name: t.hindi },
    { code: 'pt', name: t.portuguese },
    { code: 'it', name: t.italian },
  ];

  useEffect(() => {
    fetchTranslators();
  }, [t]);

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

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setNewTranslator({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      proficientLanguages: [],
      categories: [],
    });
    setFormErrors({});
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!newTranslator.username) {
      errors.username = t.requiredField;
    }
    
    if (!newTranslator.email) {
      errors.email = t.requiredField;
    } else if (!/\S+@\S+\.\S+/.test(newTranslator.email)) {
      errors.email = t.invalidEmail;
    }
    
    if (!newTranslator.password) {
      errors.password = t.requiredField;
    }
    
    if (!newTranslator.confirmPassword) {
      errors.confirmPassword = t.requiredField;
    } else if (newTranslator.password !== newTranslator.confirmPassword) {
      errors.confirmPassword = t.passwordMismatch;
    }
    
    if (newTranslator.proficientLanguages.length === 0) {
      errors.proficientLanguages = t.requiredField;
    }

    if (newTranslator.categories.length === 0) {
      errors.categories = t.requiredField;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await axios.post(
        `${config.apiBaseUrl}/api/register`,
        {
          username: newTranslator.username,
          email: newTranslator.email,
          password: newTranslator.password,
          proficient_languages: newTranslator.proficientLanguages,
          categories: newTranslator.categories,
          role: 'translator',
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      setSnackbar({
        open: true,
        message: t.translatorAdded,
        severity: 'success',
      });
      handleCloseModal();
      fetchTranslators();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setSnackbar({
          open: true,
          message: error.response.data.error,
          severity: 'error',
        });
      } else {
        setSnackbar({
          open: true,
          message: t.unexpectedError,
          severity: 'error',
        });
      }
    }
  };

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
    const language = languages.find(lang => lang.code === code);
    return language ? language.name : code;
  };

  const handleDeleteClick = (translator: Translator) => {
    setSelectedTranslator(translator);
    setOpenDeleteDialog(true);
  };

  const handleDeleteClose = () => {
    setOpenDeleteDialog(false);
    setSelectedTranslator(null);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedTranslator) return;

    try {
      await axios.delete(
        `${config.apiBaseUrl}/api/admin/translators/${selectedTranslator.ID}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      setSnackbar({
        open: true,
        message: t.translatorDeleted,
        severity: 'success',
      });
      handleDeleteClose();
      fetchTranslators();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setSnackbar({
          open: true,
          message: error.response.data.error,
          severity: 'error',
        });
      } else {
        setSnackbar({
          open: true,
          message: t.unexpectedError,
          severity: 'error',
        });
      }
    }
  };

  const renderTranslators = () => {
    return translators.map((translator) => (
      <Grid item xs={12} sm={6} md={4} key={translator.ID}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Typography
                variant="h6"
                component="div"
                sx={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  flex: 1,
                }}
                gutterBottom
              >
                {translator.Username}
              </Typography>
              <IconButton
                size="small"
                color="error"
                onClick={() => handleDeleteClick(translator)}
                sx={{ ml: 1 }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
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
            {/* <Button
              variant="contained"
              color="primary"
              onClick={() => router.push(`translators/${translator.ID}`)}
              sx={{ mt: 2 }}
            >
              {t.viewProfile}
            </Button> */}
          </CardContent>
        </Card>
      </Grid>
    ));
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            {t.pageTitle}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenModal}
          >
            {t.addTranslator}
          </Button>
        </Box>
        {error && <Alert severity="error">{error}</Alert>}
        {translators.length === 0 ? (
          <Alert severity="info">{t.noTranslators}</Alert>
        ) : (
          <Grid container spacing={2}>
            {renderTranslators()}
          </Grid>
        )}
      </Box>

      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>{t.addTranslator}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label={t.username}
              value={newTranslator.username}
              onChange={(e) =>
                setNewTranslator({ ...newTranslator, username: e.target.value })
              }
              error={!!formErrors.username}
              helperText={formErrors.username}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label={t.email}
              value={newTranslator.email}
              onChange={(e) =>
                setNewTranslator({ ...newTranslator, email: e.target.value })
              }
              error={!!formErrors.email}
              helperText={formErrors.email}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              type="password"
              label={t.password}
              value={newTranslator.password}
              onChange={(e) =>
                setNewTranslator({ ...newTranslator, password: e.target.value })
              }
              error={!!formErrors.password}
              helperText={formErrors.password}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              type="password"
              label={t.confirmPassword}
              value={newTranslator.confirmPassword}
              onChange={(e) =>
                setNewTranslator({
                  ...newTranslator,
                  confirmPassword: e.target.value,
                })
              }
              error={!!formErrors.confirmPassword}
              helperText={formErrors.confirmPassword}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth error={!!formErrors.proficientLanguages} sx={{ mb: 2 }}>
              <InputLabel>{t.selectLanguages}</InputLabel>
              <Select
                multiple
                value={newTranslator.proficientLanguages}
                onChange={(e) =>
                  setNewTranslator({
                    ...newTranslator,
                    proficientLanguages: e.target.value as string[],
                  })
                }
                input={<OutlinedInput label={t.selectLanguages} />}
              >
                {languages.map((lang) => (
                  <MenuItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.proficientLanguages && (
                <Typography color="error" variant="caption" sx={{ mt: 1, ml: 2 }}>
                  {formErrors.proficientLanguages}
                </Typography>
              )}
            </FormControl>
            <FormControl fullWidth error={!!formErrors.categories}>
              <InputLabel>{t.selectCategories}</InputLabel>
              <Select
                multiple
                value={newTranslator.categories}
                onChange={(e) =>
                  setNewTranslator({
                    ...newTranslator,
                    categories: e.target.value as string[],
                  })
                }
                input={<OutlinedInput label={t.selectCategories} />}
              >
                <MenuItem value="general">{t.categoryGeneral}</MenuItem>
                <MenuItem value="engineering">{t.categoryEngineering}</MenuItem>
                <MenuItem value="social sciences">{t.categorySocialSciences}</MenuItem>
              </Select>
              {formErrors.categories && (
                <Typography color="error" variant="caption" sx={{ mt: 1, ml: 2 }}>
                  {formErrors.categories}
                </Typography>
              )}
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="inherit">
            {t.cancel}
          </Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            {t.save}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDeleteDialog}
        onClose={handleDeleteClose}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          {t.deleteConfirmation}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            {t.deleteConfirmationDesc}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose} color="inherit">
            {t.cancel}
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            {t.delete}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminTranslatorsPage; 