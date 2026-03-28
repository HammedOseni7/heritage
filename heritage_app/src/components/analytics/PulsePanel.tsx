'use client';

import React, { useState } from 'react';
import { Box, Paper, Typography, Stack, IconButton, Collapse, Grid, Chip, LinearProgress } from '@mui/material';
import { ChevronUp, ChevronDown, BarChart3, Users, CheckCircle2, Globe } from 'lucide-react';

export default function PulsePanel() {
    const [expanded, setExpanded] = useState(false);

    // Mock stats for the MVP Pulse Panel
    const stats = {
        totalEntries: 1248,
        verifiedEntries: 412,
        activeCulture: 'Yoruba',
        validationRate: 33,
    };

    return (
        <Box sx={{
            position: 'fixed',
            bottom: { xs: 70, md: 0 },
            left: 0,
            right: 0,
            zIndex: 100,
            pointerEvents: 'none'
        }}>
            <Container maxWidth="lg" sx={{ pointerEvents: 'auto' }}>
                <Paper
                    elevation={10}
                    sx={{
                        borderRadius: '20px 20px 0 0',
                        bgcolor: 'background.paper',
                        border: '1px solid rgba(255,255,255,0.05)',
                        borderBottom: 'none',
                        p: 0,
                        overflow: 'hidden'
                    }}
                >
                    <Box
                        onClick={() => setExpanded(!expanded)}
                        sx={{
                            p: 2, px: 3, cursor: 'pointer', display: 'flex',
                            alignItems: 'center', justifyContent: 'space-between',
                            bgcolor: 'rgba(99, 102, 241, 0.05)',
                            transition: 'background 0.3s',
                            '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.08)' }
                        }}
                    >
                        <Stack direction="row" spacing={3} alignItems="center">
                            <Stack direction="row" spacing={1} alignItems="center">
                                <BarChart3 size={18} color="#6366f1" />
                                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>HERITAGE PULSE</Typography>
                            </Stack>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ display: { xs: 'none', sm: 'flex' } }}>
                                <Typography variant="caption" color="text.secondary">Total Entries:</Typography>
                                <Typography variant="caption" sx={{ fontWeight: 700 }}>{stats.totalEntries}</Typography>
                            </Stack>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ display: { xs: 'none', sm: 'flex' } }}>
                                <Typography variant="caption" color="text.secondary">Validation Rate:</Typography>
                                <Chip label={`${stats.validationRate}%`} size="small" color="primary" sx={{ height: 18, fontSize: '0.65rem' }} />
                            </Stack>
                        </Stack>
                        <IconButton size="small">{expanded ? <ChevronDown size={20} /> : <ChevronUp size={20} />}</IconButton>
                    </Box>

                    <Collapse in={expanded}>
                        <Box sx={{ p: 4, pt: 2 }}>
                            <Grid container spacing={4}>
                                <Grid size={{ xs: 12, md: 3 }}>
                                    <Stack spacing={2}>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 700 }}>Analytics Layer</Typography>
                                            <Typography variant="h5" sx={{ fontWeight: 900 }}>{stats.verifiedEntries}</Typography>
                                            <Typography variant="caption" color="primary.light">Verified Traditions</Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 700 }}>Validation Progress</Typography>
                                            <Box sx={{ mt: 1 }}>
                                                <LinearProgress variant="determinate" value={stats.validationRate} sx={{ height: 6, borderRadius: 3 }} />
                                            </Box>
                                        </Box>
                                    </Stack>
                                </Grid>

                                <Grid size={{ xs: 12, md: 9 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Globe size={16} /> Content Breakdown
                                    </Typography>
                                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ gap: 1 }}>
                                        {['Stories 📖', 'Games 🎮', 'Medicine 🌿', 'Cuisine 🍲', 'Crafts 🏺', 'Festivals 🎉'].map((pillar, i) => (
                                            <Box key={pillar} sx={{ p: 1.5, flex: 1, minWidth: 100, bgcolor: 'rgba(255,255,255,0.02)', borderRadius: 2, border: '1px solid rgba(255,255,255,0.05)' }}>
                                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>{pillar}</Typography>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{Math.floor(200 - i * 30)}</Typography>
                                            </Box>
                                        ))}
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Box>
                    </Collapse>
                </Paper>
            </Container>
        </Box>
    );
}

// Helper Container to avoid MUI import issues if using simple Box
function Container({ children, maxWidth }: any) {
    return (
        <Box sx={{
            maxWidth: maxWidth === 'lg' ? 1200 : 800,
            mx: 'auto',
            px: { xs: 2, sm: 3 },
            width: '100%'
        }}>
            {children}
        </Box>
    );
}
