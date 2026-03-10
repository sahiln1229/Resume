"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue } from 'framer-motion';
import { Upload, FileText, CheckCircle2, X, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Navbar } from '@/components/layout/Navbar';
import Scene3D from '@/components/3d/Scene3D';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import Magnetic from '@/components/ui/Magnetic';
import PerspectiveCard from '@/components/ui/PerspectiveCard';
import axios from 'axios';
import { io } from 'socket.io-client';

export default function UploadPage() {
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    // Icon migration effect
    const boxRef = useRef<HTMLDivElement>(null);
    const iconX = useMotionValue(0);
    const iconY = useMotionValue(0);
    const smoothX = useSpring(iconX, { damping: 20, stiffness: 100 });
    const smoothY = useSpring(iconY, { damping: 20, stiffness: 100 });

    const [uploadStatus, setUploadStatus] = useState<string>("Initializing...");

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!boxRef.current) return;
        const rect = boxRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        iconX.set(x * 0.1);
        iconY.set(y * 0.1);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setIsProcessing(true);
        setUploadStatus("Uploading file...");

        const formData = new FormData();
        formData.append('resume', file);

        try {
            const response = await axios.post('http://localhost:5000/api/uploadResume', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const { resumeId } = response.data;
            const socket = io('http://localhost:5000');

            socket.on(`analysis-progress-${resumeId}`, (data: any) => {
                if (data.status === 'extracting-text') {
                    setUploadStatus("Extracting Neural Data...");
                } else if (data.status === 'analyzing-ai') {
                    setUploadStatus("AI Matrix Analyzing...");
                } else if (data.status === 'completed') {
                    setUploadStatus("Analysis Complete!");
                    socket.disconnect();
                    localStorage.setItem('currentResumeId', resumeId);
                    router.push('/dashboard');
                } else if (data.status === 'error') {
                    setUploadStatus("Error: " + data.message);
                    setIsProcessing(false);
                    socket.disconnect();
                }
            });

        } catch (error) {
            console.error("Upload error:", error);
            setUploadStatus("Failed to connect to Neural Server");
            setIsProcessing(false);
        }
    };


    return (
        <main className="min-h-screen pt-40 pb-20 px-4 relative overflow-hidden bg-transparent">
            <Scene3D />
            <Navbar />

            <div className="max-w-4xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent border border-accent/20 mb-8"
                    >
                        <Sparkles size={16} />
                        <span className="text-xs font-black uppercase tracking-widest text-shadow">Neural Uplink Ready</span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-black text-foreground mb-6 tracking-tighter"
                    >
                        DEPLOY <span className="text-gradient">SOURCE</span>
                    </motion.h1>
                </div>

                <PerspectiveCard>
                    <Card
                        ref={boxRef}
                        onMouseMove={handleMouseMove}
                        className="p-0 overflow-hidden premium-card bg-card/60 backdrop-blur-3xl border-border shadow-3d hover:shadow-hover"
                    >
                        <div
                            className={cn(
                                "p-20 border-4 border-dashed transition-all duration-700 flex flex-col items-center justify-center text-center relative cursor-pointer",
                                isDragging ? "border-accent bg-accent/10 scale-[0.98]" : "border-border bg-transparent hover:border-accent/20",
                                file ? "border-none cursor-default" : ""
                            )}
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f) setFile(f); }}
                            onClick={() => !file && fileInputRef.current?.click()}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept=".pdf,.doc,.docx"
                                className="hidden"
                            />
                            {!file ? (
                                <div className="group">
                                    <motion.div
                                        style={{ x: smoothX, y: smoothY }}
                                        animate={{ y: [0, -10, 0] }}
                                        transition={{ y: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
                                        className="w-32 h-32 rounded-3xl bg-primary border border-border flex items-center justify-center mb-10 mx-auto shadow-3d group-hover:scale-110 group-hover:rotate-6 transition-all duration-700"
                                    >
                                        <Upload size={52} className="text-accent" />
                                    </motion.div>
                                    <h3 className="text-2xl font-black text-foreground mb-4 tracking-tight">Upload your resume</h3>
                                    <p className="text-secondary font-bold uppercase tracking-widest text-xs">Drop PDF or DOCX</p>
                                </div>
                            ) : (
                                <div className="w-full">
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center justify-between p-12 bg-white/5 rounded-3xl mb-12 border border-border shadow-inner"
                                    >
                                        <div className="flex items-center gap-10">
                                            <div className="w-24 h-24 bg-primary text-accent rounded-2xl flex items-center justify-center shadow-3d border border-border">
                                                <FileText size={48} />
                                            </div>
                                            <div className="text-left">
                                                <h4 className="text-xl font-black text-foreground mb-1">{file.name}</h4>
                                                <p className="text-sm font-bold text-secondary uppercase tracking-widest">{(file.size / 1024 / 1024).toFixed(2)} MB • VERIFIED</p>
                                            </div>
                                        </div>
                                        <button onClick={() => setFile(null)} className="w-16 h-16 flex items-center justify-center bg-white/5 text-secondary hover:text-red-500 rounded-2xl transition-all duration-500 shadow-sm border border-border group">
                                            <X size={32} className="group-hover:rotate-90 transition-transform" />
                                        </button>
                                    </motion.div>

                                    <Magnetic>
                                        <Button
                                            size="lg"
                                            onClick={handleUpload}
                                            disabled={isProcessing}
                                            className="w-full h-24 text-2xl font-black uppercase tracking-[0.2em] shadow-3d group relative overflow-hidden bg-accent hover:bg-accent/90"
                                        >
                                            {isProcessing ? (
                                                <div className="flex items-center gap-4">
                                                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                                                        <Sparkles size={32} />
                                                    </motion.div>
                                                    <span className="text-xl animate-pulse">{uploadStatus}</span>
                                                </div>
                                            ) : (
                                                <>
                                                    Execute Neural Sync
                                                    <ArrowRight className="ml-4 group-hover:translate-x-3 transition-transform" />
                                                </>
                                            )}
                                        </Button>
                                    </Magnetic>
                                </div>
                            )}
                        </div>
                    </Card>
                </PerspectiveCard>
            </div>
        </main>
    );
}
