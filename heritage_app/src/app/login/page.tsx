'use client';

import React, { useState } from 'react';
import { Box, Container, Typography, TextField, Button, Stack, IconButton, InputAdornment } from '@mui/material';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Globe } from 'lucide-react';
import { useAuth } from '@/theme/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getFriendlyErrorMessage } from '@/lib/auth-errors';

export default function LoginPage() {
    const { login, user, isLoading: authLoading } = useAuth();
    const router = useRouter();

    // Dedicated listener for successful login
    React.useEffect(() => {
        if (user && !authLoading) {
            router.replace('/');
        }
    }, [user, authLoading, router]);

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!formData.email || !formData.password) {
            setError('Please provide your email and password.');
            return;
        }

        try {
            setLoading(true);
            await login(formData.email, formData.password);
            router.push('/');
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
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#000000',
            color: 'white',
            px: 2
        }}>
            <Container maxWidth="xs">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        
                        <Box sx={{ mb: 4 }}>
                            <Globe size={44} color="#ffffff" strokeWidth={2.5} />
                        </Box>

                        <Typography variant="h4" sx={{ fontWeight: 800, mb: 4, letterSpacing: '-0.5px', color: 'white' }}>
                            Sign in to Heritage Hub
                        </Typography>

                        {error && (
                            <Box sx={{ p: 2, mb: 2, width: '100%', borderRadius: 1, bgcolor: '#f4212e22', border: '1px solid #f4212e' }}>
                                <Typography variant="body2" sx={{ color: '#f4212e' }} textAlign="center">{error}</Typography>
                            </Box>
                        )}

                        <Stack spacing={0.5} sx={{ width: '100%', mb: 2 }}>
                            <Typography variant="body2" sx={{ color: '#71767b', fontWeight: 700, ml: 1, mb: 0.5 }}>Email</Typography>
                            <TextField
                                fullWidth type="email" variant="outlined"
                                value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                                sx={xInputSx}
                            />
                            
                            <Typography variant="body2" sx={{ color: '#71767b', fontWeight: 700, ml: 1, mb: 0.5 }}>Password</Typography>
                            <TextField
                                fullWidth type={showPassword ? "text" : "password"} variant="outlined"
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

                            <Button
                                type="submit" variant="contained" disabled={loading}
                                sx={{ 
                                    py: 1.8, borderRadius: '9999px', fontWeight: 700, fontSize: '15px', 
                                    bgcolor: 'white', color: 'black', textTransform: 'none',
                                    mt: 2,
                                    '&:hover': { bgcolor: '#e6e6e6' },
                                    '&.Mui-disabled': { bgcolor: '#787a7a', color: '#000000' }
                                }}
                            >
                                {loading ? 'Logging in...' : 'Log in'}
                            </Button>

                            <Button
                                variant="outlined"
                                sx={{ 
                                    py: 1.8, borderRadius: '9999px', fontWeight: 700, fontSize: '15px', 
                                    borderColor: '#333639', color: 'white', textTransform: 'none',
                                    mt: 2, '&:hover': { borderColor: '#333639', bgcolor: 'rgba(255,255,255,0.05)' }
                                }}
                            >
                                Forgot password?
                            </Button>
                        </Stack>

                        <Box sx={{ mt: 8, width: '100%' }}>
                            <Typography variant="body2" sx={{ color: '#71767b' }}>
                                Don't have an account?{' '}
                                <Link href="/register" style={{ color: '#1d9bf0', textDecoration: 'none' }}>
                                    Sign up
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                </motion.div>
            </Container>
        </Box>
    );
}
