'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    User as FirebaseUser,
    updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export interface UserProfile {
    id: string;
    email: string;
    username: string;
    firstName?: string;
    lastName?: string;
    avatar: string;
    bio?: string;
    region?: string;
    country?: string;
    isAdmin?: boolean;
    isElderVerified?: boolean;
    bypassValidation?: boolean;
    badgeLevel?: string;
    points?: number;
    [key: string]: any; // allow any extra Firestore fields
}

interface AuthContextType {
    user: UserProfile | null;
    login: (email: string, pass: string) => Promise<void>;
    register: (
        email: string,
        pass: string,
        username: string,
        firstName: string,
        lastName: string,
        avatarFile: File | null,
        extra?: { bio?: string; region?: string; country?: string }
    ) => Promise<void>;
    logout: () => Promise<void>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const toUserProfile = (firebaseUser: FirebaseUser, extra?: Partial<UserProfile>): UserProfile => ({
    // Spread all extra Firestore fields first (includes bypassValidation, isAdmin, etc.)
    ...extra,
    id: firebaseUser.uid,
    email: firebaseUser.email || '',
    username: extra?.username || firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Guardian',
    firstName: extra?.firstName || '',
    lastName: extra?.lastName || '',
    avatar: extra?.avatar || firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.uid}`,
    bio: extra?.bio || '',
    region: extra?.region || '',
    country: extra?.country || '',
});

// Fetch user profile from Firestore — tries UID doc first, then falls back to email lookup (for seeded accounts like brolaja)
async function fetchUserExtra(uid: string, email: string): Promise<Partial<UserProfile> | null> {
    // 1. Try UID-based doc
    const uidDoc = await getDoc(doc(db, 'users', uid));
    if (uidDoc.exists()) return uidDoc.data() as Partial<UserProfile>;

    // 2. Fallback: email-based lookup (handles seeded accounts with custom IDs)
    const q = query(collection(db, 'users'), where('email', '==', email));
    const snap = await getDocs(q);
    if (!snap.empty) return snap.docs[0].data() as Partial<UserProfile>;

    return null;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // Instantly set basic profile from Auth (fast)
                const basicProfile = toUserProfile(firebaseUser);
                setUser(basicProfile);

                // Fetch extra data in the background (slower)
                try {
                    const extra = await fetchUserExtra(firebaseUser.uid, firebaseUser.email || '');
                    if (extra) {
                        setUser(toUserProfile(firebaseUser, extra));
                    }
                } catch (error: any) {
                    // Suppress "offline" errors as we already have basic profile from Auth
                    if (error?.code !== 'unavailable' && !error?.message?.includes('offline')) {
                        console.error('Error fetching user profile:', error);
                    }
                }
            } else {
                setUser(null);
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = async (email: string, pass: string) => {
        const result = await signInWithEmailAndPassword(auth, email, pass);
        
        // Optimistically set user from Firebase Auth result (instant feedback)
        const basicProfile = toUserProfile(result.user);
        setUser(basicProfile);

        // Fetch Firestore data in background to fill in bio/region/bypass flags
        fetchUserExtra(result.user.uid, email).then(extra => {
            if (extra) {
                setUser(toUserProfile(result.user, extra));
            }
        }).catch(err => {
            if (err?.code !== 'unavailable' && !err?.message?.includes('offline')) {
                console.error('Silent profile fetch failed:', err);
            }
        });
    };

    const register = async (
        email: string,
        pass: string,
        username: string,
        firstName: string,
        lastName: string,
        avatarFile: File | null,
        extra?: { bio?: string; region?: string; country?: string }
    ) => {
        const result = await createUserWithEmailAndPassword(auth, email, pass);
        const uid = result.user.uid;

        // Upload DP to Imgbb if provided
        let avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${uid}`;
        if (avatarFile) {
            const formData = new FormData();
            formData.append('image', avatarFile);
            const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
            
            try {
                const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
                    method: 'POST',
                    body: formData,
                });
                const data = await response.json();
                if (data.success) {
                    avatarUrl = data.data.url;
                }
            } catch (error) {
                console.error('Imgbb upload failed:', error);
                // Fallback to dicebear if upload fails
            }
        }

        // Update Firebase Auth display name and photo
        await updateProfile(result.user, { displayName: username, photoURL: avatarUrl });

        // Save full profile to Firestore
        const profile: UserProfile = {
            id: uid,
            email,
            username,
            firstName,
            lastName,
            avatar: avatarUrl,
            bio: extra?.bio || '',
            region: extra?.region || '',
            country: extra?.country || '',
        };
        await setDoc(doc(db, 'users', uid), profile);
        setUser(profile);
    };

    const logout = async () => {
        await signOut(auth);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
