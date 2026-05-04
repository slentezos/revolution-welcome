import { useEffect, useState } from "react";
import { applyLanguage, getCurrentLang } from "@/lib/i18nRuntime";

type Lang = "FR" | "EN";

export default function LanguageToggle() {
  const [lang, setLang] = useState<Lang>("FR");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLang(getCurrentLang());
    const onChange = (e: any) => setLang(e.detail ?? getCurrentLang());
    window.addEventListener("languagechange", onChange);
    return () => window.removeEventListener("languagechange", onChange);
  }, []);

  const switchTo = async (next: Lang) => {
    if (next === lang) return;
    setLang(next);
    setLoading(true);
    window.dispatchEvent(new CustomEvent("languagechange", { detail: next }));
    try {
      await applyLanguage(next);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="group"
      aria-label="Language selector"
      data-no-translate
      className="inline-flex items-center rounded-full border border-amber-200/50 bg-white/10 backdrop-blur-sm p-0.5 shadow-sm"
    >
      {(["FR", "EN"] as Lang[]).map((code) => {
        const active = lang === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => switchTo(code)}
            aria-pressed={active}
            disabled={loading}
            className={`px-3 py-1 rounded-full text-[12px] uppercase tracking-widest font-semibold transition-all duration-300 ${
              active
                ? "bg-amber-500 text-slate-900 shadow-sm"
                : "text-primary-foreground/70 hover:text-primary-foreground"
            } ${loading ? "opacity-60 cursor-wait" : ""}`}
          >
            {code}
          </button>
        );
      })}
    </div>
  );
}
