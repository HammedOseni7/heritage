'use client';

import React from 'react';
import { Box, Container, Typography, Avatar, Grid, Paper, Chip, LinearProgress, Stack, Button, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton } from '@mui/material';
import { ShieldCheck, Award, Star, History, Image as ImageIcon, MessageCircle, Camera, Edit2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useHeritage } from '@/theme/HeritageContext';
import { useAuth } from '@/theme/AuthContext';
import CultureCard from '@/components/feed/CultureCard';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const { entries, userValidationsGiven } = useHeritage();
    const { user, logout, updateProfileData } = useAuth();
    const router = useRouter();
    const [isUploading, setIsUploading] = React.useState(false);
    
    // Edit Profile State
    const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
    const [editUsername, setEditUsername] = React.useState('');
    const [editBio, setEditBio] = React.useState('');
    const [isSaving, setIsSaving] = React.useState(false);

    const handleOpenEditModal = () => {
        setEditUsername(user?.username || '');
        setEditBio(user?.bio || '');
        setIsEditModalOpen(true);
    };

    const handleSaveProfile = async () => {
        setIsSaving(true);
        try {
            // @ts-ignore
            if (updateProfileData) await updateProfileData({ username: editUsername, bio: editBio });
            setIsEditModalOpen(false);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setIsUploading(true);
            try {
                // Ignore updateProfileData type error if not recognized by TypeScript yet
                // @ts-ignore
                if (updateProfileData) await updateProfileData({}, e.target.files[0]);
            } catch (err) {
                console.error(err);
            } finally {
                setIsUploading(false);
            }
        }
    };

    // Derived Gamification Stats
    const userEntries = entries.filter(e => e.author.name === (user?.username || 'You (Heritage Guardian)'));
    const totalImpact = userValidationsGiven * 10 + userEntries.length * 50;

    const badges = [
        { icon: <ShieldCheck size={24} />, name: 'Cultural Spotter', desc: '10+ Validations', unlocked: true },
        { icon: <Award size={24} />, name: 'Heritage Keeper', desc: 'First Submission', unlocked: userEntries.length > 0 },
        { icon: <Star size={24} />, name: 'Legacy Guardian', desc: '1000+ Impact Score', unlocked: false }
    ];

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: 'calc(100vh - 72px)', py: 8 }}>
            <Container maxWidth="lg">
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
                    {/* Sidebar / Identity */}
                    <Box sx={{ flex: { xs: '1 1 auto', md: '0 0 33%' } }}>
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                            <Paper sx={{
                                p: 4, borderRadius: 6,
                                bgcolor: 'rgba(30, 41, 59, 0.7)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255,255,255,0.05)',
                                textAlign: 'center'
                            }}>
                                <Box sx={{ position: 'relative', display: 'inline-block', mb: 3 }}>
                                    <Avatar src={user?.avatar || "https://i.pravatar.cc/150?u=you"} sx={{ width: 120, height: 120, border: '4px solid #6366f1' }} />
                                    
                                    <Box 
                                        component="label" 
                                        sx={{
                                            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
                                            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            bgcolor: isUploading ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.4)', 
                                            opacity: isUploading ? 1 : 0, 
                                            cursor: 'pointer', transition: 'opacity 0.2s',
                                            '&:hover': { opacity: 1 }
                                        }}
                                    >
                                        <input type="file" hidden accept="image/*" onChange={handlePhotoUpload} disabled={isUploading} />
                                        {isUploading ? <CircularProgress size={30} sx={{ color: 'white' }} /> : <Camera color="white" />}
                                    </Box>

                                    {badges[0].unlocked && (
                                        <Box sx={{ position: 'absolute', bottom: -5, right: -5, bgcolor: '#10b981', p: 1, borderRadius: '50%', border: '4px solid #1e293b', zIndex: 2 }}>
                                            <ShieldCheck size={20} color="white" />
                                        </Box>
                                    )}
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 0.5 }}>
                                    <Typography variant="h5" sx={{ fontWeight: 900 }}>{user?.username || 'You'}</Typography>
                                    <IconButton size="small" onClick={handleOpenEditModal} sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: 'white' } }}>
                                        <Edit2 size={16} />
                                    </IconButton>
                                </Box>
                                <Typography variant="body2" sx={{ color: '#818cf8', fontWeight: 700, mb: 2 }}>Heritage Guardian</Typography>
                                {user?.bio && (
                                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 4, px: 2, fontStyle: 'italic' }}>
                                        "{user.bio}"
                                    </Typography>
                                )}
                                {!user?.bio && <Box sx={{ mb: 4 }} />}

                                <Box sx={{ textAlign: 'left', mb: 4, p: 3, bgcolor: 'rgba(0,0,0,0.2)', borderRadius: 4 }}>
                                    <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 800 }}>Impact Score</Typography>
                                    <Typography variant="h3" sx={{ fontWeight: 900, color: '#fbbf24', mb: 1 }}>{totalImpact}</Typography>
                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>Top 12% globally</Typography>
                                    <LinearProgress variant="determinate" value={65} sx={{ mt: 2, height: 6, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.1)', '& .MuiLinearProgress-bar': { bgcolor: '#fbbf24' } }} />
                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', display: 'block', mt: 1, textAlign: 'right' }}>350 to next tier</Typography>
                                </Box>

                                <Stack spacing={2}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, border: '1px solid rgba(255,255,255,0.05)', borderRadius: 3 }}>
                                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>Validations Given</Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 800 }}>{userValidationsGiven}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, border: '1px solid rgba(255,255,255,0.05)', borderRadius: 3 }}>
                                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>Entries Submitted</Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 800 }}>{userEntries.length}</Typography>
                                    </Box>
                                </Stack>

                                <Button
                                    variant="outlined"
                                    color="error"
                                    fullWidth
                                    sx={{ mt: 4, borderRadius: 3, fontWeight: 700 }}
                                    onClick={() => {
                                        logout();
                                        router.push('/');
                                    }}
                                >
                                    Sign Out
                                </Button>
                            </Paper>
                        </motion.div>
                    </Box>

                    {/* Main Content / Badges & History */}
                    <Box sx={{ flex: { xs: '1 1 auto', md: '0 0 66%' } }}>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>

                            {/* Badges Section */}
                            <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Award size={20} color="#fbbf24" /> Unlocked Badges
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 6 }}>
                                {badges.map((badge, i) => (
                                    <Box key={i} sx={{ width: { xs: '100%', sm: '32%' }, mb: { xs: 2, sm: 0 } }}>
                                        <Paper sx={{
                                            p: 3, borderRadius: 4, textAlign: 'center',
                                            bgcolor: badge.unlocked ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255,255,255,0.02)',
                                            border: `1px solid ${badge.unlocked ? 'rgba(99, 102, 241, 0.3)' : 'rgba(255,255,255,0.05)'}`,
                                            opacity: badge.unlocked ? 1 : 0.5,
                                            transition: 'transform 0.2s',
                                            '&:hover': badge.unlocked ? { transform: 'translateY(-4px)' } : {}
                                        }}>
                                            <Box sx={{
                                                width: 56, height: 56, mx: 'auto', mb: 2, borderRadius: '50%',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                bgcolor: badge.unlocked ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255,255,255,0.05)',
                                                color: badge.unlocked ? '#a5b4fc' : 'rgba(255,255,255,0.3)'
                                            }}>
                                                {badge.icon}
                                            </Box>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 0.5 }}>{badge.name}</Typography>
                                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>{badge.desc}</Typography>
                                        </Paper>
                                    </Box>
                                ))}
                            </Box>

                            {/* Portfolio Section */}
                            <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <History size={20} color="#10b981" /> Your Submissions
                            </Typography>

                            {userEntries.length > 0 ? (
                                <Box>
                                    {userEntries.map(entry => (
                                        <CultureCard key={entry.id} entry={entry} />
                                    ))}
                                </Box>
                            ) : (
                                <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 6, bgcolor: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)' }}>
                                    <ImageIcon size={48} color="rgba(255,255,255,0.2)" style={{ margin: '0 auto 16px' }} />
                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>No Heritage Shared Yet</Typography>
                                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mb: 3 }}>
                                        Be the first to document an unrecorded oral tradition, recipe, or craft from your culture.
                                    </Typography>
                                    <Button variant="contained" href="/submit" sx={{ borderRadius: 10, px: 4, fontWeight: 700 }}>
                                        Share Heritage Now
                                    </Button>
                                </Paper>
                            )}

                        </motion.div>
                    </Box>
                </Box>
            </Container>

            {/* Edit Profile Dialog */}
            <Dialog 
                open={isEditModalOpen} 
                onClose={() => !isSaving && setIsEditModalOpen(false)}
                PaperProps={{
                    sx: { bgcolor: '#0f172a', color: 'white', borderRadius: 3, border: '1px solid rgba(255,255,255,0.1)', minWidth: { xs: 300, sm: 400 } }
                }}
            >
                <DialogTitle sx={{ fontWeight: 800 }}>Edit Profile</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Username"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={editUsername}
                        onChange={(e) => setEditUsername(e.target.value)}
                        disabled={isSaving}
                        sx={{ mb: 3, mt: 1, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' }, '&:hover fieldset': { borderColor: '#6366f1' }, '&.Mui-focused fieldset': { borderColor: '#6366f1' }, color: 'white' }, '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' } }}
                    />
                    <TextField
                        margin="dense"
                        label="Bio"
                        type="text"
                        fullWidth
                        variant="outlined"
                        multiline
                        rows={3}
                        value={editBio}
                        onChange={(e) => setEditBio(e.target.value)}
                        disabled={isSaving}
                        sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' }, '&:hover fieldset': { borderColor: '#6366f1' }, '&.Mui-focused fieldset': { borderColor: '#6366f1' }, color: 'white' }, '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' } }}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 0 }}>
                    <Button onClick={() => setIsEditModalOpen(false)} disabled={isSaving} sx={{ color: 'rgba(255,255,255,0.5)' }}>Cancel</Button>
                    <Button onClick={handleSaveProfile} variant="contained" disabled={isSaving || !editUsername.trim()} sx={{ bgcolor: '#6366f1', '&:hover': { bgcolor: '#4f46e5' }, fontWeight: 700, borderRadius: 2 }}>
                        {isSaving ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
