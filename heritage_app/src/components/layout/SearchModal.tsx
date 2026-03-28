'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, IconButton, Dialog, Slide, Stack, Paper, Chip, Avatar, CircularProgress, Button } from '@mui/material';
import { Search as SearchIcon, X, Bot, MapPin, Feather } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSimulation } from '@/theme/SimulationContext';
import { CulturalEntry } from '@/types';
import Link from 'next/link';

const Transition = React.forwardRef(function Transition(props: any, ref: React.Ref<unknown>) {
    return <Slide direction="down" ref={ref} {...props} />;
});

interface SearchModalProps {
    open: boolean;
    onClose: () => void;
}

export default function SearchModal({ open, onClose }: SearchModalProps) {
    const { entries } = useSimulation();
    const [query, setQuery] = useState('');
    const [localResults, setLocalResults] = useState<CulturalEntry[]>([]);

    // AI State
    const [aiResponse, setAiResponse] = useState('');
    const [isAiSearching, setIsAiSearching] = useState(false);
    const [hasAiSearched, setHasAiSearched] = useState(false);

    // Instant Local Filtering
    useEffect(() => {
        if (!query.trim()) {
            setLocalResults([]);
            setAiResponse('');
            setHasAiSearched(false);
            return;
        }

        const q = query.toLowerCase();
        const matches = entries.filter(e =>
            e.title.toLowerCase().includes(q) ||
            e.type.toLowerCase().includes(q) ||
            e.location.city.toLowerCase().includes(q) ||
            e.location.country.toLowerCase().includes(q)
        );

        setLocalResults(matches.slice(0, 4)); // top 4 local matches max
    }, [query, entries]);

    const handleAskAi = async () => {
        if (!query.trim()) return;

        setIsAiSearching(true);
        setHasAiSearched(true);
        setAiResponse('');

        try {
            const res = await fetch(`/api/ai?q=${encodeURIComponent(query)}`);
            const data = await res.json();

            if (res.ok) {
                setAiResponse(data.answer);
            } else {
                setAiResponse("I couldn't find any historical records matching that exact topic. Try phrasing it differently or searching for a broader culture.");
            }
        } catch (error) {
            setAiResponse("The Heritage AI is currently offline or resting. Please try again later.");
        } finally {
            setIsAiSearching(false);
        }
    };

    // Reset when closed
    useEffect(() => {
        if (!open) {
            setTimeout(() => {
                setQuery('');
                setAiResponse('');
                setHasAiSearched(false);
                setLocalResults([]);
            }, 300);
        }
    }, [open]);

    return (
        <Dialog
            fullScreen
            open={open}
            onClose={onClose}
            TransitionComponent={Transition}
            PaperProps={{
                sx: {
                    bgcolor: 'rgba(15, 23, 42, 0.95)',
                    backdropFilter: 'blur(30px)',
                    color: 'white'
                }
            }}
        >
            {/* Header / Search Bar */}
            <Box sx={{ p: { xs: 2, md: 4 }, display: 'flex', alignItems: 'center', gap: 2, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <Box sx={{ flex: 1, position: 'relative' }}>
                    <SearchIcon size={28} color="rgba(99, 102, 241, 0.5)" style={{ position: 'absolute', left: 24, top: '50%', transform: 'translateY(-50%)', zIndex: 1 }} />
                    <TextField
                        fullWidth
                        autoFocus
                        placeholder="Search for dances, recipes, cities, rituals..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleAskAi(); }}
                        variant="outlined"
                        InputProps={{
                            sx: {
                                fontSize: { xs: '1.2rem', md: '1.8rem' },
                                fontWeight: 800,
                                color: 'white',
                                pl: 8,
                                pr: 4,
                                py: 1.5,
                                borderRadius: 10,
                                bgcolor: 'rgba(255,255,255,0.03)',
                                '& fieldset': { border: 'none' },
                                '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' },
                                '&.Mui-focused': { bgcolor: 'rgba(99, 102, 241, 0.05)' }
                            }
                        }}
                    />
                </Box>
                <IconButton onClick={onClose} sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: 'white', bgcolor: 'rgba(255,255,255,0.1)' }, p: { xs: 1.5, md: 2.5 } }}>
                    <X size={32} />
                </IconButton>
            </Box>

            {/* Results Grid */}
            <Box sx={{ p: { xs: 2, md: 6 }, maxWidth: 1200, mx: 'auto', width: '100%', height: 'calc(100vh - 120px)', overflowY: 'auto' }}>

                {query.trim().length > 0 && (
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={6}>

                        {/* Local Hub Matches (Left) */}
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'rgba(255,255,255,0.5)', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <MapPin size={18} /> IN THE HUB ({localResults.length})
                            </Typography>

                            {localResults.length > 0 ? (
                                <Stack spacing={2}>
                                    {localResults.map(entry => (
                                        <Box key={entry.id} onClick={onClose} component={Link} href="/" sx={{ textDecoration: 'none' }}>
                                            <Paper sx={{
                                                p: 3, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.03)',
                                                border: '1px solid rgba(255,255,255,0.05)',
                                                transition: 'all 0.2s',
                                                display: 'flex', gap: 3, alignItems: 'center',
                                                '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.1)', borderColor: 'rgba(99, 102, 241, 0.3)', transform: 'translateY(-2px)' }
                                            }}>
                                                {entry.images && entry.images[0] ? (
                                                    <Box sx={{ width: 64, height: 64, borderRadius: 2, overflow: 'hidden', flexShrink: 0 }}>
                                                        <img src={entry.images[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="local match" />
                                                    </Box>
                                                ) : (
                                                    <Box sx={{ width: 64, height: 64, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                        <Feather size={24} color="rgba(255,255,255,0.4)" />
                                                    </Box>
                                                )}

                                                <Box>
                                                    <Chip label={entry.type} size="small" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 800, bgcolor: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', mb: 0.5, letterSpacing: 0.5 }} />
                                                    <Typography variant="body1" sx={{ fontWeight: 800, color: 'white', mb: 0.5 }}>{entry.title}</Typography>
                                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <Avatar src={entry.author.avatar} sx={{ width: 16, height: 16 }} /> {entry.author.name}
                                                    </Typography>
                                                </Box>
                                            </Paper>
                                        </Box>
                                    ))}
                                </Stack>
                            ) : (
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.3)', fontStyle: 'italic', p: 4, textAlign: 'center', bgcolor: 'rgba(0,0,0,0.2)', borderRadius: 4 }}>
                                    No direct heritage entries found for "{query}".
                                </Typography>
                            )}
                        </Box>

                        {/* AI Global Search (Right) */}
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#c084fc', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Bot size={18} /> ASK HERITAGE AI
                            </Typography>

                            <Paper sx={{
                                p: 4, borderRadius: 6,
                                bgcolor: isAiSearching ? 'rgba(192, 132, 252, 0.05)' : (hasAiSearched ? 'rgba(192, 132, 252, 0.1)' : 'rgba(255,255,255,0.02)'),
                                border: '1px solid',
                                borderColor: hasAiSearched || isAiSearching ? 'rgba(192, 132, 252, 0.3)' : 'rgba(255,255,255,0.05)',
                                minHeight: 200,
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                {/* Ambient glow if waiting */}
                                {isAiSearching && <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 2, bgcolor: '#c084fc', animation: 'progress 1.5s infinite linear', '@keyframes progress': { '0%': { transform: 'translateX(-100%)' }, '100%': { transform: 'translateX(100%)' } } }} />}

                                {!hasAiSearched && !isAiSearching && (
                                    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', p: 4 }}>
                                        <Bot size={48} color="rgba(192, 132, 252, 0.2)" style={{ marginBottom: 16 }} />
                                        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.6)', mb: 3 }}>
                                            Couldn't find it in the local hub? Have our AI index the global historical archives for "{query}".
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            startIcon={<SearchIcon />}
                                            onClick={handleAskAi}
                                            sx={{ bgcolor: '#c084fc', '&:hover': { bgcolor: '#a855f7' }, borderRadius: 10, px: 4, py: 1.5, fontWeight: 800 }}
                                        >
                                            Consult Archives
                                        </Button>
                                    </Box>
                                )}

                                {isAiSearching && (
                                    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                                        <CircularProgress size={40} sx={{ color: '#c084fc', mb: 3 }} />
                                        <Typography variant="body2" sx={{ color: '#c084fc', fontWeight: 700, animation: 'pulse 2s infinite' }}>
                                            Synthesizing historical records...
                                        </Typography>
                                    </Box>
                                )}

                                {hasAiSearched && !isAiSearching && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                            <Avatar sx={{ bgcolor: '#c084fc' }}><Bot size={20} /></Avatar>
                                            <Box>
                                                <Typography variant="caption" sx={{ color: '#c084fc', fontWeight: 800 }}>Heritage AI</Typography>
                                                <Typography variant="body1" sx={{ color: 'white', lineHeight: 1.8, mt: 0.5 }}>
                                                    {aiResponse}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </motion.div>
                                )}
                            </Paper>
                        </Box>

                    </Stack>
                )}

                {/* Initial Blank State Prompts */}
                {query.length === 0 && (
                    <Box sx={{ mt: 8, textAlign: 'center' }}>
                        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.4)', mb: 4, fontWeight: 700 }}>EXPLORE THE ARCHIVES</Typography>
                        <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap" useFlexGap sx={{ maxWidth: 600, mx: 'auto' }}>
                            {['Yoruba masquerades', 'Japanese Kintsugi', 'Capoeira history', 'Machu Picchu layout', 'Inuit throat singing'].map(suggestion => (
                                <Chip
                                    key={suggestion}
                                    label={suggestion}
                                    onClick={() => setQuery(suggestion)}
                                    sx={{
                                        bgcolor: 'rgba(255,255,255,0.05)',
                                        color: 'rgba(255,255,255,0.7)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.2)', color: 'white', borderColor: 'rgba(99, 102, 241, 0.4)' },
                                        fontWeight: 600, py: 2
                                    }}
                                />
                            ))}
                        </Stack>
                    </Box>
                )}
            </Box>
        </Dialog>
    );
}
