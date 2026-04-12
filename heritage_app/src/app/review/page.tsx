'use client';

import { useHeritage } from '@/theme/HeritageContext';
import { useAuth } from '@/theme/AuthContext';
import { Typography, Container, Grid, Card, CardContent, Button, Chip, Box } from '@mui/material';
import Link from 'next/link';

export default function ReviewQueuePage() {
    const { entries } = useHeritage();
    const { user } = useAuth();
    // 1. Filter only pending entries
    const pendingEntries = entries.filter(e => e.status === 'Pending');

    // Show all pending entries to authenticated users
    const matchedEntries = pendingEntries;

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Box mb={4}>
                <Typography variant="h3" fontWeight="bold" gutterBottom>
                    Community Review Queue
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Welcome back, Guardian <strong>{user?.username || 'Guardian'}</strong>. Here are the pending submissions that need your expertise.
                </Typography>
            </Box>

            {matchedEntries.length === 0 ? (
                <Typography variant="h6" color="text.secondary">
                    No pending submissions match your cultural expertise right now.
                </Typography>
            ) : (
                <Grid container spacing={3}>
                    {matchedEntries.map(entry => (
                        <Grid size={{ xs: 12, md: 6 }} key={entry.id}>
                            <Card variant="outlined" sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                                <CardContent>
                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                        <Typography variant="h6" fontWeight="bold">
                                            {entry.title}
                                        </Typography>
                                        <Chip 
                                            label={((entry.images && entry.images.length > 0) || entry.videoUrl) ? "Pending Review" : "Pending (No Image)"} 
                                            color={((entry.images && entry.images.length > 0) || entry.videoUrl) ? "warning" : "error"} 
                                            size="small" 
                                            sx={{ fontWeight: 800 }}
                                        />
                                    </Box>
                                    <Typography variant="body2" color="text.secondary" noWrap sx={{ mb: 2 }}>
                                        {entry.description}
                                    </Typography>
                                    
                                    <Box display="flex" gap={1} mb={3} flexWrap="wrap">
                                        {entry.metadata?.region && <Chip label={entry.metadata.region} size="small" variant="outlined" />}
                                        {entry.metadata?.tribe && <Chip label={entry.metadata.tribe} size="small" variant="outlined" />}
                                    </Box>

                                    <Button 
                                        component={Link} 
                                        href={`/review/${entry.id}`} 
                                        variant="contained" 
                                        color="primary" 
                                        fullWidth
                                        sx={{ textTransform: 'none', borderRadius: 2 }}
                                    >
                                        Review Submission
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
}
