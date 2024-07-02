'use client';

import React, { useState, useEffect } from 'react';
import { Box, Button, Container, TextField, Typography, MenuItem, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Alert } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/navigation';

// const languages = [
//     { code: 'en', name: 'English' },
//     { code: 'es', name: 'Spanish' },
//     { code: 'fr', name: 'French' },
//     { code: 'de', name: 'German' },
//     { code: 'id', name: 'Indonesian' },
//     // Add more languages as needed
// ];

const pricePerPage = 100000; // Price per page

function formatCurrency(value) {
    const formatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
    });

    const numericValue = parseFloat(value);

    return formatter.format(numericValue);
}

const SubmitTranslationPage = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [sourceLanguage, setSourceLanguage] = useState('');
    const [targetLanguage, setTargetLanguage] = useState('');
    const [numberOfPages, setNumberOfPages] = useState(0);
    const [error, setError] = useState('');
    const [open, setOpen] = useState(false);
    const [languages, setLanguages] = useState()
    const router = useRouter();

    useEffect(() => {
        const fetchLanguages = async () => {
            try {
                // API endpoint that provides the list of languages
                const url = 'https://libretranslate.com/languages';

                // Sending a GET request to the API
                const response = await axios.get(url);

                // Accessing the data from the response
                const languages = response.data;
                setLanguages(response.data)
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    setError(`Error fetching languages: ${error.response.data.error}`);
                } else {
                    setError('Error fetching languages');
                }
            }
        }

        fetchLanguages();
    }, []);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setFile(event.target.files[0]);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');

        if (!title || !description || !file || !sourceLanguage || !targetLanguage || !numberOfPages) {
            setError('Please fill in all fields and upload a file.');
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
            const response = await axios.post('http://127.0.0.1:3001/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.status === 200) {
                setOpen(true);
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setError(`Error: ${error.response.data.error}`);
            } else {
                setError('Failed to submit the translation request. Please try again.');
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
                    Submit Translation Request
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="title"
                        label="Title"
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
                        label="Description"
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
                        label="Source Language"
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
                        label="Target Language"
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
                        label="Number of Pages"
                        name="numberOfPages"
                        value={numberOfPages}
                        onChange={(e) => setNumberOfPages(parseInt(e.target.value))}
                        InputProps={{ inputProps: { min: 1 } }}
                    />
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        Estimated Price: {isNaN(estimatedPrice) ? formatCurrency(0) : formatCurrency(estimatedPrice)}
                    </Typography>
                    <input
                        accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        style={{ display: 'none' }}
                        id="document"
                        type="file"
                        onChange={handleFileChange}
                    />
                    <label htmlFor="document">
                        <Button variant="outlined" component="span" fullWidth sx={{ mt: 2 }}>
                            {file ? file.name : 'Upload Document'}
                        </Button>
                    </label>
                    {error && (<Alert sx={{ mt: 2 }} severity="error">{error}</Alert>)}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Submit
                    </Button>
                </Box>
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Success</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Your document has been submitted successfully.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary" autoFocus>
                            Go to Document List
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Container>
    );
};

export default SubmitTranslationPage;
