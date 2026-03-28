'use client';

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { Box, Paper, Typography, CircularProgress, Stack } from '@mui/material';
import { CulturalEntry, CultureType } from '@/types';
import { useSimulation } from '@/theme/SimulationContext';

// Dynamic import to avoid SSR issues with globe.gl
const Globe = dynamic(() => import('react-globe.gl'), {
    ssr: false,
    loading: () => (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', bgcolor: '#0f172a' }}>
            <CircularProgress />
        </Box>
    )
});

interface CulturalMapProps {
    entries: CulturalEntry[];
    onEntryClick?: (entry: CulturalEntry) => void;
}

const PILLAR_ICONS: Record<CultureType, string> = {
    story: '📖',
    game: '🎮',
    medicine: '🌿',
    cuisine: '🍲',
    craft: '🏺',
    festival: '🎉'
};

const PILLAR_COLORS: Record<CultureType, string> = {
    story: '#6366f1',
    game: '#10b981',
    medicine: '#ef4444',
    cuisine: '#f59e0b',
    craft: '#ec4899',
    festival: '#8b5cf6'
};

export default function CulturalMap({ entries, onEntryClick }: CulturalMapProps) {
    const { currentYear } = useSimulation();
    const globeRef = useRef<any>(null);
    const [globeData, setGlobeData] = useState<any[]>([]);
    const [arcsData, setArcsData] = useState<any[]>([]);

    useEffect(() => {
        // Map our entries to globe points with emojis
        const points = entries
            .filter(entry => !entry.originYear || entry.originYear <= currentYear)
            .map(entry => ({
                lat: entry.location.lat,
                lng: entry.location.lng,
                size: 0.15,
                color: PILLAR_COLORS[entry.type] || '#ffffff',
                label: `${PILLAR_ICONS[entry.type] || '📍'} ${entry.title}`,
                entry: entry
            }));
        setGlobeData(points);

        // Generate arcs for migration paths
        const arcs: any[] = [];
        entries.forEach(entry => {
            if (entry.migrationPath && entry.migrationPath.length > 1) {
                // Find how many steps of migration have happened by currentYear
                const steps = entry.migrationPath.filter(p => (p.year || 0) <= currentYear);

                for (let i = 0; i < steps.length - 1; i++) {
                    const start = steps[i];
                    const end = steps[i + 1];
                    arcs.push({
                        startLat: start.lat,
                        startLng: start.lng,
                        endLat: end.lat,
                        endLng: end.lng,
                        color: PILLAR_COLORS[entry.type] || '#818cf8'
                    });
                }
            }
        });
        setArcsData(arcs);
    }, [entries, currentYear]);

    return (
        <Box sx={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
            <Globe
                ref={globeRef}
                globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
                bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
                pointsData={globeData}
                pointAltitude="size"
                pointColor="color"
                pointLabel="label"
                onPointClick={(point: any) => onEntryClick && onEntryClick(point.entry)}
                arcsData={arcsData}
                arcColor="color"
                arcDashLength={0.4}
                arcDashGap={4}
                arcDashAnimateTime={2000}
                arcStroke={0.5}
                backgroundColor="rgba(0,0,0,0)"
                width={typeof window !== 'undefined' ? window.innerWidth : 800}
                height={typeof window !== 'undefined' ? window.innerHeight - 72 : 600}
            />

            <Paper sx={{
                position: 'absolute',
                top: 20,
                left: 20,
                p: 2.5,
                borderRadius: 4,
                bgcolor: 'rgba(15, 23, 42, 0.8)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.1)',
                display: { xs: 'none', sm: 'block' },
                zIndex: 10
            }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span style={{ fontSize: '1.2rem' }}>🌍</span> Heritage Map Legend
                </Typography>
                <Grid container spacing={1.5} sx={{ maxWidth: 280 }}>
                    {(Object.keys(PILLAR_ICONS) as CultureType[]).map((type) => (
                        <Grid item xs={6} key={type}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: PILLAR_COLORS[type] }} />
                                <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                                    {PILLAR_ICONS[type]} {type.charAt(0).toUpperCase() + type.slice(1)}
                                </Typography>
                            </Stack>
                        </Grid>
                    ))}
                </Grid>
            </Paper>
        </Box>
    );
}

// Simple Grid since we are in a component that might use different versions
function Grid({ children, container, item, xs, sx }: any) {
    return (
        <Box sx={{
            display: container ? 'flex' : 'block',
            flexWrap: container ? 'wrap' : 'nowrap',
            width: item ? `${(xs / 12) * 100}%` : '100%',
            ...sx
        }}>
            {children}
        </Box>
    );
}
