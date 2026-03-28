'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, Button, Stack, Avatar } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

interface MancalaSimProps {
    onComplete: () => void;
}

export default function MancalaSim({ onComplete }: MancalaSimProps) {
    // 6 pits on each side, + 2 stores. Index 6 is player 1 store, index 13 is player 2 store.
    const [board, setBoard] = useState([4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 0]);
    const [turn, setTurn] = useState<1 | 2>(1);
    const [message, setMessage] = useState("Your turn! Player 1.");

    const playMove = (index: number) => {
        if (turn === 1 && (index < 0 || index > 5)) return;
        if (turn === 2 && (index < 7 || index > 12)) return;
        if (board[index] === 0) return;

        let newBoard = [...board];
        let seeds = newBoard[index];
        newBoard[index] = 0;

        let currentPos = index;
        while (seeds > 0) {
            currentPos = (currentPos + 1) % 14;
            // Skip opponent's store
            if ((turn === 1 && currentPos === 13) || (turn === 2 && currentPos === 6)) continue;

            newBoard[currentPos]++;
            seeds--;
        }

        // Check for extra turn
        const extraTurn = (turn === 1 && currentPos === 6) || (turn === 2 && currentPos === 13);

        setBoard(newBoard);

        // Simple game end check
        const side1Empty = newBoard.slice(0, 6).every(s => s === 0);
        const side2Empty = newBoard.slice(7, 13).every(s => s === 0);

        if (side1Empty || side2Empty) {
            onComplete();
            return;
        }

        if (!extraTurn) {
            setTurn(turn === 1 ? 2 : 1);
            setMessage(turn === 1 ? "Guardian's turn (AI)..." : "Your turn! Player 1.");
        } else {
            setMessage("Extra turn! Landed in store.");
        }
    };

    // Very simple AI move
    useEffect(() => {
        if (turn === 2) {
            const timer = setTimeout(() => {
                const availableMoves = [7, 8, 9, 10, 11, 12].filter(i => board[i] > 0);
                if (availableMoves.length > 0) {
                    playMove(availableMoves[Math.floor(Math.random() * availableMoves.length)]);
                }
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [turn]);

    return (
        <Box sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h5" sx={{ color: 'white', fontWeight: 800, mb: 1 }}>{message}</Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                    Capture the most seeds in your store (large pit on the right).
                </Typography>
            </Box>

            <Paper sx={{
                p: 4, borderRadius: 8,
                bgcolor: 'rgba(255,255,255,0.03)',
                border: '2px solid rgba(255,255,255,0.1)',
                width: '100%', maxWidth: 700
            }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    {/* Player 2 Store */}
                    <Box sx={{
                        width: 80, height: 200, borderRadius: 10,
                        bgcolor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)',
                        display: 'flex', flexWrap: 'wrap', p: 1, alignContent: 'center', justifyContent: 'center', gap: 0.5
                    }}>
                        {Array.from({ length: board[13] }).map((_, i) => (
                            <Box key={i} sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#f9a8d4' }} />
                        ))}
                    </Box>

                    <Box sx={{ flex: 1 }}>
                        {/* Side 2 (Top) */}
                        <Box sx={{ display: 'flex', gap: 2, mb: 4, justifyContent: 'space-between' }}>
                            {[12, 11, 10, 9, 8, 7].map(i => (
                                <Box key={i} sx={{ width: '15%' }}>
                                    <Box sx={{
                                        aspectRatio: '1/1', borderRadius: '50%',
                                        bgcolor: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)',
                                        display: 'flex', flexWrap: 'wrap', p: 1, alignItems: 'center', justifyContent: 'center', gap: 0.5,
                                        opacity: turn === 2 ? 1 : 0.6
                                    }}>
                                        {Array.from({ length: board[i] }).map((_, seedIdx) => (
                                            <Box key={seedIdx} sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#f9a8d4' }} />
                                        ))}
                                    </Box>
                                </Box>
                            ))}
                        </Box>

                        {/* Side 1 (Bottom) */}
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
                            {[0, 1, 2, 3, 4, 5].map(i => (
                                <Box key={i} sx={{ width: '15%' }}>
                                    <Box
                                        onClick={() => playMove(i)}
                                        sx={{
                                            aspectRatio: '1/1', borderRadius: '50%',
                                            bgcolor: turn === 1 && board[i] > 0 ? 'rgba(99, 102, 241, 0.2)' : 'rgba(0,0,0,0.2)',
                                            border: turn === 1 && board[i] > 0 ? '2px solid #818cf8' : '1px solid rgba(255,255,255,0.1)',
                                            display: 'flex', flexWrap: 'wrap', p: 1, alignItems: 'center', justifyContent: 'center', gap: 0.5,
                                            cursor: turn === 1 && board[i] > 0 ? 'pointer' : 'default',
                                            transition: 'all 0.2s',
                                            '&:hover': turn === 1 && board[i] > 0 ? { transform: 'scale(1.1)', bgcolor: 'rgba(99, 102, 241, 0.3)' } : {}
                                        }}
                                    >
                                        {Array.from({ length: board[i] }).map((_, seedIdx) => (
                                            <Box key={seedIdx} sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#818cf8' }} />
                                        ))}
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </Box>

                    {/* Player 1 Store */}
                    <Box sx={{
                        width: 80, height: 200, borderRadius: 10,
                        bgcolor: 'rgba(99, 102, 241, 0.1)', border: '1px solid #818cf8',
                        display: 'flex', flexWrap: 'wrap', p: 1, alignContent: 'center', justifyContent: 'center', gap: 0.5
                    }}>
                        {Array.from({ length: board[6] }).map((_, i) => (
                            <Box key={i} sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#818cf8' }} />
                        ))}
                    </Box>
                </Box>
            </Paper>

            <Box sx={{ mt: 6, display: 'flex', gap: 8 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: 'rgba(99, 102, 241, 0.2)', color: '#818cf8' }}>Y</Avatar>
                    <Box>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>PLAYER 1 (YOU)</Typography>
                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 800 }}>{board[6]} Seeds</Typography>
                    </Box>
                </Stack>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>GUARDIAN AI</Typography>
                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 800 }}>{board[13]} Seeds</Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: 'rgba(249, 168, 212, 0.2)', color: '#f9a8d4' }}>G</Avatar>
                </Stack>
            </Box>
        </Box>
    );
}
