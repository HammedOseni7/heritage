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

interface SimulationContextType {
    entries: CulturalEntry[];
    addRandomEntries: (count: number) => void;
    addEntry: (entry: Partial<CulturalEntry>) => void;
    validateEntry: (id: string) => void;
    submitValidationVote: (entryId: string, voteWeight: number) => void;
    invalidateEntry: (id: string) => void;
    addComment: (entryId: string, text: string) => void;
    isSimulating: boolean;
    userValidationsGiven: number;
    userRewardPoints: number;
    currentYear: number;
    setCurrentYear: (year: number) => void;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

const ENTRIES_COLLECTION = 'entries';

export const SimulationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [entries, setEntries] = useState<CulturalEntry[]>([]);
    const [isSimulating, setIsSimulating] = useState(false);
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
            setEntries(fetched);
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

    const addRandomEntries = (count: number) => {
        setIsSimulating(true);
        let currentCount = 0;

        const imageMap: Record<string, string> = {
            story: 'https://images.unsplash.com/photo-1478147427282-58a871190cf6',
            game: 'https://images.unsplash.com/photo-1611816361730-10659a850849',
            medicine: 'https://images.unsplash.com/photo-1544894079-e81a9eb1dbd3',
            cuisine: 'https://images.unsplash.com/photo-1512058564366-18510be2db19',
            craft: 'https://images.unsplash.com/photo-1605647540924-852290f6b0d5',
            festival: 'https://images.unsplash.com/photo-1520110120835-c96534a4c984',
        };

        const interval = setInterval(async () => {
            if (currentCount >= count) {
                clearInterval(interval);
                setIsSimulating(false);
                return;
            }

            const type = (['story', 'game', 'medicine', 'cuisine', 'craft', 'festival'] as const)[
                Math.floor(Math.random() * 6)
            ];

            await addDoc(collection(db, ENTRIES_COLLECTION), {
                title: `Discovered: ${['Ancient Secret', 'Lost Recipe', 'Hidden Ritual', 'Folk Song'][Math.floor(Math.random() * 4)]} #${currentCount + 1}`,
                description: 'A newly simulated heritage entry for demonstration purposes.',
                content: 'Full details are being archived...',
                type,
                author: {
                    name: `Explorer_${Math.floor(Math.random() * 100)}`,
                    avatar: `https://i.pravatar.cc/150?u=${Math.random()}`,
                    badges: ['Simulated'],
                },
                location: {
                    lat: (Math.random() * 120) - 60,
                    lng: (Math.random() * 240) - 120,
                    city: 'Simulated City',
                    country: 'Simulated Land',
                },
                createdAt: new Date().toISOString(),
                validationCount: 0,
                invalidationCount: 0,
                isValidated: false,
                images: [imageMap[type]],
                comments: [],
            });

            currentCount++;
        }, 1500);
    };

    const validateEntry = async (id: string) => {
        const entry = entries.find((e) => e.id === id);
        if (!entry) return;
        const newCount = entry.validationCount + 1;
        const isNowVerified = newCount >= 3;
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
        <SimulationContext.Provider
            value={{
                entries,
                addRandomEntries,
                addEntry,
                validateEntry,
                submitValidationVote,
                invalidateEntry,
                addComment,
                isSimulating,
                userValidationsGiven,
                userRewardPoints,
                currentYear,
                setCurrentYear,
            }}
        >
            {children}
        </SimulationContext.Provider>
    );
};

export const useSimulation = () => {
    const context = useContext(SimulationContext);
    if (!context) throw new Error('useSimulation must be used within a SimulationProvider');
    return context;
};
