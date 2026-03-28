'use client';

import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stage, MeshDistortMaterial, Float, MeshWobbleMaterial, ContactShadows, Environment, Center } from '@react-three/drei';
import { Box, Typography, IconButton, Paper, CircularProgress, Modal } from '@mui/material';
import { X, RotateCcw, ZoomIn } from 'lucide-react';

function ArtifactMesh() {
    const meshRef = useRef<any>(null);

    // Subtle idle animation
    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.005;
        }
    });

    return (
        <Center top>
            <mesh ref={meshRef}>
                {/* We use a complex geometry to represent a "Relic" */}
                <torusKnotGeometry args={[1, 0.3, 128, 16]} />
                <MeshDistortMaterial
                    color="#818cf8"
                    speed={2}
                    distort={0.3}
                    radius={1}
                    metalness={0.8}
                    roughness={0.2}
                />
            </mesh>
        </Center>
    );
}

interface ArtifactViewerProps {
    open: boolean;
    onClose: () => void;
    title: string;
}

export default function ArtifactViewer({ open, onClose, title }: ArtifactViewerProps) {
    return (
        <Modal
            open={open}
            onClose={onClose}
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2
            }}
        >
            <Paper
                sx={{
                    width: '90vw',
                    height: '80vh',
                    maxWidth: 1000,
                    bgcolor: 'rgba(15, 23, 42, 0.9)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 8,
                    overflow: 'hidden',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                {/* Header */}
                <Box sx={{ p: 3, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 900, color: 'white' }}>
                            3D ARTIFACT INSPECTOR
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
                            {title}
                        </Typography>
                    </Box>
                    <IconButton onClick={onClose} sx={{ color: 'rgba(255,255,255,0.6)', '&:hover': { color: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}>
                        <X />
                    </IconButton>
                </Box>

                {/* 3D Canvas */}
                <Box sx={{ flex: 1, position: 'relative', cursor: 'grab', '&:active': { cursor: 'grabbing' } }}>
                    <Suspense fallback={
                        <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <CircularProgress sx={{ color: '#818cf8' }} />
                        </Box>
                    }>
                        <Canvas shadows camera={{ position: [0, 0, 4], fov: 45 }}>
                            <ambientLight intensity={0.5} />
                            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} shadow-mapSize={[512, 512]} castShadow />

                            <Float speed={2} rotationIntensity={1} floatIntensity={1}>
                                <ArtifactMesh />
                            </Float>

                            <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={10} blur={2} far={4.5} />

                            <Environment preset="city" />
                            <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 1.75} />
                        </Canvas>
                    </Suspense>

                    {/* Controls Overlay */}
                    <Box sx={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 2 }}>
                        <Paper sx={{ px: 2, py: 1, borderRadius: 10, bgcolor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 800 }}>DRAG TO ROTATE  •  SCROLL TO ZOOM</Typography>
                        </Paper>
                    </Box>
                </Box>
            </Paper>
        </Modal>
    );
}
