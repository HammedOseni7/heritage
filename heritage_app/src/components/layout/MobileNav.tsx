'use client';

import React from 'react';
import { Box, Paper, BottomNavigation, BottomNavigationAction } from '@mui/material';
import { Home, Map, PlusCircle, History } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/theme/AuthContext';

export default function MobileNav() {
    const { user } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const navItems = [
        { label: 'Home', value: '/', icon: <Home size={22} /> },
        { label: 'Map', value: '/map', icon: <Map size={22} /> },
        ...(user ? [{ label: 'Share', value: '/submit', icon: <PlusCircle size={22} /> }] : []),
        { label: 'Feeds', value: '/heritage', icon: <History size={22} /> },
    ];

    return (
        <Box sx={{ display: { xs: 'block', md: 'none' }, position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000 }}>
            <Paper
                elevation={3}
                sx={{
                    borderRadius: 0,
                    borderTop: '1px solid rgba(0,0,0,0.05)',
                    bgcolor: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)'
                }}
            >
                <BottomNavigation
                    showLabels
                    value={pathname}
                    onChange={(event, newValue) => {
                        router.push(newValue);
                    }}
                    sx={{
                        height: 70,
                        backgroundColor: 'transparent',
                        '& .MuiBottomNavigationAction-label': { color: '#64748b' },
                        '& .MuiBottomNavigationAction-root.Mui-selected': {
                            '& .MuiBottomNavigationAction-label': { color: 'primary.main' },
                            '& svg': { color: 'primary.main' }
                        },
                        '& svg': { color: '#64748b' }
                    }}
                >
                    {navItems.map((item) => (
                        <BottomNavigationAction key={item.value} label={item.label} value={item.value} icon={item.icon} />
                    ))}
                </BottomNavigation>
            </Paper>
        </Box>
    );
}
