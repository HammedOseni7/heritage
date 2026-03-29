'use client';

import { useHeritage } from '@/theme/HeritageContext';
import { useAuth } from '@/theme/AuthContext';
import { calculateVoteWeight } from '@/lib/consensus';
import { Typography, Container, Card, CardContent, Button, Box, Slider, Checkbox, FormControlLabel, TextField, Divider, Alert } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ReviewDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const entryId = params?.id as string;
    const { entries, submitValidationVote } = useHeritage();
    const { user } = useAuth();
    const entry = entries.find(e => e.id === entryId);

    // Vote State
    const [familiarity, setFamiliarity] = useState<number>(3);
    const [accuracy, setAccuracy] = useState(false);
    const [completeness, setCompleteness] = useState(false);
    const [respectful, setRespectful] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [submitted, setSubmitted] = useState(false);

    if (!entry) return <Typography>Entry not found.</Typography>;

    const allChecked = accuracy && completeness && respectful;
    const needsFeedback = !allChecked;

    const handleSubmit = () => {
        if (needsFeedback && !feedback.trim()) {
            alert('Feedback is required when marking criteria as unmet.');
            return;
        }

        // Simulate creating the vote
        // Note: For anti-collusion simulation, we assume no social connection 
        // to simplify the mock UI demo.
        const voteWeight = calculateVoteWeight(familiarity, false);
        
        console.log({
            reviewerId: user?.id || 'anonymous',
            familiarityScore: familiarity,
            accuracyRating: accuracy,
            completenessRating: completeness,
            respectfulRating: respectful,
            feedback,
            calculatedWeight: voteWeight
        });

        // Register the vote and update the global SimulationContext
        submitValidationVote(entry.id, voteWeight);

        setSubmitted(true);
        setTimeout(() => router.push('/review'), 2000);
    };

    return (
        <Container maxWidth="md" sx={{ py: 6 }}>
            {submitted && <Alert severity="success" sx={{ mb: 3 }}>Vote submitted successfully! Calculating consensus...</Alert>}
            
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Review Submission
            </Typography>
            <Card variant="outlined" sx={{ mb: 4, borderRadius: 3 }}>
                <CardContent>
                    <Typography variant="h5" fontWeight="bold">{entry.title}</Typography>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Submitted by: {entry.author.name}
                    </Typography>
                    <Typography variant="body1" paragraph mt={2}>
                        {entry.description}
                    </Typography>
                    <Typography variant="body2" sx={{ fontStyle: 'italic', bgcolor: 'grey.50', p: 2, borderRadius: 1 }}>
                        {entry.content}
                    </Typography>
                </CardContent>
            </Card>

            <Typography variant="h5" fontWeight="bold" gutterBottom>
                Validator Self-Assessment
            </Typography>
            <Card variant="outlined" sx={{ mb: 4, borderRadius: 3, p: 2 }}>
                <Typography gutterBottom>How familiar are you with this specific tradition or topic?</Typography>
                <Slider
                    value={familiarity}
                    onChange={(e, val) => setFamiliarity(val as number)}
                    step={1}
                    marks={[
                        { value: 1, label: 'Not Familiar' },
                        { value: 3, label: 'Somewhat' },
                        { value: 5, label: 'Expert' }
                    ]}
                    min={1}
                    max={5}
                    valueLabelDisplay="auto"
                    color={familiarity < 3 ? 'warning' : 'primary'}
                />
            </Card>

            <Typography variant="h5" fontWeight="bold" gutterBottom>
                Evaluation Criteria
            </Typography>
            <Card variant="outlined" sx={{ mb: 4, borderRadius: 3, p: 2 }}>
                <Box display="flex" flexDirection="column" gap={1}>
                    <FormControlLabel 
                        control={<Checkbox checked={accuracy} onChange={e => setAccuracy(e.target.checked)} />} 
                        label="1. Cultural Accuracy: This entry accurately represents the tradition, facts, and history." 
                    />
                    <FormControlLabel 
                        control={<Checkbox checked={completeness} onChange={e => setCompleteness(e.target.checked)} />} 
                        label="2. Completeness: The required details and nuances are fully captured." 
                    />
                    <FormControlLabel 
                        control={<Checkbox checked={respectful} onChange={e => setRespectful(e.target.checked)} />} 
                        label="3. Respectful Representation: The content is respectful and sensitive to the community." 
                    />
                </Box>
                
                <Divider sx={{ my: 3 }} />

                <Typography gutterBottom fontWeight="bold">Feedback {needsFeedback ? '(Required for unmet criteria)' : '(Optional)'}</Typography>
                <TextField
                    multiline
                    rows={4}
                    fullWidth
                    variant="outlined"
                    placeholder="Provide constructive feedback for the author to improve their submission..."
                    value={feedback}
                    onChange={e => setFeedback(e.target.value)}
                    error={needsFeedback && !feedback.trim()}
                    helperText={needsFeedback && !feedback.trim() ? "You must provide feedback explaining what is inaccurate or incomplete." : ""}
                />
            </Card>

            <Button 
                variant="contained" 
                color="primary" 
                size="large" 
                fullWidth 
                onClick={handleSubmit} 
                disabled={submitted}
                sx={{ py: 1.5, borderRadius: 2 }}
            >
                Submit Validation Vote
            </Button>
        </Container>
    );
}
