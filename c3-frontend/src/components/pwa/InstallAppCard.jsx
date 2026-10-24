import React from 'react';
import { Download, X, Share, PlusSquare, Smartphone } from 'lucide-react';
import { usePWA } from '../../context/PWAContext';
import { Button } from '../ui/Button';

export const InstallAppCard = () => {
  const { showDashboardCard, isIOS, promptInstall, dismissCard } = usePWA();

  if (!showDashboardCard) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 p-4 sm:p-5 shadow-2xl transition-all duration-300">
      {/* Decorative Glow */}
      <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-white/5 blur-2xl pointer-events-none" />

      {/* Dismiss Button */}
      <button
        type="button"
        onClick={dismissCard}
        className="absolute top-3.5 right-3.5 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        aria-label="Dismiss install banner"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pr-7 sm:pr-8">
        {/* App Info & Icon */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-black border border-white/20 flex items-center justify-center shrink-0 overflow-hidden shadow-md">
            <img
              src="/icons/icon-192.png"
              alt="C3 App Icon"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-tight">
                Install C3 Portal
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                PWA App
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              {isIOS
                ? 'Install on your iPhone or iPad for quick access and full-screen workspace.'
                : 'Install on your home screen or desktop for fast offline access and alerts.'}
            </p>
          </div>
        </div>

        {/* Action: Install Button (Chrome/Android) or iOS Share Instructions */}
        <div className="w-full sm:w-auto shrink-0">
          {isIOS ? (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-zinc-300 w-full sm:w-auto">
              <Share className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>Tap Share, then Add to Home Screen</span>
              <PlusSquare className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            </div>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={promptInstall}
              className="w-full sm:w-auto min-h-[44px] sm:min-h-0 h-10 px-5 text-xs font-bold bg-white text-black hover:bg-zinc-200 justify-center shadow-lg"
              leftIcon={<Download className="w-4 h-4 text-black" />}
            >
              Install App
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstallAppCard;
