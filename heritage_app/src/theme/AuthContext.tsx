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
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { optimizeImage } from '@/lib/imageOptimization';

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
    updateProfileData: (updates: Partial<UserProfile>, fFile?: File | null) => Promise<void>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const toUserProfile = (firebaseUser: FirebaseUser, extra?: Partial<UserProfile>): UserProfile => ({
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
                    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
                    if (userDoc.exists()) {
                        const extra = userDoc.data() as Partial<UserProfile>;
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

        // Fetch Firestore data in background to fill in bio/region
        getDoc(doc(db, 'users', result.user.uid)).then(userDoc => {
            if (userDoc.exists()) {
                const extra = userDoc.data() as Partial<UserProfile>;
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
            const optimizedFile = await optimizeImage(avatarFile);
            const formData = new FormData();
            formData.append('image', optimizedFile);
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

    const updateProfileData = async (updates: Partial<UserProfile>, avatarFile?: File | null) => {
        if (!auth.currentUser || !user) return;
        
        let avatarUrl = user.avatar;
        
        if (avatarFile) {
            const optimizedFile = await optimizeImage(avatarFile);
            const formData = new FormData();
            formData.append('image', optimizedFile);
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
                console.error('Imgbb upload failed for update:', error);
            }
        }

        const newAvatarUrl = avatarUrl !== user.avatar ? avatarUrl : undefined;
        if (newAvatarUrl || updates.username) {
            await updateProfile(auth.currentUser, {
                ...(updates.username && { displayName: updates.username }),
                ...(newAvatarUrl && { photoURL: newAvatarUrl }),
            });
        }

        const updatedUser = { ...user, ...updates, ...(newAvatarUrl && { avatar: newAvatarUrl }) };

        await setDoc(doc(db, 'users', updatedUser.id), updatedUser, { merge: true });
        setUser(updatedUser);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, updateProfileData, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
