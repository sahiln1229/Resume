"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User,
    Mail,
    Briefcase,
    GraduationCap,
    Calendar,
    Building2,
    Upload,
    CheckCircle2,
    ArrowRight,
    Camera,
    FileText,
    Sparkles,
    ShieldCheck,
    Save
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Navbar } from '@/components/layout/Navbar';
import Scene3D from '@/components/3d/Scene3D';
import Magnetic from '@/components/ui/Magnetic';
import PerspectiveCard from '@/components/ui/PerspectiveCard';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ProfileData {
    name: string;
    age: string;
    email: string;
    college: string;
    officeName: string;
    degree: string;
    qualification: string;
    profileImage: string | null;
    certificate: string | null;
}

const initialData: ProfileData = {
    name: '',
    age: '',
    email: '',
    college: '',
    officeName: '',
    degree: '',
    qualification: '',
    profileImage: null,
    certificate: null,
};

export default function ProfilePage() {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(true);
    const [data, setData] = useState<ProfileData>(initialData);
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'personal' | 'academic' | 'professional'>('personal');

    // Load data from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('user_profile_data');
        if (saved) {
            setData(JSON.parse(saved));
            setIsEditing(false); // If data exists, show view mode first
        }
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        localStorage.setItem('user_profile_data', JSON.stringify(data));
        setIsSaving(false);
        setIsEditing(false);
        router.push('/');
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setData({ ...data, profileImage: event.target?.result as string });
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleCertificateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setData({ ...data, certificate: e.target.files[0].name });
        }
    };

    const InputField = ({ label, icon: Icon, placeholder, value, onChange, type = "text" }: any) => (
        <div className="space-y-2">
            <label className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] ml-2">{label}</label>
            <div className="relative">
                <Icon className="absolute left-6 top-1/2 -translate-y-1/2 text-accent/50" size={18} />
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-16 pr-6 focus:ring-2 focus:ring-accent focus:border-transparent outline-none text-foreground font-medium transition-all hover:bg-white/10"
                />
            </div>
        </div>
    );

    return (
        <main className="min-h-screen pt-40 pb-20 px-6 relative overflow-hidden bg-transparent">
            <Scene3D />
            <Navbar />

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent border border-accent/20 mb-8"
                    >
                        <ShieldCheck size={16} />
                        <span className="text-xs font-black uppercase tracking-widest">Neural Identity Management</span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-black text-foreground mb-4 tracking-tighter"
                    >
                        {isEditing ? 'UPDATE' : 'PROFILE'} <span className="text-gradient">MATRIX</span>
                    </motion.h1>
                    <p className="text-secondary font-medium">
                        Synchronize your professional parameters across the neural network.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Sidebar / Profile Image */}
                    <div className="space-y-8">
                        <PerspectiveCard>
                            <Card className="p-8 premium-card bg-card/40 backdrop-blur-3xl border-border text-center overflow-hidden h-full flex flex-col items-center">
                                <div className="relative group mb-8">
                                    <div className="w-32 h-32 rounded-3xl overflow-hidden border-2 border-accent/20 shadow-3d relative">
                                        {data.profileImage ? (
                                            <img src={data.profileImage} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-accent/5 flex items-center justify-center text-accent">
                                                <User size={48} />
                                            </div>
                                        )}
                                        {isEditing && (
                                            <label className="absolute inset-0 bg-accent/80 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-all duration-300">
                                                <Camera size={24} className="text-white" />
                                                <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                                            </label>
                                        )}
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-accent rounded-xl flex items-center justify-center border-2 border-[#0B1120] text-white shadow-lg">
                                        <Sparkles size={14} />
                                    </div>
                                </div>

                                <h3 className="text-xl font-black text-foreground truncate w-full px-2">
                                    {data.name || 'Anonymous User'}
                                </h3>
                                <p className="text-xs font-black text-secondary tracking-widest uppercase mb-6">Level 0: Initializing Access</p>

                                <div className="w-full h-[2px] bg-white/5 mb-6" />

                                <div className="space-y-4 w-full text-left">
                                    <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest">
                                        <span className="text-secondary">Integrity</span>
                                        <span className="text-accent">85%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: '85%' }}
                                            className="h-full bg-gradient-to-r from-primary to-accent"
                                        />
                                    </div>
                                </div>
                            </Card>
                        </PerspectiveCard>
                    </div>

                    {/* Main Form Area */}
                    <div className="lg:col-span-2">
                        <PerspectiveCard>
                            <Card className="p-10 premium-card bg-card/60 backdrop-blur-3xl border-border h-full">
                                {isEditing ? (
                                    <div className="space-y-8">
                                        {/* Tabs */}
                                        <div className="flex gap-4 p-1.5 bg-white/5 rounded-2xl border border-white/5 mb-8">
                                            {(['personal', 'academic', 'professional'] as const).map((tab) => (
                                                <button
                                                    key={tab}
                                                    onClick={() => setActiveTab(tab)}
                                                    className={`flex-1 h-12 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === tab
                                                        ? 'bg-accent text-white shadow-lg'
                                                        : 'text-secondary hover:text-foreground hover:bg-white/5'
                                                        }`}
                                                >
                                                    {tab}
                                                </button>
                                            ))}
                                        </div>

                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                key={activeTab}
                                                initial={{ opacity: 0, x: 10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -10 }}
                                                className="space-y-6"
                                            >
                                                {activeTab === 'personal' && (
                                                    <>
                                                        <InputField
                                                            label="Full Identity"
                                                            icon={User}
                                                            placeholder="Enter your name"
                                                            value={data.name}
                                                            onChange={(val: string) => setData({ ...data, name: val })}
                                                        />
                                                        <div className="grid grid-cols-2 gap-6">
                                                            <InputField
                                                                label="Age / Cycle"
                                                                icon={Calendar}
                                                                placeholder="Years"
                                                                value={data.age}
                                                                onChange={(val: string) => setData({ ...data, age: val })}
                                                            />
                                                            <InputField
                                                                label="Neural Address"
                                                                icon={Mail}
                                                                placeholder="Email"
                                                                value={data.email}
                                                                onChange={(val: string) => setData({ ...data, email: val })}
                                                            />
                                                        </div>
                                                    </>
                                                )}

                                                {activeTab === 'academic' && (
                                                    <>
                                                        <InputField
                                                            label="Learning Node"
                                                            icon={Building2}
                                                            placeholder="College / University Name"
                                                            value={data.college}
                                                            onChange={(val: string) => setData({ ...data, college: val })}
                                                        />
                                                        <InputField
                                                            label="Specialization"
                                                            icon={GraduationCap}
                                                            placeholder="Qualification / Field"
                                                            value={data.qualification}
                                                            onChange={(val: string) => setData({ ...data, qualification: val })}
                                                        />
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] ml-2">Verification Artifact</label>
                                                            <label className="w-full h-14 bg-white/5 border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center gap-3 cursor-pointer hover:border-accent/40 transition-all text-secondary hover:text-accent">
                                                                {data.certificate ? (
                                                                    <div className="flex items-center gap-2">
                                                                        <CheckCircle2 size={18} className="text-green-500" />
                                                                        <span className="text-[10px] font-black uppercase tracking-widest truncate max-w-[200px]">{data.certificate}</span>
                                                                    </div>
                                                                ) : (
                                                                    <>
                                                                        <Upload size={18} />
                                                                        <span className="text-[10px] font-black uppercase tracking-widest">Upload Certificate</span>
                                                                    </>
                                                                )}
                                                                <input type="file" className="hidden" onChange={handleCertificateUpload} />
                                                            </label>
                                                        </div>
                                                    </>
                                                )}

                                                {activeTab === 'professional' && (
                                                    <>
                                                        <InputField
                                                            label="Current Collective"
                                                            icon={Briefcase}
                                                            placeholder="Office / Company Name"
                                                            value={data.officeName}
                                                            onChange={(val: string) => setData({ ...data, officeName: val })}
                                                        />
                                                        <InputField
                                                            label="Professional Rank"
                                                            icon={FileText}
                                                            placeholder="Degree / Designation"
                                                            value={data.degree}
                                                            onChange={(val: string) => setData({ ...data, degree: val })}
                                                        />
                                                    </>
                                                )}
                                            </motion.div>
                                        </AnimatePresence>

                                        <div className="pt-8">
                                            <Magnetic>
                                                <Button
                                                    onClick={handleSave}
                                                    disabled={isSaving}
                                                    className="w-full h-18 text-lg font-black uppercase tracking-[0.2em] shadow-3d group bg-accent hover:bg-accent/90"
                                                >
                                                    {isSaving ? 'Synchronizing...' : 'Save Matrix Data'}
                                                    {!isSaving && <Save className="ml-3 group-hover:scale-110 transition-transform" size={20} />}
                                                </Button>
                                            </Magnetic>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-12">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-2xl font-black text-foreground tracking-tight">Access Results</h3>
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    setIsEditing(true);
                                                    setActiveTab('personal');
                                                }}
                                                className="rounded-xl border-accent/20 text-accent hover:bg-accent/5"
                                            >
                                                Edit Profile
                                            </Button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                            <div className="space-y-6">
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-black text-secondary uppercase tracking-widest">Neural ID</p>
                                                    <p className="text-xl font-bold text-foreground">{data.name}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-black text-secondary uppercase tracking-widest">Address</p>
                                                    <p className="text-xl font-bold text-foreground">{data.email}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-black text-secondary uppercase tracking-widest">Learning Node</p>
                                                    <p className="text-xl font-bold text-foreground">{data.college}</p>
                                                </div>
                                            </div>
                                            <div className="space-y-6">
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-black text-secondary uppercase tracking-widest">Occupation</p>
                                                    <p className="text-xl font-bold text-foreground">{data.degree}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-black text-secondary uppercase tracking-widest">Collective</p>
                                                    <p className="text-xl font-bold text-foreground">{data.officeName}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-black text-secondary uppercase tracking-widest">Verification</p>
                                                    <div className="flex items-center gap-2 text-accent">
                                                        <CheckCircle2 size={16} />
                                                        <span className="text-sm font-black uppercase tracking-widest">Verified Badge</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-8 flex flex-col items-center justify-center p-8 bg-white/5 rounded-3xl border border-white/5 space-y-4">
                                            <p className="text-secondary font-medium text-center italic">"Your professional narrative is now circulating through the core indices."</p>
                                            <Link href="/">
                                                <Magnetic>
                                                    <Button variant="outline" className="h-14 px-8 rounded-2xl border-white/10 text-foreground font-black uppercase tracking-widest flex items-center gap-2">
                                                        Home Interface
                                                        <ArrowRight size={18} />
                                                    </Button>
                                                </Magnetic>
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </Card>
                        </PerspectiveCard>
                    </div>
                </div>
            </div>
        </main>
    );
}
