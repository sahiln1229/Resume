"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Menu, X, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import Magnetic from '@/components/ui/Magnetic';

export const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ${isScrolled ? 'py-4' : 'py-8'
            }`}>
            <div className="max-w-7xl mx-auto px-6">
                <div className={`relative flex items-center justify-between px-8 py-4 transition-all duration-700 ${isScrolled ? 'glass rounded-3xl shadow-premium border-white/10' : 'bg-transparent border-transparent'
                    }`}>
                    <Link href="/" className="flex items-center gap-3 group">
                        <motion.div
                            whileHover={{ rotate: 90 }}
                            className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center shadow-3d group-hover:scale-110 transition-transform"
                        >
                            <Cpu className="text-white" size={24} />
                        </motion.div>
                        <span className="text-2xl font-black text-foreground tracking-tighter uppercase italic">
                            RE<span className="text-accent">S</span>UME<span className="text-gradient">AI</span>
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-12">
                        {['Features', 'Intelligence', 'Network'].map((item) => (
                            <Link
                                key={item}
                                href={`/#${item.toLowerCase()}`}
                                className="text-xs font-black uppercase tracking-[0.2em] text-secondary hover:text-accent transition-colors relative group"
                            >
                                {item}
                                <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-accent transition-all duration-500 group-hover:w-full" />
                            </Link>
                        ))}
                    </div>

                    <div className="hidden md:flex items-center gap-6">
                        <Link href="/upload">
                            <Magnetic>
                                <Button className="h-14 px-8 rounded-2xl bg-accent hover:bg-accent/90 text-white font-black uppercase tracking-widest shadow-3d group">
                                    Launch Interface
                                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Magnetic>
                        </Link>
                    </div>

                    <button
                        className="md:hidden text-foreground p-2"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-full left-0 right-0 mt-4 mx-6 p-8 glass rounded-3xl border-white/10 md:hidden z-[101]"
                    >
                        <div className="flex flex-col gap-8">
                            {['Features', 'Intelligence', 'Network'].map((item) => (
                                <Link
                                    key={item}
                                    href={`/#${item.toLowerCase()}`}
                                    className="text-lg font-black uppercase tracking-widest text-foreground hover:text-accent"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {item}
                                </Link>
                            ))}
                            <Link href="/upload" onClick={() => setIsMobileMenuOpen(false)}>
                                <Button className="w-full h-16 rounded-2xl bg-accent text-white font-black uppercase tracking-widest">
                                    Launch Interface
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};
