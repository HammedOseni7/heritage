'use client';

import React, { useState } from 'react';
import { Box, Paper, Typography, Stack, Button, LinearProgress, Collapse } from '@mui/material';
import { Activity, ChevronUp, ChevronDown, Globe, Play, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSimulation } from '@/theme/SimulationContext';

export default function PulsePanel() {
    const [isOpen, setIsOpen] = useState(false);
    const { addRandomEntries, isSimulating, entries } = useSimulation();

    const verifiedCount = entries.filter(e => e.isValidated).length;
    const verifiedRate = Math.round((verifiedCount / (entries.length || 1)) * 100);

    return (
        <Box sx={{
            position: 'fixed',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: { xs: '95%', md: '800px' },
            zIndex: 1000,
        }}>
            <Paper
                elevation={24}
                sx={{
                    borderTopLeftRadius: 24,
                    borderTopRightRadius: 24,
                    bgcolor: 'rgba(15, 23, 42, 0.95)',
                    backdropFilter: 'blur(32px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderBottom: 'none',
                    overflow: 'hidden',
                    boxShadow: '0 -20px 40px rgba(0,0,0,0.5)',
                    position: 'relative',
                    zIndex: 1100
                }}
            >
                <Box
                    sx={{
                        p: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        bgcolor: 'rgba(255,255,255,0.02)',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' }
                    }}
                    onClick={(e) => {
                        e.preventDefault();
                        setIsOpen(!isOpen);
                    }}
                >
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Activity size={18} color="#6366f1" className={isSimulating ? "animate-pulse" : ""} />
                        <Typography variant="subtitle2" sx={{ fontWeight: 900, color: 'white', letterSpacing: '0.15em', fontSize: '0.7rem' }}>
                            {isSimulating ? 'SIMULATION ACTIVE' : 'HERITAGE PULSE LIVE'}
                        </Typography>
                        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
                            <ChevronUp size={18} color="rgba(255,255,255,0.5)" />
                        </motion.div>
                    </Stack>
                </Box>

                <Collapse in={isOpen}>
                    <Box sx={{ p: 4, pt: 2 }}>
                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} justifyContent="space-between" sx={{ mb: 4 }}>
                            <Box>
                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.6rem' }}>Total Entries</Typography>
                                <Stack direction="row" spacing={1} alignItems="flex-end">
                                    <Typography variant="h4" sx={{ fontWeight: 900, color: 'white' }}>{entries.length.toLocaleString()}</Typography>
                                    <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 800, mb: 1 }}>ACTIVE</Typography>
                                </Stack>
                            </Box>

                            <Box sx={{ flex: 1 }}>
                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.6rem' }}>Integrity Score</Typography>
                                <Stack spacing={1} sx={{ mt: 1 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="h5" sx={{ fontWeight: 900, color: 'white' }}>{verifiedRate}%</Typography>
                                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>VERIFIED</Typography>
                                    </Box>
                                    <LinearProgress variant="determinate" value={verifiedRate} sx={{ height: 6, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.05)', '& .MuiLinearProgress-bar': { bgcolor: '#6366f1', borderRadius: 3 } }} />
                                </Stack>
                            </Box>

                            <Box>
                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.6rem' }}>Community Val.</Typography>
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                                    <CheckCircle size={20} color="#10b981" />
                                    <Typography variant="h5" sx={{ fontWeight: 900, color: 'white' }}>{verifiedCount}</Typography>
                                </Stack>
                            </Box>
                        </Stack>

                        <Box sx={{
                            p: 2.5,
                            borderRadius: 6,
                            bgcolor: 'rgba(99, 102, 241, 0.08)',
                            border: '1px solid rgba(99, 102, 241, 0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            backdropFilter: 'blur(10px)'
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                                <motion.div animate={isSimulating ? { rotate: 360 } : {}} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
                                    <Box sx={{
                                        width: 44, height: 44, borderRadius: '50%',
                                        bgcolor: isSimulating ? 'rgba(16, 185, 129, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        border: `1px solid ${isSimulating ? '#10b981' : '#6366f1'}`
                                    }}>
                                        {isSimulating ? <Activity size={20} color="#10b981" /> : <Play size={20} color="#6366f1" fill="currentColor" />}
                                    </Box>
                                </motion.div>
                                <Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 900, color: 'white', letterSpacing: '0.05em' }}>
                                        {isSimulating ? 'SIMULATION ACTIVE' : 'LIVE DEMO MODE'}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
                                        Injecting real-time discoveries into global hub
                                    </Typography>
                                </Box>
                            </Box>
                            <Button
                                variant="contained"
                                color={isSimulating ? "success" : "primary"}
                                onClick={() => addRandomEntries(10)}
                                disabled={isSimulating}
                                sx={{ borderRadius: 10, px: 4, py: 1, fontWeight: 900, fontSize: '0.8rem' }}
                            >
                                {isSimulating ? 'SMART SYNC...' : 'SIMULATE'}
                            </Button>
                        </Box>
                    </Box>
                </Collapse>
            </Paper>
        </Box>
    );
}
