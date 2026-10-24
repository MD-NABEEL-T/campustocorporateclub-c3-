import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '../utils/cn';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toastConfig = {
    success: {
      icon: <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />,
      badgeBg: 'bg-emerald-500/10 border-emerald-500/25',
      border: 'border-emerald-500/30',
      gradient: 'from-emerald-950/30 via-zinc-950/95 to-zinc-950/95',
    },
    error: {
      icon: <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400" />,
      badgeBg: 'bg-rose-500/10 border-rose-500/25',
      border: 'border-rose-500/30',
      gradient: 'from-rose-950/30 via-zinc-950/95 to-zinc-950/95',
    },
    warning: {
      icon: <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />,
      badgeBg: 'bg-amber-500/10 border-amber-500/25',
      border: 'border-amber-500/30',
      gradient: 'from-amber-950/30 via-zinc-950/95 to-zinc-950/95',
    },
    info: {
      icon: <Info className="w-4 h-4 sm:w-5 sm:h-5 text-sky-400" />,
      badgeBg: 'bg-sky-500/10 border-sky-500/25',
      border: 'border-sky-500/30',
      gradient: 'from-sky-950/30 via-zinc-950/95 to-zinc-950/95',
    },
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {/* Toast container: mobile friendly (inset-x-3) and pinned to bottom-right on desktop */}
      <div className="fixed bottom-4 inset-x-3 sm:inset-x-auto sm:right-5 sm:bottom-5 z-[9999] flex flex-col gap-2.5 sm:max-w-md w-auto pointer-events-none items-center sm:items-end">
        <AnimatePresence>
          {toasts.map((toast) => {
            const config = toastConfig[toast.type] || toastConfig.info;
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.96 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                  'pointer-events-auto w-full sm:w-auto sm:min-w-[300px] sm:max-w-md flex items-center justify-between gap-3 p-3 sm:p-3.5',
                  'rounded-2xl border bg-gradient-to-r shadow-2xl shadow-black/90 backdrop-blur-xl ring-1 ring-white/10',
                  config.border,
                  config.gradient
                )}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div
                    className={cn(
                      'w-8 h-8 rounded-xl border flex items-center justify-center shrink-0',
                      config.badgeBg
                    )}
                  >
                    {config.icon}
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-zinc-100 leading-snug break-words">
                    {toast.message}
                  </div>
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  aria-label="Dismiss toast"
                  className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
