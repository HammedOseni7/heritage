'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, Box, Typography, IconButton, Paper, Stack, Button, Fade } from '@mui/material';
import { X, PlayCircle, Bot, Info, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CulturalEntry } from '@/types';

// Lazy load simulations to keep the main bundle light
import MancalaSim from './MancalaSim';
import WeavingSim from './WeavingSim';
import GuardianChat from './GuardianChat';

interface SimulationModalProps {
    open: boolean;
    onClose: () => void;
    entry: CulturalEntry;
}

export default function SimulationModal({ open, onClose, entry }: SimulationModalProps) {
    const [gameState, setGameState] = useState<'intro' | 'playing' | 'complete'>('intro');

    const renderSimulation = () => {
        switch (entry.simulationType) {
            case 'mancala':
                return <MancalaSim onComplete={() => setGameState('complete')} />;
            case 'weaving':
                return <WeavingSim onComplete={() => setGameState('complete')} />;
            case 'chat':
                return <GuardianChat entry={entry} />;
            default:
                return (
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                        <Typography>Simulation coming soon for this entry!</Typography>
                    </Box>
                );
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    bgcolor: 'rgba(15, 23, 42, 0.9)',
                    backdropFilter: 'blur(30px)',
                    borderRadius: 8,
                    border: '1px solid rgba(255,255,255,0.1)',
                    overflow: 'hidden',
                    boxShadow: '0 0 100px rgba(99, 102, 241, 0.2)'
                }
            }}
        >
            <Box sx={{ position: 'relative', p: 3, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Box sx={{ p: 1, borderRadius: 3, bgcolor: 'primary.main', display: 'flex' }}>
                        <PlayCircle size={20} color="white" />
                    </Box>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 900, color: 'white', lineHeight: 1.2 }}>
                            {entry.title}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 700, textTransform: 'uppercase' }}>
                            Interactive Simulation
                        </Typography>
                    </Box>
                </Stack>
                <IconButton onClick={onClose} sx={{ color: 'rgba(255,255,255,0.4)', '&:hover': { bgcolor: 'rgba(255,255,255,0.05)', color: 'white' } }}>
                    <X size={24} />
                </IconButton>
            </Box>

            <DialogContent sx={{ p: 0, minHeight: 500, display: 'flex', flexDirection: 'column' }}>
                <AnimatePresence mode="wait">
                    {gameState === 'intro' ? (
                        <motion.div
                            key="intro"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}
                        >
                            <Box sx={{ maxWidth: 500, textAlign: 'center' }}>
                                <Box sx={{
                                    width: 120, height: 120, borderRadius: '50%',
                                    bgcolor: 'rgba(99, 102, 241, 0.1)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    mx: 'auto', mb: 4,
                                    border: '1px solid rgba(99, 102, 241, 0.2)'
                                }}>
                                    <PlayCircle size={64} color="#818cf8" />
                                </Box>
                                <Typography variant="h4" sx={{ fontWeight: 900, mb: 2, color: 'white' }}>
                                    Experience History
                                </Typography>
                                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.6)', mb: 4, lineHeight: 1.6 }}>
                                    Step inside this cultural tradition. This simulation allows you to {entry.type === 'game' ? 'play the strategy' : 'learn the craft'} as it has been passed down for generations.
                                </Typography>
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={() => setGameState('playing')}
                                    sx={{
                                        borderRadius: 6, px: 6, py: 2, fontWeight: 800,
                                        boxShadow: '0 12px 32px rgba(99, 102, 241, 0.3)'
                                    }}
                                >
                                    Start Simulation
                                </Button>
                            </Box>
                        </motion.div>
                    ) : gameState === 'playing' ? (
                        <motion.div
                            key="playing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{ flex: 1 }}
                        >
                            {renderSimulation()}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="complete"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}
                        >
                            <Box sx={{ textAlign: 'center' }}>
                                <Award size={80} color="#fbbf24" style={{ marginBottom: '24px' }} />
                                <Typography variant="h4" sx={{ fontWeight: 900, mb: 1, color: 'white' }}>
                                    Simulation Complete!
                                </Typography>
                                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.6)', mb: 4 }}>
                                    You've successfully experienced a part of our shared cultural legacy.
                                </Typography>
                                <Button variant="outlined" onClick={onClose} sx={{ borderRadius: 4, fontWeight: 700 }}>
                                    Finish & Close
                                </Button>
                            </Box>
                        </motion.div>
                    )}
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    );
}
