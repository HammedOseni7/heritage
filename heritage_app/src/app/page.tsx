'use client';

import React, { useState } from 'react';
import { Box, Container, Typography, Stack, Button, Tabs, Tab, Paper, Avatar, Chip } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Map as MapIcon, ChevronRight, Globe, Shield, Plus } from 'lucide-react';
import Link from 'next/link';
import CultureCard from '@/components/feed/CultureCard';
import EntryDetail from '@/components/feed/EntryDetail';
import PulsePanel from '@/components/layout/PulsePanel';
import { CulturalEntry, CultureType } from '@/types';
import { Fab } from '@mui/material';

import { useSimulation } from '@/theme/SimulationContext';
import CategoryFilter from '@/components/feed/CategoryFilter';

export default function Home() {
  const [selectedEntry, setSelectedEntry] = useState<CulturalEntry | null>(null);
  const [activeTab, setActiveTab] = useState<CultureType | 'all'>('all');
  const { entries, validateEntry, currentYear } = useSimulation();

  const temporalEntries = entries.filter(e => 
    (!e.originYear || e.originYear <= currentYear) && e.status === 'Community Verified'
  );

  const filteredEntries = activeTab === 'all'
    ? temporalEntries
    : temporalEntries.filter(e => e.type === activeTab);

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box sx={{
        py: { xs: 8, md: 16 },
        position: 'relative',
        overflow: 'hidden',
        backgroundImage: 'url(https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.4))',
          zIndex: 1
        }
      }}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 7 }}>
              <Chip
                label="A Living Encyclopedia of Human Culture"
                sx={{
                  mb: 3,
                  bgcolor: 'rgba(99, 102, 241, 0.2)',
                  color: 'primary.light',
                  fontWeight: 800,
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  backdropFilter: 'blur(8px)'
                }}
              />
              <Typography variant="h1" sx={{ fontWeight: 900, mb: 3, letterSpacing: '-2px', lineHeight: 1, color: 'white' }}>
                Preserve the <span style={{ color: '#818cf8', display: 'block' }}>Wisdom</span> of Generations
              </Typography>
              <Typography variant="h6" sx={{ mb: 5, fontWeight: 400, maxWidth: 600, color: 'rgba(255,255,255,0.8)' }}>
                Join communities worldwide in sharing and validating local heritage — from oral legends to traditional medicine.
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  component={Link} href="/map"
                  variant="contained" size="large"
                  startIcon={<Globe size={20} />}
                  sx={{ borderRadius: 10, px: 6, py: 2, fontWeight: 800, fontSize: '1.1rem', boxShadow: '0 8px 32px rgba(99, 102, 241, 0.4)' }}
                >
                  Explore Map
                </Button>
                <Button
                  component={Link} href="/submit"
                  variant="outlined" size="large"
                  sx={{ borderRadius: 10, px: 4, py: 1.5, fontWeight: 700, color: 'white', borderColor: 'rgba(255,255,255,0.3)', backdropFilter: 'blur(10px)' }}
                >
                  Share Heritage
                </Button>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box sx={{ position: 'relative' }}>
                <Box sx={{
                  p: 4, borderRadius: 8,
                  bgcolor: 'rgba(255,255,255,0.03)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 24px 48px rgba(0,0,0,0.5)'
                }}>
                  <Stack spacing={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}><Shield size={24} /></Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 800, color: 'white' }}>Heritage Guardian</Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>Verify traditions to earn badges</Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
                      Our community has verified over 4,200 cultural treasures. Be the next guardian of your culture.
                    </Typography>
                    <Button
                      component={Link} href="/map"
                      fullWidth
                      variant="contained"
                      sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
                    >
                      View Live Map
                    </Button>
                  </Stack>
                </Box>
                <Paper sx={{
                  position: 'absolute', bottom: -24, right: 24, p: 2, borderRadius: 4,
                  display: 'flex', alignItems: 'center', gap: 2,
                  bgcolor: 'background.paper', border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 12px 24px rgba(0,0,0,0.2)'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {[1, 2, 3].map(i => (
                      <Avatar key={i} src={`https://i.pravatar.cc/150?u=${i}`} sx={{ width: 32, height: 32, border: '2px solid #1e293b', ml: i > 1 ? -1.5 : 0 }} />
                    ))}
                  </Box>
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>+1.2k Online</Typography>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Content Feed Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>
          Living <span style={{ color: '#6366f1' }}>Encyclopedia</span>
        </Typography>

        <Box sx={{ mb: 6, overflowX: 'auto', pb: 2 }}>
          <CategoryFilter selectedCategory={activeTab} onSelectCategory={setActiveTab} />
        </Box>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Box>
              {filteredEntries.map((entry) => (
                <Box key={entry.id} onClick={() => setSelectedEntry(entry)} sx={{ cursor: 'pointer' }}>
                  <CultureCard entry={entry} />
                </Box>
              ))}
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={4}>
              <Paper sx={{ p: 3, borderRadius: 4, bgcolor: 'background.paper', border: '1px solid rgba(255,255,255,0.05)' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Heritage Guardians</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Help us verify and preserve these stories. Earn Legacy Guardian status for high-quality contributions.
                </Typography>
                <Button component={Link} href="/submit" fullWidth variant="contained" sx={{ borderRadius: 10, py: 1.5, fontWeight: 700 }}>
                  Join the Hub
                </Button>
              </Paper>

              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>Top Contributors</Typography>
                {[
                  { name: 'Elena Rojas', validations: 1240, tier: 'Legacy Guardian' },
                  { name: 'Moussa Diop', validations: 856, tier: 'Heritage Keeper' },
                  { name: 'Tenzin Gyatso', validations: 420, tier: 'Cultural Spotter' }
                ].map((user, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.5 }}>
                    <Box sx={{ position: 'relative' }}>
                      <Avatar src={`https://i.pravatar.cc/150?u=${i + 10}`} sx={{ width: 44, height: 44 }} />
                      <Box sx={{ position: 'absolute', bottom: -2, right: -2, width: 16, height: 16, bgcolor: i === 0 ? '#fbbf24' : '#10b981', border: '3px solid #0f172a', borderRadius: '50%' }} />
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'white' }}>{user.name}</Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>{user.validations} Validations • {user.tier}</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Container>

      <EntryDetail entry={selectedEntry} onClose={() => setSelectedEntry(null)} />

      {/* Floating Action Button */}
      <Fab
        component={Link}
        href="/submit"
        color="primary"
        sx={{
          position: 'fixed',
          bottom: { xs: 80, md: 48 },
          right: { xs: 24, md: 48 },
          boxShadow: '0 12px 32px rgba(99, 102, 241, 0.4)',
          width: 64,
          height: 64
        }}
      >
        <Plus size={32} />
      </Fab>

      <PulsePanel />
    </Box>
  );
}
