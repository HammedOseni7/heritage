'use client';

import React from 'react';
import { Box, Container, Grid, Typography, Stack, Link as MuiLink, IconButton, Divider } from '@mui/material';
import Link from 'next/link';
import { Twitter, Instagram, Linkedin, Github, Globe, Shield, Heart } from 'lucide-react';

const FOOTER_LINKS = {
  discover: [
    { label: 'View Heritage', href: '/heritage' },
    { label: 'Global Map', href: '/map' },
    { label: 'Culture Types', href: '/heritage' },
    { label: 'Community Pulsar', href: '/pulsar' },
  ],
  contribute: [
    { label: 'Share Heritage', href: '/submit' },
    { label: 'Help Us Verify', href: '/review' },
    { label: 'Submission Guide', href: '/guide' },
    { label: 'Become a Guardian', href: '/register' },
  ],
  community: [
    { label: 'Leaderboard', href: '/pulsar' },
    { label: 'Ethical Guidelines', href: '/legal' },
    { label: 'Institutional Partners', href: '/about' },
    { label: 'Developer API', href: '/docs' },
  ],
};

const Footer = () => {
  return (
    <Box sx={{ bgcolor: '#020617', color: 'rgba(255,255,255,0.7)', pt: 12, pb: 4, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <Container maxWidth="lg">
        <Grid container spacing={8}>
          {/* Brand Column */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 900, color: 'white', letterSpacing: '-1px', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Globe size={24} color="#6366f1" /> Heritage <span style={{ color: '#6366f1' }}>Hub</span>
              </Typography>
              <Typography variant="body2" sx={{ lineHeight: 1.8, maxWidth: 300 }}>
                A community-driven digital ark documenting, verifying, and celebrating the diverse cultural legacies of humanity for future generations.
              </Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <IconButton size="small" sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.03)', '&:hover': { bgcolor: '#6366f1' } }}><Twitter size={18} /></IconButton>
              <IconButton size="small" sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.03)', '&:hover': { bgcolor: '#6366f1' } }}><Instagram size={18} /></IconButton>
              <IconButton size="small" sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.03)', '&:hover': { bgcolor: '#6366f1' } }}><Linkedin size={18} /></IconButton>
              <IconButton size="small" sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.03)', '&:hover': { bgcolor: '#6366f1' } }}><Github size={18} /></IconButton>
            </Stack>
          </Grid>

          {/* Links Columns */}
          <Grid size={{ xs: 6, md: 2.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 900, color: 'white', mb: 3, letterSpacing: '0.1em' }}>DISCOVER</Typography>
            <Stack spacing={1.5}>
              {FOOTER_LINKS.discover.map(link => (
                <MuiLink key={link.label} component={Link} href={link.href} underline="none" sx={{ color: 'inherit', fontSize: '0.9rem', transition: '0.2s', '&:hover': { color: '#6366f1', pl: 1 } }}>
                  {link.label}
                </MuiLink>
              ))}
            </Stack>
          </Grid>

          <Grid size={{ xs: 6, md: 2.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 900, color: 'white', mb: 3, letterSpacing: '0.1em' }}>CONTRIBUTE</Typography>
            <Stack spacing={1.5}>
              {FOOTER_LINKS.contribute.map(link => (
                <MuiLink key={link.label} component={Link} href={link.href} underline="none" sx={{ color: 'inherit', fontSize: '0.9rem', transition: '0.2s', '&:hover': { color: '#6366f1', pl: 1 } }}>
                  {link.label}
                </MuiLink>
              ))}
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 900, color: 'white', mb: 3, letterSpacing: '0.1em' }}>COMMUNITY</Typography>
            <Stack spacing={1.5}>
              {FOOTER_LINKS.community.map(link => (
                <MuiLink key={link.label} component={Link} href={link.href} underline="none" sx={{ color: 'inherit', fontSize: '0.9rem', transition: '0.2s', '&:hover': { color: '#6366f1', pl: 1 } }}>
                  {link.label}
                </MuiLink>
              ))}
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 8, borderColor: 'rgba(255,255,255,0.05)' }} />

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Typography variant="caption">
            © {new Date().getFullYear()} Heritage Hub. All rights reserved. Preserved with <Heart size={12} fill="#ef4444" color="#ef4444" style={{ display: 'inline', verticalAlign: 'middle' }} /> globally.
          </Typography>
          <Stack direction="row" spacing={3}>
            <MuiLink component={Link} href="/legal" underline="none" sx={{ color: 'inherit', fontSize: '0.75rem', '&:hover': { color: 'white' } }}>Privacy Policy</MuiLink>
            <MuiLink component={Link} href="/legal" underline="none" sx={{ color: 'inherit', fontSize: '0.75rem', '&:hover': { color: 'white' } }}>Terms of Service</MuiLink>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Shield size={12} color="#10b981" />
              <Typography variant="caption" sx={{ color: '#10b981' }}>Secure Ecosystem</Typography>
            </Stack>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
