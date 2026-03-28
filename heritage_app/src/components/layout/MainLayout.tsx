import React from 'react';
import Header from './Header';
import MobileNav from './MobileNav';
import { Box, Container } from '@mui/material';

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', pb: { xs: 10, md: 0 } }}>
            <Header />
            <Box component="main" sx={{ flexGrow: 1 }}>
                {children}
            </Box>
            <MobileNav />
        </Box>
    );
}
