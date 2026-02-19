'use client';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, ArrowRight } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push('/dashboard');
        } catch (err) {
            setError('Invalid credentials.');
        }
    };

    return (
        <div className="min-h-screen bg-[#F7F4F2] flex items-center justify-center p-6">

            <div className="bg-white rounded-[40px] shadow-xl overflow-hidden max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 min-h-[600px]">

                {/* Left: Login Form */}
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
                        <h2 className="text-3xl font-bold text-slate-800 mb-2">Welcome Back</h2>
                        <p className="text-slate-500">Please enter your details to sign in.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 ml-2 uppercase tracking-wide">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-6 py-4 bg-[#F7F4F2] rounded-2xl border-none outline-none focus:ring-2 focus:ring-teal-100 text-slate-700 font-medium"
                                placeholder="Enter email..."
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 ml-2 uppercase tracking-wide">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-6 py-4 bg-[#F7F4F2] rounded-2xl border-none outline-none focus:ring-2 focus:ring-teal-100 text-slate-700 font-medium"
                                placeholder="••••••••"
                            />
                        </div>

                        {error && <p className="text-red-500 text-sm font-medium ml-2">{error}</p>}

                        <button
                            type="submit"
                            className="w-full py-4 bg-slate-800 text-white font-bold rounded-2xl hover:bg-slate-900 transition-all shadow-lg hover:shadow-xl mt-4"
                        >
                            Sign In
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-slate-500 text-sm">
                            Don't have an account?{' '}
                            <Link href="/signup" className="text-teal-600 font-bold hover:underline">
                                Sign up for free
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Right: Graphic (Hidden on mobile) */}
                <div className="hidden md:flex bg-[#ECFEFF] relative p-12 flex-col justify-between">
                    <div className="flex justify-end">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-teal-500 shadow-sm">
                            <Shield size={24} />
                        </div>
                    </div>

                    <div className="relative z-10">
                        <h3 className="text-3xl font-bold text-slate-800 mb-4 leading-tight">
                            Secure <br />Genomic Data.
                        </h3>
                        <p className="text-slate-500 font-medium">
                            Your analysis is encrypted and processed locally where possible.
                        </p>
                    </div>

                    {/* Decorative Blobs */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-200 rounded-full blur-[80px] opacity-40"></div>
                </div>

            </div>
        </div>
    );
}
