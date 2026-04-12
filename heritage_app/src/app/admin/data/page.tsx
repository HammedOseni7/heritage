'use client';

import React, { useState } from 'react';
import { 
    Box, 
    Container, 
    Typography, 
    TextField, 
    Button, 
    Paper, 
    Alert, 
    LinearProgress,
    Stack,
    Divider,
    IconButton
} from '@mui/material';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CulturalEntry } from '@/types';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from 'next/link';

export default function BulkUploadPage() {
    const [jsonInput, setJsonInput] = useState('');
    const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleUpload = async () => {
        if (!jsonInput.trim()) {
            setStatus({ type: 'error', message: 'Please provide JSON input.' });
            return;
        }

        let data: any[];
        try {
            data = JSON.parse(jsonInput);
            if (!Array.isArray(data)) {
                data = [data]; // Wrap single object in array
            }
        } catch (e) {
            setStatus({ type: 'error', message: 'Invalid JSON format. Please check your syntax.' });
            return;
        }

        setIsUploading(true);
        setStatus({ type: 'info', message: `Starting upload of ${data.length} entries...` });
        setProgress(0);

        let successCount = 0;
        let errorCount = 0;

        const entriesCollection = collection(db, 'entries');

        for (let i = 0; i < data.length; i++) {
            try {
                const entry = data[i];
                // basic validation/cleanup
                const newEntry = {
                    ...entry,
                    createdAt: entry.createdAt || new Date().toISOString(),
                    validationCount: entry.validationCount || 0,
                    invalidationCount: entry.invalidationCount || 0,
                    isValidated: entry.isValidated || false,
                    status: entry.status || 'Pending',
                    comments: entry.comments || [],
                    images: entry.images || [],
                };

                // Remove ID if present to let Firestore generate a new one
                if (newEntry.id) delete newEntry.id;

                await addDoc(entriesCollection, newEntry);
                successCount++;
            } catch (err) {
                console.error(`Failed to upload entry at index ${i}:`, err);
                errorCount++;
            }
            setProgress(((i + 1) / data.length) * 100);
        }

        setIsUploading(false);
        if (errorCount === 0) {
            setStatus({ type: 'success', message: `Successfully uploaded all ${successCount} entries!` });
            setJsonInput('');
        } else {
            setStatus({ 
                type: 'error', 
                message: `Upload complete with issues. Success: ${successCount}, Errors: ${errorCount}. Check console for details.` 
            });
        }
    };

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 8 }}>
            <Container maxWidth="md">
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
                    <IconButton component={Link} href="/" sx={{ color: 'white' }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: 'white' }}>
                        System Data Migration
                    </Typography>
                </Stack>

                <Paper sx={{ p: 4, bgcolor: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                        Bulk Upload Heritage Entries
                    </Typography>
                    
                    <Typography variant="body2" sx={{ mb: 3, color: 'rgba(255,255,255,0.6)' }}>
                        Paste a JSON array of Heritage entries below. The system will process each entry and add it to the database.
                    </Typography>

                    {status && (
                        <Alert severity={status.type} sx={{ mb: 3 }}>
                            {status.message}
                        </Alert>
                    )}

                    {isUploading && (
                        <Box sx={{ width: '100%', mb: 3 }}>
                            <LinearProgress variant="determinate" value={progress} />
                            <Typography variant="caption" sx={{ mt: 1, display: 'block', textAlign: 'center', color: 'white' }}>
                                {Math.round(progress)}% Complete
                            </Typography>
                        </Box>
                    )}

                    <TextField
                        multiline
                        rows={15}
                        fullWidth
                        placeholder='[{"title": "Ancient Weaving", "description": "...", "type": "craft", ...}]'
                        value={jsonInput}
                        onChange={(e) => setJsonInput(e.target.value)}
                        variant="outlined"
                        disabled={isUploading}
                        sx={{ 
                            mb: 3,
                            '& .MuiOutlinedInput-root': {
                                color: 'white',
                                fontFamily: 'monospace',
                                bgcolor: 'rgba(0,0,0,0.2)',
                                '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                                '&:hover fieldset': { borderColor: 'primary.main' },
                            }
                        }}
                    />

                    <Button 
                        variant="contained" 
                        fullWidth 
                        size="large"
                        onClick={handleUpload}
                        disabled={isUploading}
                        sx={{ 
                            py: 2, 
                            fontWeight: 900,
                            bgcolor: 'primary.main',
                            '&:hover': { bgcolor: 'primary.dark' }
                        }}
                    >
                        {isUploading ? 'Uploading...' : 'Execute Bulk Migration'}
                    </Button>
                </Paper>

                <Box sx={{ mt: 4 }}>
                    <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.3)' }}>
                        Internal Access Only • Heritage Hubs Admin
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}
