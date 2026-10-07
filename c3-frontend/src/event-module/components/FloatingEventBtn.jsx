import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { EVENT_ENABLED } from '../config';

export default function FloatingEventBtn() {
    const location = useLocation();

    // Hide it if we are already inside the event module to avoid double buttons
    if (!EVENT_ENABLED || location.pathname.startsWith('/event')) {
        return null;
    }

    return (
        <Link
            to="/event/register"
            className="fixed bottom-6 right-6 md:bottom-12 md:right-12 z-[100] group"
        >
            <div className="absolute inset-0 bg-blue-500 rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity animate-pulse"></div>
            <div className="relative flex items-center justify-center bg-zinc-900 border border-blue-500/50 text-white rounded-full p-4 shadow-2xl hover:scale-105 transition-transform">
                <Sparkles className="w-6 h-6 text-blue-400 mr-2" />
                <span className="font-bold tracking-wide">Register for Event</span>
            </div>
        </Link>
    );
}
