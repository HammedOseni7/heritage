import React from 'react';
import { Box, Chip } from '@mui/material';
import { CultureType } from '@/types';

interface CategoryFilterProps {
    selectedCategory: CultureType | 'all';
    onSelectCategory: (category: CultureType | 'all') => void;
}

const CATEGORIES: { label: string; value: CultureType | 'all' }[] = [
    { label: 'All Heritage', value: 'all' },
    { label: 'Stories & Myths', value: 'story' },
    { label: 'Traditional Games', value: 'game' },
    { label: 'Medicine & Healing', value: 'medicine' },
    { label: 'Cuisine & Food', value: 'cuisine' },
    { label: 'Crafts & Arts', value: 'craft' },
    { label: 'Festivals & Rituals', value: 'festival' },
];

export default function CategoryFilter({ selectedCategory, onSelectCategory }: CategoryFilterProps) {
    return (
        <Box
            sx={{
                display: 'flex',
                gap: 1.5,
                overflowX: 'auto',
                pb: 2,
                mb: 3,
                '&::-webkit-scrollbar': { height: 4 },
                '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 10 }
            }}
        >
            {CATEGORIES.map((category) => (
                <Chip
                    key={category.value}
                    label={category.label}
                    onClick={() => onSelectCategory(category.value)}
                    sx={{
                        bgcolor: selectedCategory === category.value ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                        color: selectedCategory === category.value ? '#818cf8' : 'rgba(255, 255, 255, 0.6)',
                        border: '1px solid',
                        borderColor: selectedCategory === category.value ? 'rgba(99, 102, 241, 0.5)' : 'rgba(255, 255, 255, 0.1)',
                        fontWeight: selectedCategory === category.value ? 800 : 600,
                        backdropFilter: 'blur(10px)',
                        px: 1,
                        py: 2.5,
                        borderRadius: 3,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            bgcolor: selectedCategory === category.value ? 'rgba(99, 102, 241, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                        }
                    }}
                />
            ))}
        </Box>
    );
}
