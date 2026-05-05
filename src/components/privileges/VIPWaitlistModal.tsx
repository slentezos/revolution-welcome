import { useState } from "react";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, Crown } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface VIPWaitlistModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const schema = z.object({
  email: z.string().trim().email("Email invalide").max(255),
  age: z.literal(true, { errorMap: () => ({ message: "Vous devez certifier avoir plus de 60 ans." }) }),
});

export default function VIPWaitlistModal({ open, onClose, onSuccess }: VIPWaitlistModalProps) {
  const [email, setEmail] = useState("");
  const [ageOk, setAgeOk] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ email, age: ageOk });
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("waitlist_leads").insert({
      email: parsed.data.email,
      city_name: "VIP",
      postal_code: "VIP",
      region_name: "VIP",
      status: "vip",
    });
    setLoading(false);
    if (error) {
      toast.error("Une erreur est survenue. Merci de réessayer.");
      return;
    }
    toast.success("Inscription validée. Nous vous contacterons dès l'ouverture du Carré VIP.");
    setEmail("");
    setAgeOk(false);
    onClose();
    onSuccess?.();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="bg-white border border-slate-200 max-w-xl p-8 md:p-10">
        <DialogHeader>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 border border-slate-200 flex items-center justify-center rounded-sm">
              <Crown className="h-5 w-5 text-[hsl(var(--gold))]" />
            </div>
          </div>
          <DialogTitle className="font-heading text-3xl md:text-4xl text-foreground text-center leading-tight">
            Le Carré VIP — Liste d'attente
          </DialogTitle>
          <DialogDescription className="text-foreground/70 text-xl leading-relaxed text-center pt-4">
            Cette option exclusive est en cours de finalisation. Laissez-nous votre email pour être informé(e) de son
            ouverture. En attendant, validez votre adhésion au Cercle pour profiter de vos 3 mois offerts.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div>
            <label htmlFor="vip-email" className="block text-xl font-medium text-foreground mb-3">
              Votre email
            </label>
            <Input
              id="vip-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              className="text-xl h-14"
            />
          </div>

          <label className="flex items-start gap-4 cursor-pointer p-4 border border-slate-200 rounded-sm hover:border-[hsl(var(--gold)/0.5)] transition-colors">
            <Checkbox
              checked={ageOk}
              onCheckedChange={(v) => setAgeOk(v === true)}
              className="h-6 w-6 mt-1"
            />
            <span className="text-xl text-foreground leading-snug">Je certifie avoir plus de 60 ans.</span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-foreground text-white py-5 text-lg uppercase tracking-widest font-medium transition-all hover:bg-[hsl(var(--gold))] min-h-[64px] flex items-center justify-center gap-3 disabled:opacity-60"
          >
            {loading ? "Inscription en cours..." : "M'inscrire et voir les 3 mois offerts"}
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
