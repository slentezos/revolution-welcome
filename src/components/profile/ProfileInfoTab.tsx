import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ShieldCheck, Edit3, Send, Check, X } from "lucide-react";
import { toast } from "sonner";
import DateInput from "@/components/profile/DateInput";
import profileInfoImg from "@/assets/profile-info.jpg";
import LocationsSection, { type ProfileLocationData } from "@/components/profile/LocationsSection";

interface ProfileInfoTabProps {
  formData: {
    first_name: string;
    last_name: string;
    birth_date: string;
    gender: string;
    looking_for: string;
  };
  setFormData: (data: any) => void;
  userEmail: string;
  saving: boolean;
  onSave: () => void;
  onContactTab: () => void;
  profile: ProfileLocationData | null;
  onProfileUpdated: (next: ProfileLocationData) => void;
}

const MODIFIABLE_FIELDS = [
  { id: "first_name", label: "Prénom" },
  { id: "last_name", label: "Nom" },
  { id: "birth_date", label: "Date de naissance" },
  { id: "email", label: "Adresse Email" },
];

export default function ProfileInfoTab({ formData, userEmail, profile, onProfileUpdated }: ProfileInfoTabProps) {
  const [modModalOpen, setModModalOpen] = useState(false);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [modMessage, setModMessage] = useState("");
  const [sending, setSending] = useState(false);

  const toggleField = (id: string) => {
    setSelectedFields((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  };

  const handleSendRequest = () => {
    if (selectedFields.length === 0 && !modMessage.trim()) {
      toast.error("Veuillez sélectionner au moins un champ ou écrire un message.");
      return;
    }

    setSending(true);
    // Simulation d'envoi API
    setTimeout(() => {
      setSending(false);
      setModModalOpen(false);
      setSelectedFields([]);
      setModMessage("");
      toast.success("Votre demande a été transmise à notre équipe. Elle sera traitée sous 24h.");
    }, 1200);
  };

  return (
    <div>
      {/* Hero split */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        <div className="relative overflow-hidden aspect-[4/3] lg:aspect-auto lg:min-h-[60vh]">
          <img decoding="async" src={profileInfoImg} alt="Votre profil" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/20 to-transparent" />
        </div>
        <div className="flex flex-col justify-center bg-[#1B2333] px-8 md:px-16 lg:px-20 xl:px-28 py-16 lg:py-24">
          <span className="font-medium tracking-[0.3em] uppercase text-[hsl(var(--gold))] mb-4 block text-xl">
            Espace Sécurisé
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-white mb-3 leading-tight">Mon Profil</h2>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-[hsl(var(--gold))] to-transparent mb-8" />
          <p className="text-white/80 leading-relaxed max-w-lg text-2xl">
            Vos informations personnelles sont certifiées pour garantir l'authenticité de notre club privé.
          </p>
        </div>
      </section>

      {/* Form section */}
      <section className="bg-slate-50 py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <div className="bg-white p-8 md:p-12 rounded-[32px] shadow-sm border border-slate-100 mb-12">
            <div className="flex items-center gap-3 mb-10 pb-6 border-b border-slate-100">
              <ShieldCheck className="h-8 w-8 text-[hsl(var(--gold))]" />
              <h3 className="text-2xl font-bold text-[#1B2333]">Identité Certifiée</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 mb-12">
              <div className="space-y-3">
                <Label className="font-semibold text-muted-foreground text-lg uppercase tracking-wider">Prénom</Label>
                <div className="h-14 px-4 flex items-center text-2xl font-medium text-[#1B2333] bg-slate-50/50 rounded-xl border border-slate-100">
                  {formData.first_name}
                </div>
              </div>

              <div className="space-y-3">
                <Label className="font-semibold text-muted-foreground text-lg uppercase tracking-wider">Nom</Label>
                <div className="h-14 px-4 flex items-center text-2xl font-medium text-[#1B2333] bg-slate-50/50 rounded-xl border border-slate-100">
                  {formData.last_name || "—"}
                </div>
              </div>

              <div className="space-y-3">
                <Label className="font-semibold text-muted-foreground text-lg uppercase tracking-wider">
                  Date de naissance
                </Label>
                <div className="pointer-events-none opacity-90">
                  <DateInput value={formData.birth_date} onChange={() => {}} disabled={true} />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="font-semibold text-muted-foreground text-lg uppercase tracking-wider">
                  Adresse Email
                </Label>
                <div className="h-14 px-4 flex items-center text-xl font-medium text-[#1B2333] bg-slate-50/50 rounded-xl border border-slate-100">
                  {userEmail}
                </div>
              </div>
            </div>

            {/* ACTION UNIQUE DE MODIFICATION */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-[#1B2333]/5 rounded-2xl border border-[#1B2333]/10">
              <div className="mb-4 sm:mb-0">
                <p className="text-[#1B2333] font-semibold text-xl mb-1">Une correction à apporter ?</p>
                <p className="text-muted-foreground text-lg">Modifiez vos données de manière sécurisée.</p>
              </div>
              <Button
                onClick={() => setModModalOpen(true)}
                className="w-full sm:w-auto h-14 bg-white text-[#1B2333] border-2 border-[#1B2333]/10 hover:border-[hsl(var(--gold))] hover:bg-white text-lg font-bold rounded-xl shadow-sm transition-all"
              >
                <Edit3 className="h-5 w-5 mr-2" />
                Demander une modification
              </Button>
            </div>
          </div>
        </div>
      </section>

      {profile && <LocationsSection profile={profile} onProfileUpdated={onProfileUpdated} />}

      {/* MODALE DE DEMANDE DE MODIFICATION */}
      <Dialog open={modModalOpen} onOpenChange={setModModalOpen}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden bg-white border-0 rounded-[28px] shadow-2xl">
          <div className="bg-[#1B2333] px-8 py-6 flex items-center justify-between">
            <h2 className="font-heading text-2xl font-bold text-white">Demande de modification</h2>
            <button onClick={() => setModModalOpen(false)} className="text-white/70 hover:text-white transition-colors">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-8">
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Sélectionnez les informations que vous souhaitez mettre à jour. Notre équipe traitera votre demande
              rapidement pour garantir la sécurité de votre compte.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {MODIFIABLE_FIELDS.map((field) => {
                const isSelected = selectedFields.includes(field.id);
                return (
                  <button
                    key={field.id}
                    onClick={() => toggleField(field.id)}
                    className={`h-14 px-4 flex items-center justify-between rounded-xl border-2 transition-all text-lg font-semibold ${
                      isSelected
                        ? "border-[#1B2333] bg-[#1B2333] text-white shadow-md"
                        : "border-slate-200 bg-white text-slate-600 hover:border-[hsl(var(--gold))]"
                    }`}
                  >
                    {field.label}
                    {isSelected && <Check className="h-5 w-5 text-[hsl(var(--gold))]" />}
                  </button>
                );
              })}
            </div>

            <div className="space-y-3 mb-10">
              <Label className="font-semibold text-[#1B2333] text-xl">Détails de la modification (Optionnel)</Label>
              <Textarea
                value={modMessage}
                onChange={(e) => setModMessage(e.target.value)}
                placeholder="Ex: Bonjour, suite à une erreur de frappe, mon prénom s'écrit avec un e final..."
                className="min-h-[120px] text-xl rounded-xl border-2 border-slate-200 focus:border-[hsl(var(--gold))] focus:ring-0 resize-none p-4"
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button
                variant="ghost"
                onClick={() => setModModalOpen(false)}
                className="h-14 px-6 text-lg font-medium text-muted-foreground hover:text-[#1B2333]"
              >
                Annuler
              </Button>
              <Button
                onClick={handleSendRequest}
                disabled={sending}
                className="h-14 px-8 bg-[#1B2333] hover:bg-[#1B2333]/90 text-white text-xl font-bold rounded-xl shadow-lg transition-all"
              >
                {sending ? "Envoi en cours..." : "Transmettre ma demande"}
                {!sending && <Send className="ml-2 h-5 w-5" />}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
