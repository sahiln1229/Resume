"use client";

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import {
    BarChart3,
    Target,
    Brain,
    Zap,
    TrendingUp,
    Download,
    Sparkles
} from 'lucide-react';
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    ResponsiveContainer
} from 'recharts';
import { Navbar } from '@/components/layout/Navbar';
import PerspectiveCard from '@/components/ui/PerspectiveCard';
import Magnetic from '@/components/ui/Magnetic';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const data = [
    { subject: 'ATS Score', A: 85, fullMark: 100 },
    { subject: 'Keywords', A: 92, fullMark: 100 },
    { subject: 'Grammar', A: 78, fullMark: 100 },
    { subject: 'Structure', A: 95, fullMark: 100 },
    { subject: 'Impact', A: 82, fullMark: 100 },
];

export default function DashboardPage() {
    const containerRef = useRef(null);
    const scoreRef = useRef(null);

    useEffect(() => {
        // Simple GSAP count-up animation for score
        gsap.fromTo(scoreRef.current,
            { innerText: 0 },
            {
                innerText: 85,
                duration: 2,
                snap: { innerText: 1 },
                ease: "power2.out",
                scrollTrigger: {
                    trigger: scoreRef.current,
                    start: "top 80%",
                }
            }
        );
    }, []);

    return (
        <main ref={containerRef} className="min-h-screen pt-40 pb-20 px-6 relative overflow-hidden bg-transparent">
            <Navbar />
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-3 text-accent mb-4"
                        >
                            <Sparkles size={20} />
                            <span className="text-sm font-black uppercase tracking-[0.3em]">Neural Verification Complete</span>
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-7xl font-black text-foreground tracking-tighter"
                        >
                            CORE <span className="text-gradient">DIAGNOSTICS</span>
                        </motion.h1>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex gap-4"
                    >
                        <Magnetic>
                            <button className="h-16 px-8 rounded-2xl bg-white/5 border border-border text-foreground font-bold hover:bg-white/10 transition-all flex items-center gap-3">
                                <Download size={20} />
                                Export Protocol
                            </button>
                        </Magnetic>
                    </motion.div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="lg:col-span-2"
                >
                    <PerspectiveCard>
                        <Card className="p-10 premium-card bg-card/40 backdrop-blur-xl border-border">
                            <div className="flex items-center justify-between mb-12">
                                <h3 className="text-2xl font-black text-foreground tracking-tight">Performance Matrix</h3>
                                <div className="px-4 py-2 rounded-xl bg-accent/10 text-accent text-xs font-black uppercase tracking-widest border border-accent/20">Market Index: Elite</div>
                            </div>
                            <div className="h-[400px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                                        <PolarGrid stroke="rgba(255,255,255,0.05)" />
                                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 'bold' }} />
                                        <Radar
                                            name="Score"
                                            dataKey="A"
                                            stroke="#3B82F6"
                                            fill="#3B82F6"
                                            fillOpacity={0.4}
                                        />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </PerspectiveCard>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                >
                    <PerspectiveCard className="h-full">
                        <Card className="p-10 premium-card h-full flex flex-col items-center justify-center text-center bg-card/40 backdrop-blur-xl border-border">
                            <h3 className="text-xl font-black text-secondary uppercase tracking-[0.2em] mb-12">Composite Integrity</h3>
                            <div className="relative w-64 h-64 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="128" cy="128" r="110" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/5" />
                                    <motion.circle
                                        initial={{ strokeDashoffset: 691 }}
                                        whileInView={{ strokeDashoffset: 691 * (1 - 0.85) }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 2, ease: "easeOut" }}
                                        cx="128" cy="128" r="110" stroke="currentColor" strokeWidth="12" fill="transparent"
                                        strokeDasharray="691" className="text-accent"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span ref={scoreRef} className="text-7xl font-black text-foreground">85</span>
                                    <span className="text-sm font-black text-secondary tracking-widest">/ 100</span>
                                </div>
                            </div>
                            <p className="mt-12 text-secondary font-medium leading-relaxed">
                                Your profile exceeds <span className="text-foreground font-bold">85%</span> of Tier-1 industry performance targets.
                            </p>
                        </Card>
                    </PerspectiveCard>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    { title: "Keywords", value: "92%", icon: Target, status: "Optimal" },
                    { title: "Impact", value: "High", icon: Zap, status: "Advanced" },
                    { title: "Network", value: "Strong", icon: Brain, status: "Sync" },
                    { title: "Market", value: "Tier 1", icon: BarChart3, status: "Priority" }
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        viewport={{ once: true }}
                    >
                        <PerspectiveCard>
                            <Card className="p-8 premium-card bg-card/40 backdrop-blur-xl border-border group">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-border flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                                        <stat.icon size={24} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-secondary-accent">{stat.status}</span>
                                </div>
                                <h4 className="text-sm font-black text-secondary uppercase tracking-widest mb-1">{stat.title}</h4>
                                <div className="text-3xl font-black text-foreground">{stat.value}</div>
                            </Card>
                        </PerspectiveCard>
                    </motion.div>
                ))}
            </div>
        </main>
    );
}
