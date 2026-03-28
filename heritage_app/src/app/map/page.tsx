'use client';

import React, { useState } from 'react';
import { Box } from '@mui/material';
import CulturalMap from '@/components/map/CulturalMap';
import EntryDetail from '@/components/feed/EntryDetail';
import PulsePanel from '@/components/layout/PulsePanel';
import { useSimulation } from '@/theme/SimulationContext';
import { CulturalEntry } from '@/types';

export default function MapPage() {
    const [selectedEntry, setSelectedEntry] = useState<CulturalEntry | null>(null);
    const { entries } = useSimulation();
    const verifiedEntries = entries.filter(e => e.status === 'Community Verified');

    return (
        <Box sx={{ height: 'calc(100vh - 72px)', width: '100%', position: 'relative', overflow: 'hidden', bgcolor: '#0f172a' }}>
            <CulturalMap
                entries={verifiedEntries}
                onEntryClick={(entry) => setSelectedEntry(entry)}
            />

            <PulsePanel />

            <EntryDetail entry={selectedEntry} onClose={() => setSelectedEntry(null)} />
        </Box>
    );
}
