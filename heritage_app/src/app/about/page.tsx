'use client';

import React from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, Stack, Avatar, Button } from '@mui/material';
import { Globe, Heart, Shield, Users, BookOpen, Target } from 'lucide-react';
import { motion } from 'framer-motion';

const stats = [
    { label: 'Cultures Documented', value: '1,200+', icon: <Globe size={24} color="#6366f1" /> },
    { label: 'Active Guardians', value: '45,000+', icon: <Users size={24} color="#10b981" /> },
    { label: 'Verified Entries', value: '8,500+', icon: <Shield size={24} color="#f59e0b" /> },
];

const missionPoints = [
    {
        title: 'Preservation',
        description: 'Digitally safeguarding cultural expressions, languages, and traditions that are at risk of being lost.',
        icon: <Heart size={32} color="#ec4899" />
    },
    {
        title: 'Accessibility',
        description: 'Making the world\'s cultural heritage accessible to everyone, anywhere, at any time.',
        icon: <BookOpen size={32} color="#6366f1" />
    },
    {
        title: 'Community Consensus',
        description: 'Using peer-review and cultural expertise to ensure the authenticity and integrity of every record.',
        icon: <Target size={32} color="#10b981" />
    }
];

export default function AboutPage() {
    return (
        <Box sx={{ bgcolor: '#020617', color: 'white', minHeight: '100vh', pb: 12 }}>
            {/* Hero Section */}
            <Box sx={{ 
                pt: 20, pb: 12, 
                background: 'radial-gradient(circle at 50% -20%, rgba(99, 102, 241, 0.15) 0%, transparent 50%)',
                textAlign: 'center' 
            }}>
                <Container maxWidth="md">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <Typography variant="h2" sx={{ fontWeight: 900, mb: 3, letterSpacing: '-2px' }}>
                            The Digital Ark for <span style={{ color: '#6366f1' }}>Humanity</span>
                        </Typography>
                        <Typography variant="h5" sx={{ color: 'rgba(255,255,255,0.6)', mb: 6, lineHeight: 1.6, fontWeight: 400 }}>
                            Heritage Hub is a decentralized platform dedicated to documenting and verifying the world's cultural legacies through community-driven wisdom.
                        </Typography>
                    </motion.div>
                </Container>
            </Box>

            {/* Stats */}
            <Container maxWidth="lg" sx={{ mb: 12 }}>
                <Grid container spacing={4}>
                    {stats.map((stat, index) => (
                        <Grid size={{ xs: 12, md: 4 }} key={index}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <Card sx={{ 
                                    bgcolor: 'rgba(255,255,255,0.03)', 
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    borderRadius: 4,
                                    height: '100%',
                                    textAlign: 'center',
                                    p: 2
                                }}>
                                    <CardContent>
                                        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>{stat.icon}</Box>
                                        <Typography variant="h3" sx={{ fontWeight: 900, color: 'white', mb: 1 }}>{stat.value}</Typography>
                                        <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{stat.label}</Typography>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Mission Section */}
            <Container maxWidth="lg" sx={{ mb: 12 }}>
                <Typography variant="h4" sx={{ fontWeight: 900, mb: 8, textAlign: 'center' }}>Our Core Pillars</Typography>
                <Grid container spacing={6}>
                    {missionPoints.map((point, index) => (
                        <Grid size={{ xs: 12, md: 4 }} key={index}>
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <Stack spacing={3} alignItems="center" sx={{ textAlign: 'center' }}>
                                    <Box sx={{ 
                                        p: 3, 
                                        borderRadius: '50%', 
                                        bgcolor: 'rgba(255,255,255,0.03)',
                                        border: '1px solid rgba(255,255,255,0.05)'
                                    }}>
                                        {point.icon}
                                    </Box>
                                    <Box>
                                        <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>{point.title}</Typography>
                                        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.8 }}>
                                            {point.description}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Institutional Partners Section Placeholder */}
            <Box sx={{ bgcolor: 'rgba(255,255,255,0.02)', py: 12, borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <Container maxWidth="lg">
                    <Typography variant="subtitle2" sx={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', mb: 6, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                        In Partnership With
                    </Typography>
                    <Grid container spacing={4} justifyContent="center" alignItems="center">
                        {[1, 2, 3, 4].map((i) => (
                            <Grid size={{ xs: 6, md: 3 }} key={i}>
                                <Box sx={{ 
                                    height: 60, 
                                    bgcolor: 'rgba(255,255,255,0.03)', 
                                    borderRadius: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    filter: 'grayscale(1)',
                                    opacity: 0.5,
                                    border: '1px solid rgba(255,255,255,0.05)'
                                }}>
                                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 900, fontStyle: 'italic' }}>PARTNER {i}</Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>
        </Box>
    );
}
