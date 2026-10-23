import React from 'react';
import { ShieldCheck, User } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';

export const CoordinatorsCard = ({ coordinators = [] }) => {
  return (
    <Card className="bg-zinc-950/80 border border-white/10 p-5 sm:p-6 rounded-2xl shadow-xl flex flex-col justify-between">
      <div>
        <CardHeader className="p-0 pb-3 border-b border-white/10 flex flex-row items-center justify-between">
          <CardTitle className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            Club Coordinators
          </CardTitle>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
            {coordinators.length > 0 ? `${coordinators.length} Active` : 'None'}
          </span>
        </CardHeader>

        <CardContent className="p-0 pt-3">
          {coordinators.length === 0 ? (
            <div className="py-6 text-center text-xs text-zinc-500 font-mono">
              No coordinators assigned yet
            </div>
          ) : (
            <div className="space-y-2.5">
              {coordinators.map((c) => (
                <div
                  key={c._id}
                  className="p-2.5 rounded-xl bg-zinc-900/60 border border-white/5 flex items-center justify-between gap-2.5 hover:border-white/15 transition-all"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                      <User className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{c.name}</p>
                      <p className="text-[10px] font-mono text-zinc-400 truncate">
                        {c.section ? `${c.section}` : 'CSE'}
                        {c.year ? ` • Year ${c.year}` : ''}
                      </p>
                    </div>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase font-semibold bg-white/5 text-zinc-400 border border-white/10 shrink-0">
                    Staff
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </div>

      <div className="pt-3 border-t border-white/5 text-[11px] font-mono text-zinc-500 mt-3">
        Responsible for peer sessions & attendance
      </div>
    </Card>
  );
};

export default CoordinatorsCard;
