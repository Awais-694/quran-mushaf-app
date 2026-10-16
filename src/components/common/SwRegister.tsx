"use client";

import { useEffect } from "react";

// PWA service worker register — production me offline chalane ke liye.
// Development mode me existing workers ko unregister karte hain taake fast refresh break na ho.
export function SwRegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    if (process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    } else {
      navigator.serviceWorker
        .getRegistrations()
        .then((registrations) => {
          for (const reg of registrations) {
            reg.unregister().catch(() => {});
          }
        })
        .catch(() => {});
    }
  }, []);

  return null;
}
