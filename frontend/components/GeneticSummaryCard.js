'use client';
import { ShieldCheck, AlertOctagon, Activity } from 'lucide-react';

export default function GeneticSummaryCard({ riskCount, variantCount, confidenceScore = 98 }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Risk Summary */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-500">
                    <AlertOctagon size={24} />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-slate-800">{riskCount}</h3>
                    <p className="text-sm text-slate-500 font-medium">High Risk Drugs</p>
                </div>
            </div>

            {/* Variant Summary */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                    <Activity size={24} />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-slate-800">{variantCount}</h3>
                    <p className="text-sm text-slate-500 font-medium">Variants Analyzed</p>
                </div>
            </div>

            {/* Confidence Score */}
            <div className="bg-gradient-to-br from-teal-500 to-emerald-400 p-6 rounded-2xl shadow-lg shadow-teal-500/20 text-white flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-sm">
                    <ShieldCheck size={24} />
                </div>
                <div>
                    <h3 className="text-2xl font-bold">{confidenceScore}%</h3>
                    <p className="text-sm text-white/90 font-medium">Analysis Confidence</p>
                </div>
            </div>
        </div>
    );
}
