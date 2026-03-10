"use client";

import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
import * as THREE from 'three';

export function FloatingResume() {
    const group = useRef<THREE.Group>(null);
    const sheet = useRef<THREE.Mesh>(null);
    const [userName, setUserName] = useState('JOHN DOE');

    useEffect(() => {
        const fetchName = () => {
            const authInfo = localStorage.getItem('auth_user_info');
            if (authInfo) {
                const parsed = JSON.parse(authInfo);
                if (parsed.name) setUserName(parsed.name);
            } else {
                setUserName('JOHN DOE');
            }
        };
        fetchName();
        window.addEventListener('storage', fetchName);
        return () => window.removeEventListener('storage', fetchName);
    }, []);

    useFrame((state) => {
        if (!group.current) return;
        const t = state.clock.getElapsedTime();
        group.current.rotation.y = Math.sin(t / 4) * 0.3;
        group.current.rotation.x = Math.cos(t / 4) * 0.1;
        group.current.position.y = Math.sin(t / 2) * 0.2;
    });

    return (
        <group ref={group}>
            <mesh ref={sheet} castShadow receiveShadow>
                <planeGeometry args={[4.5, 6]} />
                <meshStandardMaterial
                    color="#F8FAFC"
                    roughness={0.2}
                    metalness={0.1}
                    side={THREE.DoubleSide}
                />

                <group position={[0, 0, 0.01]}>
                    <Text
                        position={[-1.8, 2.5, 0]}
                        fontSize={0.3}
                        color="#020617"
                        anchorX="left"
                    >
                        {userName.toUpperCase()}
                    </Text>
                    <Text
                        position={[-1.8, 2, 0]}
                        fontSize={0.15}
                        color="#64748B"
                        anchorX="left"
                    >
                        SOFTWARE ENGINEER
                    </Text>

                    {[0, 1, 2, 3, 4].map((i) => (
                        <mesh key={i} position={[0, 1 - i * 0.5, 0]}>
                            <planeGeometry args={[3.6, 0.1]} />
                            <meshBasicMaterial color="#E2E8F0" />
                        </mesh>
                    ))}

                    <mesh position={[-1.2, -2.5, 0]}>
                        <planeGeometry args={[1.2, 0.6]} />
                        <meshBasicMaterial color="#2563EB" opacity={0.1} transparent />
                    </mesh>
                </group>
            </mesh>

            <mesh position={[0, 0, -0.05]}>
                <planeGeometry args={[4.5, 6]} />
                <meshBasicMaterial color="#CBD5E1" side={THREE.DoubleSide} />
            </mesh>
        </group>
    );
}

export function FloatingIcon({
    position,
    color,
    icon: Icon,
    delay = 0,
    label
}: {
    position: [number, number, number],
    color: string,
    icon?: any,
    delay?: number,
    label?: string
}) {
    const mesh = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (!mesh.current) return;
        const t = state.clock.getElapsedTime() + delay;
        mesh.current.position.y += Math.sin(t) * 0.005;
        mesh.current.rotation.y += 0.01;
    });

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={2}>
            <group position={position}>
                <mesh ref={mesh}>
                    <boxGeometry args={[0.5, 0.5, 0.5]} />
                    <meshStandardMaterial color={color} metalness={0.6} roughness={0.2} />
                </mesh>
                {label && (
                    <Text
                        position={[0, -0.6, 0]}
                        fontSize={0.15}
                        color="#64748B"
                        anchorX="center"
                    >
                        {label.toUpperCase()}
                    </Text>
                )}
            </group>
        </Float>
    );
}
