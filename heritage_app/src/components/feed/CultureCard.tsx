import React, { useState, useRef } from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Avatar, Chip, IconButton, Stack, Button, Slider, Collapse, TextField, Divider, MenuItem, Select, FormControl, InputLabel, CircularProgress } from '@mui/material';
import { Heart, MessageCircle, MapPin, Share2, CheckCircle2, ShieldCheck, ShieldAlert, Award, PlayCircle, PauseCircle, Music, Send, Languages, Box as BoxIcon } from 'lucide-react';
import { CulturalEntry } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { useSimulation } from '@/theme/SimulationContext';
import ArtifactViewer from './ArtifactViewer';
import SimulationModal from '../simulations/SimulationModal';

interface CultureCardProps {
    entry: CulturalEntry;
}

export default function CultureCard({ entry }: CultureCardProps) {
    const { validateEntry, invalidateEntry, addComment } = useSimulation();
    const [hasValidated, setHasValidated] = useState(false);
    const [hasInvalidated, setHasInvalidated] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);

    // Translation States
    const [translatedContent, setTranslatedContent] = useState<string | null>(null);
    const [isTranslating, setIsTranslating] = useState(false);
    const [targetLang, setTargetLang] = useState('es'); // Default to Spanish for demo
    const [showTranslation, setShowTranslation] = useState(false);

    // 3D States
    const [show3D, setShow3D] = useState(false);

    // Simulation States
    const [showSim, setShowSim] = useState(false);

    const audioRef = useRef<HTMLAudioElement | null>(null);

    const toggleAudio = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleValidate = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!hasValidated && !hasInvalidated) {
            validateEntry(entry.id);
            setHasValidated(true);
        }
    };

    const handleInvalidate = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!hasInvalidated && !hasValidated) {
            invalidateEntry(entry.id);
            setHasInvalidated(true);
        }
    };

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (commentText.trim()) {
            addComment(entry.id, commentText);
            setCommentText('');
        }
    };

    const handleTranslate = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (showTranslation) {
            setShowTranslation(false);
            return;
        }

        if (translatedContent) {
            setShowTranslation(true);
            return;
        }

        setIsTranslating(true);
        try {
            const res = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: entry.description, targetLanguage: targetLang })
            });
            const data = await res.json();
            if (data.translatedText) {
                setTranslatedContent(data.translatedText);
                setShowTranslation(true);
            }
        } catch (error) {
            console.error('Translation failed', error);
        } finally {
            setIsTranslating(false);
        }
    };

    const isCommunityVerified = entry.validationCount >= 3;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card sx={{
                bgcolor: 'rgba(255, 255, 255, 0.04)',
                backdropFilter: 'blur(24px) saturate(180%)',
                borderRadius: 8,
                overflow: 'hidden',
                mb: 4,
                border: '1px solid rgba(255, 255, 255, 0.08)',
                transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
                '&:hover': {
                    transform: 'translateY(-12px)',
                    bgcolor: 'rgba(255, 255, 255, 0.07)',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    boxShadow: '0 32px 64px rgba(0,0,0,0.5)',
                    '& .card-image': {
                        transform: 'scale(1.05)',
                        filter: 'brightness(1.05)'
                    }
                }
            }}>
                {entry.videoUrl ? (
                    <Box sx={{ overflow: 'hidden', height: 260, position: 'relative' }}>
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.85)' }}
                            src={entry.videoUrl}
                        />
                        <Box sx={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 1 }}>
                            {entry.isElderVerified && <Chip icon={<Award size={14} color="#fbbf24" />} label="Elder Verified" sx={{ bgcolor: 'rgba(251, 191, 36, 0.2)', color: '#fbbf24', fontWeight: 900, fontSize: '0.65rem', backdropFilter: 'blur(10px)', border: '1px solid rgba(251, 191, 36, 0.3)', textTransform: 'uppercase' }} />}
                            {isCommunityVerified && <Chip icon={<ShieldCheck size={14} color="#10b981" />} label="Community Verified" sx={{ bgcolor: 'rgba(16, 185, 129, 0.2)', color: '#34d399', fontWeight: 900, fontSize: '0.65rem', backdropFilter: 'blur(10px)', border: '1px solid rgba(16, 185, 129, 0.3)', textTransform: 'uppercase' }} />}
                        </Box>
                        {entry.hasSimulation && (
                            <Box sx={{ position: 'absolute', bottom: 16, right: 16, zIndex: 2 }}>
                                <Button
                                    variant="contained"
                                    size="small"
                                    startIcon={<PlayCircle size={16} />}
                                    onClick={(e) => { e.stopPropagation(); setShowSim(true); }}
                                    sx={{
                                        borderRadius: 10,
                                        bgcolor: 'rgba(16, 185, 129, 0.7)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        fontWeight: 800,
                                        fontSize: '0.65rem'
                                    }}
                                >
                                    Start Simulation
                                </Button>
                            </Box>
                        )}
                    </Box>
                ) : entry.images && entry.images.length > 0 ? (
                    <Box sx={{ overflow: 'hidden', height: 260, position: 'relative' }}>
                        <CardMedia
                            component="img"
                            image={entry.images[0]}
                            alt={entry.title}
                            className="card-image"
                            sx={{
                                transition: 'all 0.6s ease',
                                filter: 'brightness(0.8)',
                                height: '100%',
                                objectFit: 'cover'
                            }}
                        />
                        <Box sx={{
                            position: 'absolute', top: 16, right: 16,
                            display: 'flex', gap: 1
                        }}>
                            {entry.isElderVerified && (
                                <Chip
                                    icon={<Award size={14} color="#fbbf24" />}
                                    label="Elder Verified"
                                    sx={{
                                        bgcolor: 'rgba(251, 191, 36, 0.2)',
                                        color: '#fbbf24',
                                        fontWeight: 900,
                                        fontSize: '0.65rem',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(251, 191, 36, 0.3)',
                                        textTransform: 'uppercase'
                                    }}
                                />
                            )}
                            <AnimatePresence>
                                {isCommunityVerified && (
                                    <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                                        <Chip
                                            icon={<ShieldCheck size={14} color="#10b981" />}
                                            label="Community Verified"
                                            sx={{
                                                bgcolor: 'rgba(16, 185, 129, 0.2)',
                                                color: '#34d399',
                                                fontWeight: 900,
                                                fontSize: '0.65rem',
                                                backdropFilter: 'blur(10px)',
                                                border: '1px solid rgba(16, 185, 129, 0.3)',
                                                textTransform: 'uppercase'
                                            }}
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Box>

                        {/* Simulation / 3D Action Overlay */}
                        <Box sx={{ position: 'absolute', bottom: 16, right: 16, zIndex: 2, display: 'flex', gap: 1 }}>
                            {entry.hasSimulation && (
                                <Button
                                    variant="contained"
                                    size="small"
                                    startIcon={<PlayCircle size={16} />}
                                    onClick={(e) => { e.stopPropagation(); setShowSim(true); }}
                                    sx={{
                                        borderRadius: 10,
                                        bgcolor: 'rgba(16, 185, 129, 0.7)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        fontWeight: 800,
                                        fontSize: '0.65rem'
                                    }}
                                >
                                    Start Simulation
                                </Button>
                            )}
                            {entry.has3DModel && (
                                <Button
                                    variant="contained"
                                    size="small"
                                    startIcon={<BoxIcon size={16} />}
                                    onClick={(e) => { e.stopPropagation(); setShow3D(true); }}
                                    sx={{
                                        borderRadius: 10,
                                        bgcolor: 'rgba(99, 102, 241, 0.6)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        fontWeight: 800,
                                        fontSize: '0.65rem'
                                    }}
                                >
                                    Inspect in 3D
                                </Button>
                            )}
                        </Box>
                    </Box>
                ) : entry.hasSimulation ? (
                    <Box sx={{ overflow: 'hidden', height: 260, position: 'relative', bgcolor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Box sx={{ textAlign: 'center' }}>
                            <Box sx={{ p: 2, borderRadius: '50%', bgcolor: 'rgba(16, 185, 129, 0.1)', display: 'inline-flex', mb: 1 }}>
                                <PlayCircle size={40} color="#10b981" />
                            </Box>
                            <Typography variant="body2" sx={{ fontWeight: 800, color: 'white' }}>INTERACTIVE SIMULATION</Typography>
                        </Box>
                        <Box sx={{ position: 'absolute', bottom: 16, right: 16, zIndex: 2 }}>
                            <Button
                                variant="contained"
                                size="small"
                                startIcon={<PlayCircle size={16} />}
                                onClick={(e) => { e.stopPropagation(); setShowSim(true); }}
                                sx={{
                                    borderRadius: 10,
                                    bgcolor: 'rgba(16, 185, 129, 0.7)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    fontWeight: 800,
                                    fontSize: '0.65rem'
                                }}
                            >
                                Start Simulation
                            </Button>
                        </Box>
                    </Box>
                ) : null}
                <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box>
                            <Chip
                                label={entry.type.toUpperCase()}
                                size="small"
                                sx={{
                                    bgcolor: entry.type === 'story' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(236, 72, 153, 0.2)',
                                    color: entry.type === 'story' ? '#a5b4fc' : '#f9a8d4',
                                    fontWeight: 800,
                                    fontSize: '0.7rem',
                                    mb: 1.5,
                                    letterSpacing: '0.08em',
                                    backdropFilter: 'blur(4px)',
                                    border: '1px solid rgba(255,255,255,0.05)'
                                }}
                            />
                            <Typography variant="h5" sx={{ fontWeight: 900, lineHeight: 1.2, color: 'white', mb: 1, letterSpacing: '-0.5px' }}>
                                {entry.title}
                            </Typography>
                        </Box>
                    </Box>

                    {entry.audioUrl && (
                        <Box
                            sx={{
                                mb: 3, p: 2,
                                borderRadius: 4,
                                bgcolor: 'rgba(99, 102, 241, 0.08)',
                                border: '1px solid rgba(99, 102, 241, 0.15)',
                                display: 'flex', alignItems: 'center', gap: 2
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <audio ref={audioRef} src={entry.audioUrl} loop />
                            <IconButton
                                onClick={toggleAudio}
                                sx={{ color: '#818cf8', '&:hover': { bgcolor: 'rgba(129, 140, 248, 0.1)' } }}
                            >
                                {isPlaying ? <PauseCircle size={32} /> : <PlayCircle size={32} />}
                            </IconButton>
                            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <Typography variant="caption" sx={{ color: '#a5b4fc', fontWeight: 700, mb: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <Music size={12} /> ORAL TRADITION AUDIO
                                </Typography>
                                <Slider
                                    size="small"
                                    defaultValue={0}
                                    sx={{ color: '#818cf8', '& .MuiSlider-thumb': { display: 'none' }, padding: '4px 0' }}
                                />
                            </Box>
                        </Box>
                    )}

                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.6)', mb: 3, lineHeight: 1.7, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {showTranslation ? translatedContent : entry.description}
                    </Typography>

                    {entry.metadata && (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                            {entry.metadata.region && <Chip label={entry.metadata.region.toUpperCase()} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', fontSize: '0.65rem', fontWeight: 700 }} />}
                            {entry.metadata.tribe && <Chip label={entry.metadata.tribe.toUpperCase()} size="small" sx={{ bgcolor: 'rgba(99, 102, 241, 0.1)', color: '#a5b4fc', fontSize: '0.65rem', fontWeight: 800, border: '1px solid rgba(99, 102, 241, 0.2)' }} />}
                            {entry.metadata.language && <Chip label={`🗣 ${entry.metadata.language.toUpperCase()}`} size="small" sx={{ bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#34d399', fontSize: '0.65rem', fontWeight: 800, border: '1px solid rgba(16, 185, 129, 0.2)' }} />}
                            {entry.metadata.theme && <Chip label={`#${entry.metadata.theme.toUpperCase()}`} size="small" sx={{ bgcolor: 'rgba(236, 72, 153, 0.1)', color: '#f9a8d4', fontSize: '0.65rem', fontWeight: 800, border: '1px solid rgba(236, 72, 153, 0.2)' }} />}
                        </Box>
                    )}

                    <Stack direction="row" spacing={3} sx={{ mb: 4 }} alignItems="center" justifyContent="space-between">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <MapPin size={16} color="#818cf8" />
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
                                {entry.location.city}, {entry.location.country}
                            </Typography>
                        </Box>

                        <Stack direction="row" spacing={1} alignItems="center">
                            <FormControl size="small" variant="standard" sx={{ minWidth: 60 }}>
                                <Select
                                    value={targetLang}
                                    onChange={(e) => setTargetLang(e.target.value)}
                                    sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', fontWeight: 700 }}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <MenuItem value="es">SPA</MenuItem>
                                    <MenuItem value="fr">FRA</MenuItem>
                                    <MenuItem value="yo">YOR</MenuItem>
                                    <MenuItem value="hi">HIN</MenuItem>
                                    <MenuItem value="zh">CHN</MenuItem>
                                </Select>
                            </FormControl>
                            <Button
                                size="small"
                                startIcon={isTranslating ? <CircularProgress size={14} color="inherit" /> : <Languages size={14} />}
                                onClick={handleTranslate}
                                sx={{ color: showTranslation ? '#818cf8' : 'rgba(255,255,255,0.4)', fontSize: '0.7rem', fontWeight: 800 }}
                            >
                                {showTranslation ? 'Show Original' : 'Translate'}
                            </Button>
                        </Stack>
                    </Stack>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 3, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar src={entry.author.avatar} sx={{ width: 36, height: 36, border: '2px solid rgba(255,255,255,0.08)' }} />
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: 800, color: 'white', fontSize: '0.85rem' }}>{entry.author.name}</Typography>
                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>Heritage Keeper</Typography>
                            </Box>
                        </Box>

                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            p: 0.75,
                            pr: 2,
                            borderRadius: 6,
                            bgcolor: 'rgba(255, 255, 255, 0.03)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.05)'
                        }}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Button
                                        size="small"
                                        onClick={handleValidate}
                                        disabled={hasValidated || hasInvalidated}
                                        variant={hasValidated ? "text" : "outlined"}
                                        startIcon={<CheckCircle2 size={16} />}
                                        sx={{
                                            borderRadius: 4,
                                            px: 2,
                                            height: 36,
                                            fontWeight: 800,
                                            fontSize: '0.75rem',
                                            textTransform: 'none',
                                            borderColor: hasValidated ? 'transparent' : 'rgba(16, 185, 129, 0.3)',
                                            color: hasValidated ? '#34d399' : 'white',
                                            bgcolor: hasValidated ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                borderColor: '#10b981',
                                                bgcolor: 'rgba(16, 185, 129, 0.1)',
                                                boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)'
                                            },
                                            '&.Mui-disabled': {
                                                borderColor: hasValidated ? 'transparent' : 'rgba(255,255,255,0.05)',
                                                color: hasValidated ? '#34d399' : 'rgba(255,255,255,0.15)',
                                                bgcolor: hasValidated ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                                            }
                                        }}
                                    >
                                        {hasValidated ? "Validated" : `Validate (${entry.validationCount})`}
                                    </Button>
                                </motion.div>

                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Button
                                        size="small"
                                        onClick={handleInvalidate}
                                        disabled={hasValidated || hasInvalidated}
                                        variant={hasInvalidated ? "text" : "outlined"}
                                        startIcon={<ShieldAlert size={16} />}
                                        sx={{
                                            borderRadius: 4,
                                            px: 2,
                                            height: 36,
                                            fontWeight: 800,
                                            fontSize: '0.75rem',
                                            textTransform: 'none',
                                            borderColor: hasInvalidated ? 'transparent' : 'rgba(244, 63, 94, 0.3)',
                                            color: hasInvalidated ? '#fb7185' : 'white',
                                            bgcolor: hasInvalidated ? 'rgba(244, 63, 94, 0.15)' : 'transparent',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                borderColor: '#f43f5e',
                                                bgcolor: 'rgba(244, 63, 94, 0.1)',
                                                boxShadow: '0 0 20px rgba(244, 63, 94, 0.3)'
                                            },
                                            '&.Mui-disabled': {
                                                borderColor: hasInvalidated ? 'transparent' : 'rgba(255,255,255,0.05)',
                                                color: hasInvalidated ? '#fb7185' : 'rgba(255,255,255,0.15)',
                                                bgcolor: hasInvalidated ? 'rgba(244, 63, 94, 0.1)' : 'transparent',
                                            }
                                        }}
                                    >
                                        {hasInvalidated ? "Invalidated" : `Invalidate (${entry.invalidationCount})`}
                                    </Button>
                                </motion.div>
                            </Stack>

                            <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.05)', mx: 0.5, height: 20, alignSelf: 'center' }} />

                            <IconButton
                                size="small"
                                sx={{ color: showComments ? '#818cf8' : 'rgba(255,255,255,0.4)', transition: 'all 0.3s ease', '&:hover': { color: '#818cf8', transform: 'translateY(-2px)' } }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowComments(!showComments);
                                }}
                            >
                                <MessageCircle size={18} />
                                {entry.comments && entry.comments.length > 0 && (
                                    <Typography variant="caption" sx={{ ml: 0.5, fontWeight: 900 }}>
                                        {entry.comments.length}
                                    </Typography>
                                )}
                            </IconButton>
                            <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.4)', transition: 'all 0.3s ease', '&:hover': { color: '#f43f5e', transform: 'translateY(-2px)' } }}><Heart size={18} /></IconButton>
                            <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.4)', transition: 'all 0.3s ease', '&:hover': { color: 'white', transform: 'translateY(-2px)' } }}><Share2 size={18} /></IconButton>
                        </Box>
                    </Box>

                    {/* Comments Section */}
                    <Collapse in={showComments} timeout="auto" unmountOnExit>
                        <Box onClick={(e) => e.stopPropagation()} sx={{ mt: 3, pt: 3, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2, color: 'rgba(255,255,255,0.8)' }}>
                                Community Discussion
                            </Typography>

                            <Stack spacing={2} sx={{ mb: 3, maxHeight: 200, overflowY: 'auto', pr: 1, '&::-webkit-scrollbar': { width: 4 }, '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 10 } }}>
                                {entry.comments?.map(comment => (
                                    <Box key={comment.id} sx={{ display: 'flex', gap: 1.5 }}>
                                        <Avatar src={comment.authorAvatar} sx={{ width: 28, height: 28 }} />
                                        <Box sx={{ bgcolor: 'rgba(255,255,255,0.03)', p: 1.5, borderRadius: 3, borderTopLeftRadius: 0, flex: 1 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                <Typography variant="caption" sx={{ fontWeight: 800, color: '#a5b4fc' }}>{comment.authorName}</Typography>
                                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem' }}>
                                                    {new Date(comment.createdAt).toLocaleDateString()}
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}>
                                                {comment.text}
                                            </Typography>
                                        </Box>
                                    </Box>
                                ))}
                                {(!entry.comments || entry.comments.length === 0) && (
                                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', py: 2, fontStyle: 'italic' }}>
                                        Be the first guardian to leave a comment.
                                    </Typography>
                                )}
                            </Stack>

                            <Box component="form" onSubmit={handleCommentSubmit} sx={{ display: 'flex', gap: 1 }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    placeholder="Add to the discussion..."
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            bgcolor: 'rgba(0,0,0,0.2)',
                                            borderRadius: 6,
                                            '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                                            '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                                            '&.Mui-focused fieldset': { borderColor: '#818cf8' },
                                        },
                                        '& input': { color: 'white', fontSize: '0.85rem' }
                                    }}
                                />
                                <IconButton
                                    type="submit"
                                    disabled={!commentText.trim()}
                                    sx={{
                                        bgcolor: commentText.trim() ? '#6366f1' : 'rgba(255,255,255,0.05)',
                                        color: 'white',
                                        borderRadius: 2,
                                        '&:hover': { bgcolor: '#4f46e5' },
                                        '&.Mui-disabled': { bgcolor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.2)' }
                                    }}
                                >
                                    <Send size={16} />
                                </IconButton>
                            </Box>
                        </Box>
                    </Collapse>
                </CardContent>
            </Card>

            {/* 3D Modal */}
            {entry.has3DModel && (
                <ArtifactViewer
                    open={show3D}
                    onClose={() => setShow3D(false)}
                    title={entry.title}
                />
            )}
            {/* Simulation Modal */}
            <SimulationModal
                open={showSim}
                onClose={() => setShowSim(false)}
                entry={entry}
            />
        </motion.div>
    );
}

