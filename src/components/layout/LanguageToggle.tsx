import { useEffect, useState } from "react";

type Lang = "FR" | "EN";

export default function LanguageToggle() {
  const [lang, setLang] = useState<Lang>("FR");

  useEffect(() => {
    const stored = (localStorage.getItem("kalimera-lang") as Lang | null) ?? "FR";
    setLang(stored);
    document.documentElement.lang = stored.toLowerCase();
  }, []);

  const switchTo = (next: Lang) => {
    setLang(next);
    localStorage.setItem("kalimera-lang", next);
    document.documentElement.lang = next.toLowerCase();
    window.dispatchEvent(new CustomEvent("languagechange", { detail: next }));
  };

  return (
    <div
      role="group"
      aria-label="Language selector"
      className="inline-flex items-center rounded-full border border-amber-200/50 bg-white/70 backdrop-blur-sm p-0.5 shadow-sm"
    >
      {(["FR", "EN"] as Lang[]).map((code) => {
        const active = lang === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => switchTo(code)}
            aria-pressed={active}
            className={`px-3 py-1 rounded-full text-[11px] uppercase tracking-widest font-semibold transition-all duration-300 ${
              active
                ? "bg-slate-900 text-amber-400 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            {code}
          </button>
        );
      })}
    </div>
  );
}
