import React, { useState } from 'react';
import api from '../../api/axios';
import { Link } from 'react-router-dom';
import { Brain, Layout, Server, Database, Palette, CheckCircle, ChevronRight, User, Hash } from 'lucide-react';

const DOMAIN_DETAILS = [
    { id: 'Frontend', icon: <Layout className="w-6 h-6 mb-2" />, hook: 'Design web pages, buttons, and what users interact with.' },
    { id: 'Backend', icon: <Server className="w-6 h-6 mb-2" />, hook: 'Work with databases and the hidden engine of the app.' },
    { id: 'UI/UX', icon: <Palette className="w-6 h-6 mb-2" />, hook: 'Make screens look beautiful and easy to use.' },
    { id: 'AI/ML', icon: <Brain className="w-6 h-6 mb-2" />, hook: 'Teach computers to learn and make smart decisions.' },
    { id: 'Data Analytics', icon: <Database className="w-6 h-6 mb-2" />, hook: 'Analyze numbers to find patterns and tell a story.' }
];

export default function EventRegister() {
    const [step, setStep] = useState(1);
    const [rollNumber, setRollNumber] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const [alreadyRegistered, setAlreadyRegistered] = useState(false);
    const [allocatedDomain, setAllocatedDomain] = useState(null);

    const [memberName, setMemberName] = useState('');
    const [memberGender, setMemberGender] = useState('');
    const [ranking, setRanking] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const API_BASE = '/event';

    const handleVerify = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        try {
            const res = await api.get(`${API_BASE}/verify/${rollNumber}`);
            if (res.data.alreadyRegistered) {
                setAlreadyRegistered(true);
                setAllocatedDomain(res.data.allocatedDomain);
                setStep(3);
            } else {
                setStep(2);
            }
        } catch (err) {
            setErrorMsg("Roll number not found or invalid.");
        }
    };

    const handleRank = (domainId) => {
        if (ranking.includes(domainId)) return;
        if (ranking.length >= 3) return;
        setRanking([...ranking, domainId]);
    };

    const clearRanks = () => setRanking([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!memberName || !memberGender || ranking.length < 3) {
            setErrorMsg("Please complete all sections and pick your top 3 domains.");
            return;
        }

        // Automatically rank the unpicked ones 4th and 5th
        const finalRanking = [...ranking];
        DOMAIN_DETAILS.forEach(d => {
            if (!finalRanking.includes(d.id)) finalRanking.push(d.id);
        });

        setIsSubmitting(true);
        try {
            const payload = { rollNumber, name: memberName, gender: memberGender, ranking: finalRanking };
            const res = await api.post(`${API_BASE}/register`, payload);
            setAlreadyRegistered(res.data.alreadyRegistered || false);
            setAllocatedDomain(res.data.allocatedDomain || null);
            setStep(3);
        } catch (err) {
            if (err.response?.data?.alreadyRegistered) {
                setAlreadyRegistered(true);
                setAllocatedDomain(err.response.data.allocatedDomain);
                setStep(3);
            } else {
                setErrorMsg(err.response?.data?.error || "Submission failed.");
            }
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden flex items-center justify-center p-4">
            {/* Background ambient glowing effect */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-900/40 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-900/30 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="relative z-10 w-full max-w-lg bg-zinc-950/80 backdrop-blur-xl border border-zinc-800/50 rounded-2xl shadow-2xl p-6 md:p-8">

                {step === 1 && (
                    <form onSubmit={handleVerify} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="text-center">
                            <div className="inline-block p-4 rounded-full bg-blue-500/10 mb-4">
                                <Hash className="w-10 h-10 text-blue-400" />
                            </div>
                            <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 mb-2">C3 Registration</h1>
                            <p className="text-zinc-400">Enter your official C3 roll number to continue.</p>
                        </div>

                        <div>
                            <input
                                type="text"
                                inputMode="numeric"
                                maxLength="6"
                                className="w-full bg-zinc-900/50 border border-zinc-700/50 text-white p-5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-center text-3xl font-bold tracking-[0.3em] transition-all placeholder:text-zinc-700"
                                placeholder="256XXX"
                                value={rollNumber}
                                onChange={(e) => setRollNumber(e.target.value.replace(/\D/g, ''))}
                                required
                            />
                        </div>

                        {errorMsg && <p className="text-red-400 text-sm text-center font-medium bg-red-500/10 p-3 rounded-lg border border-red-500/20">{errorMsg}</p>}

                        <button type="submit" className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white p-4 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)]">
                            Continue <ChevronRight className="w-5 h-5" />
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                            <h2 className="text-xl font-bold">Profile Details</h2>
                            <span className="text-xs bg-zinc-800 px-3 py-1 rounded-full text-zinc-300">Roll: {rollNumber}</span>
                        </div>

                        <div className="space-y-4">
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                                <input type="text" className="w-full bg-zinc-900/60 border border-zinc-800 text-white p-4 pl-12 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium" placeholder="Your Full Name" value={memberName} onChange={e => setMemberName(e.target.value)} required />
                            </div>

                            <div className="flex gap-4">
                                <button type="button" onClick={() => setMemberGender('boy')} className={`flex-1 p-4 rounded-xl font-bold transition-all border ${memberGender === 'boy' ? 'bg-blue-600/20 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'bg-zinc-900/60 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'}`}>Boy</button>
                                <button type="button" onClick={() => setMemberGender('girl')} className={`flex-1 p-4 rounded-xl font-bold transition-all border ${memberGender === 'girl' ? 'bg-pink-600/20 border-pink-500 text-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.3)]' : 'bg-zinc-900/60 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'}`}>Girl</button>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-end mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-2">Pick your Top 3 Domains</h3>
                                    <p className="text-sm text-zinc-400 leading-relaxed max-w-sm">
                                        We highly encourage you to choose a new domain you want to explore and learn, even if you are a complete beginner!
                                    </p>
                                </div>
                                {ranking.length > 0 && <button type="button" onClick={clearRanks} className="text-xs text-blue-400 hover:text-blue-300 font-semibold px-2 py-1">Reset</button>}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {DOMAIN_DETAILS.map(d => {
                                    const rankIndex = ranking.indexOf(d.id);
                                    const isSelected = rankIndex !== -1;

                                    // Dynamic styling based on rank
                                    let badgeColor = 'bg-blue-500';
                                    if (rankIndex === 1) badgeColor = 'bg-purple-500';
                                    if (rankIndex === 2) badgeColor = 'bg-teal-500';

                                    return (
                                        <button
                                            key={d.id}
                                            type="button"
                                            onClick={() => handleRank(d.id)}
                                            className={`relative overflow-hidden p-4 rounded-xl text-left border transition-all duration-300 ${isSelected ? 'bg-gradient-to-br from-zinc-800 to-zinc-900 border-zinc-600 shadow-lg scale-[0.98]' : (ranking.length >= 3 ? 'opacity-40 bg-zinc-900/40 border-zinc-800/50 cursor-not-allowed' : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800')}`}
                                            disabled={ranking.length >= 3 && !isSelected}
                                        >
                                            <div className={`${isSelected ? 'text-zinc-100' : 'text-zinc-400'}`}>
                                                {d.icon}
                                            </div>
                                            <h4 className={`font-bold text-sm ${isSelected ? 'text-white' : 'text-zinc-200'}`}>{d.id}</h4>
                                            <p className="text-[10px] text-zinc-500 leading-tight mt-1">{d.hook}</p>

                                            {isSelected && (
                                                <div className={`absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center shadow-lg text-xs font-black text-white ${badgeColor}`}>
                                                    {rankIndex + 1}
                                                </div>
                                            )}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        {errorMsg && <p className="text-red-400 text-sm font-medium bg-red-500/10 p-3 rounded-lg border border-red-500/20 text-center">{errorMsg}</p>}

                        <button type="submit" disabled={isSubmitting || !memberName || !memberGender || ranking.length < 3} className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white disabled:opacity-50 disabled:from-zinc-800 disabled:to-zinc-800 disabled:text-zinc-500 p-4 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)] disabled:shadow-none">
                            {isSubmitting ? 'Submitting...' : 'Submit Registration'}
                        </button>
                    </form>
                )}

                {step === 3 && (
                    <div className="text-center space-y-6 py-8 animate-in fade-in zoom-in-95 duration-500">
                        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-green-400" />
                        </div>

                        <h2 className="text-2xl font-bold text-white">
                            {allocatedDomain ? `You are in the ${allocatedDomain} team!` : (alreadyRegistered ? `You've already registered.` : `Registration Successful!`)}
                        </h2>

                        {!allocatedDomain && (
                            <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-xl inline-block mt-4">
                                <p className="text-zinc-400 font-medium">Teams will be announced soon.</p>
                            </div>
                        )}

                        <div className="pt-8">
                            <Link to="/" className="inline-block px-6 py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-white rounded-lg font-medium transition-all">
                                Return Home
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
