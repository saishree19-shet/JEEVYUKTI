'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { User, Mail, Shield, Activity, Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                router.push('/login');
            }
        });
        return () => unsubscribe();
    }, [router]);

    const handleLogout = async () => {
        await signOut(auth);
        router.push('/login');
    };

    if (!user) return <div className="min-h-screen bg-[#F7F4F2] flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-[#F7F4F2] font-sans p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/dashboard" className="p-2 bg-white rounded-full shadow-sm hover:bg-slate-50 transition-colors">
                        <ArrowLeft className="text-slate-600" />
                    </Link>
                    <div className="flex items-center gap-2">
                        <img src="/logo.jpg" alt="Jeevyukt" className="w-32 h-auto object-contain mix-blend-multiply hue-rotate-180" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* User Card */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-white p-8 rounded-[32px] shadow-sm text-center">
                            <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold text-teal-600 border-4 border-white shadow-lg">
                                {user.email?.charAt(0).toUpperCase()}
                            </div>
                            <h2 className="text-xl font-bold text-slate-800 break-words">{user.email?.split('@')[0]}</h2>
                            <p className="text-sm text-slate-400 mb-6">Patient ID: #{user.uid.slice(0, 6)}</p>

                            <button onClick={handleLogout} className="w-full py-3 bg-red-50 text-red-500 font-bold rounded-xl hover:bg-red-100 transition-colors pointer-events-auto">
                                Sign Out
                            </button>
                        </div>

                        {/* Status Card */}
                        <div className="bg-white p-6 rounded-[24px] shadow-sm">
                            <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                                <Shield size={18} className="text-teal-500" /> Account Status
                            </h3>
                            <div className="flex items-center gap-3 p-3 bg-teal-50 rounded-xl">
                                <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
                                <span className="text-sm font-bold text-teal-700">Active & Verified</span>
                            </div>
                        </div>
                    </div>

                    {/* Details Column */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-white p-8 rounded-[32px] shadow-sm">
                            <h3 className="text-xl font-bold text-slate-800 mb-6">Personal Information</h3>

                            <div className="space-y-6">
                                <div className="flex items-center gap-4 p-4 bg-[#FBF9F8] rounded-2xl">
                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm">
                                        <Mail size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Email Address</p>
                                        <p className="font-bold text-slate-700">{user.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-4 bg-[#FBF9F8] rounded-2xl">
                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm">
                                        <Calendar size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Member Since</p>
                                        <p className="font-bold text-slate-700">{requestAnimationFrame ? new Date(user.metadata.creationTime).toLocaleDateString() : 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-teal-500 to-emerald-500 p-8 rounded-[32px] shadow-lg text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>

                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <Activity className="text-teal-100" />
                                    <span className="font-bold opacity-90">Pharmacogenomic Profile</span>
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Analysis Ready</h3>
                                <p className="opacity-80 mb-6 max-w-md">Your genetic data is linked and ready for real-time drug interaction checking.</p>

                                <Link href="/dashboard" className="px-6 py-3 bg-white text-teal-600 font-bold rounded-xl hover:bg-teal-50 transition-colors inline-block">
                                    Go to Dashboard
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
