import React, { useState } from 'react';
import api from '../../api/axios';
import { Eye, EyeOff, RefreshCw } from 'lucide-react';

export default function EventAdmin() {
    const [password, setPassword] = useState('');
    const [isAuth, setIsAuth] = useState(false);
    const [stats, setStats] = useState(null);
    const [errMs, setErrMs] = useState('');
    const [msg, setMsg] = useState('');
    const [showPwd, setShowPwd] = useState(false);

    const API = '/event/admin';

    const login = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post(`${API}/stats`, { password });
            setStats(res.data);
            setIsAuth(true);
            setErrMs('');
        } catch (e) {
            if (e.response?.status === 401) {
                setErrMs('Invalid password');
            } else if (e.response?.status === 404) {
                setErrMs('API not found (Backend running?)');
            } else {
                setErrMs('Network or Server Error');
            }
        }
    };

    const loadStats = async () => {
        try {
            const res = await api.post(`${API}/stats`, { password });
            setStats(res.data);
        } catch { }
    }

    const allocate = async () => {
        try {
            await api.post(`${API}/assign`, { password });
            setMsg('Teams assigned.');
            loadStats();
        } catch (e) { setErrMs(e.response?.data?.error || 'Error') }
    };

    const resetData = async () => {
        if (!window.confirm("Are you sure you want to delete all students and reopen registration?")) return;
        try {
            await api.post(`${API}/reset`, { password });
            setMsg('Registrations unlocked and all test data wiped!');
            loadStats();
        } catch (e) { setErrMs('Failed to reset.'); }
    };

    if (!isAuth) {
        return (
            <div className="min-h-[70vh] flex flex-col justify-center px-4 py-12 max-w-sm mx-auto w-full">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-white mb-2">Event Admin</h1>
                    <p className="text-zinc-500 text-sm">Please log in to manage allocations.</p>
                </div>
                <form onSubmit={login} className="space-y-4">
                    <div className="relative">
                        <input
                            type={showPwd ? 'text' : 'password'}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Admin Password"
                            required
                            className="w-full bg-zinc-900 border border-zinc-800 p-4 pr-12 text-white rounded-lg focus:outline-none focus:border-red-500 tracking-wide"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPwd(!showPwd)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                        >
                            {showPwd ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                    <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold p-4 rounded-lg min-h-[44px] transition-colors">Login</button>
                    {errMs && <p className="text-red-400 text-center font-medium mt-4">{errMs}</p>}
                </form>
            </div>
        );
    }

    return (
        <div className="min-h-[70vh] max-w-3xl mx-auto px-4 py-12 text-white">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Event Admin Dashboard</h1>
                <button onClick={loadStats} className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-4 py-2 rounded-lg transition-colors text-sm font-medium">
                    <RefreshCw size={16} /> Refresh
                </button>
            </div>

            {msg && <div className="bg-green-600/20 text-green-400 p-3 rounded mb-4">{msg}</div>}
            {errMs && <div className="bg-red-600/20 text-red-400 p-3 rounded mb-4">{errMs}</div>}

            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded text-center mb-6">
                <h2 className="text-sm text-zinc-400">Total Registered</h2>
                <p className="text-3xl font-bold">{stats?.totalRegistered || 0} / 120</p>
            </div>

            <div className="flex gap-4 mb-8">
                <button onClick={allocate} disabled={stats?.assignedTeamsAt} className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:bg-zinc-800 text-white p-4 rounded-xl font-bold min-h-[44px] shadow-lg">
                    {stats?.assignedTeamsAt ? 'Teams already assigned' : 'Close registration and assign teams now'}
                </button>
                <button onClick={resetData} className="px-6 bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-500/30 rounded-xl font-bold transition-all">
                    Reset Data
                </button>
            </div>

            {stats?.assignedTeamsAt && stats?.distribution && (
                <div>
                    <h2 className="text-xl font-bold mb-4">Allocation Preview</h2>
                    <div className="space-y-3">
                        {Object.entries(stats.distribution).map(([domain, counts]) => (
                            <div key={domain} className="bg-zinc-900 border border-zinc-800 p-4 rounded flex justify-between items-center">
                                <span className="font-medium text-lg">{domain}</span>
                                <div className="text-sm text-zinc-400 space-x-4">
                                    <span>Boys: <strong className={counts.boy === 15 ? 'text-green-400' : 'text-white'}>{counts.boy}</strong></span>
                                    <span>Girls: <strong className={counts.girl === 9 ? 'text-green-400' : 'text-white'}>{counts.girl}</strong></span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
