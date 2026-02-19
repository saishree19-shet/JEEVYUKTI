'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import {
    LayoutGrid,
    History,
    BarChart2,
    Settings,
    User,
    Shield,
    LogOut,
    Search,
    Bell,
    Plus,
    ChevronRight,
    Heart,
    Activity,
    Upload,
    MapPin,
    X,
    Send,
    MessageSquare
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import GeneticSummaryCard from '@/components/GeneticSummaryCard';

export default function Dashboard() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatHistory, setChatHistory] = useState([]);
    const [chatInput, setChatInput] = useState('');

    // Mock Data for UI Visualization (matches template style)
    const healthStats = [
        { label: "CYP2D6", value: "Normal", color: "text-emerald-500", bg: "bg-emerald-100", icon: Heart },
        { label: "CYP2C19", value: "Poor", color: "text-orange-500", bg: "bg-orange-100", icon: Activity },
        { label: "SLCO1B1", value: "Review", color: "text-blue-500", bg: "bg-blue-100", icon: Activity },
        { label: "DPYD", value: "Normal", color: "text-emerald-500", bg: "bg-emerald-100", icon: Heart },
    ];

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
        try {
            await signOut(auth);
            router.push('/login');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const handleSendMessage = async () => {
        if (!chatInput.trim()) return;

        const newMessage = { role: 'user', content: chatInput };
        setChatHistory(prev => [...prev, newMessage]);
        setChatInput('');

        try {
            const response = await fetch('http://localhost:5000/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    history: chatHistory,
                    message: newMessage.content
                })
            });

            const data = await response.json();
            if (data.response) {
                setChatHistory(prev => [...prev, { role: 'model', content: data.response }]);
            }
        } catch (error) {
            console.error("Chat Error:", error);
            setChatHistory(prev => [...prev, { role: 'model', content: "Sorry, I'm having trouble connecting to the server." }]);
        }
    };

    const handleFileUpload = async () => {
        if (!file) return;
        setLoading(true);

        const formData = new FormData();
        formData.append('vcf', file);

        try {
            // Updated to point to backend API
            const response = await fetch('http://localhost:5000/api/vcf/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();

            if (response.ok) {
                setResults(data); // Expecting { audit, variants, phenotypeProfile, riskReport }
            } else {
                alert(`Analysis Failed: ${data.message || 'Unknown Error'}`);
            }
        } catch (error) {
            console.error(error);
            alert("Backend Connection Error. Ensure server is running on port 5000.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-[#F7F4F2] font-sans selection:bg-orange-100">

            {/* Sidebar - Health+ Style */}
            <aside className="w-64 bg-[#FBF9F8] p-6 flex flex-col justify-between hidden md:flex rounded-r-[40px] shadow-sm z-10">
                <div>
                    <div className="flex items-center gap-3 mb-10 px-2">
                        <img src="/logo.jpg" alt="Jeevyukt" className="w-32 h-auto object-contain mix-blend-multiply hue-rotate-180" />
                    </div>

                    <nav className="space-y-1">
                        <NavItem icon={LayoutGrid} label="Dashboard" active href="/dashboard" />
                        <NavItem icon={Activity} label="Analysis" href="/analysis" />
                        <NavItem icon={MapPin} label="Find Doctors" href="/doctors" />
                        <NavItem icon={History} label="History" href="/history" />
                        <NavItem icon={Settings} label="Settings" href="/settings" />
                    </nav>
                </div>

                <div>
                    <nav className="space-y-2 mb-8">
                        <a href="/profile" className="flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all font-medium text-sm text-slate-400 hover:text-slate-600 hover:bg-slate-50">
                            <User size={20} />
                            <span>Profile</span>
                        </a>
                        <NavItem icon={Shield} label="Support" />
                    </nav>
                    <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-orange-500 transition-colors w-full text-left">
                        <LogOut size={20} />
                        <span>Exit</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                {/* Header */}
                <header className="flex justify-between items-center mb-10">
                    <div className="flex items-center gap-4 bg-white p-2 rounded-2xl w-96 shadow-sm">
                        <Search className="text-slate-400 ml-2" size={20} />
                        <input type="text" placeholder="Search parameters..." className="bg-transparent outline-none w-full text-sm text-slate-600" />
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative p-2 bg-white rounded-full shadow-sm hover:bg-orange-50 transition-colors">
                            <Bell size={20} className="text-slate-600" />
                            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-orange-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-sm font-bold shadow-sm border-2 border-white">
                                {user?.email?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <span className="text-sm font-semibold text-slate-700 hidden sm:inline">
                                {user?.email ? user.email.split('@')[0] : 'Guest'}
                            </span>
                            <ChevronRight size={16} className="text-slate-400" />
                        </div>
                    </div>
                </header>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-12 gap-8">
                    {/* Left Column: Stats & Quick Links */}
                    <div className="col-span-12 lg:col-span-8 space-y-8">
                        {/* Welcome Banner */}
                        <div className="bg-slate-800 text-white rounded-[32px] p-8 relative overflow-hidden flex flex-col justify-center min-h-[240px]">
                            <div className="relative z-10 max-w-lg">
                                <h2 className="text-3xl font-bold mb-2">Welcome Back, {user?.email ? user.email.split('@')[0] : 'Guest'}!</h2>
                                <p className="text-slate-400 mb-6">Your genetic profile is ready. Check your latest analysis or upload a new genome.</p>
                                <div className="flex gap-4">
                                    <button onClick={() => router.push('/analysis')} className="px-6 py-3 bg-teal-500 text-white rounded-xl text-sm font-bold hover:bg-teal-600 transition-colors shadow-lg shadow-teal-500/20">
                                        Start Analysis
                                    </button>
                                    <button onClick={() => router.push('/chat')} className="px-6 py-3 bg-white/10 text-white rounded-xl text-sm font-bold hover:bg-white/20 transition-colors backdrop-blur-sm">
                                        Ask AI Assistant
                                    </button>
                                </div>
                            </div>
                            {/* Decorative Background Circles */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl -ml-10 -mb-10"></div>
                        </div>

                        {/* Recent Health Stats */}
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 mb-4">Genetic Overview</h3>
                            <GeneticSummaryCard
                                riskCount={3}
                                variantCount={12450}
                                confidenceScore={98}
                            />

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                                {healthStats.map((stat, idx) => (
                                    <div key={idx} className="bg-white p-5 rounded-[24px] shadow-sm flex flex-col items-center justify-center gap-2 hover:translate-y-[-2px] transition-transform text-center border border-slate-100">
                                        <div className={`w-12 h-12 rounded-full ${stat.bg} flex items-center justify-center ${stat.color} mb-2`}>
                                            <stat.icon size={20} />
                                        </div>
                                        <h4 className="text-sm text-slate-500 font-medium">{stat.label}</h4>
                                        <span className="text-sm font-bold text-slate-800">{stat.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Actions */}
                    <div className="col-span-12 lg:col-span-4 space-y-6">
                        <div className="bg-white p-8 rounded-[32px] shadow-sm h-full">
                            <h3 className="font-bold text-slate-800 mb-6">Quick Actions</h3>
                            <button onClick={() => router.push('/analysis')} className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors mb-3 group">
                                <span className="flex items-center gap-3 font-medium text-slate-700">
                                    <span className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 group-hover:scale-110 transition-transform"><Activity size={16} /></span>
                                    New Analysis
                                </span>
                                <ChevronRight size={16} className="text-slate-400" />
                            </button>
                            <button onClick={() => router.push('/chat')} className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors mb-3 group">
                                <span className="flex items-center gap-3 font-medium text-slate-700">
                                    <span className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform"><MessageSquare size={16} /></span>
                                    Chat with AI
                                </span>
                                <ChevronRight size={16} className="text-slate-400" />
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function NavItem({ icon: Icon, label, active, href }) {
    return (
        <a href={href || "#"} className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all font-medium text-sm
            ${active
                ? 'text-teal-600 bg-teal-50 shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
            }`}
        >
            <Icon size={20} className={active ? 'stroke-[2.5px]' : ''} />
            <span>{label}</span>
        </a>
    )
}
