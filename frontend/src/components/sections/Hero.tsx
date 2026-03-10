"use client";

import { motion, useScroll, useTransform, Variants } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls } from '@react-three/drei';
import { FloatingResume, FloatingIcon } from '@/components/3d/HeroScene';
import { Sparkles, Brain, Zap, Target, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Magnetic from '@/components/ui/Magnetic';
import { useRef } from 'react';

const container: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.3
        }
    }
};

const item: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
};

export const Hero = () => {
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

    return (
        <section ref={targetRef} className="relative min-h-screen flex items-center pt-20 overflow-hidden">
            <motion.div
                style={{ y, opacity, scale }}
                className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10 w-full"
            >
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="text-left"
                >
                    <motion.div
                        variants={item}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent border border-accent/20 mb-8"
                    >
                        <Sparkles size={16} />
                        <span className="text-xs font-black uppercase tracking-widest">Neural Career Optimization</span>
                    </motion.div>

                    <motion.h1
                        variants={item}
                        className="text-6xl md:text-8xl font-black text-foreground mb-8 tracking-tighter leading-[0.9]"
                    >
                        UNLEASH YOUR <br />
                        <span className="text-gradient">EVOLVED</span> <br />
                        POTENTIAL
                    </motion.h1>

                    <motion.p
                        variants={item}
                        className="text-xl text-secondary max-w-lg mb-12 font-medium leading-relaxed"
                    >
                        Precision-engineered AI systems that transform your professional history into an unstoppable narrative for elite performance.
                    </motion.p>

                    <motion.div variants={item} className="flex flex-col sm:flex-row gap-6">
                        <Magnetic>
                            <Link href="/upload">
                                <Button size="lg" className="h-20 px-12 text-lg shadow-3d font-black uppercase tracking-widest group bg-accent hover:bg-accent/90">
                                    Initialize Scan
                                    <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" />
                                </Button>
                            </Link>
                        </Magnetic>
                        <Magnetic>
                            <Link href="/dashboard">
                                <Button variant="outline" size="lg" className="h-20 px-12 text-lg font-black uppercase tracking-widest border-border/40 bg-white/5 backdrop-blur-md hover:bg-white/10">
                                    Neural Portal
                                </Button>
                            </Link>
                        </Magnetic>
                    </motion.div>
                </motion.div>

                {/* 3D Visualizer Column */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, ease: "circOut" }}
                    className="relative h-[600px] lg:h-[800px] hidden lg:block"
                >
                    <div className="absolute inset-0 bg-accent/5 blur-[120px] rounded-full" />
                    <Canvas className="z-10 bg-transparent">
                        <PerspectiveCamera makeDefault position={[0, 0, 8]} />
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} intensity={3} color="#3B82F6" />
                        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={3} color="#06B6D4" />

                        <FloatingResume />

                        <FloatingIcon position={[3, 2, 0]} color="#3B82F6" icon={Brain} delay={0} label="Cognitive" />
                        <FloatingIcon position={[-3, -2, 2]} color="#06B6D4" icon={Target} delay={1} label="Precision" />
                        <FloatingIcon position={[3, -2, -2]} color="#3B82F6" icon={Zap} delay={2} label="Velocity" />

                        <OrbitControls enableZoom={false} enablePan={false} />
                    </Canvas>
                </motion.div>
            </motion.div>
        </section>
    );
};
