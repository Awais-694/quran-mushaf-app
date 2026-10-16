"use client";

import { useEffect } from "react";
import { getTheme } from "@/lib/settings";

// Save shuda theme page load par laga do.
export function ThemeInit() {
  useEffect(() => {
    document.documentElement.dataset.theme = getTheme();
  }, []);
  return null;
}
