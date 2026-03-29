'use client';

import React, { useState } from 'react';
import { Box, Container, Typography, Stack, Button, Chip, Grid, Avatar } from '@mui/material';
import Link from 'next/link';
import { useHeritage } from '@/theme/HeritageContext';
import { motion, AnimatePresence } from 'framer-motion';

const quotes = [
  {
    text: "Heritage is our legacy from the past, what we live with today, and what we pass on to future generations.",
    author: "UNESCO",
    title: "World Heritage Centre"
  },
  {
    text: "A people without the knowledge of their past history, origin and culture is like a tree without roots.",
    author: "Marcus Garvey",
    title: "Cultural Visionary"
  },
  {
    text: "Cultural heritage is not just about the past; it is the living breath of a community's identity and future.",
    author: "ICOMOS",
    title: "Int. Council on Monuments & Sites"
  }
];

export default function Home() {
  const { entries } = useHeritage();
  const [currentQuote, setCurrentQuote] = useState(0);

  // Filter for high-quality highlights
  const highlights = entries.filter(e => e.status === 'Community Verified').slice(0, 5);

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box sx={{
        py: { xs: 12, md: 24 },
        position: 'relative',
        backgroundImage: 'url(https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, rgba(15, 23, 42, 0.4), rgba(15, 23, 42, 0.9))',
          zIndex: 1
        }
      }}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Typography variant="h1" sx={{ fontWeight: 900, mb: 3, letterSpacing: '-2px', color: 'white', fontSize: { xs: '3rem', md: '5rem' } }}>
              The World's <span style={{ color: '#818cf8' }}>Memory</span>, <br />Preserved by You.
            </Typography>
            <Typography variant="h5" sx={{ mb: 6, fontWeight: 400, maxWidth: 800, mx: 'auto', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
              A collective effort to document, verify, and celebrate the diverse cultural heritage of humanity. From oral legends to architectural marvels.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" alignItems="center" sx={{ flexWrap: 'wrap', gap: 2 }}>
              <Button component={Link} href="/heritage" variant="contained" size="large" sx={{ borderRadius: 10, px: 4, py: 2, fontWeight: 900, bgcolor: 'white', color: '#0f172a', border: '1px solid white', '&:hover': { bgcolor: '#f1f5f9', transform: 'translateY(-2px)' }, transition: '0.3s', width: { xs: '100%', sm: 'auto' } }}>
                View Heritage
              </Button>
              <Button component={Link} href="/map" variant="contained" size="large" sx={{ borderRadius: 10, px: 4, py: 2, fontWeight: 900, bgcolor: 'white', color: '#0f172a', border: '1px solid white', '&:hover': { bgcolor: '#f1f5f9', transform: 'translateY(-2px)' }, transition: '0.3s', width: { xs: '100%', sm: 'auto' } }}>
                View Global Map
              </Button>
              <Button component={Link} href="/review" variant="contained" size="large" sx={{ borderRadius: 10, px: 4, py: 2, fontWeight: 900, bgcolor: 'white', color: '#0f172a', border: '1px solid white', '&:hover': { bgcolor: '#f1f5f9', transform: 'translateY(-2px)' }, transition: '0.3s', width: { xs: '100%', sm: 'auto' } }}>
                Help Us Verify
              </Button>
              <Button component={Link} href="/submit" variant="contained" size="large" sx={{ borderRadius: 10, px: 4, py: 2, fontWeight: 900, bgcolor: 'white', color: '#0f172a', border: '1px solid white', '&:hover': { bgcolor: '#f1f5f9', transform: 'translateY(-2px)' }, transition: '0.3s', width: { xs: '100%', sm: 'auto' } }}>
                Share Heritage
              </Button>
            </Stack>
          </motion.div>
        </Container>
      </Box>

      {/* Preservation Writeup & Quotes */}
      <Container maxWidth="lg" sx={{ py: 16 }}>
        <Grid container spacing={8} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="overline" sx={{ color: '#6366f1', fontWeight: 900, letterSpacing: '0.2em' }}>MISSION PHILOSOPHY</Typography>
            <Typography variant="h3" sx={{ fontWeight: 900, mt: 2, mb: 4, letterSpacing: '-1px' }}>
              Why We Preserve
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3, fontSize: '1.2rem', lineHeight: 1.8 }}>
              Culture is the soul of humanity. In an age of rapid globalization, the unique stories, rituals, and crafts that define our communities are at risk of being lost forever.
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, fontSize: '1.2rem', lineHeight: 1.8 }}>
              The Heritage Hub is more than a database—it is a digital ark. By leveraging community validation and expert verification, we ensure that local wisdom is documented accurately and remains accessible for centuries to come.
            </Typography>
            <Button
              component={Link} href="/review"
              variant="outlined" size="large"
              sx={{ borderRadius: 10, px: 6, py: 1.5, fontWeight: 900, color: '#10b981', borderColor: '#10b981', '&:hover': { bgcolor: 'rgba(16, 185, 129, 0.05)', borderColor: '#10b981' } }}
            >
              Help Us Verify New Entries
            </Button>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{
              p: 6, borderRadius: 8,
              bgcolor: 'rgba(99, 102, 241, 0.05)',
              border: '1px solid rgba(99, 102, 241, 0.1)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 32px 64px -12px rgba(0,0,0,0.5)'
            }}>
              <Typography variant="h4" sx={{ fontStyle: 'italic', fontWeight: 400, color: 'white', mb: 6, lineHeight: 1.6, position: 'relative' }}>
                <span style={{ fontSize: '4rem', color: '#6366f1', position: 'absolute', top: -32, left: -16, opacity: 0.3 }}>"</span>
                Heritage is not a thing. It is a relationship between people and their ancestors.
              </Typography>
              <Stack direction="row" spacing={3} alignItems="center">
                <Avatar sx={{ width: 64, height: 64, border: '2px solid #6366f1' }} src="https://i.pravatar.cc/150?u=elder" />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>Majiid Al-Husein</Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>LEGACY GUARDIAN & ELDER</Typography>
                </Box>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Impact Stats */}
      <Box sx={{ py: 12, bgcolor: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <Container maxWidth="lg">
          <Grid container spacing={8}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h2" sx={{ fontWeight: 900, color: '#6366f1', mb: 1 }}>{entries.length}+</Typography>
                <Typography variant="subtitle1" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 800 }}>TRADITIONS PRESERVED</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h2" sx={{ fontWeight: 900, color: '#10b981', mb: 1 }}>84</Typography>
                <Typography variant="subtitle1" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 800 }}>COUNTRIES REPRESENTED</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h2" sx={{ fontWeight: 900, color: '#ef4444', mb: 1 }}>2.4K</Typography>
                <Typography variant="subtitle1" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 800 }}>ACTIVE GUARDIANS</Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Highlights Carousel */}
      <Box sx={{ py: 16, bgcolor: 'rgba(255,255,255,0.02)' }}>
        <Container maxWidth="lg">
          <Typography variant="overline" sx={{ color: '#ec4899', fontWeight: 900, letterSpacing: '0.2em' }}>CURATED SELECTION</Typography>
          <Typography variant="h3" sx={{ fontWeight: 900, mt: 2, mb: 8, letterSpacing: '-1px' }}>
            Heritage Highlights
          </Typography>

          <Box sx={{ overflow: 'hidden', mb: 4, cursor: 'grab', '&:active': { cursor: 'grabbing' } }}>
            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 40,
                  ease: "linear",
                },
              }}
              style={{ display: 'flex', gap: 32, width: 'max-content' }}
            >
              {/* Duplicate highlights for seamless looping */}
              {[...highlights, ...highlights].map((entry, index) => (
                <Box
                  key={`${entry.id}-${index}`}
                  component={Link}
                  href="/heritage"
                  sx={{
                    minWidth: { xs: 300, md: 400 },
                    height: 500,
                    borderRadius: 8,
                    overflow: 'hidden',
                    position: 'relative',
                    textDecoration: 'none',
                    '&:hover img': { transform: 'scale(1.1)' }
                  }}
                >
                  {entry.images && entry.images[0] && (
                    <img
                      src={entry.images[0]}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: '0.8s' }}
                      alt={entry.title}
                    />
                  )}
                  <Box sx={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    p: 4,
                    background: 'linear-gradient(to top, rgba(15, 23, 42, 0.9), transparent)',
                    color: 'white'
                  }}>
                    <Chip label={entry.type.toUpperCase()} size="small" sx={{ bgcolor: 'rgba(129, 140, 248, 0.3)', color: '#a5b4fc', fontWeight: 900, mb: 1 }} />
                    <Typography variant="h5" sx={{ fontWeight: 900, mb: 1 }}>{entry.title}</Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 400 }}>{entry.description}</Typography>
                  </Box>
                </Box>
              ))}
            </motion.div>
          </Box>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', fontWeight: 700 }}>
            ← DRAG TO EXPLORE HIGHLIGHTS →
          </Typography>
        </Container>
      </Box>

      {/* Call to Action */}
      <Container maxWidth="lg" sx={{ py: 20, textAlign: 'center' }}>
        <Typography variant="h2" sx={{ fontWeight: 900, mb: 4, letterSpacing: '-2px' }}>
          Document Your Story.
        </Typography>
        <Typography variant="h6" sx={{ color: 'text.secondary', mb: 6, maxWidth: 600, mx: 'auto' }}>
          Every memory matters. Join thousands of Heritage Guardians in preserving the world's most valuable asset: its identity.
        </Typography>
        <Button
          component={Link} href="/register"
          variant="contained" size="large"
          sx={{ borderRadius: 10, px: 8, py: 2.5, fontWeight: 900, fontSize: '1.2rem', bgcolor: '#6366f1' }}
        >
          Begin Your Journey
        </Button>
      </Container>
    </Box>
  );
}
