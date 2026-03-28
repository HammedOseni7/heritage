'use client';

import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box, IconButton, Stack, Tooltip, Avatar } from '@mui/material';
import { Globe, PlusCircle, Bell, UserCircle, Menu, Trophy, Search } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/theme/AuthContext';
import SearchModal from './SearchModal';

export default function Header() {
    const { user } = useAuth();
    const [isScrolled, setIsScrolled] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <AppBar
            position="sticky"
            sx={{
                backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid rgba(0,0,0,0.05)',
                boxShadow: isScrolled ? '0 4px 20px rgba(0,0,0,0.03)' : 'none',
                transition: 'all 0.3s ease-in-out',
                color: '#0f172a'
            }}
        >
            <Container maxWidth="lg">
                <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 1, sm: 2 }, height: 72 }}>
                    <Box component={Link} href="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
                        <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: '-1px', background: 'linear-gradient(45deg, #6366f1, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            HERITAGE HUB
                        </Typography>
                    </Box>

                    <Stack direction="row" spacing={1} sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
                        <IconButton color="inherit" onClick={() => setSearchOpen(true)}>
                            <Search size={20} />
                        </IconButton>
                        <Button component={Link} href="/" sx={{ color: 'inherit', fontWeight: 700 }}>Encyclopedia</Button>
                        <Button component={Link} href="/map" startIcon={<Globe size={18} />} sx={{ color: 'inherit', fontWeight: 700 }}>World Map</Button>
                        <Tooltip title="Global Leaderboard">
                            <IconButton color="inherit" component={Link} href="/leaderboard"><Trophy size={20} /></IconButton>
                        </Tooltip>
                        <Box sx={{ width: '1px', height: 24, bgcolor: 'rgba(0,0,0,0.1)', mx: 1 }} />
                        <Button component={Link} href="/submit" startIcon={<PlusCircle size={18} />} variant="contained" color="primary" sx={{ borderRadius: 10, fontWeight: 800 }}>Share Heritage</Button>
                        <IconButton color="inherit"><Bell size={20} /></IconButton>
                        {user ? (
                            <Tooltip title="Your Profile">
                                <IconButton color="inherit" component={Link} href="/profile">
                                    <Avatar src={user.avatar} sx={{ width: 32, height: 32, border: '2px solid #6366f1' }} />
                                </IconButton>
                            </Tooltip>
                        ) : (
                            <Button component={Link} href="/login" variant="outlined" sx={{ borderRadius: 10, fontWeight: 700, borderColor: 'rgba(0,0,0,0.2)', color: 'inherit' }}>
                                Sign In
                            </Button>
                        )}
                    </Stack>

                    <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
                        <IconButton color="inherit" onClick={() => setSearchOpen(true)}><Search size={22} /></IconButton>
                        <IconButton color="inherit" component={Link} href="/map"><Globe size={22} /></IconButton>
                        <IconButton color="inherit"><Bell size={22} /></IconButton>
                        <IconButton color="inherit"><Menu size={22} /></IconButton>
                    </Box>
                </Toolbar>
            </Container>

            {/* Global Search Interface */}
            <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
        </AppBar>
    );
}
