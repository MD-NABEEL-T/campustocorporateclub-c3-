import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from './ToastContext';

const PWAContext = createContext(null);

const DISMISS_KEY = 'c3_pwa_install_dismissed_at';
const FOURTEEN_DAYS_MS = 14 * 24 * 60 * 60 * 1000;

export const PWAProvider = ({ children }) => {
  const { addToast } = useToast();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isDismissed, setIsDismissed] = useState(true); // default true until checked

  // Check standalone mode and platform
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkStandalone = () => {
      const isDisplayStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isNavStandalone = window.navigator.standalone === true;
      const isTwa = document.referrer.includes('android-app://');
      return isDisplayStandalone || isNavStandalone || isTwa;
    };

    const standaloneNow = checkStandalone();
    setIsStandalone(standaloneNow);

    // iOS Safari detection
    const ua = window.navigator.userAgent;
    const isIOSDevice =
      /iPad|iPhone|iPod/.test(ua) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isSafari =
      /Safari/.test(ua) && !/Chrome|CriOS|FxiOS|EdgiOS|OPiOS|mercury/i.test(ua);
    setIsIOS(isIOSDevice && isSafari && !standaloneNow);

    // Check 14-day dismissal
    try {
      const savedTimestamp = localStorage.getItem(DISMISS_KEY);
      if (savedTimestamp) {
        const parsed = parseInt(savedTimestamp, 10);
        if (!isNaN(parsed) && Date.now() - parsed < FOURTEEN_DAYS_MS) {
          setIsDismissed(true);
        } else {
          setIsDismissed(false);
        }
      } else {
        setIsDismissed(false);
      }
    } catch {
      setIsDismissed(false);
    }

    // Listen for display-mode changes
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleMediaChange = (e) => {
      setIsStandalone(e.matches);
    };
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMediaChange);
    } else {
      mediaQuery.addListener(handleMediaChange);
    }

    // Listen for beforeinstallprompt
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Listen for appinstalled
    const handleAppInstalled = () => {
      setIsStandalone(true);
      setDeferredPrompt(null);
    };
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleMediaChange);
      } else {
        mediaQuery.removeListener(handleMediaChange);
      }
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Register service worker in production builds only, after window load event
  const waitingWorkerRef = React.useRef(null);
  const userWantsReload = React.useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    if (!import.meta.env.PROD) {
      return;
    }

    const triggerUpdateToast = (worker) => {
      waitingWorkerRef.current = worker;
      addToast(
        <button
          type="button"
          onClick={() => {
            userWantsReload.current = true;
            if (waitingWorkerRef.current) {
              waitingWorkerRef.current.postMessage({ type: 'SKIP_WAITING' });
            } else {
              window.location.reload();
            }
          }}
          className="text-left font-medium text-white hover:underline cursor-pointer flex items-center gap-1.5"
        >
          <span>New version available, tap to refresh</span>
        </button>,
        'info',
        10000
      );
    };

    const onControllerChange = () => {
      if (userWantsReload.current) {
        window.location.reload();
      }
    };
    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);

    const onNextNavigation = () => {
      if (waitingWorkerRef.current) {
        userWantsReload.current = true;
        waitingWorkerRef.current.postMessage({ type: 'SKIP_WAITING' });
      }
    };
    window.addEventListener('beforeunload', onNextNavigation);

    const registerSW = () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          // Check if waiting worker exists
          if (reg.waiting) {
            triggerUpdateToast(reg.waiting);
          }

          reg.addEventListener('updatefound', () => {
            const installing = reg.installing;
            if (!installing) return;
            installing.addEventListener('statechange', () => {
              if (
                installing.state === 'installed' &&
                navigator.serviceWorker.controller
              ) {
                triggerUpdateToast(installing);
              }
            });
          });
        })
        .catch((err) => {
          console.error('[PWA] Registration failed:', err);
        });
    };

    if (document.readyState === 'complete') {
      registerSW();
    } else {
      window.addEventListener('load', registerSW);
      return () => {
        window.removeEventListener('load', registerSW);
        navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
        window.removeEventListener('beforeunload', onNextNavigation);
      };
    }

    return () => {
      navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
      window.removeEventListener('beforeunload', onNextNavigation);
    };
  }, [addToast]);

  const dismissCard = useCallback(() => {
    setIsDismissed(true);
    try {
      localStorage.setItem(DISMISS_KEY, Date.now().toString());
    } catch {}
  }, []);

  const promptInstall = useCallback(async () => {
    if (isIOS) {
      addToast(
        'To install on iOS: Tap the Share button in Safari toolbar, then select "Add to Home Screen".',
        'info',
        6000
      );
      return false;
    }
    if (!deferredPrompt) return false;
    try {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice?.outcome === 'accepted') {
        setDeferredPrompt(null);
        return true;
      }
      return false;
    } catch (err) {
      console.error('[PWA] Prompt install error:', err);
      return false;
    }
  }, [deferredPrompt, isIOS, addToast]);

  const canInstall = !isStandalone && (Boolean(deferredPrompt) || isIOS);
  const showDashboardCard = canInstall && !isDismissed;

  return (
    <PWAContext.Provider
      value={{
        isStandalone,
        isIOS,
        canInstall,
        showDashboardCard,
        dismissCard,
        promptInstall,
        deferredPrompt,
      }}
    >
      {children}
    </PWAContext.Provider>
  );
};

export const usePWA = () => {
  const context = useContext(PWAContext);
  if (!context) {
    throw new Error('usePWA must be used within a PWAProvider');
  }
  return context;
};

export default PWAContext;
