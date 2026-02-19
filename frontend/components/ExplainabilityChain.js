'use client';
import { motion } from 'framer-motion';
import { Dna, Activity, AlertTriangle, CheckCircle, XCircle, ArrowRight } from 'lucide-react';

const statusColors = {
    neutral: "bg-slate-100 text-slate-600 border-slate-200",
    warning: "bg-orange-50 text-orange-600 border-orange-200",
    critical: "bg-red-50 text-red-600 border-red-200",
    success: "bg-teal-50 text-teal-600 border-teal-200",
    info: "bg-blue-50 text-blue-600 border-blue-200"
};

const statusIcons = {
    neutral: Dna,
    warning: AlertTriangle,
    critical: XCircle,
    success: CheckCircle,
    info: Activity
};

export default function ExplainabilityChain({ chain }) {
    if (!chain || chain.length === 0) return null;

    return (
        <div className="w-full overflow-x-auto pb-4">
            <div className="flex items-start gap-2 min-w-max">
                {chain.map((link, index) => {
                    const Icon = statusIcons[link.status] || Activity;
                    return (
                        <div key={index} className="flex items-center">
                            {/* Step Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.15 }}
                                className={`flex flex-col w-48 p-4 rounded-xl border ${statusColors[link.status]} shadow-sm relative`}
                            >
                                <div className="text-[10px] font-bold uppercase tracking-wider opacity-70 mb-1">
                                    {link.step}
                                </div>
                                <div className="font-bold text-sm mb-2 leading-tight">
                                    {link.value}
                                </div>
                                <div className="text-xs opacity-80 leading-snug">
                                    {link.description}
                                </div>
                                <div className="absolute top-3 right-3 opacity-20">
                                    <Icon size={16} />
                                </div>
                            </motion.div>

                            {/* Arrow Connector */}
                            {index < chain.length - 1 && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.15 + 0.1 }}
                                    className="mx-2 text-slate-300"
                                >
                                    <ArrowRight size={20} />
                                </motion.div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
