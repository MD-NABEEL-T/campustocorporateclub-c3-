import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

export const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'max-w-lg',
  className,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#071A2B]/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={cn(
              'relative w-full bg-[#10273D] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10',
              maxWidth,
              className
            )}
          >
            {/* Header */}
            {(title || onClose) && (
              <div className="flex items-start justify-between p-6 border-b border-white/5">
                <div>
                  {title && (
                    <h3 className="text-xl font-bold text-[#F8FAFC] tracking-tight">
                      {title}
                    </h3>
                  )}
                  {description && (
                    <p className="text-sm text-[#94A3B8] mt-1">{description}</p>
                  )}
                </div>
                {onClose && (
                  <button
                    onClick={onClose}
                    className="p-1 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}

            {/* Body Content */}
            <div className="p-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
