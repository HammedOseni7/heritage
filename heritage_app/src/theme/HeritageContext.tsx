'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    collection,
    onSnapshot,
    addDoc,
    updateDoc,
    doc,
    arrayUnion,
    Timestamp,
    query,
    orderBy,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CulturalEntry } from '@/types';
import { useAuth } from '@/theme/AuthContext';
import { MOCK_ENTRIES } from '@/data/mockData';

interface HeritageContextType {
    entries: CulturalEntry[];
    addEntry: (entry: Partial<CulturalEntry>) => void;
    validateEntry: (id: string) => void;
    submitValidationVote: (entryId: string, voteWeight: number) => void;
    invalidateEntry: (id: string) => void;
    addComment: (entryId: string, text: string) => void;
    userValidationsGiven: number;
    userRewardPoints: number;
    currentYear: number;
    setCurrentYear: (year: number) => void;
}

const HeritageContext = createContext<HeritageContextType | undefined>(undefined);

const ENTRIES_COLLECTION = 'entries';

export const HeritageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [entries, setEntries] = useState<CulturalEntry[]>([]);
    const [userValidationsGiven, setUserValidationsGiven] = useState(0);
    const [userRewardPoints, setUserRewardPoints] = useState(0);
    const [currentYear, setCurrentYear] = useState<number>(2024);

    // Real-time Firestore listener
    useEffect(() => {
        const q = query(collection(db, ENTRIES_COLLECTION), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetched: CulturalEntry[] = snapshot.docs.map((d) => ({
                ...(d.data() as CulturalEntry),
                id: d.id,
            }));
            
            // Hybrid logic: Merge Firestore data with MOCK_ENTRIES
            // We prioritize Firestore data, and only add MOCK entries that don't exist by title
            const combined = [...fetched];
            MOCK_ENTRIES.forEach(mock => {
                const alreadyExists = fetched.some(f => 
                    f.title.toLowerCase() === mock.title.toLowerCase()
                );
                if (!alreadyExists) {
                    combined.push(mock);
                }
            });

            setEntries(combined);
        });
        return () => unsubscribe();
    }, []);

    const addEntry = async (entry: Partial<CulturalEntry>) => {
        const newEntry = {
            title: entry.title || 'Untitled',
            description: entry.description || '',
            content: entry.content || '',
            type: entry.type || 'story',
            author: entry.author || {
                name: user ? user.username : 'Anonymous Guardian',
                avatar: user ? user.avatar : `https://i.pravatar.cc/150?u=anon`,
                badges: ['Contributor'],
            },
            location: entry.location || {
                lat: (Math.random() * 120) - 60,
                lng: (Math.random() * 240) - 120,
                city: 'Unknown',
                country: 'Unknown',
            },
            createdAt: new Date().toISOString(),
            validationCount: 0,
            invalidationCount: 0,
            isValidated: false,
            status: 'Pending',
            images: [],
            comments: [],
            ...entry,
        };
        await addDoc(collection(db, ENTRIES_COLLECTION), newEntry);
    };


    const validateEntry = async (id: string) => {
        const entry = entries.find((e) => e.id === id);
        if (!entry) return;
        const newCount = entry.validationCount + 1;
        const isNowVerified = newCount >= 5;
        await updateDoc(doc(db, ENTRIES_COLLECTION, id), {
            validationCount: newCount,
            isValidated: isNowVerified || entry.isValidated,
            status: isNowVerified ? 'Community Verified' : entry.status,
        });
        setUserValidationsGiven((prev) => prev + 1);
    };

    const submitValidationVote = async (entryId: string, voteWeight: number) => {
        const entry = entries.find((e) => e.id === entryId);
        if (!entry) return;
        const newValidationCount = entry.validationCount + voteWeight;
        const isApproved = newValidationCount >= 5;
        await updateDoc(doc(db, ENTRIES_COLLECTION, entryId), {
            validationCount: newValidationCount,
            isValidated: isApproved || entry.isValidated,
            status: isApproved ? 'Community Verified' : entry.status,
        });
        setUserValidationsGiven((prev) => prev + 1);
        setUserRewardPoints((prev) => prev + 15);
    };

    const invalidateEntry = async (id: string) => {
        const entry = entries.find((e) => e.id === id);
        if (!entry) return;
        await updateDoc(doc(db, ENTRIES_COLLECTION, id), {
            invalidationCount: entry.invalidationCount + 1,
        });
    };

    const addComment = async (entryId: string, text: string) => {
        const newComment = {
            id: `comment-${Date.now()}`,
            authorName: user ? user.username : 'Anonymous Guardian',
            authorAvatar: user ? user.avatar : `https://i.pravatar.cc/150?u=anon`,
            text,
            createdAt: new Date().toISOString(),
        };
        await updateDoc(doc(db, ENTRIES_COLLECTION, entryId), {
            comments: arrayUnion(newComment),
        });
    };

    return (
        <HeritageContext.Provider
            value={{
                entries,
                addEntry,
                validateEntry,
                submitValidationVote,
                invalidateEntry,
                addComment,
                userValidationsGiven,
                userRewardPoints,
                currentYear,
                setCurrentYear,
            }}
        >
            {children}
        </HeritageContext.Provider>
    );
};

export const useHeritage = () => {
    const context = useContext(HeritageContext);
    if (!context) throw new Error('useHeritage must be used within a HeritageProvider');
    return context;
};
