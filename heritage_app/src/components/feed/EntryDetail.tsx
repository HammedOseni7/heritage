'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, Box, Typography, Avatar, Chip, Button, Stack, Divider, IconButton, Tooltip } from '@mui/material';
import { X, CheckCircle2, Heart, Share2, MapPin, Calendar, Award, ShieldCheck, ShieldAlert, Info } from 'lucide-react';
import { CulturalEntry } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

interface EntryDetailProps {
    entry: CulturalEntry | null;
    onClose: () => void;
}

export default function EntryDetail({ entry, onClose }: EntryDetailProps) {
    const [validated, setValidated] = useState(false);
    const [invalidated, setInvalidated] = useState(false);

    if (!entry) return null;

    const currentValidations = entry.validationCount + (validated ? 1 : 0);
    const isCommunityVerified = currentValidations >= 3;

    return (
        <Dialog
            open={!!entry}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: { bgcolor: 'background.paper', borderRadius: 4, backgroundImage: 'none', border: '1px solid rgba(255,255,255,0.1)' }
            }}
        >
            <Box sx={{ position: 'relative' }}>
                <IconButton
                    onClick={onClose}
                    sx={{ position: 'absolute', right: 10, top: 10, bgcolor: 'rgba(0,0,0,0.5)', color: 'white', '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }, zIndex: 10 }}
                >
                    <X size={20} />
                </IconButton>

                <Box sx={{ height: 350, width: '100%', position: 'relative' }}>
                    <img
                        src={entry.images?.[0] || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23'}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        alt={entry.title}
                    />
                    <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 150, background: 'linear-gradient(to top, #1e293b, transparent)' }} />
                </Box>

                <DialogContent sx={{ mt: -6, position: 'relative', zIndex: 2, p: { xs: 2, md: 5 } }}>
                    <Stack spacing={4}>
                        <Box>
                            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                                <Chip label={entry.type} color="primary" size="small" sx={{ fontWeight: 800, textTransform: 'uppercase', px: 1 }} />
                                {entry.isElderVerified && (
                                    <Tooltip title="Verified by a Cultural Custodian">
                                        <Chip
                                            icon={<Award size={14} color="#fbbf24" />}
                                            label="Elder Verified"
                                            sx={{ bgcolor: 'rgba(251, 191, 36, 0.1)', color: '#fbbf24', border: '1px solid rgba(251, 191, 36, 0.3)', fontWeight: 700 }}
                                            size="small"
                                        />
                                    </Tooltip>
                                )}
                                {isCommunityVerified && (
                                    <Chip
                                        icon={<CheckCircle2 size={14} />}
                                        label="Community Verified"
                                        color="success"
                                        size="small"
                                        variant="outlined"
                                        sx={{ fontWeight: 700 }}
                                    />
                                )}
                            </Stack>
                            <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: '-1px' }}>{entry.title}</Typography>
                            <Stack direction="row" spacing={3} sx={{ mt: 2, opacity: 0.6 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <MapPin size={16} /> <Typography variant="subtitle2">{entry.location.city}, {entry.location.country}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <Calendar size={16} /> <Typography variant="subtitle2">{new Date(entry.createdAt).toLocaleDateString()}</Typography>
                                </Box>
                            </Stack>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: 'rgba(255,255,255,0.02)', borderRadius: 3, border: '1px solid rgba(255,255,255,0.05)' }}>
                            <Avatar src={entry.author.avatar} sx={{ width: 48, height: 48 }} />
                            <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{entry.author.name}</Typography>
                                <Typography variant="caption" color="text.secondary">Heritage Keeper • {entry.author.badges.join(', ')}</Typography>
                            </Box>
                            <Button variant="outlined" size="small" sx={{ ml: 'auto', borderRadius: 10, borderColor: 'rgba(255,255,255,0.1)', color: 'white' }}>Profile</Button>
                        </Box>

                        {entry.type === 'medicine' && (
                            <Box sx={{ p: 2.5, bgcolor: 'rgba(239, 68, 68, 0.05)', borderRadius: 2, border: '1px solid rgba(239, 68, 68, 0.1)', display: 'flex', gap: 2 }}>
                                <Info size={24} color="#ef4444" />
                                <Box>
                                    <Typography variant="caption" sx={{ fontWeight: 900, color: '#f87171', display: 'block', mb: 0.5 }}>SAFETY DISCLAIMER</Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Traditional medical practices should be approached with respect and caution. Consult with verified practitioners and healthcare professionals.
                                    </Typography>
                                </Box>
                            </Box>
                        )}

                        <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', whiteSpace: 'pre-wrap', fontSize: '1.1rem' }}>
                            {entry.content}
                        </Typography>

                        <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)', my: 2 }} />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 2, gap: 2 }}>
                            <Stack direction="row" spacing={3}>
                                <Button startIcon={<Heart size={22} />} sx={{ color: 'text.secondary', '&:hover': { color: 'secondary.main' } }}>
                                    Helpful ({currentValidations})
                                </Button>
                                <Button startIcon={<Share2 size={22} />} sx={{ color: 'text.secondary' }}>Share</Button>
                            </Stack>

                            <Stack direction="row" spacing={2} sx={{
                                p: 1,
                                px: 1.5,
                                borderRadius: 10,
                                bgcolor: 'rgba(255, 255, 255, 0.03)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.05)',
                                boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.05)'
                            }}>
                                {!validated && !invalidated && (
                                    <>
                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                startIcon={<ShieldCheck size={20} />}
                                                onClick={() => setValidated(true)}
                                                sx={{
                                                    borderRadius: 10,
                                                    fontWeight: 900,
                                                    px: 3,
                                                    py: 1.25,
                                                    bgcolor: '#6366f1',
                                                    '&:hover': {
                                                        bgcolor: '#4f46e5',
                                                        boxShadow: '0 0 25px rgba(99, 102, 241, 0.4)'
                                                    }
                                                }}
                                            >
                                                Validate
                                            </Button>
                                        </motion.div>
                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                startIcon={<ShieldAlert size={20} />}
                                                onClick={() => setInvalidated(true)}
                                                sx={{
                                                    borderRadius: 10,
                                                    fontWeight: 900,
                                                    px: 3,
                                                    py: 1.25,
                                                    borderColor: 'rgba(239, 68, 68, 0.3)',
                                                    color: 'white',
                                                    '&:hover': {
                                                        borderColor: '#ef4444',
                                                        bgcolor: 'rgba(239, 68, 68, 0.1)',
                                                        boxShadow: '0 0 25px rgba(239, 68, 68, 0.3)'
                                                    }
                                                }}
                                            >
                                                Invalidate
                                            </Button>
                                        </motion.div>
                                    </>
                                )}

                                {validated && (
                                    <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                                        <Chip
                                            icon={<CheckCircle2 size={18} />}
                                            label="Heritage Validated"
                                            color="success"
                                            sx={{ height: 44, px: 2.5, fontWeight: 900, fontSize: '0.9rem', boxShadow: '0 0 15px rgba(16, 185, 129, 0.2)' }}
                                        />
                                    </motion.div>
                                )}

                                {invalidated && (
                                    <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                                        <Chip
                                            icon={<ShieldAlert size={18} />}
                                            label="Heritage Invalidated"
                                            color="error"
                                            sx={{ height: 44, px: 2.5, fontWeight: 900, fontSize: '0.9rem', boxShadow: '0 0 15px rgba(244, 63, 94, 0.2)' }}
                                        />
                                    </motion.div>
                                )}
                            </Stack>
                        </Box>
                    </Stack>
                </DialogContent>
            </Box>
        </Dialog>
    );
}
