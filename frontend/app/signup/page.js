'use client';
import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Activity, ArrowRight } from 'lucide-react';

export default function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            router.push('/dashboard');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-[#F7F4F2] flex items-center justify-center p-6">

            <div className="bg-white rounded-[40px] shadow-xl overflow-hidden max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 min-h-[600px]">

                {/* Right: Graphic (Swapped for variety) */}
                <div className="hidden md:flex bg-[#FFF7ED] relative p-12 flex-col justify-between">
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-orange-500 shadow-sm mb-6">
                            <Activity size={24} />
                        </div>
                        <h3 className="text-3xl font-bold text-slate-800 mb-4 leading-tight">
                            Start Your <br />Journey.
                        </h3>
                        <p className="text-slate-500 font-medium">
                            Join 10,000+ patients optimizing their medication today.
                        </p>
                    </div>

                    {/* Visual Element */}
                    <div className="bg-white p-6 rounded-[32px] shadow-sm transform rotate-3 w-48 ml-auto">
                        <div className="flex gap-3 mb-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100"></div>
                            <div className="flex-1 space-y-2">
                                <div className="w-full h-2 bg-slate-100 rounded-full"></div>
                                <div className="w-2/3 h-2 bg-slate-100 rounded-full"></div>
                            </div>
                        </div>
                        <div className="w-full h-8 bg-orange-100 rounded-lg flex items-center justify-center text-xs font-bold text-orange-500">
                            High Risk Alert
                        </div>
                    </div>
                </div>

                {/* Left: Signup Form */}
                <div className="p-10 md:p-14 flex flex-col justify-center">
                    <div className="mb-10">
                        <Link href="/" className="flex items-center gap-2 mb-6 group">
                            <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                                <ArrowRight className="transform rotate-180 text-slate-600 w-4 h-4" />
                            </div>
                            <span className="text-sm font-bold text-slate-500">Back to Home</span>
                        </Link>
                        <div className="flex items-center justify-start mb-6">
                            <img src="/logo.jpg" alt="Jeevyukt" className="w-40 h-auto object-contain mix-blend-multiply hue-rotate-180" />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-800 mb-2">Create Account</h2>
                        <p className="text-slate-500">Get access to precision medicine tools.</p>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-5">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 ml-2 uppercase tracking-wide">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-6 py-4 bg-[#F7F4F2] rounded-2xl border-none outline-none focus:ring-2 focus:ring-orange-100 text-slate-700 font-medium"
                                placeholder="Enter email..."
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 ml-2 uppercase tracking-wide">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-6 py-4 bg-[#F7F4F2] rounded-2xl border-none outline-none focus:ring-2 focus:ring-orange-100 text-slate-700 font-medium"
                                placeholder="Create password"
                            />
                        </div>

                        {error && <p className="text-red-500 text-sm font-medium ml-2">{error}</p>}

                        <button
                            type="submit"
                            className="w-full py-4 bg-orange-500 text-white font-bold rounded-2xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-200 hover:shadow-orange-300 mt-4"
                        >
                            Create Account
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-slate-500 text-sm">
                            Already have an account?{' '}
                            <Link href="/login" className="text-orange-500 font-bold hover:underline">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}
