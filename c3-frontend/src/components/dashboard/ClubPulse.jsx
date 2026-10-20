import React from 'react';
import { BookOpen, Calendar, Users, TrendingUp } from 'lucide-react';
import CountUp from '../reactbits/CountUp';

export const ClubPulse = ({ club }) => {
  const totalSessions = club?.totalSessions || 0;
  const totalEvents = club?.totalEvents || 0;
  const totalMembers = club?.totalMembers || 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-400">
        <TrendingUp className="w-4 h-4 text-white" />
        <span>Club Pulse (All-Time Stats)</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {/* Pulse Card 1: Club Sessions Held */}
        <div className="p-5 rounded-2xl bg-zinc-950/80 border border-white/10 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-zinc-400">Club sessions held</span>
            <div className="text-2xl sm:text-3xl font-extrabold font-heading text-white mt-1">
              <CountUp to={totalSessions} duration={1.5} />
            </div>
            <span className="text-[11px] text-zinc-500">Total conducted club sessions</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        {/* Pulse Card 2: Club Events */}
        <div className="p-5 rounded-2xl bg-zinc-950/80 border border-white/10 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-zinc-400">Club events</span>
            <div className="text-2xl sm:text-3xl font-extrabold font-heading text-white mt-1">
              <CountUp to={totalEvents} duration={1.5} />
            </div>
            <span className="text-[11px] text-zinc-500">Workshops & hackathons</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        {/* Pulse Card 3: Active Members */}
        <div className="p-5 rounded-2xl bg-zinc-950/80 border border-white/10 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-zinc-400">Active members</span>
            <div className="text-2xl sm:text-3xl font-extrabold font-heading text-white mt-1">
              <CountUp to={totalMembers} duration={1.5} />
            </div>
            <span className="text-[11px] text-zinc-500">Approved club roster</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubPulse;
