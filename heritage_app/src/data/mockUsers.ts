import { UserProfile } from '@/types';

export const MOCK_USERS: UserProfile[] = [
    {
        id: 'user_1',
        name: 'Amina Okafor',
        bio: 'Culinary historian focused on West African cuisine.',
        avatar: 'https://i.pravatar.cc/150?u=amina',
        points: 450,
        badgeLevel: 'Heritage Keeper',
        contributions: ['4'],
        tribe: 'Igbo',
        language: 'Igbo',
        region: 'West Africa'
    },
    {
        id: 'user_2',
        name: 'Folake Adeleke',
        bio: 'Passionate about Yoruba traditions and food.',
        avatar: 'https://i.pravatar.cc/150?u=folake',
        points: 120,
        badgeLevel: 'Cultural Spotter',
        contributions: ['7'],
        tribe: 'Yoruba',
        language: 'Yoruba',
        region: 'West Africa'
    }
];

// Simulate the currently logged in user for the review queue matching
export const CURRENT_USER: UserProfile = MOCK_USERS[1]; 
