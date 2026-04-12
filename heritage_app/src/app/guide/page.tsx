'use client';

import React from 'react';
import { Container, Typography, Box, Grid, Stack, Paper, IconButton } from '@mui/material';
import { Upload, CheckCircle, Search, MessageSquare, AlertCircle, Camera, PenTool, MapPin, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const steps = [
    {
        title: 'Choose Your Subject',
        description: 'Identify a cultural artifact, oral tradition, ritual, or landmark that deserves preservation.',
        icon: <Search size={24} color="#6366f1" />,
        color: '#6366f1'
    },
    {
        title: 'Gather Media',
        description: 'Take high-quality photos, record audio of stories, or find relevant historical documents.',
        icon: <Camera size={24} color="#ec4899" />,
        color: '#ec4899'
    },
    {
        title: 'Add Context',
        description: 'Provide detailed descriptions, historical significance, and accurate geographic location.',
        icon: <PenTool size={24} color="#f59e0b" />,
        color: '#f59e0b'
    },
    {
        title: 'Submit for Review',
        description: 'Upload your entry. Our community of guardians will verify the authenticity of the content. Note: Your entry requires 5 verifications from the community to be moved from pending to fully verified.',
        icon: <Upload size={24} color="#10b981" />,
        color: '#10b981'
    }
];

export default function GuidePage() {
    return (
        <Box sx={{ bgcolor: '#020617', color: 'white', minHeight: '100vh', pb: 12 }}>
            {/* Hero Section */}
            <Box sx={{ 
                pt: 20, pb: 8, 
                background: 'linear-gradient(to bottom, rgba(99, 102, 241, 0.05), transparent)',
                textAlign: 'center' 
            }}>
                <Container maxWidth="md">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Typography variant="overline" sx={{ color: '#6366f1', fontWeight: 900, letterSpacing: '0.3em' }}>
                            CONTRIBUTOR GUIDE
                        </Typography>
                        <Typography variant="h2" sx={{ fontWeight: 900, mt: 2, mb: 3, letterSpacing: '-1.5px' }}>
                            How to Preserve <span style={{ color: '#6366f1' }}>Heritage</span>
                        </Typography>
                        <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, fontWeight: 400 }}>
                            Follow these steps to ensure your cultural contributions meet our community standards and help build a reliable digital archive.
                        </Typography>
                    </motion.div>
                </Container>
            </Box>

            {/* Steps Section */}
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    {steps.map((step, index) => (
                        <Grid size={{ xs: 12, md: 6 }} key={index}>
                            <motion.div
                                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <Paper sx={{ 
                                    p: 4, 
                                    bgcolor: 'rgba(255,255,255,0.02)', 
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    borderRadius: 4,
                                    height: '100%',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    '&:hover': {
                                        borderColor: step.color,
                                        bgcolor: 'rgba(255,255,255,0.04)'
                                    }
                                }}>
                                    <Box sx={{ 
                                        position: 'absolute', 
                                        top: -20, 
                                        right: -20, 
                                        fontSize: '12rem', 
                                        fontWeight: 900, 
                                        color: 'rgba(255,255,255,0.02)',
                                        userSelect: 'none'
                                    }}>
                                        {index + 1}
                                    </Box>
                                    <Stack direction="row" spacing={3} alignItems="flex-start">
                                        <Box sx={{ 
                                            p: 2, 
                                            borderRadius: 2, 
                                            bgcolor: `${step.color}15`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            {step.icon}
                                        </Box>
                                        <Box>
                                            <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>{step.title}</Typography>
                                            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>
                                                {step.description}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </Paper>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>

                {/* Content Standards */}
                <Box sx={{ mt: 12, p: 6, bgcolor: 'rgba(99, 102, 241, 0.05)', borderRadius: 6, border: '1px dashed rgba(99, 102, 241, 0.2)' }}>
                    <Typography variant="h4" sx={{ fontWeight: 900, mb: 6, textAlign: 'center' }}>Content Standards</Typography>
                    <Grid container spacing={4}>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Stack spacing={2} alignItems="center" sx={{ textAlign: 'center' }}>
                                <AlertCircle color="#6366f1" size={32} />
                                <Typography variant="h6" sx={{ fontWeight: 800 }}>Authenticity</Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>Only submit content that is historically accurate or genuine cultural expression.</Typography>
                            </Stack>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Stack spacing={2} alignItems="center" sx={{ textAlign: 'center' }}>
                                <Shield color="#10b981" size={32} />
                                <Typography variant="h6" sx={{ fontWeight: 800 }}>Ethical Respect</Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>Respect the privacy and sacred nature of certain rituals or community information.</Typography>
                            </Stack>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Stack spacing={2} alignItems="center" sx={{ textAlign: 'center' }}>
                                <CheckCircle color="#ec4899" size={32} />
                                <Typography variant="h6" sx={{ fontWeight: 800 }}>Clarity</Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>Use clear images and detailed descriptions to help reviewers validate your entry.</Typography>
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </Box>
    );
}
