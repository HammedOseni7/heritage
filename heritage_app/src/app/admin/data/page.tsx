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
    IconButton,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Grid,
    Tooltip,
    Stack
} from '@mui/material';
import { 
    ArrowLeft, 
    Database, 
    FileJson, 
    Info, 
    ChevronDown, 
    Copy, 
    Check,
    AlertCircle,
    Layout,
    MapPin,
    Users
} from 'lucide-react';
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
    const [copied, setCopied] = useState(false);

    const JSON_TEMPLATE = [
        {
            "title": "Historical Adire Textile",
            "description": "Indig-dyed cloth made by Yaruba women...",
            "content": "Full historical documentation...",
            "type": "craft",
            "author": {
                "name": "Heritage Admin",
                "avatar": "https://i.pravatar.cc/150?u=admin",
                "badges": ["Expert"]
            },
            "location": {
                "lat": 7.15,
                "lng": 3.35,
                "city": "Abeokuta",
                "country": "Nigeria"
            },
            "metadata": {
                "tribe": "Yoruba",
                "theme": "Traditional Craft",
                "region": "West Africa"
            },
            "images": ["https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?q=80&w=1000"]
        }
    ];

    const copyTemplate = () => {
        navigator.clipboard.writeText(JSON.stringify(JSON_TEMPLATE, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

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
                const images = entry.images || (entry.image ? [entry.image] : (entry.imageUrl ? [entry.imageUrl] : []));
                const newEntry = {
                    ...entry,
                    createdAt: entry.createdAt || new Date().toISOString(),
                    validationCount: entry.validationCount || 0,
                    invalidationCount: entry.invalidationCount || 0,
                    isValidated: entry.isValidated || false,
                    status: entry.status || 'Pending',
                    comments: entry.comments || [],
                    images: images,
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
                    <IconButton component={Link} href="/" sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.05)', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
                        <ArrowLeft size={20} />
                    </IconButton>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 900, color: 'white', letterSpacing: '-1px' }}>
                            Data Migration
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                            Internal Admin Terminal
                        </Typography>
                    </Box>
                </Stack>

                <Grid container spacing={4}>
                    <Grid size={{ xs: 12, md: 7 }}>
                        <Paper sx={{ p: 4, bgcolor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
                            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                                <Database color="#6366f1" size={24} />
                                <Typography variant="h6" sx={{ fontWeight: 800, color: 'white' }}>
                                    Bulk Migration Console
                                </Typography>
                            </Stack>
                            
                            <Typography variant="body2" sx={{ mb: 3, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
                                Inject raw heritage data into the persistent store. Ensure your JSON payload conforms to the system schema to maintain data integrity.
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
                        placeholder='[{"title": "Ancient Weaving", "description": "...", "type": "craft", "image": "https://example.com/image.jpg", ...}]'
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
                                startIcon={isUploading ? null : <Database size={18} />}
                                sx={{ 
                                    py: 2, 
                                    borderRadius: 3,
                                    fontWeight: 900,
                                    bgcolor: '#6366f1',
                                    '&:hover': { bgcolor: '#4f46e5' },
                                    boxShadow: '0 8px 16px rgba(99, 102, 241, 0.2)'
                                }}
                            >
                                {isUploading ? 'Processing Migration...' : 'Execute Bulk Migration'}
                            </Button>
                        </Paper>
                    </Grid>

                    <Grid size={{ xs: 12, md: 5 }}>
                        <Stack spacing={3}>
                            <Paper sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 5, border: '1px solid rgba(255,255,255,0.05)' }}>
                                <Typography variant="subtitle2" sx={{ color: '#818cf8', fontWeight: 900, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Info size={16} /> MIGRATION GUIDE
                                </Typography>
                                
                                <Accordion sx={{ bgcolor: 'transparent', boxShadow: 'none', '&:before': { display: 'none' } }}>
                                    <AccordionSummary expandIcon={<ChevronDown color="white" />} sx={{ p: 0 }}>
                                        <Typography variant="body2" sx={{ color: 'white', fontWeight: 700 }}>1. Structure Requirements</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails sx={{ p: 0, pb: 2 }}>
                                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block', mb: 1 }}>
                                            Data must be a **JSON Array**. If objects are missing `id`, the system will generate UUIDs automatically.
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>

                                <Accordion sx={{ bgcolor: 'transparent', boxShadow: 'none', '&:before': { display: 'none' } }}>
                                    <AccordionSummary expandIcon={<ChevronDown color="white" />} sx={{ p: 0 }}>
                                        <Typography variant="body2" sx={{ color: 'white', fontWeight: 700 }}>2. Mandatory Fields</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails sx={{ p: 0, pb: 2 }}>
                                        <Stack spacing={1}>
                                            <Box sx={{ display: 'flex', gap: 1 }}><Layout size={14} color="#6366f1" /><Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>title, description, type</Typography></Box>
                                            <Box sx={{ display: 'flex', gap: 1 }}><MapPin size={14} color="#6366f1" /><Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>location (lat, lng, city, country)</Typography></Box>
                                            <Box sx={{ display: 'flex', gap: 1 }}><Users size={14} color="#6366f1" /><Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>author (name, avatar)</Typography></Box>
                                        </Stack>
                                    </AccordionDetails>
                                </Accordion>

                                <Accordion sx={{ bgcolor: 'transparent', boxShadow: 'none', '&:before': { display: 'none' } }}>
                                    <AccordionSummary expandIcon={<ChevronDown color="white" />} sx={{ p: 0 }}>
                                        <Typography variant="body2" sx={{ color: 'white', fontWeight: 700 }}>3. Image Handling</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails sx={{ p: 0, pb: 2 }}>
                                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                                            The system supports `images` (array), `image` (string), or `imageUrl` (string). All will be normalized to the `images` array field.
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>
                            </Paper>

                            <Paper sx={{ p: 3, bgcolor: 'rgba(0,0,0,0.3)', borderRadius: 5, border: '1px solid rgba(255,255,255,0.1)' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="subtitle2" sx={{ color: '#10b981', fontWeight: 900, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <FileJson size={16} /> JSON TEMPLATE
                                    </Typography>
                                    <Tooltip title={copied ? "Copied!" : "Copy Template"}>
                                        <IconButton size="small" onClick={copyTemplate} sx={{ color: copied ? '#10b981' : 'rgba(255,255,255,0.3)' }}>
                                            {copied ? <Check size={16} /> : <Copy size={16} />}
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                                <Box sx={{ 
                                    maxHeight: 200, 
                                    overflow: 'auto', 
                                    p: 2, 
                                    bgcolor: 'rgba(0,0,0,0.4)', 
                                    borderRadius: 3,
                                    '&::-webkit-scrollbar': { width: 4 },
                                    '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 10 }
                                }}>
                                    <pre style={{ margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', fontFamily: 'monospace' }}>
                                        {JSON.stringify(JSON_TEMPLATE, null, 2)}
                                    </pre>
                                </Box>
                            </Paper>

                            <Alert severity="warning" icon={<AlertCircle size={20} />} sx={{ bgcolor: 'rgba(245, 158, 11, 0.05)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: 4, '& .MuiAlert-icon': { color: '#fbbf24' } }}>
                                <Typography variant="caption" sx={{ fontWeight: 700 }}>
                                    Caution: Bulk migrations are irreversible. Ensure all URLs are valid before execution.
                                </Typography>
                            </Alert>
                        </Stack>
                    </Grid>
                </Grid>

                <Box sx={{ mt: 4 }}>
                    <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.3)' }}>
                        Internal Access Only • Heritage Hubs Admin
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}
