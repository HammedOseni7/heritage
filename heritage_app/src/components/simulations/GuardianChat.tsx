'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, TextField, IconButton, Stack, Avatar, Paper, CircularProgress } from '@mui/material';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { CulturalEntry } from '@/types';

interface Message {
    role: 'bot' | 'user';
    text: string;
}

export default function GuardianChat({ entry }: { entry: CulturalEntry }) {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'bot', text: `Greetings, explorer. I am a Guardian of the ${entry.title}. What would you like to know about our traditions?` }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setIsLoading(true);

        try {
            const res = await fetch(`/api/ai?q=${encodeURIComponent(userMsg)}&persona=${encodeURIComponent(entry.title)}`);
            const data = await res.json();

            // Format the response to be more "Elder-like"
            const elderResponse = `As we say in our community, ${data.answer}`;

            setMessages(prev => [...prev, { role: 'bot', text: elderResponse }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'bot', text: "Forgive me, my young friend, but my connection to the ancestors is weak right now. Ask me again shortly." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'rgba(0,0,0,0.2)' }}>
            <Box ref={scrollRef} sx={{ flex: 1, p: 4, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 3 }}>
                {messages.map((msg, i) => (
                    <Box key={i} sx={{
                        display: 'flex',
                        gap: 2,
                        flexDirection: msg.role === 'bot' ? 'row' : 'row-reverse',
                        alignSelf: msg.role === 'bot' ? 'flex-start' : 'flex-end',
                        maxWidth: '80%'
                    }}>
                        <Avatar sx={{
                            bgcolor: msg.role === 'bot' ? 'primary.main' : 'rgba(255,255,255,0.1)',
                            width: 36, height: 36
                        }}>
                            {msg.role === 'bot' ? <Bot size={20} /> : <User size={20} />}
                        </Avatar>
                        <Paper sx={{
                            p: 2,
                            borderRadius: 4,
                            borderTopLeftRadius: msg.role === 'bot' ? 0 : 4,
                            borderTopRightRadius: msg.role === 'user' ? 0 : 4,
                            bgcolor: msg.role === 'bot' ? 'rgba(255,255,255,0.05)' : 'primary.main',
                            border: '1px solid rgba(255,255,255,0.08)'
                        }}>
                            <Typography variant="body2" sx={{ color: 'white', lineHeight: 1.6 }}>
                                {msg.text}
                            </Typography>
                        </Paper>
                    </Box>
                ))}
                {isLoading && (
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', ml: 7 }}>
                        <CircularProgress size={16} sx={{ color: 'rgba(255,255,255,0.3)' }} />
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>
                            Guardian is thinking...
                        </Typography>
                    </Box>
                )}
            </Box>

            <Box sx={{ p: 3, bgcolor: 'rgba(15, 23, 42, 0.5)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <Box sx={{ position: 'relative' }}>
                    <TextField
                        fullWidth
                        placeholder="Ask the Heritage Guardian..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 4,
                                bgcolor: 'rgba(0,0,0,0.3)',
                                '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' }
                            },
                            '& input': { color: 'white' }
                        }}
                    />
                    <IconButton
                        onClick={handleSend}
                        sx={{
                            position: 'absolute', right: 8, top: 8,
                            bgcolor: 'primary.main', color: 'white',
                            '&:hover': { bgcolor: 'primary.dark' }
                        }}
                    >
                        <Send size={18} />
                    </IconButton>
                </Box>
                <Stack direction="row" spacing={1} sx={{ mt: 1.5, justifyContent: 'center' }}>
                    <Sparkles size={12} color="#818cf8" />
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>
                        Powered by Heritage AI • Community Roleplay Mode
                    </Typography>
                </Stack>
            </Box>
        </Box>
    );
}
