'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { HeritageNotification, CulturalEntry } from '@/types';
import { useHeritage } from '@/theme/HeritageContext';
import { useAuth } from '@/theme/AuthContext';

interface NotificationContextType {
    notifications: HeritageNotification[];
    unreadCount: number;
    markAsRead: (id: string) => void;
    dismissNotification: (id: string) => void;
    clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { entries } = useHeritage();
    const { user } = useAuth();
    
    // In a real app, these would be persisted in Firestore
    const [readIds, setReadIds] = useState<Set<string>>(new Set());
    const [dismissedEntryIds, setDismissedEntryIds] = useState<Set<string>>(new Set());

    const notifications = useMemo(() => {
        if (!user) return [];

        // Generate dynamic notifications from pending entries
        const pendingNotifications: HeritageNotification[] = entries
            .filter(entry => 
                entry.status === 'Pending' && 
                !dismissedEntryIds.has(entry.id) &&
                entry.author.name !== user.username // Don't notify user of their own pending posts
            )
            .map(entry => ({
                id: `notify-${entry.id}`,
                entryId: entry.id,
                title: 'New Heritage Pending',
                message: `"${entry.title}" needs your community verification.`,
                type: 'pending_verification',
                isRead: readIds.has(`notify-${entry.id}`),
                createdAt: entry.createdAt
            }));

        return pendingNotifications.sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }, [entries, user, readIds, dismissedEntryIds]);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const markAsRead = (id: string) => {
        setReadIds(prev => new Set(prev).add(id));
    };

    const dismissNotification = (id: string) => {
        // Extract the original entry ID from our formatted notification ID
        const entryId = id.replace('notify-', '');
        setDismissedEntryIds(prev => new Set(prev).add(entryId));
    };

    const clearAll = () => {
        const allIds = notifications.map(n => n.entryId);
        setDismissedEntryIds(prev => {
            const next = new Set(prev);
            allIds.forEach(id => next.add(id));
            return next;
        });
    };

    return (
        <NotificationContext.Provider value={{ 
            notifications, 
            unreadCount, 
            markAsRead, 
            dismissNotification,
            clearAll 
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) throw new Error('useNotifications must be used within a NotificationProvider');
    return context;
};
