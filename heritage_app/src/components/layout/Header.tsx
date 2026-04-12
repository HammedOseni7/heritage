'use client';

import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box, IconButton, Stack, Tooltip, Avatar, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { Globe, PlusCircle, Bell, Menu, Trophy, Search, Home, History, User, X } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/theme/AuthContext';
import { useNotifications } from '@/theme/NotificationContext';
import SearchModal from './SearchModal';
import NotificationsPopover from './NotificationsPopover';
import { Badge } from '@mui/material';

export default function Header() {
    const { user } = useAuth();
    const { unreadCount } = useNotifications();
    const [isScrolled, setIsScrolled] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [notifAnchor, setNotifAnchor] = useState<null | HTMLElement>(null);

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const menuItems = [
        { label: 'Home', href: '/', icon: <Home size={20} /> },
        { label: 'View Heritage', href: '/heritage', icon: <History size={20} /> },
        { label: 'World Map', href: '/map', icon: <Globe size={20} /> },
        { label: 'Leaderboard', href: '/leaderboard', icon: <Trophy size={20} /> },
        { label: 'Profile', href: '/profile', icon: <User size={20} /> },
    ];

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
                        <Button component={Link} href="/heritage" sx={{ color: 'inherit', fontWeight: 700 }}>View Heritage</Button>
                        <Button component={Link} href="/map" startIcon={<Globe size={18} />} sx={{ color: 'inherit', fontWeight: 700 }}>World Map</Button>
                        <Tooltip title="Global Leaderboard">
                            <IconButton color="inherit" component={Link} href="/leaderboard"><Trophy size={20} /></IconButton>
                        </Tooltip>
                        <Box sx={{ width: '1px', height: 24, bgcolor: 'rgba(0,0,0,0.1)', mx: 1 }} />
                        {user && (
                            <Button component={Link} href="/submit" startIcon={<PlusCircle size={18} />} variant="contained" color="primary" sx={{ borderRadius: 10, fontWeight: 800 }}>Share Heritage</Button>
                        )}
                        <IconButton color="inherit" onClick={(e) => setNotifAnchor(e.currentTarget)}>
                            <Badge badgeContent={unreadCount} color="error" sx={{ '& .MuiBadge-badge': { fontWeight: 900, fontSize: '0.6rem' } }}>
                                <Bell size={20} />
                            </Badge>
                        </IconButton>
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

                    <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 0.5 }}>
                        <IconButton color="inherit" onClick={() => setSearchOpen(true)}><Search size={22} /></IconButton>
                        <IconButton color="inherit" onClick={() => setDrawerOpen(true)}><Menu size={22} /></IconButton>
                    </Box>
                </Toolbar>
            </Container>

            {/* Mobile Drawer */}
            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                PaperProps={{
                    sx: {
                        width: 280,
                        bgcolor: '#ffffff',
                        backgroundImage: 'none',
                        color: '#0f172a',
                        padding: 3,
                        boxShadow: '-10px 0 30px rgba(0,0,0,0.1)'
                    }
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: '-0.5px', color: '#0f172a' }}>MENU</Typography>
                    <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: '#0f172a' }}><X size={24} /></IconButton>
                </Box>

                <List sx={{ pt: 0 }}>
                    {menuItems.map((item) => (
                        <ListItem key={item.label} disablePadding sx={{ mb: 1 }}>
                            <ListItemButton
                                component={Link}
                                href={item.href}
                                onClick={() => setDrawerOpen(false)}
                                sx={{
                                    borderRadius: 3,
                                    '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.08)', '& svg': { color: '#6366f1' } }
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 44 }}>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 700, fontSize: '1rem' }} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>

                <Divider sx={{ my: 4, opacity: 0.1 }} />

                <Box sx={{ px: 1 }}>
                    {user && (
                        <Button
                            fullWidth
                            component={Link}
                            href="/submit"
                            variant="contained"
                            startIcon={<PlusCircle size={20} />}
                            onClick={() => setDrawerOpen(false)}
                            sx={{ py: 2, borderRadius: 4, fontWeight: 900, mb: 2 }}
                        >
                            Share Heritage
                        </Button>
                    )}
                    {!user && (
                        <Button
                            fullWidth
                            component={Link}
                            href="/login"
                            variant="outlined"
                            onClick={() => setDrawerOpen(false)}
                            sx={{ py: 1.5, borderRadius: 4, fontWeight: 800, borderColor: 'rgba(0,0,0,0.1)', color: 'text.secondary' }}
                        >
                            Sign In
                        </Button>
                    )}
                </Box>
            </Drawer>

            {/* Global Search Interface */}
            <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />

            {/* Notifications Interface */}
            <NotificationsPopover anchorEl={notifAnchor} onClose={() => setNotifAnchor(null)} />
        </AppBar>
    );
}
