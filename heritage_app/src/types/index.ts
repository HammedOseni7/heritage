export type CultureType = 'story' | 'game' | 'medicine' | 'cuisine' | 'craft' | 'festival';

export interface Location {
    lat: number;
    lng: number;
    city: string;
    country: string;
    year?: number; // The year this tradition arrived at this specific location
}

export interface Comment {
    id: string;
    authorName: string;
    authorAvatar: string;
    text: string;
    createdAt: string;
}

export interface CulturalEntry {
    id: string;
    title: string;
    description: string;
    content: string;
    type: CultureType;
    author: {
        name: string;
        avatar: string;
        badges: string[];
    };
    location: Location;
    createdAt: string;
    validationCount: number;
    invalidationCount: number;
    images?: string[];
    audioUrl?: string;
    videoUrl?: string;
    isElderVerified?: boolean;
    isValidated?: boolean;
    status?: 'Pending' | 'Community Verified' | 'Needs Revision';
    comments?: Comment[];
    has3DModel?: boolean;
    modelUrl?: string;
    originYear?: number;
    migrationPath?: Location[]; // Paths showing how the tradition moved
    metadata?: {
        tribe?: string;
        language?: string;
        theme?: string;
        region?: string;
    };
}

export interface UserProfile {
    id: string;
    email: string;
    username: string;
    firstName?: string;
    lastName?: string;
    avatar: string;
    bio?: string;
    points: number;
    badgeLevel: 'Newcomer' | 'Cultural Spotter' | 'Heritage Keeper' | 'Legacy Guardian';
    contributions: string[]; // IDs of entries
    tribe?: string;
    language?: string;
    region?: string;
    country?: string;
}

export interface ValidationVote {
    id: string;
    entryId: string;
    reviewerId: string;
    familiarityScore: number; // 1-5 scale
    accuracyRating: boolean;
    completenessRating: boolean;
    respectfulRating: boolean;
    feedback?: string;
    calculatedWeight: number; // Penalty applied (e.g., 0.5 or 1.0)
    createdAt: string;
}
export interface HeritageNotification {
    id: string;
    entryId: string;
    title: string;
    message: string;
    type: 'pending_verification' | 'system' | 'achievement';
    isRead: boolean;
    createdAt: string;
}
