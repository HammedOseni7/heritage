'use client';

import React, { useState } from 'react';
import { Container, Typography, Box, Tabs, Tab, Paper, Stack, Divider } from '@mui/material';
import { Shield, Scale, Gavel, Lock, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`legal-tabpanel-${index}`}
            aria-labelledby={`legal-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: { xs: 2, md: 4 } }}>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {children}
                    </motion.div>
                </Box>
            )}
        </div>
    );
}

export default function LegalPage() {
    const [value, setValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ bgcolor: '#020617', color: 'white', minHeight: '100vh', pb: 12 }}>
            {/* Header */}
            <Box sx={{ pt: 16, pb: 4, textAlign: 'center' }}>
                <Container maxWidth="md">
                    <Typography variant="h3" sx={{ fontWeight: 900, mb: 2 }}>
                        Legal & <span style={{ color: '#6366f1' }}>Ethical</span> Framework
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.5)', maxWidth: 600, mx: 'auto' }}>
                        Our commitment to cultural integrity, user privacy, and ethical documentation.
                    </Typography>
                </Container>
            </Box>

            <Container maxWidth="lg">
                <Paper sx={{ 
                    bgcolor: 'rgba(255,255,255,0.02)', 
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: 4,
                    overflow: 'hidden'
                }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'rgba(255,255,255,0.05)', bgcolor: 'rgba(255,255,255,0.01)' }}>
                        <Tabs 
                            value={value} 
                            onChange={handleChange} 
                            variant="scrollable"
                            scrollButtons="auto"
                            sx={{
                                '& .MuiTab-root': { color: 'rgba(255,255,255,0.4)', fontWeight: 700, py: 3 },
                                '& .Mui-selected': { color: '#6366f1 !important' },
                                '& .MuiTabs-indicator': { bgcolor: '#6366f1', height: 3 }
                            }}
                        >
                            <Tab icon={<Scale size={18} />} iconPosition="start" label="Privacy Policy" />
                            <Tab icon={<Gavel size={18} />} iconPosition="start" label="Terms of Service" />
                            <Tab icon={<Shield size={18} />} iconPosition="start" label="Ethical Guidelines" />
                            <Tab icon={<Info size={18} />} iconPosition="start" label="Data Rights" />
                        </Tabs>
                    </Box>

                    <CustomTabPanel value={value} index={0}>
                        <Typography variant="h5" sx={{ fontWeight: 900, mb: 4 }}>Privacy Policy</Typography>
                        <Stack spacing={4} sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}>
                            <Box>
                                <Typography variant="h6" sx={{ color: 'white', fontWeight: 800, mb: 2 }}>1. Information We Collect</Typography>
                                <Typography variant="body1">
                                    We collect information you provide directly to us when you create an account, submit heritage entries, or communicate with us. This includes your username, email address, and any cultural content you share.
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="h6" sx={{ color: 'white', fontWeight: 800, mb: 2 }}>2. How We Use Data</Typography>
                                <Typography variant="body1">
                                    Your data is used to maintain the Heritage Hub platform, verify the authenticity of submissions through our community consensus system, and provide a personalized experience.
                                </Typography>
                            </Box>
                        </Stack>
                    </CustomTabPanel>

                    <CustomTabPanel value={value} index={1}>
                        <Typography variant="h5" sx={{ fontWeight: 900, mb: 4 }}>Terms of Service</Typography>
                        <Stack spacing={4} sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}>
                            <Box>
                                <Typography variant="h6" sx={{ color: 'white', fontWeight: 800, mb: 2 }}>1. Content Ownership</Typography>
                                <Typography variant="body1">
                                    By submitting content to Heritage Hub, you grant us a non-exclusive, worldwide, royalty-free license to use, store, and display that content for the purpose of cultural preservation.
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="h6" sx={{ color: 'white', fontWeight: 800, mb: 2 }}>2. Prohibited Conduct</Typography>
                                <Typography variant="body1">
                                    Users are prohibited from submitting false information, hateful content, or materials that violate the intellectual or cultural property rights of others.
                                </Typography>
                            </Box>
                        </Stack>
                    </CustomTabPanel>

                    <CustomTabPanel value={value} index={2}>
                        <Typography variant="h5" sx={{ fontWeight: 900, mb: 4 }}>Ethical Guidelines</Typography>
                        <Stack spacing={4} sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}>
                            <Box>
                                <Typography variant="h6" sx={{ color: 'white', fontWeight: 800, mb: 2 }}>Cultural Sensitivity</Typography>
                                <Typography variant="body1">
                                    Heritage Hub operates on a principle of deep respect for the communities we document. We avoid the commodification of sacred knowledge and prioritize community-led representation.
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="h6" sx={{ color: 'white', fontWeight: 800, mb: 2 }}>Authenticity Over Popularity</Typography>
                                <Typography variant="body1">
                                    Our validation system prioritizes historical and cultural accuracy over engagement metrics. Contributions are reviewed by community "Guardians" with demonstrated expertise.
                                </Typography>
                            </Box>
                        </Stack>
                    </CustomTabPanel>

                    <CustomTabPanel value={value} index={3}>
                        <Typography variant="h5" sx={{ fontWeight: 900, mb: 4 }}>Data Rights</Typography>
                        <Stack spacing={4} sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}>
                            <Box>
                                <Typography variant="h6" sx={{ color: 'white', fontWeight: 800, mb: 2 }}>Right to Erasure</Typography>
                                <Typography variant="body1">
                                    You have the right to request the deletion of your personal account and associated metadata at any time.
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="h6" sx={{ color: 'white', fontWeight: 800, mb: 2 }}>Open Access</Typography>
                                <Typography variant="body1">
                                    Verified cultural heritage data is intended to be an open resource for humanity, while respecting specific community restrictions on sensitive knowledge.
                                </Typography>
                            </Box>
                        </Stack>
                    </CustomTabPanel>
                </Paper>
            </Container>
        </Box>
    );
}
