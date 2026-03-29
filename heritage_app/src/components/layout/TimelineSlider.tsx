'use client';

import React from 'react';
import { Box, Paper, Slider, Typography, IconButton, Stack, Tooltip } from '@mui/material';
import { Clock, History, FastForward, Rewind } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHeritage } from '@/theme/HeritageContext';

const MARKS = [
    { value: 1000, label: '1000 AD' },
    { value: 1500, label: '1500' },
    { value: 1800, label: '1800' },
    { value: 1950, label: '1950' },
    { value: 2024, label: 'Today' },
];

export default function TimelineSlider() {
    const { currentYear, setCurrentYear } = useHeritage();

    return (
        <Box sx={{
            position: 'fixed',
            bottom: { xs: 80, md: 40 },
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            width: '100%',
            maxWidth: 600,
            px: 2
        }}>
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300, delay: 0.5 }}
            >
                <Paper sx={{
                    p: 3,
                    borderRadius: 8,
                    bgcolor: 'rgba(15, 23, 42, 0.7)',
                    backdropFilter: 'blur(30px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 24px 48px rgba(0,0,0,0.4)'
                }}>
                    <Stack direction="row" spacing={3} alignItems="center">
                        <Box sx={{ textAlign: 'center', minWidth: 80 }}>
                            <Typography variant="h4" sx={{ fontWeight: 900, color: '#818cf8', letterSpacing: '-1px', lineHeight: 1 }}>
                                {currentYear}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 800, textTransform: 'uppercase' }}>
                                Year
                            </Typography>
                        </Box>

                        <Box sx={{ flex: 1, px: 2 }}>
                            <Slider
                                value={currentYear}
                                min={1000}
                                max={2024}
                                step={1}
                                marks={MARKS}
                                onChange={(_, value) => setCurrentYear(value as number)}
                                sx={{
                                    color: '#818cf8',
                                    height: 6,
                                    '& .MuiSlider-thumb': {
                                        width: 24,
                                        height: 24,
                                        backgroundColor: '#fff',
                                        border: '4px solid #818cf8',
                                        '&:hover, &.Mui-focusVisible, &.Mui-active': {
                                            boxShadow: '0 0 0 8px rgba(129, 140, 248, 0.16)',
                                        },
                                    },
                                    '& .MuiSlider-mark': {
                                        backgroundColor: 'rgba(255,255,255,0.2)',
                                        height: 8,
                                        width: 1,
                                    },
                                    '& .MuiSlider-markLabel': {
                                        color: 'rgba(255,255,255,0.4)',
                                        fontSize: '0.65rem',
                                        fontWeight: 700,
                                        mt: 1
                                    },
                                    '& .MuiSlider-track': {
                                        border: 'none',
                                    },
                                    '& .MuiSlider-rail': {
                                        opacity: 0.2,
                                        backgroundColor: '#bfbfbf',
                                    },
                                }}
                            />
                        </Box>

                        <Stack direction="row" spacing={1}>
                            <Tooltip title="Historical Era">
                                <IconButton sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: 'white', bgcolor: 'rgba(255,255,255,0.05)' } }}>
                                    <History size={20} />
                                </IconButton>
                            </Tooltip>
                        </Stack>
                    </Stack>
                </Paper>
            </motion.div>
        </Box>
    );
}
