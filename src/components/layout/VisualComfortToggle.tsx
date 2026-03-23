import { useState, useEffect, useRef } from "react";
import { Eye } from "lucide-react";

const SIZE_OPTIONS = [
{ key: "standard", label: "Standard", percentage: "100%", aaClass: "text-sm", hint: "" },
{ key: "confort", label: "Confort", percentage: "125%", aaClass: "text-base", hint: "+25%" },
{ key: "large", label: "Large", percentage: "150%", aaClass: "text-lg", hint: "+50%" }] as
const;

type SizeKey = (typeof SIZE_OPTIONS)[number]["key"];

const STORAGE_KEY_SIZE = "visual-comfort-size";
const STORAGE_KEY_INTERACTED = "visual-comfort-interacted";

export default function VisualComfortToggle() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<SizeKey>("standard");
  const [hasInteracted, setHasInteracted] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Hydration-safe: read from localStorage on mount
  useEffect(() => {
    try {
      const storedSize = localStorage.getItem(STORAGE_KEY_SIZE) as SizeKey | null;
      const storedInteracted = localStorage.getItem(STORAGE_KEY_INTERACTED);
      if (storedSize && ["standard", "confort", "large"].includes(storedSize)) {
        setSelectedSize(storedSize);
      }
      if (storedInteracted === "true") {
        setHasInteracted(true);
      }
    } catch {


      // localStorage unavailable
    }}, []);
  // Apply font-size to document root
  useEffect(() => {
    const option = SIZE_OPTIONS.find((o) => o.key === selectedSize);
    if (option) {
      document.documentElement.style.fontSize = option.percentage;
    }
  }, [selectedSize]);

  // Click-away listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleConfirm = () => {
    setHasInteracted(true);
    try {
      localStorage.setItem(STORAGE_KEY_SIZE, selectedSize);
      localStorage.setItem(STORAGE_KEY_INTERACTED, "true");
    } catch {


      // localStorage unavailable
    }setIsOpen(false);};

  const currentLabel = SIZE_OPTIONS.find((o) => o.key === selectedSize)?.label ?? "Standard";

  return (
    <div ref={wrapperRef} className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="flex items-center gap-2 px-4 py-2 rounded-full border border-amber-200/40 hover:border-amber-500/50 bg-white/80 hover:bg-white text-slate-700 transition-all duration-300 shadow-sm group"
        aria-label="Confort de vue"
        aria-expanded={isOpen}>
        
        <Eye className="h-4 w-4 text-amber-600 transition-transform duration-300 group-hover:scale-110" />
        <span className="text-[11px] uppercase tracking-widest font-semibold whitespace-nowrap">
          {!hasInteracted ? "Votre confort de vue" : currentLabel}
        </span>
      </button>

      {/* Dropdown Card */}
      {isOpen &&
      <div className="absolute right-0 mt-2 z-50 w-[340px] bg-white rounded-xl shadow-xl border border-amber-100/60 p-5 animate-fade-in">
          {/* Header */}
          <p className="leading-relaxed mb-5 text-lg text-secondary-foreground">
            Pour votre confort de lecture, nous vous proposons d'ajuster la taille du texte.
          </p>

          {/* Options */}
          <div className="flex flex-col gap-2">
            {SIZE_OPTIONS.map((option) => {
            const isActive = selectedSize === option.key;
            return (
              <button
                key={option.key}
                onClick={() => setSelectedSize(option.key)}
                className={`flex items-center gap-4 w-full px-4 py-3.5 rounded-lg border transition-all duration-300 text-left ${
                isActive ?
                "border-amber-500 bg-amber-50/60 shadow-sm" :
                "border-slate-200 hover:border-amber-300 hover:bg-amber-50/30"}`
                }>
                
                  <span
                  className={`${option.aaClass} font-bold font-heading ${
                  isActive ? "text-amber-700" : "text-slate-500"}`
                  }>
                  
                    Aa
                  </span>
                  <span className={`text-lg font-medium ${isActive ? "text-slate-900" : "text-slate-600"}`}>
                    {option.label}
                  </span>
                  {option.hint &&
                <span className="text-[11px] text-slate-400 ml-auto tracking-wide">{option.hint}</span>
                }
                  {isActive && <span className="ml-auto w-2 h-2 rounded-full bg-amber-500" />}
                </button>);

          })}
          </div>

          {/* Confirm Button */}
          <button
          onClick={handleConfirm}
          className="mt-5 w-full py-3 bg-slate-900 text-white text-[13px] uppercase tracking-widest font-bold rounded-full hover:bg-slate-800 transition-all duration-300 shadow-md active:scale-[0.98]">
          
            Confirmer
          </button>
        </div>
      }
    </div>);

}