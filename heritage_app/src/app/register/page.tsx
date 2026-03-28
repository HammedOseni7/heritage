'use client';

import React, { useState } from 'react';
import { Box, Container, Typography, TextField, Button, Stack, IconButton, InputAdornment, Autocomplete } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Globe, MapPin, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/theme/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getFriendlyErrorMessage } from '@/lib/auth-errors';
import { COUNTRIES, getRegionForCountry } from '@/data/countries';

const STEPS = [
    { label: 'Account', description: 'Step 1 of 2' },
    { label: 'Profile', description: 'Step 2 of 2' },
];

export default function RegisterPage() {
    const { register, user, isLoading: authLoading } = useAuth();
    const router = useRouter();

    // Dedicated listener for successful login/signup
    React.useEffect(() => {
        if (user && !authLoading) {
            router.replace('/');
        }
    }, [user, authLoading, router]);

    const [step, setStep] = useState(0);
    const [direction, setDirection] = useState(1);
    const [formData, setFormData] = useState({ 
        email: '', 
        password: '', 
        username: '', 
        firstName: '', 
        lastName: '', 
        bio: '', 
        country: '' 
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const go = (next: number) => {
        setError('');
        if (step === 0) {
            if (!formData.email || !formData.password) { setError('Email and password are required.'); return; }
            if (formData.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
        }
        setDirection(next > step ? 1 : -1);
        setStep(next);
    };

    const handleSubmit = async () => {
        if (!formData.firstName || !formData.lastName || !formData.username || !formData.country) { 
            setError('All profile fields (First Name, Surname, Username, Country) are required.'); 
            return; 
        }
        setError('');
        try {
            setLoading(true);
            const autoUsername = formData.username || formData.email.split('@')[0];
            await register(
                formData.email,
                formData.password,
                autoUsername,
                formData.firstName,
                formData.lastName,
                null,
                { bio: formData.bio, region: getRegionForCountry(formData.country), country: formData.country }
            );
            // Use replace instead of push for auth redirects to prevent back-button loops
            router.replace('/');
        } catch (err: any) {
            setError(getFriendlyErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    const xInputSx = {
        '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            bgcolor: '#ffffff',
            '& fieldset': { borderColor: 'transparent' },
            '&:hover fieldset': { borderColor: '#1d9bf0' },
            '&.Mui-focused fieldset': { borderColor: '#1d9bf0', borderWidth: '2px' },
        },
        '& .MuiInputBase-input': { 
            color: '#000000',
            py: 1.8,
            px: 2,
            '&:-webkit-autofill': {
                WebkitBoxShadow: '0 0 0 100px white inset',
                WebkitTextFillColor: '#000000',
            },
        },
        mb: 3
    };

    return (
        <Box sx={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            bgcolor: '#000000', color: 'white', px: 2
        }}>
            <Container maxWidth="xs" sx={{ py: 4 }}>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        
                        <Box sx={{ mb: 3 }}>
                            <Globe size={40} color="#ffffff" strokeWidth={2.5} />
                        </Box>

                        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, letterSpacing: '-0.5px', textAlign: 'center', color: 'white' }}>
                            {step === 0 ? 'Create your account' : 'Customize your profile'}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#aab8c2', mb: 4, textAlign: 'center' }}>
                            {STEPS[step].description}
                        </Typography>

                        {error && (
                            <Box sx={{ p: 2, mb: 3, width: '100%', borderRadius: 1, bgcolor: '#f4212e22', border: '1px solid #f4212e' }}>
                                <Typography variant="body2" sx={{ color: '#f4212e' }} textAlign="center">{error}</Typography>
                            </Box>
                        )}

                        <Box sx={{ width: '100%', position: 'relative' }}>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={step}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {step === 0 ? (
                                        <Stack spacing={0.5}>
                                            <Typography variant="body2" sx={{ color: '#71767b', fontWeight: 700, ml: 1, mb: 0.5 }}>Email</Typography>
                                            <TextField
                                                fullWidth variant="outlined"
                                                value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                sx={xInputSx}
                                            />
                                            <Typography variant="body2" sx={{ color: '#71767b', fontWeight: 700, ml: 1, mb: 0.5 }}>Password</Typography>
                                            <TextField
                                                fullWidth type={showPassword ? 'text' : 'password'} variant="outlined"
                                                value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })}
                                                sx={xInputSx}
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: '#71767b' }}>
                                                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    )
                                                }}
                                            />
                                        </Stack>
                                    ) : (
                                        <Stack spacing={0.3}>
                                            <Typography variant="body2" sx={{ color: '#71767b', fontWeight: 700, ml: 1, mb: 0.3 }}>First Name</Typography>
                                            <TextField
                                                fullWidth variant="outlined"
                                                value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                                sx={xInputSx}
                                            />

                                            <Typography variant="body2" sx={{ color: '#71767b', fontWeight: 700, ml: 1, mb: 0.3 }}>Surname</Typography>
                                            <TextField
                                                fullWidth variant="outlined"
                                                value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                                sx={xInputSx}
                                            />

                                            <Typography variant="body2" sx={{ color: '#71767b', fontWeight: 700, ml: 1, mb: 0.3 }}>Username (@heritage_guy)</Typography>
                                            <TextField
                                                fullWidth variant="outlined"
                                                value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value.toLowerCase() })}
                                                sx={xInputSx}
                                            />
                                            <Typography variant="body2" sx={{ color: '#71767b', fontWeight: 700, ml: 1, mb: 0.5 }}>Country</Typography>
                                            <Autocomplete
                                                fullWidth
                                                options={COUNTRIES.map(c => c.name)}
                                                value={formData.country}
                                                onChange={(_, newValue) => setFormData({ ...formData, country: newValue || '' })}
                                                renderInput={(params) => <TextField {...params} variant="outlined" sx={xInputSx} />}
                                                sx={{
                                                    '& .MuiAutocomplete-paper': { bgcolor: '#1e293b', color: 'white' },
                                                    '& .MuiAutocomplete-listbox .MuiAutocomplete-option': {
                                                        '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                                                        '&[aria-selected="true"]': { bgcolor: '#1d9bf066' }
                                                    }
                                                }}
                                            />
                                            <Typography variant="body2" sx={{ color: '#71767b', fontWeight: 700, ml: 1, mb: 0.5 }}>Bio (optional)</Typography>
                                            <TextField
                                                fullWidth multiline rows={2} variant="outlined"
                                                value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                                sx={xInputSx}
                                            />
                                        </Stack>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </Box>

                        <Stack spacing={2} sx={{ width: '100%', mt: 4 }}>
                            {step < STEPS.length - 1 ? (
                                <Button
                                    variant="contained" onClick={() => go(step + 1)}
                                    sx={{ 
                                        py: 1.8, borderRadius: '9999px', fontWeight: 700, fontSize: '15px', 
                                        bgcolor: 'white', color: 'black', textTransform: 'none',
                                        '&:hover': { bgcolor: '#e6e6e6' }
                                    }}
                                >
                                    Next
                                </Button>
                            ) : (
                                <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
                                    <Button
                                        variant="outlined" onClick={() => go(step - 1)}
                                        sx={{ 
                                            flex: 1, py: 1.8, borderRadius: '9999px', fontWeight: 700, 
                                            borderColor: '#333639', color: 'white', textTransform: 'none',
                                            '&:hover': { borderColor: '#333639', bgcolor: 'rgba(255,255,255,0.05)' }
                                        }}
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        variant="contained" onClick={handleSubmit} disabled={loading}
                                        sx={{ 
                                            flex: 2, py: 1.8, borderRadius: '9999px', fontWeight: 700, 
                                            bgcolor: '#1d9bf0', color: 'white', textTransform: 'none',
                                            '&:hover': { bgcolor: '#1a8cd8' },
                                            '&.Mui-disabled': { bgcolor: '#1d9bf055', color: 'white' }
                                        }}
                                    >
                                        {loading ? 'Creating...' : 'Create account'}
                                    </Button>
                                </Stack>
                            )}
                        </Stack>

                        <Box sx={{ mt: 6, width: '100%' }}>
                            <Typography variant="body2" sx={{ color: '#71767b' }}>
                                Already have an account?{' '}
                                <Link href="/login" style={{ color: '#1d9bf0', textDecoration: 'none' }}>
                                    Log in
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                </motion.div>
            </Container>
        </Box>
    );
}
