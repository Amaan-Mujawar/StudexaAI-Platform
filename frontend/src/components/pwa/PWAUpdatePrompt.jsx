// src/components/pwa/PWAUpdatePrompt.jsx
//
// Shows a non-blocking toast-style banner when a new service-worker version
// is available, letting the user refresh to pick up the update.

import { useEffect, useState } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import { RefreshCw, X } from "lucide-react";

const PWAUpdatePrompt = () => {
  const [show, setShow] = useState(false);

  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      // Check for updates every 60 minutes
      if (r) {
        setInterval(() => r.update(), 60 * 60 * 1000);
      }
    },
    onRegisterError(_error) {
      // SW registration failures are silently ignored in production;
      // the app still works fully without the service worker.
    },
  });

  useEffect(() => {
    if (needRefresh) setShow(true);
  }, [needRefresh]);

  if (!show) return null;

  return (
    <div
      role="alert"
      aria-live="polite"
      className="fixed bottom-5 left-1/2 z-[9999] flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 items-center gap-3 rounded-2xl border border-border bg-white px-4 py-3 shadow-card sm:left-auto sm:right-5 sm:translate-x-0"
    >
      {/* Icon */}
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-blue/10">
        <RefreshCw className="h-4 w-4 text-brand-blue" />
      </span>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-text-title">Update available</p>
        <p className="text-xs text-text-body">Reload to get the latest version.</p>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-2">
        <button
          onClick={() => updateServiceWorker(true)}
          className="inline-flex items-center rounded-lg bg-brand-gradient px-3 py-1.5 text-xs font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-card focus:outline-none focus:ring-2 focus:ring-brand-blue/40"
        >
          Reload
        </button>
        <button
          onClick={() => setShow(false)}
          aria-label="Dismiss update prompt"
          className="flex h-7 w-7 items-center justify-center rounded-lg text-text-body transition hover:bg-surface-page focus:outline-none focus:ring-2 focus:ring-border"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default PWAUpdatePrompt;

