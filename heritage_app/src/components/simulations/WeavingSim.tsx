'use client';

import React, { useState } from 'react';
import { Box, Typography, Button, Paper, Stack } from '@mui/material';
import { motion } from 'framer-motion';

interface WeavingSimProps {
    onComplete: () => void;
}

export default function WeavingSim({ onComplete }: WeavingSimProps) {
    const [row, setRow] = useState(0);
    const [pattern, setPattern] = useState<string[][]>(Array(10).fill([]).map(() => Array(10).fill('rgba(255,255,255,0.05)')));

    const colors = ['#f59e0b', '#dc2626', '#10b981', '#000000', '#6366f1'];
    const meanings = ['Royalty & Wealth', 'Sacrifice & Struggle', 'Growth & Renewal', 'Maturity & Spirit', 'Harmony & Peace'];

    const weave = (color: string) => {
        if (row >= 10) return;

        const newPattern = [...pattern];
        newPattern[row] = Array(10).fill(color);
        setPattern(newPattern);
        setRow(row + 1);

        if (row === 9) {
            setTimeout(onComplete, 1000);
        }
    };

    return (
        <Box sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h5" sx={{ color: 'white', fontWeight: 800, mb: 1 }}>Kente Weaving Loom</Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                    Select a color thread to weave the next row of your sacred cloth.
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 4, width: '100%', maxWidth: 800, flex: 1 }}>
                <Paper sx={{
                    flex: 1, p: 4, borderRadius: 4,
                    bgcolor: 'rgba(0,0,0,0.3)', border: '2px solid rgba(255,255,255,0.1)',
                    display: 'flex', flexDirection: 'column', gap: 1
                }}>
                    {pattern.map((rowArr, i) => (
                        <Box key={i} sx={{ display: 'flex', height: 24, gap: 1 }}>
                            {rowArr.map((color, j) => (
                                <motion.div
                                    key={j}
                                    initial={{ width: 0 }}
                                    animate={{ width: '100%' }}
                                    style={{
                                        height: '100%',
                                        backgroundColor: color,
                                        borderRadius: 2,
                                        boxShadow: i === row - 1 ? '0 0 10px rgba(255,255,255,0.2)' : 'none'
                                    }}
                                />
                            ))}
                        </Box>
                    ))}
                    {row < 10 && (
                        <Box sx={{ height: 2, bgcolor: 'rgba(255,255,255,0.2)', mt: 1, position: 'relative' }}>
                            <Box sx={{ position: 'absolute', top: -4, left: -4, width: 10, height: 10, borderRadius: '50%', bgcolor: '#818cf8' }} />
                        </Box>
                    )}
                </Paper>

                <Box sx={{ width: 300 }}>
                    <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>Thread Collection</Typography>
                    <Stack spacing={2}>
                        {colors.map((c, i) => (
                            <Button
                                key={i}
                                onClick={() => weave(c)}
                                disabled={row >= 10}
                                sx={{
                                    justifyContent: 'flex-start', p: 1.5, borderRadius: 3,
                                    bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)',
                                    '&:hover': { bgcolor: 'rgba(255,255,255,0.07)' }
                                }}
                            >
                                <Box sx={{ width: 32, height: 32, borderRadius: 2, bgcolor: c, mr: 2, border: '1px solid rgba(255,255,255,0.1)' }} />
                                <Box sx={{ textAlign: 'left' }}>
                                    <Typography variant="body2" sx={{ color: 'white', fontWeight: 700, lineHeight: 1 }}>{meanings[i]}</Typography>
                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>Symbolic Meaning</Typography>
                                </Box>
                            </Button>
                        ))}
                    </Stack>
                </Box>
            </Box>
        </Box>
    );
}


