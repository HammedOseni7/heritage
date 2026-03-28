'use client';

import React, { useState } from 'react';
import { Box, Container, Typography, Avatar, Paper, Stack, IconButton, Tabs, Tab, Grid } from '@mui/material';
import { Trophy, Medal, MapPin, ChevronRight, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSimulation } from '@/theme/SimulationContext';

// Mock Top Users mixed with real user potential
const TOP_GUARDIANS = [
    { rank: 1, name: 'Elena Rojas', country: 'Argentina', points: 12450, tier: 'Legacy Guardian', avatar: 'https://i.pravatar.cc/150?u=10' },
    { rank: 2, name: 'Moussa Diop', country: 'Senegal', points: 9800, tier: 'Heritage Keeper', avatar: 'https://i.pravatar.cc/150?u=11' },
    { rank: 3, name: 'Tenzin Gyatso', country: 'Nepal', points: 8420, tier: 'Heritage Keeper', avatar: 'https://i.pravatar.cc/150?u=12' },
    { rank: 4, name: 'Amina Okafor', country: 'Nigeria', points: 7100, tier: 'Cultural Spotter', avatar: 'https://i.pravatar.cc/150?u=13' },
    { rank: 5, name: 'Kwame Mensah', country: 'Ghana', points: 6500, tier: 'Cultural Spotter', avatar: 'https://i.pravatar.cc/150?u=14' },
    { rank: 6, name: 'Mateo Quispe', country: 'Peru', points: 5200, tier: 'Cultural Spotter', avatar: 'https://i.pravatar.cc/150?u=15' }
];

export default function LeaderboardPage() {
    const [tab, setTab] = useState(0);
    const { entries, userValidationsGiven } = useSimulation();

    // Calculate live user stats to rank
    const userEntries = entries.filter(e => e?.author?.name === 'You (Heritage Guardian)');
    const totalImpact = userValidationsGiven * 10 + userEntries.length * 50;

    const getRankColor = (rank: number) => {
        if (rank === 1) return '#fbbf24'; // Gold
        if (rank === 2) return '#94a3b8'; // Silver
        if (rank === 3) return '#b45309'; // Bronze
        return 'rgba(255,255,255,0.1)';
    };

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: 'calc(100vh - 72px)', py: 8 }}>
            <Container maxWidth="md">

                {/* Header */}
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 20 }}>
                        <Trophy size={64} color="#fbbf24" style={{ marginBottom: 16 }} />
                    </motion.div>
                    <Typography variant="h3" sx={{ fontWeight: 900, mb: 2 }}>Global <span style={{ color: '#fbbf24' }}>Leaderboard</span></Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.6)', maxWidth: 500, mx: 'auto' }}>
                        Recognizing the top Heritage Guardians worldwide dedicating their time to preserving and validating human culture.
                    </Typography>
                </Box>

                <Tabs
                    value={tab}
                    onChange={(_, v) => setTab(v)}
                    centered
                    sx={{
                        mb: 6,
                        '& .MuiTabs-indicator': { backgroundColor: '#fbbf24' },
                        '& .MuiTab-root': { color: 'rgba(255,255,255,0.5)', fontWeight: 800 },
                        '& .Mui-selected': { color: 'white !important' }
                    }}
                >
                    <Tab label="All-Time Impact" />
                    <Tab label="This Month" />
                    <Tab label="Regional (Africa)" />
                </Tabs>

                {/* Top 3 Podium */}
                <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3, mb: 6, alignItems: 'flex-end', width: '100%' }}>
                    {/* Rank 2 */}
                    <Box sx={{ flex: 1 }}>
                        <Paper sx={{ p: 4, pt: 6, textAlign: 'center', borderRadius: 6, bgcolor: 'rgba(148, 163, 184, 0.1)', border: '2px solid rgba(148, 163, 184, 0.3)', position: 'relative' }}>
                            <Box sx={{ position: 'absolute', top: -32, left: '50%', transform: 'translateX(-50%)' }}>
                                <Avatar src={TOP_GUARDIANS[1].avatar} sx={{ width: 80, height: 80, border: '4px solid #94a3b8' }} />
                                <Box sx={{ position: 'absolute', bottom: -10, left: '50%', transform: 'translateX(-50%)', bgcolor: '#94a3b8', color: '#0f172a', fontWeight: 900, px: 1.5, borderRadius: 10, fontSize: '0.8rem' }}>2</Box>
                            </Box>
                            <Typography variant="h6" sx={{ fontWeight: 800, mt: 2 }}>{TOP_GUARDIANS[1].name}</Typography>
                            <Typography variant="body2" sx={{ color: '#fbbf24', fontWeight: 700 }}>{TOP_GUARDIANS[1].points.toLocaleString()} pts</Typography>
                        </Paper>
                    </Box>

                    {/* Rank 1 */}
                    <Box sx={{ flex: 1 }}>
                        <Paper sx={{ p: 4, pt: 8, textAlign: 'center', borderRadius: 6, bgcolor: 'rgba(251, 191, 36, 0.15)', border: '2px solid rgba(251, 191, 36, 0.5)', position: 'relative', boxShadow: '0 0 40px rgba(251, 191, 36, 0.2)' }}>
                            <Box sx={{ position: 'absolute', top: -48, left: '50%', transform: 'translateX(-50%)' }}>
                                <Avatar src={TOP_GUARDIANS[0].avatar} sx={{ width: 100, height: 100, border: '6px solid #fbbf24' }} />
                                <Box sx={{ position: 'absolute', bottom: -12, left: '50%', transform: 'translateX(-50%)', bgcolor: '#fbbf24', color: '#0f172a', fontWeight: 900, px: 2, py: 0.5, borderRadius: 10, fontSize: '1rem' }}>1</Box>
                            </Box>
                            <Typography variant="h5" sx={{ fontWeight: 900, mt: 2 }}>{TOP_GUARDIANS[0].name}</Typography>
                            <Typography variant="body1" sx={{ color: '#fbbf24', fontWeight: 800 }}>{TOP_GUARDIANS[0].points.toLocaleString()} pts</Typography>
                        </Paper>
                    </Box>

                    {/* Rank 3 */}
                    <Box sx={{ flex: 1 }}>
                        <Paper sx={{ p: 4, pt: 5, textAlign: 'center', borderRadius: 6, bgcolor: 'rgba(180, 83, 9, 0.1)', border: '2px solid rgba(180, 83, 9, 0.3)', position: 'relative' }}>
                            <Box sx={{ position: 'absolute', top: -28, left: '50%', transform: 'translateX(-50%)' }}>
                                <Avatar src={TOP_GUARDIANS[2].avatar} sx={{ width: 70, height: 70, border: '4px solid #b45309' }} />
                                <Box sx={{ position: 'absolute', bottom: -8, left: '50%', transform: 'translateX(-50%)', bgcolor: '#b45309', color: 'white', fontWeight: 900, px: 1.5, borderRadius: 10, fontSize: '0.75rem' }}>3</Box>
                            </Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 800, mt: 2 }}>{TOP_GUARDIANS[2].name}</Typography>
                            <Typography variant="body2" sx={{ color: '#fbbf24', fontWeight: 700 }}>{TOP_GUARDIANS[2].points.toLocaleString()} pts</Typography>
                        </Paper>
                    </Box>
                </Box>

                {/* List */}
                <Stack spacing={2}>
                    {TOP_GUARDIANS.map((user) => (
                        <motion.div key={user.rank} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: user.rank * 0.1 }}>
                            <Paper sx={{
                                p: 2, px: 3,
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                borderRadius: 4,
                                bgcolor: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.05)',
                                '&:hover': { bgcolor: 'rgba(255,255,255,0.06)' }
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 900, color: getRankColor(user.rank), minWidth: 24, textAlign: 'center' }}>
                                        {user.rank}
                                    </Typography>
                                    <Avatar src={user.avatar} sx={{ width: 48, height: 48, border: `2px solid ${getRankColor(user.rank)}` }} />
                                    <Box>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>{user.name}</Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <MapPin size={12} color="rgba(255,255,255,0.5)" />
                                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>{user.country}</Typography>
                                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.2)', mx: 0.5 }}>•</Typography>
                                            <Typography variant="caption" sx={{ color: '#6366f1', fontWeight: 700 }}>{user.tier}</Typography>
                                        </Box>
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                    <Box sx={{ textAlign: 'right' }}>
                                        <Typography variant="h6" sx={{ fontWeight: 900, color: '#fbbf24', lineHeight: 1 }}>
                                            {user.points.toLocaleString()}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <TrendingUp size={12} color="#10b981" /> +120
                                        </Typography>
                                    </Box>
                                    <IconButton size="small" sx={{ bgcolor: 'rgba(255,255,255,0.05)' }}>
                                        <ChevronRight size={18} />
                                    </IconButton>
                                </Box>
                            </Paper>
                        </motion.div>
                    ))}

                    {/* Current User Fixed at Bottom (Example of Gamification Hook) */}
                    <Box sx={{ mt: 4, p: 3, borderRadius: 4, bgcolor: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 900, color: 'white', minWidth: 24, textAlign: 'center' }}>
                                #?
                            </Typography>
                            <Avatar src="https://i.pravatar.cc/150?u=you" sx={{ width: 48, height: 48, border: `2px solid #6366f1` }} />
                            <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>You</Typography>
                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>Submit more entries to climb the ranks!</Typography>
                            </Box>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="h6" sx={{ fontWeight: 900, color: '#a5b4fc', lineHeight: 1 }}>
                                {totalImpact} <span style={{ fontSize: '0.6em', opacity: 0.7 }}>pts</span>
                            </Typography>
                        </Box>
                    </Box>
                </Stack>
            </Container>
        </Box>
    );
}
