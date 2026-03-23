import { useState, useEffect } from "react";
import { Gift, Heart, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import giftCoupleImg from "@/assets/gift-couple.jpg";

const POPUP_STORAGE_KEY = "gift_popup_dismissed";
const POPUP_DELAY_MS = 3000;

export default function GiftPopup() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const dismissed = sessionStorage.getItem(POPUP_STORAGE_KEY);
    if (dismissed) return;

    const timer = setTimeout(() => setOpen(true), POPUP_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setOpen(false);
    sessionStorage.setItem(POPUP_STORAGE_KEY, "true");
  };

  const handleCta = () => {
    handleDismiss();
    navigate("/inscription");
  };

  return (
    <Dialog open={open} onOpenChange={(v) => {if (!v) handleDismiss();}}>
      <DialogContent className="sm:max-w-4xl w-[calc(100%-2rem)] p-0 overflow-hidden gap-0">
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[480px]">
          {/* Left — Image */}
          <div className="relative hidden md:block">
            <img
              src={giftCoupleImg}
              alt="Couple heureux au coucher du soleil"
              className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#1B2333]/20" />
            <div className="absolute bottom-8 left-8 right-8">
              <p className="text-white font-heading italic leading-relaxed drop-shadow-lg text-4xl">
                "Le plus beau cadeau que l'on puisse offrir, c'est une nouvelle chance de bonheur."
              </p>
            </div>
          </div>

          {/* Mobile image */}
          <div className="relative h-48 md:hidden overflow-hidden">
            <img
              src={giftCoupleImg}
              alt="Couple heureux au coucher du soleil"
              className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/60" />
          </div>

          {/* Right — Content */}
          <div className="flex flex-col justify-center px-6 sm:px-8 md:px-12 py-10 md:py-14 bg-white relative">
            {/* Centered icon */}
            <div className="mx-auto w-12 h-12 rounded-full bg-[hsl(var(--gold))]/10 flex items-center justify-center mb-4 text-[#1B2333]">
              <Gift className="h-6 w-6" />
            </div>

            <DialogTitle className="text-center font-heading text-2xl md:text-3xl font-bold text-[#1B2333] mb-3 leading-tight">
              Offrez 3 mois de rencontres
            </DialogTitle>
            <p className="text-center text-foreground text-base mb-8">
              à un proche qui mérite de retrouver l'amour
            </p>

            {/* Benefits */}
            <div className="space-y-3 mb-8">
              {[
              "Un cadeau unique et plein de sens",
              "3 mois d'accès complet à Kalimera",
              "Des rencontres sérieuses et vérifiées"].
              map((text, i) =>
              <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-gray-50/80 border border-gray-100 text-left">
                  <CheckCircle className="h-5 w-5 text-[hsl(var(--gold))] flex-shrink-0 mt-0.5" />
                  <span className="text-foreground text-base">{text}</span>
                </div>
              )}
            </div>

            {/* CTA */}
            <div className="flex flex-col gap-2">
              <Button
                onClick={handleCta}
                className="w-full h-12 rounded-xl text-white font-medium bg-[#1B2333] hover:bg-[#1B2333]/90">
                <Gift className="h-5 w-5 mr-2" />
                Offrir 3 mois — 60€
              </Button>
              <button
                onClick={handleDismiss}
                className="w-full h-12 rounded-xl text-gray-500 hover:text-[#1B2333] hover:bg-gray-50 font-medium">
                Non merci, peut-être plus tard
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>);
}
