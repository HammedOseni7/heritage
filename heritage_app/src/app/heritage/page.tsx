'use client';

import React, { useState, useMemo } from 'react';
import { Box, Container, Typography, Stack, Grid, TextField, InputAdornment, Chip, MenuItem, Select, FormControl, InputLabel, Button } from '@mui/material';
import { Search, Filter, Shield } from 'lucide-react';
import Link from 'next/link';
import CultureCard from '@/components/feed/CultureCard';
import EntryDetail from '@/components/feed/EntryDetail';
import PulsePanel from '@/components/layout/PulsePanel';
import CategoryFilter from '@/components/feed/CategoryFilter';
import { CulturalEntry, CultureType } from '@/types';
import { useHeritage } from '@/theme/HeritageContext';
import { useAuth } from '@/theme/AuthContext';

export default function HeritagePage() {
  const { user } = useAuth();
  const [selectedEntry, setSelectedEntry] = useState<CulturalEntry | null>(null);
  const [activeTab, setActiveTab] = useState<CultureType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [selectedCountry, setSelectedCountry] = useState('All Countries');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  
  const { entries, currentYear } = useHeritage();

  // Extract unique regions and countries for filters
  const regions = useMemo(() => {
    const all = entries.map(e => e.metadata?.region).filter(Boolean) as string[];
    return ['All Regions', ...Array.from(new Set(all))];
  }, [entries]);

  const countries = useMemo(() => {
    const all = entries
      .filter(e => selectedRegion === 'All Regions' || e.metadata?.region === selectedRegion)
      .map(e => e.location.country);
    return ['All Countries', ...Array.from(new Set(all)).sort()];
  }, [entries, selectedRegion]);

  const filteredEntries = useMemo(() => {
    return entries.filter(e => {
      // Temporal & Production Logic
      const isVisible = !e.originYear || e.originYear <= currentYear;
      if (!isVisible) return false;

      // Category Filter
      if (activeTab !== 'all' && e.type !== activeTab) return false;

      // Region Filter
      if (selectedRegion !== 'All Regions' && e.metadata?.region !== selectedRegion) return false;

      // Country Filter
      if (selectedCountry !== 'All Countries' && e.location.country !== selectedCountry) return false;

      // Status Filter
      if (selectedStatus !== 'All Status') {
        const isVerified = e.status === 'Community Verified' || e.isValidated === true || (e.validationCount && e.validationCount >= 5);
        if (selectedStatus === 'Community Verified' && !isVerified) return false;
        if (selectedStatus === 'Pending') {
          if (!user || isVerified) return false;
        }
        if (selectedStatus === 'Pending' && e.status === 'Needs Revision') return false;
      }

      // Hard gate: Public cannot see Pending even if status filter is "All Status"
      if (!user) {
        const isVerified = e.status === 'Community Verified' || e.isValidated === true || (e.validationCount && e.validationCount >= 5);
        if (!isVerified) return false;
      }

      // Search Filter
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        e.title.toLowerCase().includes(q) || 
        e.description.toLowerCase().includes(q) ||
        (e.location.country && e.location.country.toLowerCase().includes(q));
      
      return matchesSearch;
    });
  }, [entries, activeTab, searchQuery, selectedRegion, selectedCountry, selectedStatus, currentYear]);

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 8 }}>
      <Container maxWidth="lg">
        <Typography variant="h2" sx={{ fontWeight: 900, mb: 1, letterSpacing: '-1.5px' }}>
          Global <span style={{ color: '#6366f1' }}>Heritage</span> Hub
        </Typography>
        <Typography variant="h6" sx={{ color: 'text.secondary', mb: 8, fontWeight: 400 }}>
          An authoritative encyclopedia of the world's most valuable cultural assets.
        </Typography>

        {/* Advanced Discovery Controls */}
        <Paper sx={{ p: 4, borderRadius: 6, mb: 6, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
          <Stack spacing={4}>
            <Grid container spacing={3} alignItems="center">
              {/* Search Bar */}
              <Grid size={{ xs: 12, md: 8 }}>
                <TextField
                  fullWidth
                  placeholder="Search by tradition name or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Search size={20} color="#6366f1" /></InputAdornment>,
                    sx: { borderRadius: 10, bgcolor: 'rgba(255,255,255,0.03)', fontWeight: 600 }
                  }}
                />
              </Grid>

              {/* Status Select */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Select
                  fullWidth
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  sx={{ borderRadius: 10, bgcolor: 'rgba(255,255,255,0.03)', fontWeight: 600 }}
                >
                  <MenuItem value="All Status">All Records</MenuItem>
                  <MenuItem value="Community Verified">Verified</MenuItem>
                  {user && <MenuItem value="Pending">Pending</MenuItem>}
                </Select>
              </Grid>
            </Grid>

            {/* Geographical Hierarchy Filters */}
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 900, ml: 2, mb: 1, display: 'block' }}>REGION / CONTINENT</Typography>
                  <Select
                    fullWidth
                    value={selectedRegion}
                    onChange={(e) => { setSelectedRegion(e.target.value); setSelectedCountry('All Countries'); }}
                    sx={{ borderRadius: 10, bgcolor: 'rgba(255,255,255,0.03)', fontWeight: 600 }}
                  >
                    {regions.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
                  </Select>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 900, ml: 2, mb: 1, display: 'block' }}>SPECIFIC COUNTRY</Typography>
                  <Select
                    fullWidth
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    sx={{ borderRadius: 10, bgcolor: 'rgba(255,255,255,0.03)', fontWeight: 600 }}
                    disabled={countries.length <= 1}
                  >
                    {countries.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                  </Select>
                </Box>
              </Grid>
            </Grid>

            {/* Category Tabs */}
            <Box>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 900, ml: 2, mb: 1, display: 'block' }}>HERITAGE CATEGORY</Typography>
              <CategoryFilter selectedCategory={activeTab} onSelectCategory={setActiveTab} />
            </Box>
          </Stack>
        </Paper>

        <Grid container spacing={6}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Box>
              <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>
                  {filteredEntries.length} RECORDS FOUND
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Button
                    component={Link} href="/review"
                    startIcon={<Shield size={16} />}
                    variant="outlined"
                    sx={{ borderRadius: 10, px: 3, py: 1, fontWeight: 800, color: 'white', borderColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.05)' } }}
                  >
                    Help Us Verify
                  </Button>
                  {(searchQuery || selectedRegion !== 'All Regions' || selectedCountry !== 'All Countries' || selectedStatus !== 'All Status' || activeTab !== 'all') && (
                    <Chip label="CLEAR FILTERS" size="small" onClick={() => { setSearchQuery(''); setSelectedRegion('All Regions'); setSelectedCountry('All Countries'); setSelectedStatus('All Status'); setActiveTab('all'); }} sx={{ fontWeight: 900, bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }} />
                  )}
                </Stack>
              </Box>
              {filteredEntries.map((entry) => (
                <Box key={entry.id} onClick={() => setSelectedEntry(entry)} sx={{ cursor: 'pointer' }}>
                  <CultureCard entry={entry} />
                </Box>
              ))}
              {filteredEntries.length === 0 && (
                <Box sx={{ p: 8, textAlign: 'center', bgcolor: 'rgba(255,255,255,0.01)', borderRadius: 8, border: '1px dashed rgba(255,255,255,0.1)' }}>
                  <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.3)', fontWeight: 400 }}>No heritage records match your current search and filters.</Typography>
                </Box>
              )}
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <PulsePanel />
          </Grid>
        </Grid>
      </Container>
      <EntryDetail entry={selectedEntry} onClose={() => setSelectedEntry(null)} />
    </Box>
  );
}

// Minimal Paper for the layout
function Paper({ children, sx }: any) {
  return (
    <Box sx={{
      p: 2,
      bgcolor: 'background.paper',
      borderRadius: 4,
      boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
      ...sx
    }}>
      {children}
    </Box>
  );
}
