"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Navbar } from '@/components/layout/Navbar';
import Scene3D from '@/components/3d/Scene3D';
import PerspectiveCard from '@/components/ui/PerspectiveCard';
import Magnetic from '@/components/ui/Magnetic';
import { Sparkles, MessageSquare, ArrowRight, Brain, CheckCircle2, ChevronRight, RefreshCcw, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import axios from 'axios';

const FALLBACK_QUESTIONS = [
    "Tell me about a time you had to lead a project under a tight deadline. How did you handle it?",
    "Describe a situation where you disagreed with a team member. How did you resolve the conflict?",
    "What is your most significant professional achievement and what steps did you take to reach it?",
    "How do you prioritize your work when you have multiple competing deadlines?",
    "Tell me about a time you failed or made a mistake. What did you learn from it?",
    "Where do you see your career progressing in the next three to five years?",
    "Describe a complex problem you faced and the analytical process you used to solve it.",
    "How do you keep your technical skills updated in such a fast-paced industry?",
    "Tell me about a time you had to learn a completely new technology or framework quickly.",
    "Why do you want to work for our company specifically?"
];

export default function InterviewPage() {
    const [questions, setQuestions] = useState<string[]>(FALLBACK_QUESTIONS);
    const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);

    useEffect(() => {
        const fetchAnalysis = async () => {
            try {
                const resumeId = localStorage.getItem('currentResumeId');
                if (resumeId) {
                    const res = await axios.get(`http://localhost:5000/api/resumeAnalysis/${resumeId}`);
                    const aiQuestions = res.data.aiAnalysisResult?.interviewQuestions;
                    if (aiQuestions && aiQuestions.length > 0) {
                        setQuestions(aiQuestions.slice(0, 10)); // Ensure max 10
                    }
                }
            } catch (err) {
                console.error("Failed to load custom custom questions, using fallbacks.", err);
            } finally {
                setIsLoadingQuestions(false);
            }
        };
        fetchAnalysis();
    }, []);
    const [activeQuestion, setActiveQuestion] = useState(0);
    const [answer, setAnswer] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [feedback, setFeedback] = useState<{ score: number, strengths: string, weaknesses: string } | null>(null);

    const handleSubmit = () => {
        if (!answer.trim()) return;

        setIsAnalyzing(true);
        setFeedback(null);

        // Simulate AI analysis delay
        setTimeout(() => {
            setIsAnalyzing(false);
            // Simulated dynamic feedback based on length for realism
            const score = answer.length > 150 ? 88 : answer.length > 50 ? 65 : 42;
            setFeedback({
                score,
                strengths: answer.length > 100
                    ? "Good level of detail. Attempted to structure the response."
                    : "Direct and to the point.",
                weaknesses: answer.length > 150
                    ? "Could be more concise. Ensure you are directly answering the prompt."
                    : "Lacks depth. Try using the STAR method (Situation, Task, Action, Result) to provide more context."
            });
        }, 2000);
    };

    const nextQuestion = () => {
        if (activeQuestion < questions.length - 1) {
            setActiveQuestion(prev => prev + 1);
            setAnswer("");
            setFeedback(null);
        }
    };

    const prevQuestion = () => {
        if (activeQuestion > 0) {
            setActiveQuestion(prev => prev - 1);
            setAnswer("");
            setFeedback(null);
        }
    };

    return (
        <main className="min-h-screen pt-40 pb-20 px-6 relative overflow-hidden bg-transparent">
            <Scene3D />
            <Navbar />

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-3 text-accent mb-4"
                        >
                            <Sparkles size={20} />
                            <span className="text-sm font-black uppercase tracking-[0.3em]">Live Simulation Active</span>
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-7xl font-black text-foreground tracking-tighter"
                        >
                            INTERVIEW <span className="text-gradient">MATRIX</span>
                        </motion.h1>
                    </div>

                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                        <Link href="/dashboard">
                            <Magnetic>
                                <button className="h-14 px-6 rounded-2xl bg-white/5 border border-white/10 text-secondary font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-3">
                                    Exit Simulator
                                </button>
                            </Magnetic>
                        </Link>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Sidebar / Question Tracker */}
                    <div className="lg:col-span-4">
                        <PerspectiveCard>
                            <Card className="p-8 premium-card bg-card/60 backdrop-blur-3xl border-white/10 shadow-3d h-full">
                                <h3 className="text-xs font-black text-secondary tracking-[0.3em] uppercase mb-8">Scenario Sequence</h3>
                                <div className="space-y-3">
                                    {isLoadingQuestions ? (
                                        <div className="flex justify-center p-8">
                                            <Loader2 className="animate-spin text-accent" />
                                        </div>
                                    ) : (
                                        questions.map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => {
                                                    setActiveQuestion(idx);
                                                    setAnswer("");
                                                    setFeedback(null);
                                                }}
                                                className={cn(
                                                    "w-full text-left px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-between group",
                                                    activeQuestion === idx
                                                        ? "bg-accent/20 border border-accent/40 text-accent ring-1 ring-accent/20"
                                                        : "bg-white/5 border border-transparent text-secondary hover:bg-white/10 hover:border-white/10"
                                                )}
                                            >
                                                <span>Question {idx + 1}</span>
                                                {activeQuestion === idx && <ChevronRight size={14} className="animate-pulse" />}
                                            </button>
                                        ))
                                    )}
                                </div>
                            </Card>
                        </PerspectiveCard>
                    </div>

                    {/* Main Interaction Area */}
                    <div className="lg:col-span-8 flex flex-col gap-6">
                        <PerspectiveCard>
                            <Card className="p-10 premium-card bg-card/60 backdrop-blur-3xl border-white/10 shadow-3d relative overflow-hidden">
                                {/* Decorative background element */}
                                <div className="absolute -top-32 -right-32 w-64 h-64 bg-accent/10 rounded-full blur-[100px]" />

                                <div className="flex items-start gap-6 relative z-10">
                                    <div className="w-14 h-14 rounded-2xl bg-accent/20 border border-accent/30 flex items-center justify-center text-accent shrink-0 shadow-3d">
                                        <MessageSquare size={24} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-black text-accent uppercase tracking-[0.3em] mb-3">
                                            Scenario {activeQuestion + 1} / 10
                                        </div>
                                        <h2 className="text-2xl md:text-3xl font-black text-foreground leading-tight tracking-tight">
                                            {questions[activeQuestion]}
                                        </h2>
                                    </div>
                                </div>
                            </Card>
                        </PerspectiveCard>

                        <div className="relative flex-1">
                            <textarea
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                placeholder="Type your response here... (Aim for depth and use the STAR method)"
                                disabled={isAnalyzing || feedback !== null}
                                className="w-full h-64 p-8 rounded-3xl bg-card/40 backdrop-blur-xl border border-white/10 focus:border-accent/50 focus:ring-1 focus:ring-accent/50 outline-none text-foreground font-medium resize-none transition-all shadow-inner disabled:opacity-50"
                            />

                            <AnimatePresence>
                                {!feedback && !isAnalyzing && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="absolute bottom-6 right-6"
                                    >
                                        <Magnetic>
                                            <Button
                                                onClick={handleSubmit}
                                                disabled={answer.length < 10}
                                                className="h-14 px-8 bg-accent hover:bg-accent/90 text-white font-black uppercase tracking-widest shadow-3d group disabled:opacity-50"
                                            >
                                                Analyze Response
                                                <Brain className="ml-3 group-hover:scale-110 transition-transform" size={18} />
                                            </Button>
                                        </Magnetic>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {isAnalyzing && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="absolute inset-0 z-20 rounded-3xl bg-background/60 backdrop-blur-sm flex flex-col items-center justify-center border border-white/5"
                                >
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    >
                                        <RefreshCcw size={48} className="text-accent mb-6" />
                                    </motion.div>
                                    <p className="text-secondary font-black uppercase tracking-[0.3em] text-sm animate-pulse">
                                        Synthesizing Feedback Matrix...
                                    </p>
                                </motion.div>
                            )}
                        </div>

                        {/* Feedback Module */}
                        <AnimatePresence>
                            {feedback && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0, y: 20 }}
                                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <PerspectiveCard>
                                        <Card className="p-8 premium-card bg-[#0e1629] border border-accent/20 relative">
                                            <div className="absolute top-0 left-0 w-1 h-full bg-accent rounded-l-3xl" />
                                            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start mb-8">
                                                <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                                                    <svg className="w-full h-full transform -rotate-90">
                                                        <circle cx="50%" cy="50%" r="42%" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white/5" />
                                                        <motion.circle
                                                            initial={{ strokeDashoffset: '264%' }}
                                                            animate={{ strokeDashoffset: `${264 * (1 - (feedback.score / 100))}%` }}
                                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                                            cx="50%" cy="50%" r="42%" stroke="currentColor" strokeWidth="6" fill="transparent"
                                                            strokeDasharray="264%" className={feedback.score > 70 ? "text-green-500" : feedback.score > 50 ? "text-yellow-500" : "text-red-500"}
                                                        />
                                                    </svg>
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                        <span className="text-2xl font-black text-foreground">{feedback.score}</span>
                                                    </div>
                                                </div>
                                                <div className="flex-1 space-y-4">
                                                    <h4 className="text-lg font-black text-foreground uppercase tracking-widest">Diagnostic Report</h4>
                                                    <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                                                        <div className="text-[10px] font-black text-green-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                            <CheckCircle2 size={12} /> Strengths
                                                        </div>
                                                        <p className="text-sm text-secondary font-medium">{feedback.strengths}</p>
                                                    </div>
                                                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                                                        <div className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                            <AlertCircle size={12} /> Areas for Improvement
                                                        </div>
                                                        <p className="text-sm text-secondary font-medium">{feedback.weaknesses}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex justify-end gap-4 mt-6">
                                                <Button variant="outline" onClick={() => setFeedback(null)} className="h-12 px-6 rounded-xl border-white/10 text-secondary uppercase tracking-widest text-xs font-black">
                                                    Try Again
                                                </Button>
                                                <Button onClick={nextQuestion} disabled={activeQuestion === questions.length - 1} className="h-12 px-6 rounded-xl bg-accent hover:bg-accent/90 text-white uppercase tracking-widest text-xs font-black group">
                                                    Next Scenario
                                                    <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                                </Button>
                                            </div>
                                        </Card>
                                    </PerspectiveCard>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </main>
    );
}
