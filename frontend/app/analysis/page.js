'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import {
    LayoutGrid, History, BarChart2, Settings, User, Shield, LogOut,
    Search, Bell, ChevronRight, Upload, Activity, Heart, AlertTriangle,
    FileText, Code, CheckCircle2, Loader2, Copy, Download, MapPin
} from 'lucide-react';
import ExplainabilityChain from '@/components/ExplainabilityChain';

function getRiskTheme(risk) {
    if (!risk) return { bg: 'bg-[#F8F9FA]', border: 'border-slate-100', text: 'text-slate-900', icon: 'text-slate-400', badge: 'bg-slate-100 text-slate-700' };

    // Normalize risk string
    const r = risk.toLowerCase();

    if (r === 'toxic' || r === 'ineffective' || r === 'danger') {
        return {
            bg: 'bg-red-50',
            border: 'border-red-200',
            text: 'text-red-800',
            icon: 'text-red-500',
            badge: 'bg-red-100 text-red-700',
            button: 'bg-red-600 hover:bg-red-700 text-white'
        };
    }
    if (r === 'adjust dosage' || r === 'warning') {
        return {
            bg: 'bg-amber-50',
            border: 'border-amber-200',
            text: 'text-amber-800',
            icon: 'text-amber-500',
            badge: 'bg-amber-100 text-amber-700',
            button: 'bg-amber-600 hover:bg-amber-700 text-white'
        };
    }
    if (r === 'safe' || r === 'normal') {
        return {
            bg: 'bg-emerald-50',
            border: 'border-emerald-200',
            text: 'text-emerald-800',
            icon: 'text-emerald-500',
            badge: 'bg-emerald-100 text-emerald-700',
            button: 'bg-emerald-600 hover:bg-emerald-700 text-white'
        };
    }

    return { bg: 'bg-[#F8F9FA]', border: 'border-slate-100', text: 'text-slate-900', icon: 'text-slate-400', badge: 'bg-slate-100 text-slate-700' };
}

export default function AnalysisPage() {
    const [file, setFile] = useState(null);
    const [results, setResults] = useState(null);
    const [user, setUser] = useState(null);
    const [drugInput, setDrugInput] = useState('');
    const [activeTab, setActiveTab] = useState('overview');

    // Loading State
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [loadingStep, setLoadingStep] = useState(0);

    const router = useRouter();

    // Determine current theme based on specific drug analysis
    const currentTheme = results?.specificDrugAnalysis?.drug_risks
        ? getRiskTheme(results.specificDrugAnalysis.drug_risks)
        : getRiskTheme(null);

    const LOADING_STEPS = [
        "Parsing VCF file",
        "Identifying variants",
        "Calling star alleles",
        "Predicting phenotypes",
        "Classifying drug responses",
        "Generating report"
    ];

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

    const simulateLoading = () => {
        setLoadingStep(0);
        const interval = setInterval(() => {
            setLoadingStep(prev => {
                if (prev >= LOADING_STEPS.length - 1) {
                    clearInterval(interval);
                    return prev;
                }
                return prev + 1;
            });
        }, 800); // Advance step every 800ms
        return interval;
    };

    const handleFileUpload = async () => {
        if (!file) return;
        setIsAnalyzing(true);
        const loadingInterval = simulateLoading();

        const formData = new FormData();
        formData.append('vcf', file);
        if (drugInput) formData.append('drug', drugInput);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/vcf/upload`, {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();

            // Ensure animation finishes visually before showing results
            setTimeout(() => {
                clearInterval(loadingInterval);
                if (response.ok) {
                    setResults(data);
                    setIsAnalyzing(false);
                } else {
                    alert(`Analysis Failed: ${data.message || 'Unknown Error'}`);
                    setIsAnalyzing(false);
                }
            }, 5000); // Ensure at least 5 seconds of "analysis" theatre

        } catch (error) {
            console.error(error);
            clearInterval(loadingInterval);
            setIsAnalyzing(false);
            alert("Backend Connection Error. Ensure server is running on port 5000.");
        }
    };

    return (
        <div className={`flex h-screen ${currentTheme.bg} transition-colors duration-1000 font-sans text-slate-900`}>
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-100 p-6 flex flex-col justify-between hidden md:flex z-10">
                <div>
                    <div className="flex items-center gap-3 mb-8 px-2">
                        <img src="/logo.jpg" alt="Jeevyukt" className="w-32 h-auto object-contain mix-blend-multiply hue-rotate-180" />
                    </div>
                    <nav className="space-y-1">
                        <NavItem icon={LayoutGrid} label="Dashboard" href="/dashboard" />
                        <NavItem icon={Activity} label="Analysis" active href="/analysis" />
                        <NavItem icon={MapPin} label="Find Doctors" href="/doctors" />
                        <NavItem icon={History} label="History" href="/history" />
                        <NavItem icon={Settings} label="Settings" href="/settings" />
                    </nav>
                </div>
                <div>
                    <div className="px-4 py-3 mb-6 bg-indigo-50 rounded-xl">
                        <p className="text-xs font-bold text-indigo-900 mb-1">Pro Plan</p>
                        <p className="text-[10px] text-indigo-600">Expires in 24 days</p>
                    </div>
                    <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-500 transition-colors w-full text-left text-sm font-medium">
                        <LogOut size={18} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-20">
                    <div className="flex items-center gap-4">
                        <h1 className="text-lg font-bold text-slate-800">Analysis</h1>
                        {results && (
                            <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-100">
                                Completed
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-xs font-bold ring-2 ring-white shadow-sm">
                            {user?.email?.charAt(0).toUpperCase() || 'U'}
                        </div>
                    </div>
                </header>

                <div className="p-8 max-w-6xl mx-auto">
                    {isAnalyzing ? (
                        // LOADING STATE
                        <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-2xl mx-auto">
                            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg shadow-indigo-200 mb-8 animate-pulse">
                                🧬
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Analyzing Genomic Data</h2>
                            <p className="text-slate-500 mb-10">Processing your pharmacogenomic variants...</p>

                            <div className="w-full space-y-4">
                                {LOADING_STEPS.map((step, index) => (
                                    <div key={index} className="flex items-center gap-4 p-4 rounded-xl transition-all duration-500"
                                        style={{
                                            opacity: index <= loadingStep ? 1 : 0.4,
                                            backgroundColor: index === loadingStep ? 'white' : 'transparent',
                                            boxShadow: index === loadingStep ? '0 4px 6px -1px rgb(0 0 0 / 0.05)' : 'none'
                                        }}
                                    >
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors duration-500 ${index < loadingStep ? 'bg-green-500 border-green-500 text-white' :
                                            index === loadingStep ? 'border-indigo-600 text-indigo-600' :
                                                'border-slate-200 text-slate-200'
                                            }`}>
                                            {index < loadingStep ? <CheckCircle2 size={14} /> :
                                                index === loadingStep ? <Loader2 size={14} className="animate-spin" /> :
                                                    <div className="w-2 h-2 rounded-full bg-slate-200" />}
                                        </div>
                                        <span className={`font-medium ${index <= loadingStep ? 'text-slate-800' : 'text-slate-400'}`}>
                                            {step}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : !results ? (
                        // UPLOAD STATE
                        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                            <div className="mb-8">
                                <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl mx-auto shadow-lg shadow-indigo-200 mb-6">
                                    🧬
                                </div>
                                <h2 className="text-3xl font-bold text-slate-900 mb-3">Precision Medicine Engine</h2>
                                <p className="text-slate-500 max-w-lg mx-auto">Upload a VCF file to detect pharmacogenomic variants, determine metabolizer status, and generate evidence-based predictions.</p>
                            </div>

                            <div className="w-full max-w-xl bg-white rounded-3xl p-10 shadow-sm border border-slate-100 hover:border-indigo-100 transition-all group cursor-pointer"
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => { e.preventDefault(); setFile(e.dataTransfer.files[0]); }}
                                onClick={() => !file && document.getElementById('vcfInput').click()}
                            >
                                <input type="file" id="vcfInput" className="hidden" accept=".vcf,.txt" onChange={(e) => setFile(e.target.files[0])} />

                                {!file ? (
                                    <>
                                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                            <Upload className="text-slate-400 group-hover:text-indigo-600" />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-700">Upload VCF File</h3>
                                        <p className="text-sm text-slate-400 mt-2">Drag and drop or click to browse</p>
                                        <div className="mt-6">
                                            <a href="/sample_genome.vcf" download className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline flex items-center justify-center gap-1">
                                                <Download size={14} /> Download Sample VCF
                                            </a>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-left">
                                        <div className="flex items-center gap-4 mb-6 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-indigo-600 shadow-sm">
                                                <Activity size={20} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-indigo-900 text-sm">{file.name}</p>
                                                <p className="text-xs text-indigo-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                            </div>
                                        </div>

                                        {/* Drug Input - Clean Look */}
                                        <div className="mb-6">
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Check Specific Drug (Optional)</label>
                                            <input
                                                type="text"
                                                value={drugInput}
                                                onChange={(e) => setDrugInput(e.target.value)}
                                                placeholder="e.g. Clopidogrel"
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                                            />
                                        </div>

                                        <div className="flex gap-3">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleFileUpload(); }}
                                                className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                                            >
                                                Run Analysis
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setFile(null); setDrugInput(''); }}
                                                className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-colors"
                                            >
                                                Reset
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        // RESULTS STATE
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Header and Actions */}
                            <div className="flex justify-between items-end mb-8">
                                <div>
                                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Analysis Report</h2>
                                    <p className="text-slate-500 text-sm">{file.name} • {new Date().toLocaleDateString()}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => { setResults(null); setFile(null); setDrugInput(''); setActiveTab('overview'); }} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 text-sm font-bold rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2">
                                        <Upload size={14} /> New Analysis
                                    </button>
                                </div>
                            </div>

                            {/* TABS */}
                            <div className="flex border-b border-slate-200 mb-8">
                                <TabButton label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
                                <TabButton label="Gene Details" active={activeTab === 'genes'} onClick={() => setActiveTab('genes')} />
                                <TabButton label="JSON Output" active={activeTab === 'json'} onClick={() => setActiveTab('json')} />
                            </div>

                            {/* TAB CONTENT */}
                            {activeTab === 'overview' && (
                                <div className="space-y-8 animate-in fade-in duration-300">
                                    {/* Summary Cards */}
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <SummaryCard icon={Activity} label="Total Variants" value={results.summary.totalVariants} color="blue" />
                                        <SummaryCard icon={User} label="Genes Analyzed" value={results.summary.genesAnalyzed.length} color="indigo" />
                                        <SummaryCard icon={AlertTriangle} label="High Risk" value={results.summary.highRiskCount} color="red" />
                                        <SummaryCard icon={Shield} label="Actionable" value={results.riskReport.filter(r => r.risk !== 'Safe').length} color="emerald" />
                                    </div>

                                    {/* Specific Drug Result */}
                                    {results.specificDrugAnalysis && (
                                        <div>
                                            {results.specificDrugAnalysis.message ? (
                                                // UNKNOWN DRUG STATE
                                                <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 text-center">
                                                    <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500">
                                                        <Search size={24} />
                                                    </div>
                                                    <h3 className="text-lg font-bold text-slate-800 mb-2">Drug Not Found</h3>
                                                    <p className="text-slate-500 max-w-md mx-auto">
                                                        {results.specificDrugAnalysis.message}
                                                    </p>
                                                    <button onClick={() => setDrugInput('')} className="mt-4 text-sm font-bold text-indigo-600 hover:text-indigo-800">
                                                        Try Another Drug
                                                    </button>
                                                </div>
                                            ) : (
                                                // VALID DRUG ANALYSIS
                                                <div>
                                                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">Targeted Analysis</h3>

                                                    {/* Dynamic Theme Card */}
                                                    <div className={`p-6 rounded-3xl border-2 shadow-sm ${currentTheme.bg} ${currentTheme.border}`}>
                                                        <div className="flex justify-between items-start">
                                                            <div className="w-full">
                                                                <div className={`text-xs font-bold uppercase tracking-wider opacity-70 mb-2 ${currentTheme.text}`}>Drug Response</div>
                                                                <h2 className={`text-3xl font-bold mb-4 ${currentTheme.text}`}>
                                                                    {drugInput}: {results.specificDrugAnalysis.drug_risks}
                                                                </h2>
                                                                <p className="text-base text-slate-600 max-w-3xl leading-relaxed mb-6">
                                                                    {results.specificDrugAnalysis.clinical_explanation}
                                                                </p>

                                                                {/* Recommendation Section */}
                                                                <div className="bg-white/60 p-5 rounded-xl border border-white/50 backdrop-blur-sm mb-6">
                                                                    <h4 className={`text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2 ${currentTheme.icon}`}>
                                                                        <Shield size={16} /> Recommendation
                                                                    </h4>
                                                                    <p className={`font-bold text-lg ${currentTheme.text}`}>
                                                                        {results.specificDrugAnalysis.actionable_recommendation || results.specificDrugAnalysis.dosing_recommendation}
                                                                    </p>
                                                                </div>

                                                                {/* Alternative Suggestions */}
                                                                {results.specificDrugAnalysis.alternatives && results.specificDrugAnalysis.alternatives.length > 0 && results.specificDrugAnalysis.drug_risks !== 'Safe' && (
                                                                    <div className="bg-white/40 p-5 rounded-xl border border-white/30 backdrop-blur-sm">
                                                                        <h4 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                                                                            <Heart size={16} className="text-emerald-500" /> Safer Alternatives
                                                                        </h4>
                                                                        <div className="flex flex-wrap gap-2">
                                                                            {results.specificDrugAnalysis.alternatives.map((alt, i) => (
                                                                                <span key={i} className="px-3 py-1.5 bg-emerald-100 text-emerald-800 text-sm font-bold rounded-lg border border-emerald-200 shadow-sm">
                                                                                    {alt}
                                                                                </span>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Explainability Chain */}
                                                        {results.specificDrugAnalysis.visual_chain && (
                                                            <div className="mt-8 pt-8 border-t border-black/5 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200">
                                                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Mechanism of Action</h4>
                                                                <ExplainabilityChain chain={results.specificDrugAnalysis.visual_chain} />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Dosage Adjustments - HIDDEN IF SAFE */}
                                    {(!results.specificDrugAnalysis || (results.specificDrugAnalysis.drug_risks !== 'Safe' && !results.specificDrugAnalysis.message)) && (
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                                <AlertTriangle size={18} className="text-amber-500" />
                                                Dosage Adjustments Needed
                                            </h3>
                                            <div className="space-y-3">
                                                {results.riskReport
                                                    .filter(r => r.risk !== 'Safe' && r.risk !== 'Normal')
                                                    .map((report, idx) => (
                                                        <div key={idx} className="bg-amber-50 border border-amber-100 p-5 rounded-xl flex items-start gap-4">
                                                            <div className="mt-1">
                                                                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                                                            </div>
                                                            <div>
                                                                <h4 className="font-bold text-slate-800 text-sm">
                                                                    {report.drug} <span className="text-amber-600 font-normal">— {report.risk}</span>
                                                                </h4>
                                                                <p className="text-xs text-amber-700 mt-1 font-medium bg-amber-100/50 px-2 py-1 rounded-md inline-block">
                                                                    {report.recommendation}
                                                                </p>
                                                                <p className="text-xs text-slate-500 mt-2">
                                                                    {report.gene} ({report.phenotype})
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                {results.riskReport.filter(r => r.risk !== 'Safe' && r.risk !== 'Normal').length === 0 && (
                                                    <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-100 text-slate-400 text-sm">
                                                        No critical dosage adjustments found for other drugs.
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'genes' && (
                                <div className="animate-in fade-in duration-300">
                                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-6">Analysed Genes & Phenotypes</h3>
                                    <div className="space-y-4">
                                        {Object.entries(results.phenotypeProfile || {}).map(([gene, phenotype], idx) => (
                                            <div key={idx} className="bg-white border border-slate-200 rounded-xl p-6 flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-slate-700">
                                                        {gene.substring(0, 4)}...
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-slate-900">{gene}</h4>
                                                        <span className={`inline-block px-2 py-1 rounded text-xs font-bold mt-1 ${phenotype.includes('Poor') ? 'bg-red-100 text-red-700' :
                                                            phenotype.includes('Rapid') ? 'bg-amber-100 text-amber-700' :
                                                                'bg-green-100 text-green-700'
                                                            }`}>
                                                            {phenotype}
                                                        </span>
                                                    </div>
                                                </div>
                                                <ChevronRight className="text-slate-300" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'json' && (
                                <div className="animate-in fade-in duration-300">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Raw Output</h3>
                                        <div className="flex gap-2">
                                            <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-600 transition-colors">
                                                <Copy size={12} /> Copy
                                            </button>
                                            <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-600 transition-colors">
                                                <Download size={12} /> Download
                                            </button>
                                        </div>
                                    </div>
                                    <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
                                        <pre className="text-xs text-blue-300 font-mono">
                                            {JSON.stringify(results, null, 2)}
                                        </pre>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

function NavItem({ icon: Icon, label, active, href }) {
    return (
        <a href={href || "#"} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all font-medium text-sm ${active ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}>
            <Icon size={18} />
            <span>{label}</span>
        </a>
    )
}

function TabButton({ label, active, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`px-6 py-3 text-sm font-bold border-b-2 transition-all ${active
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
        >
            {label}
        </button>
    )
}

function SummaryCard({ icon: Icon, label, value, color }) {
    const colors = {
        blue: "bg-blue-50 text-blue-600",
        indigo: "bg-indigo-50 text-indigo-600",
        red: "bg-red-50 text-red-600",
        emerald: "bg-emerald-50 text-emerald-600"
    };

    return (
        <div className="bg-white border border-slate-100 p-5 rounded-2xl flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors[color] || colors.blue}`}>
                <Icon size={24} />
            </div>
            <div>
                <h4 className="text-2xl font-bold text-slate-800">{value}</h4>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{label}</p>
            </div>
        </div>
    );
}
