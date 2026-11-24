"use client";

import { useEffect } from "react";
import { TRACKER_SCRIPT } from "@/lib/analytics";

/**
 * Mounts the first-party tracker.
 *
 * The script is injected after hydration rather than inlined into the HTML so
 * the markup stays cacheable and the tracker never blocks a first paint.
 */
export default function Analytics() {
  useEffect(() => {
    if (document.getElementById("eh-analytics")) return;
    const script = document.createElement("script");
    script.id = "eh-analytics";
    script.textContent = TRACKER_SCRIPT;
    document.body.appendChild(script);
  }, []);

  return null;
}
