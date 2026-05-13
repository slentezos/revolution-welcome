import { useEffect } from "react";

/**
 * Injects <meta name="robots" content="noindex, nofollow"> while the
 * Admin Portal is mounted, and removes it on unmount so the public site
 * keeps its normal indexability.
 */
export function useNoIndex() {
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    meta.setAttribute("data-admin-portal", "true");
    document.head.appendChild(meta);

    const previousTitle = document.title;
    document.title = "Admin · Kalimera";

    return () => {
      meta.remove();
      document.title = previousTitle;
    };
  }, []);
}
