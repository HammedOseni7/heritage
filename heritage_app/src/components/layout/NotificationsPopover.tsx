'use client';

import React from 'react';
import { 
    Popover, 
    Typography, 
    Box, 
    List, 
    ListItem, 
    ListItemText, 
    Button, 
    Stack, 
    Divider, 
    IconButton,
    Chip,
    Avatar
} from '@mui/material';
import { CheckCircle2, XCircle, Bell, History } from 'lucide-react';
import { useNotifications } from '@/theme/NotificationContext';
import { useHeritage } from '@/theme/HeritageContext';

interface NotificationsPopoverProps {
    anchorEl: HTMLElement | null;
    onClose: () => void;
}

export default function NotificationsPopover({ anchorEl, onClose }: NotificationsPopoverProps) {
    const { notifications, dismissNotification, markAsRead } = useNotifications();
    const { validateEntry } = useHeritage();
    const open = Boolean(anchorEl);

    const handleVerify = (notificationId: string, entryId: string) => {
        validateEntry(entryId);
        dismissNotification(notificationId);
    };

    const handleDismiss = (notificationId: string) => {
        dismissNotification(notificationId);
    };

    return (
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            PaperProps={{
                sx: {
                    width: 380,
                    maxHeight: 500,
                    borderRadius: 4,
                    mt: 1.5,
                    bgcolor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(0,0,0,0.05)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                }
            }}
        >
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Bell size={18} /> Notifications
                </Typography>
                <Chip 
                    label={`${notifications.length} New`} 
                    size="small" 
                    sx={{ bgcolor: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', fontWeight: 800, fontSize: '0.7rem' }} 
                />
            </Box>
            <Divider sx={{ opacity: 0.1 }} />

            {notifications.length === 0 ? (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                    <History size={48} color="rgba(0,0,0,0.1)" strokeWidth={1} style={{ marginBottom: 16 }} />
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                        All caught up! No pending heritages for now.
                    </Typography>
                </Box>
            ) : (
                <List sx={{ p: 0 }}>
                    {notifications.map((notification) => (
                        <ListItem 
                            key={notification.id} 
                            divider 
                            sx={{ 
                                flexDirection: 'column', 
                                alignItems: 'stretch', 
                                p: 2.5,
                                '&:hover': { bgcolor: 'rgba(0,0,0,0.01)' }
                            }}
                        >
                            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                <Avatar sx={{ bgcolor: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' }}>
                                    <History size={20} />
                                </Avatar>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 800, lineHeight: 1.3 }}>
                                        {notification.title}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.85rem', mt: 0.5 }}>
                                        {notification.message}
                                    </Typography>
                                </Box>
                            </Box>
                            
                            <Stack direction="row" spacing={1}>
                                <Button 
                                    fullWidth
                                    variant="contained" 
                                    size="small" 
                                    startIcon={<CheckCircle2 size={14} />}
                                    onClick={() => handleVerify(notification.id, notification.entryId)}
                                    sx={{ 
                                        borderRadius: 2, 
                                        bgcolor: '#10b981', 
                                        fontWeight: 800,
                                        fontSize: '0.75rem',
                                        '&:hover': { bgcolor: '#059669' }
                                    }}
                                >
                                    Verify
                                </Button>
                                <Button 
                                    fullWidth
                                    variant="outlined" 
                                    size="small" 
                                    startIcon={<XCircle size={14} />}
                                    onClick={() => handleDismiss(notification.id)}
                                    sx={{ 
                                        borderRadius: 2, 
                                        color: 'text.secondary', 
                                        borderColor: 'rgba(0,0,0,0.1)',
                                        fontWeight: 800,
                                        fontSize: '0.75rem',
                                        '&:hover': { bgcolor: 'rgba(0,0,0,0.05)', borderColor: 'rgba(0,0,0,0.2)' }
                                    }}
                                >
                                    Don't Know
                                </Button>
                            </Stack>
                        </ListItem>
                    ))}
                </List>
            )}
        </Popover>
    );
}
