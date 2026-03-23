import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";

export default function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Retour en haut"
      className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full bg-[#FAF9F6] border border-amber-400 shadow-card flex items-center justify-center transition-all duration-300 hover:shadow-elevated hover:scale-110 animate-fade-in"
    >
      <ChevronUp className="h-6 w-6 text-amber-600" />
    </button>
  );
}
