'use client';
import { useState } from 'react';
import { MessageSquare, Send, User, LogOut, LayoutGrid, Activity, History, Settings } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function ChatPage() {
    const [messages, setMessages] = useState([{ role: 'model', content: 'Hello! I am your Pharmacogenomic Assistant. Ask me about your genetic results or drug interactions.' }]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        const newMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, newMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    history: messages.map(m => ({ role: m.role, parts: [{ text: m.content }] })),
                    message: newMessage.content
                })
            });

            const data = await response.json();
            if (data.response) {
                setMessages(prev => [...prev, { role: 'model', content: data.response }]);
            } else {
                setMessages(prev => [...prev, { role: 'model', content: "Sorry, I couldn't get a response. Please check the backend connection." }]);
            }
        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, { role: 'model', content: "Error connecting to the server. Is it running?" }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-[#F7F4F2] font-sans">
            {/* Sidebar Placeholder (Reuse Component ideally) */}
            <aside className="w-64 bg-[#FBF9F8] p-6 flex flex-col justify-between hidden md:flex rounded-r-[40px] shadow-sm z-10">
                <div>
                    <div className="flex items-center gap-3 mb-10 px-2">
                        <img src="/logo.jpg" alt="Jeevyukt" className="w-32 h-auto object-contain mix-blend-multiply hue-rotate-180" />
                    </div>
                    <nav className="space-y-2">
                        <NavItem icon={LayoutGrid} label="Dashboard" href="/dashboard" />
                        <NavItem icon={Activity} label="Analysis" href="/analysis" />
                        <NavItem icon={MessageSquare} label="AI Assistant" active href="/chat" />
                    </nav>
                </div>
            </aside>

            <main className="flex-1 p-8 flex flex-col h-screen relative">
                {/* Custom Background */}
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('/chat-bg.png')" }}
                >
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>
                </div>

                <div className="relative z-10 flex flex-col h-full">
                    <header className="mb-6 flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-white drop-shadow-md">AI Assistant</h1>
                    </header>

                    <div className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl p-6 overflow-hidden flex flex-col">
                        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`p-4 rounded-2xl max-w-[80%] text-sm shadow-lg backdrop-blur-sm ${msg.role === 'user'
                                        ? 'bg-teal-500/80 text-white rounded-br-none border border-teal-400/30'
                                        : 'bg-white/80 text-slate-800 rounded-bl-none border border-white/40'
                                        }`}>
                                        <div className="prose prose-sm max-w-none prose-p:my-1 prose-ul:list-disc prose-ul:pl-4 prose-li:my-0.5 prose-strong:text-current prose-headings:text-current">
                                            <ReactMarkdown
                                                components={{
                                                    p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                                    ul: ({ node, ...props }) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
                                                    li: ({ node, ...props }) => <li className="marker:text-current" {...props} />
                                                }}
                                            >
                                                {msg.content}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="p-4 rounded-2xl bg-white/50 text-white text-xs animate-pulse border border-white/20">
                                        Thinking...
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="mt-4 pt-4 border-t border-white/10 flex gap-2">
                            <input
                                type="text"
                                className="flex-1 bg-white/20 text-white placeholder-white/70 rounded-xl px-4 text-sm outline-none border border-white/10 focus:bg-white/30 transition-all backdrop-blur-sm"
                                placeholder="Type your question..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!input.trim() || loading}
                                className="p-3 bg-teal-500 text-white rounded-xl hover:bg-teal-400 transition-colors disabled:opacity-50 shadow-lg"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

function NavItem({ icon: Icon, label, active, href }) {
    return (
        <a href={href || "#"} className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all font-medium text-sm ${active ? 'text-teal-600 bg-teal-50 shadow-sm font-bold' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}>
            <Icon size={20} className={active ? 'stroke-[2.5px]' : ''} />
            <span>{label}</span>
        </a>
    )
}
