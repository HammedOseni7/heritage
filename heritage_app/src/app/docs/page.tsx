'use client';

import React from 'react';
import { Container, Typography, Box, Grid, Card, Stack, Chip, Button } from '@mui/material';
import { Code, Terminal, Cpu, Zap, Copy, ExternalLink, Globe, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const endpoints = [
    { method: 'GET', path: '/api/v1/heritage', desc: 'Fetch a list of verified heritage entries.' },
    { method: 'GET', path: '/api/v1/heritage/:id', desc: 'Retrieve detailed data for a specific entry.' },
    { method: 'POST', path: '/api/v1/validate', desc: 'Submit a validation vote (Requires API Key).' },
];

export default function DocsPage() {
    return (
        <Box sx={{ bgcolor: '#020617', color: 'white', minHeight: '100vh', pb: 12 }}>
            {/* Header section */}
            <Box sx={{ pt: 20, pb: 10, background: 'radial-gradient(circle at 10% 10%, rgba(99, 102, 241, 0.1), transparent 40%)' }}>
                <Container maxWidth="lg">
                    <Grid container spacing={8} alignItems="center">
                        <Grid size={{ xs: 12, md: 7 }}>
                            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
                                <Chip label="BETA ACCESS" sx={{ bgcolor: '#6366f1', color: 'white', fontWeight: 900, mb: 3 }} />
                                <Typography variant="h2" sx={{ fontWeight: 900, mb: 3, letterSpacing: '-2px' }}>
                                    Developer <span style={{ color: '#6366f1' }}>API</span>
                                </Typography>
                                <Typography variant="h5" sx={{ color: 'rgba(255,255,255,0.6)', mb: 6, lineHeight: 1.6 }}>
                                    Build applications on top of the world's most comprehensive digital cultural archive.
                                </Typography>
                                <Stack direction="row" spacing={2}>
                                    <Button variant="contained" size="large" sx={{ bgcolor: '#6366f1', height: 56, px: 4, borderRadius: 2, fontWeight: 800 }}>
                                        Get API Key
                                    </Button>
                                    <Button variant="outlined" size="large" sx={{ borderColor: 'rgba(255,255,255,0.1)', color: 'white', height: 56, px: 4, borderRadius: 2, fontWeight: 800 }}>
                                        Full Docs
                                    </Button>
                                </Stack>
                            </motion.div>
                        </Grid>
                        <Grid size={{ xs: 12, md: 5 }}>
                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
                                <Card sx={{ 
                                    bgcolor: '#0f172a', 
                                    p: 3, 
                                    borderRadius: 4, 
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    fontFamily: 'monospace'
                                }}>
                                    <Stack direction="row" spacing={1} mb={2}>
                                        <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#ff5f56' }} />
                                        <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#ffbd2e' }} />
                                        <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#27c93f' }} />
                                    </Stack>
                                    <Typography variant="body2" sx={{ color: '#94a3b8' }}>$ curl -H "X-API-Key: YOUR_KEY" \</Typography>
                                    <Typography variant="body2" sx={{ color: '#6366f1' }}>  https://api.heritagehub.org/v1/heritage</Typography>
                                    <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 1 }}>
                                        <Typography variant="caption" display="block" sx={{ color: '#10b981' }}>// Response 200 OK</Typography>
                                        <Typography variant="caption" display="block" sx={{ color: '#94a3b8' }}>{'{'}</Typography>
                                        <Typography variant="caption" display="block" sx={{ color: '#94a3b8', pl: 2 }}>"status": "success",</Typography>
                                        <Typography variant="caption" display="block" sx={{ color: '#94a3b8', pl: 2 }}>"data": [...]</Typography>
                                        <Typography variant="caption" display="block" sx={{ color: '#94a3b8' }}>{'}'}</Typography>
                                    </Box>
                                </Card>
                            </motion.div>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Quick Start */}
            <Container maxWidth="lg" sx={{ mt: 12 }}>
                <Typography variant="h4" sx={{ fontWeight: 900, mb: 6 }}>Quick Reference</Typography>
                <Grid container spacing={4}>
                    {endpoints.map((ep, i) => (
                        <Grid size={{ xs: 12 }} key={i}>
                            <Card sx={{ 
                                p: 3, 
                                bgcolor: 'rgba(255,255,255,0.02)', 
                                border: '1px solid rgba(255,255,255,0.05)',
                                borderRadius: 2,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 3
                            }}>
                                <Chip 
                                    label={ep.method} 
                                    sx={{ 
                                        bgcolor: ep.method === 'GET' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(99, 102, 241, 0.1)', 
                                        color: ep.method === 'GET' ? '#10b981' : '#6366f1',
                                        fontWeight: 900,
                                        width: 80
                                    }} 
                                />
                                <Typography variant="h6" sx={{ fontFamily: 'monospace', flexGrow: 1, fontSize: '1rem' }}>{ep.path}</Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>{ep.desc}</Typography>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Features */}
            <Container maxWidth="lg" sx={{ mt: 12 }}>
                <Grid container spacing={4}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Stack spacing={2}>
                            <Zap size={32} color="#f59e0b" />
                            <Typography variant="h6" sx={{ fontWeight: 800 }}>Real-time Sync</Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>Websocket support for live updates as heritage entries are verified by the community.</Typography>
                        </Stack>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Stack spacing={2}>
                            <Globe size={32} color="#6366f1" />
                            <Typography variant="h6" sx={{ fontWeight: 800 }}>Global CDN</Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>Low-latency data access through our global heritage nodes.</Typography>
                        </Stack>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Stack spacing={2}>
                            <Lock size={32} color="#10b981" />
                            <Typography variant="h6" sx={{ fontWeight: 800 }}>Secure Access</Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>OAuth 2.0 and API Key authentication for sensitive data endpoints.</Typography>
                        </Stack>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
