"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Cpu,
    Mail,
    Lock,
    User,
    ArrowRight,
    Github,
    Chrome,
    Sparkles,
    ShieldCheck
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Navbar } from '@/components/layout/Navbar';
import Scene3D from '@/components/3d/Scene3D';
import Magnetic from '@/components/ui/Magnetic';
import PerspectiveCard from '@/components/ui/PerspectiveCard';
import Link from 'next/link';

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: ''
    });

    return (
        <main className="min-h-screen pt-40 pb-20 px-6 relative overflow-hidden bg-transparent">
            <Scene3D />
            <Navbar />

            <div className="max-w-md mx-auto relative z-10">
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent border border-accent/20 mb-8"
                    >
                        <ShieldCheck size={16} />
                        <span className="text-xs font-black uppercase tracking-widest">Secure Neural Uplink</span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-black text-foreground mb-4 tracking-tighter"
                    >
                        {isLogin ? 'LOGIN' : 'SIGNUP'} <span className="text-gradient">PORTAL</span>
                    </motion.h1>
                    <p className="text-secondary font-medium">
                        {isLogin ? 'Reconnect to your diagnostic profile' : 'Deploy your new career intelligence identity'}
                    </p>
                </div>

                <PerspectiveCard>
                    <Card className="p-10 premium-card bg-card/60 backdrop-blur-3xl border-border shadow-3d">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={isLogin ? 'login' : 'register'}
                                initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-8"
                            >
                                {!isLogin && (
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] ml-2">Full Identity</label>
                                        <div className="relative">
                                            <User className="absolute left-6 top-1/2 -translate-y-1/2 text-secondary/50" size={20} />
                                            <input
                                                type="text"
                                                placeholder="Enter full name"
                                                className="w-full h-16 bg-white/5 border border-border rounded-2xl pl-16 pr-6 focus:ring-2 focus:ring-accent focus:border-transparent outline-none text-foreground font-medium transition-all"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] ml-2">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-secondary/50" size={20} />
                                        <input
                                            type="email"
                                            placeholder="Enter email"
                                            className="w-full h-16 bg-white/5 border border-border rounded-2xl pl-16 pr-6 focus:ring-2 focus:ring-accent focus:border-transparent outline-none text-foreground font-medium transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center ml-2">
                                        <label className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">Password</label>
                                        {isLogin && <button className="text-[10px] font-black text-accent uppercase tracking-widest hover:underline">Reset Logic</button>}
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-secondary/50" size={20} />
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            className="w-full h-16 bg-white/5 border border-border rounded-2xl pl-16 pr-6 focus:ring-2 focus:ring-accent focus:border-transparent outline-none text-foreground font-medium transition-all"
                                        />
                                    </div>
                                </div>

                                <Magnetic>
                                    <Link href="/profile" className="w-full">
                                        <Button className="w-full h-18 text-lg font-black uppercase tracking-[0.2em] shadow-3d group bg-accent hover:bg-accent/90">
                                            {isLogin ? 'Login' : 'Signup'}
                                            <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" />
                                        </Button>
                                    </Link>
                                </Magnetic>

                                <div className="relative py-4">
                                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border"></div></div>
                                    <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.2em]"><span className="bg-[#111827] px-4 text-secondary/50">OR CONTINUE WITH</span></div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <Magnetic>
                                        <button className="w-full h-14 bg-white/5 border border-border rounded-xl flex items-center justify-center gap-3 hover:bg-white/10 transition-all">
                                            <Github size={20} className="text-foreground" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Github</span>
                                        </button>
                                    </Magnetic>
                                    <Magnetic>
                                        <button className="w-full h-14 bg-white/5 border border-border rounded-xl flex items-center justify-center gap-3 hover:bg-white/10 transition-all">
                                            <Chrome size={20} className="text-foreground" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Google</span>
                                        </button>
                                    </Magnetic>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </Card>
                </PerspectiveCard>

                <div className="mt-10 text-center">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-secondary font-medium hover:text-accent transition-colors"
                    >
                        {isLogin ? "Don't have a profile? " : "Already have an account? "}
                        <span className="text-foreground font-black uppercase tracking-widest ml-2 underline underline-offset-4 decoration-accent/50 hover:decoration-accent transition-all">
                            {isLogin ? 'Register Now' : 'Login Portal'}
                        </span>
                    </button>
                </div>
            </div>
        </main>
    );
}
