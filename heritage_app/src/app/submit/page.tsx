'use client';

import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import { Container, Typography, Box, TextField, Button, MenuItem, Paper, Stepper, Step, StepLabel, Stack, Avatar } from '@mui/material';
import { Share2, MapPin, CheckCircle2, Info } from 'lucide-react';
import { CultureType } from '@/types';

import Link from 'next/link';
import { useSimulation } from '@/theme/SimulationContext';

const CULTURE_TYPES: { value: CultureType; label: string }[] = [
    { value: 'story', label: 'Oral Story / Legend' },
    { value: 'game', label: 'Traditional Game' },
    { value: 'medicine', label: 'Traditional Medicine' },
    { value: 'cuisine', label: 'Cuisine / Recipe' },
    { value: 'craft', label: 'Craft / Art Technique' },
    { value: 'festival', label: 'Festival / Ceremony' },
];

export default function SubmitPage() {
    const [activeStep, setActiveStep] = useState(0);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { addEntry } = useSimulation();
    const [formData, setFormData] = useState({
        title: '',
        type: 'story',
        description: '',
        content: '',
        city: '',
        country: '',
        tribe: '',
        language: '',
        region: ''
    });

    const handleNext = () => setActiveStep((prev) => prev + 1);
    const handleBack = () => setActiveStep((prev) => prev - 1);

    const handleSubmit = async () => {
        try {
            addEntry({
                title: formData.title,
                type: formData.type as any,
                description: formData.description,
                content: formData.content,
                metadata: {
                    tribe: formData.tribe,
                    language: formData.language,
                    region: formData.region
                },
                location: {
                    lat: (Math.random() * 120) - 60,
                    lng: (Math.random() * 240) - 120,
                    city: formData.city,
                    country: formData.country
                }
            });

            // Simulation of submission
            await new Promise(resolve => setTimeout(resolve, 600));
            setIsSubmitted(true);
        } catch (error) {
            console.error('Submission failed:', error);
        }
    };

    if (isSubmitted) {
        return (
            <Container maxWidth="sm" sx={{ py: 12, textAlign: 'center' }}>
                <Box sx={{
                    p: 6, borderRadius: 8,
                    bgcolor: 'rgba(16, 185, 129, 0.05)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    backdropFilter: 'blur(20px)'
                }}>
                    <Avatar sx={{ bgcolor: '#10b981', width: 80, height: 80, mx: 'auto', mb: 4 }}>
                        <CheckCircle2 size={40} color="white" />
                    </Avatar>
                    <Typography variant="h4" sx={{ fontWeight: 900, mb: 2, color: 'white' }}>Submission Received!</Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)', mb: 6 }}>
                        Thank you for contributing to the World Heritage Hub. Your entry for <strong>"{formData.title}"</strong> has been queued for community validation.
                    </Typography>
                    <Stack spacing={2}>
                        <Button component={Link} href="/" variant="contained" fullWidth sx={{ py: 2, borderRadius: 10, fontWeight: 800 }}>
                            Return to Feed
                        </Button>
                        <Button onClick={() => { setIsSubmitted(false); setActiveStep(0); setFormData({ ...formData, title: '' }); }} variant="text" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                            Submit Another Entry
                        </Button>
                    </Stack>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 8, pb: 20 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>Share Your <span style={{ color: '#6366f1' }}>Heritage</span></Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 6 }}>
                Preserve your culture's wisdom for future generations. Your submission will be validated by the community.
            </Typography>

            <Stepper activeStep={activeStep} sx={{ mb: 6, '& .MuiStepIcon-root.Mui-active': { color: 'primary.main' }, '& .MuiStepLabel-label': { color: 'rgba(255,255,255,0.5)' }, '& .MuiStepLabel-label.Mui-active': { color: 'white', fontWeight: 700 } }}>
                <Step><StepLabel>Basics</StepLabel></Step>
                <Step><StepLabel>Content</StepLabel></Step>
                <Step><StepLabel>Origin Metadata</StepLabel></Step>
            </Stepper>

            <Paper sx={{ p: 4, borderRadius: 4, bgcolor: 'background.paper', border: '1px solid rgba(255,255,255,0.05)' }}>
                {activeStep === 0 && (
                    <Stack spacing={3}>
                        <TextField
                            fullWidth label="Title"
                            placeholder="e.g. The Legend of the Silver Moon"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                        <TextField
                            select fullWidth label="Category"
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                        >
                            {CULTURE_TYPES.map((opt) => (
                                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            fullWidth multiline rows={3} label="Short Description"
                            placeholder="Provide a brief summary of what this is..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </Stack>
                )}

                {activeStep === 1 && (
                    <Stack spacing={3}>
                        <Box sx={{ p: 2, bgcolor: 'rgba(99, 102, 241, 0.05)', borderRadius: 2, display: 'flex', gap: 2, mb: 1 }}>
                            <Info size={20} color="#6366f1" />
                            <Typography variant="caption" color="text.secondary">
                                Detailed content helps the community validate the authenticity of your submission. Be as specific as possible.
                            </Typography>
                        </Box>
                        <TextField
                            fullWidth multiline rows={10} label="Full Content / Details"
                            placeholder="Write the full story, recipe, or description here..."
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        />
                    </Stack>
                )}

                {activeStep === 2 && (
                    <Stack spacing={3}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <MapPin size={18} /> Geography
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth label="City"
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth label="Country"
                                    value={formData.country}
                                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                />
                            </Grid>
                        </Grid>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                            <Info size={18} /> Cultural Demographics
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <TextField
                                    fullWidth label="Tribe / People"
                                    value={formData.tribe}
                                    onChange={(e) => setFormData({ ...formData, tribe: e.target.value })}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <TextField
                                    fullWidth label="Language"
                                    value={formData.language}
                                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <TextField
                                    fullWidth label="Broader Region"
                                    value={formData.region}
                                    placeholder="e.g. West Africa"
                                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                                />
                            </Grid>
                        </Grid>
                        <Box sx={{ mt: 4, p: 4, textAlign: 'center', border: '2px dashed rgba(255,255,255,0.1)', borderRadius: 2 }}>
                            <Typography variant="body2" color="text.secondary">This metadata will be securely routed to qualified community members for peer review.</Typography>
                        </Box>
                    </Stack>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 6 }}>
                    <Button disabled={activeStep === 0} onClick={handleBack} color="inherit">Back</Button>
                    {activeStep < 2 ? (
                        <Button variant="contained" onClick={handleNext} sx={{ px: 4, borderRadius: 10 }}>Next Step</Button>
                    ) : (
                        <Button variant="contained" onClick={handleSubmit} startIcon={<CheckCircle2 />} color="primary" sx={{ px: 4, borderRadius: 10 }}>Submit Heritage</Button>
                    )}
                </Box>
            </Paper>
        </Container>
    );
}

