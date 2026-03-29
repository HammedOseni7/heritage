'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Box, Paper, IconButton, Typography, TextField, Stack, Avatar, CircularProgress, Fade, Fab, InputAdornment } from '@mui/material';
import { MessageSquare, Send, X, Globe, Bot, Shield, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', text: "Welcome to the Global Heritage Archives. I am your Institutional Guardian. How can I assist you in discovering or documenting our collective memory today?", sender: 'bot', timestamp: new Date() }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: Message = { id: Date.now().toString(), text: input, sender: 'user', timestamp: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            const res = await fetch(`/api/ai?q=${encodeURIComponent(input)}`);
            const data = await res.json();
            
            const botMsg: Message = { 
                id: (Date.now() + 1).toString(), 
                text: data.answer || "I scoured the archives but experienced a spectral interference. Could you rephrase your inquiry?", 
                sender: 'bot', 
                timestamp: new Date() 
            };
            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            setMessages(prev => [...prev, { id: Date.now().toString(), text: "The historical databases are temporarily unreachable. Please try again shortly.", sender: 'bot', timestamp: new Date() }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <>
            {/* Floating Toggle Button */}
            <Box sx={{ position: 'fixed', bottom: 32, right: 32, zIndex: 1000 }}>
                <Fab 
                    onClick={() => setIsOpen(!isOpen)}
                    sx={{ 
                        bgcolor: isOpen ? '#ef4444' : '#6366f1', 
                        color: 'white', 
                        '&:hover': { bgcolor: isOpen ? '#dc2626' : '#4f46e5', transform: 'scale(1.1)' },
                        transition: '0.3s'
                    }}
                >
                    {isOpen ? <X /> : <MessageSquare />}
                </Fab>
            </Box>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <Box
                        component={motion.div}
                        initial={{ opacity: 0, y: 100, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.9 }}
                        sx={{
                            position: 'fixed',
                            bottom: 100,
                            right: 32,
                            width: { xs: 'calc(100vw - 64px)', sm: 400 },
                            height: 600,
                            zIndex: 1000,
                        }}
                    >
                        <Paper sx={{ 
                            height: '100%', 
                            display: 'flex', 
                            flexDirection: 'column',
                            borderRadius: 6,
                            overflow: 'hidden',
                            bgcolor: 'rgba(15, 23, 42, 0.9)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                        }}>
                            {/* Header */}
                            <Box sx={{ p: 3, bgcolor: '#6366f1', color: 'white' }}>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}><Shield size={20} /></Avatar>
                                    <Box>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 900, fontSize: '1rem' }}>Heritage AI</Typography>
                                        <Typography variant="caption" sx={{ opacity: 0.8, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <Globe size={10} /> Institutional Guardian Online
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Box>

                            {/* Messages Area */}
                            <Box 
                                ref={scrollRef}
                                sx={{ 
                                    flexGrow: 1, 
                                    p: 3, 
                                    overflowY: 'auto', 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    gap: 2,
                                    '&::-webkit-scrollbar': { width: 4 },
                                    '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 10 }
                                }}
                            >
                                {messages.map((msg) => (
                                    <Box 
                                        key={msg.id} 
                                        sx={{ 
                                            maxWidth: '85%', 
                                            alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start' 
                                        }}
                                    >
                                        <Paper sx={{ 
                                            p: 2, 
                                            borderRadius: msg.sender === 'user' ? '20px 20px 0 20px' : '20px 20px 20px 0',
                                            bgcolor: msg.sender === 'user' ? '#6366f1' : 'rgba(255,255,255,0.05)',
                                            color: 'white',
                                            border: msg.sender === 'user' ? 'none' : '1px solid rgba(255,255,255,0.05)'
                                        }}>
                                            <Typography variant="body2" sx={{ lineHeight: 1.6 }}>{msg.text}</Typography>
                                        </Paper>
                                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', mt: 0.5, display: 'block', textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
                                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </Typography>
                                    </Box>
                                ))}
                                {isTyping && (
                                    <Box sx={{ alignSelf: 'flex-start', bgcolor: 'rgba(255,255,255,0.05)', p: 2, borderRadius: 10 }}>
                                        <CircularProgress size={12} sx={{ color: '#6366f1' }} />
                                    </Box>
                                )}
                            </Box>

                            {/* Input Area */}
                            <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                <TextField
                                    fullWidth
                                    placeholder="Inquire about world heritage..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={handleSend} disabled={!input.trim()} sx={{ color: '#6366f1' }}>
                                                    <Send size={20} />
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                        sx: { 
                                            borderRadius: 4, 
                                            bgcolor: 'rgba(255,255,255,0.03)', 
                                            color: 'white',
                                            '& fieldset': { border: 'none' }
                                        }
                                    }}
                                />
                            </Box>
                        </Paper>
                    </Box>
                )}
            </AnimatePresence>
        </>
    );
}
