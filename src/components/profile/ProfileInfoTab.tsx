import { useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Save, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import profileInfoImg from "@/assets/profile-info.jpg";
import LocationsSection, { type ProfileLocationData } from "@/components/profile/LocationsSection";

interface ProfileInfoTabProps {
  formData: {
    first_name: string;
    last_name: string;
    birth_date: string;
    gender: string;
    looking_for: string;
    phone: string;
  };
  setFormData: (data: any) => void;
  userEmail: string;
  saving: boolean;
  onSave: () => void;
  onContactTab: () => void;
  profile: ProfileLocationData | null;
  onProfileUpdated: (next: ProfileLocationData) => void;
}

const months = [
  { value: "01", label: "Janvier" },
  { value: "02", label: "Février" },
  { value: "03", label: "Mars" },
  { value: "04", label: "Avril" },
  { value: "05", label: "Mai" },
  { value: "06", label: "Juin" },
  { value: "07", label: "Juillet" },
  { value: "08", label: "Août" },
  { value: "09", label: "Septembre" },
  { value: "10", label: "Octobre" },
  { value: "11", label: "Novembre" },
  { value: "12", label: "Décembre" },
];

const interactiveClasses =
  "hover:border-[hsl(var(--gold))] focus:border-[hsl(var(--gold))] focus:ring-0 focus:ring-offset-0 transition-colors duration-300";

export default function ProfileInfoTab({
  formData,
  setFormData,
  saving,
  onSave,
  profile,
  onProfileUpdated,
}: ProfileInfoTabProps) {
  // Decompose birth_date "YYYY-MM-DD"
  const [birthYear, birthMonth, birthDay] = (formData.birth_date || "--").split("-");

  const update = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const updateBirth = (part: "y" | "m" | "d", value: string) => {
    const y = part === "y" ? value : birthYear || "0000";
    const m = part === "m" ? value : birthMonth || "00";
    const d = part === "d" ? value : birthDay || "00";
    setFormData((prev: any) => ({ ...prev, birth_date: `${y}-${m}-${d}` }));
  };

  const years = useMemo(() => {
    const arr = [];
    for (let y = 1940; y <= 1966; y++) arr.push(y);
    return arr.reverse();
  }, []);

  const days = useMemo(() => {
    const month = parseInt(birthMonth) || 1;
    const year = parseInt(birthYear) || 1960;
    const daysInMonth = new Date(year, month, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => String(i + 1).padStart(2, "0"));
  }, [birthMonth, birthYear]);

  const formatPhone = (phone: string) => phone.replace(/\D/g, "").slice(0, 10);

  const handleSave = () => {
    onSave();
    toast.success("Vos modifications ont été enregistrées.");
  };

  return (
    <div>
      {/* Hero split – kept as requested */}
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

      {/* Editable identity form – matches onboarding UI */}
      <section className="bg-secondary/40 py-16 md:py-24">
        <div className="px-6 md:px-16 lg:px-20 xl:px-28 max-w-6xl mx-auto">
          <div className="mb-10">
            <span className="font-medium tracking-[0.3em] uppercase text-muted-foreground mb-3 block text-lg">
              Identité Certifiée
            </span>
            <h3 className="font-heading text-3xl md:text-4xl text-foreground mb-3 leading-tight flex items-center gap-3">
              <ShieldCheck className="h-8 w-8 text-[hsl(var(--gold))]" />
              Vos informations
            </h3>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-[hsl(var(--gold))] to-transparent mb-6" />
            <p className="text-muted-foreground leading-relaxed text-xl max-w-2xl">
              Mettez à jour vos informations personnelles. Toute modification est sécurisée et tracée.
            </p>
          </div>

          <div className="bg-background border-2 border-border rounded-lg p-8 md:p-12 shadow-[var(--shadow-card)] space-y-8">
            {/* PRÉNOM */}
            <div>
              <label className="block font-medium text-[#1B2333] mb-3 text-xl">Prénom *</label>
              <Input
                placeholder="Votre prénom"
                className={cn("h-14 text-xl rounded-xl border-[#E5E0D8]", interactiveClasses)}
                value={formData.first_name}
                onChange={(e) => update("first_name", e.target.value)}
                autoComplete="given-name"
              />
            </div>

            {/* DATE DE NAISSANCE */}
            <div>
              <label className="block font-medium text-[#1B2333] mb-3 text-xl">Date de naissance *</label>
              <div className="grid grid-cols-3 gap-3">
                <Select value={birthDay} onValueChange={(v) => updateBirth("d", v)}>
                  <SelectTrigger className={cn("h-14 text-xl rounded-xl border-[#E5E0D8] bg-white", interactiveClasses)}>
                    <SelectValue placeholder="Jour" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {days.map((d) => (
                      <SelectItem key={d} value={d} className="text-xl py-3 cursor-pointer focus:bg-slate-50">
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={birthMonth} onValueChange={(v) => updateBirth("m", v)}>
                  <SelectTrigger className={cn("h-14 text-xl rounded-xl border-[#E5E0D8] bg-white", interactiveClasses)}>
                    <SelectValue placeholder="Mois" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {months.map((m) => (
                      <SelectItem key={m.value} value={m.value} className="text-xl py-3 cursor-pointer focus:bg-slate-50">
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={birthYear} onValueChange={(v) => updateBirth("y", v)}>
                  <SelectTrigger className={cn("h-14 text-xl rounded-xl border-[#E5E0D8] bg-white", interactiveClasses)}>
                    <SelectValue placeholder="Année" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {years.map((y) => (
                      <SelectItem key={y} value={String(y)} className="text-xl py-3 cursor-pointer focus:bg-slate-50">
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* GENRE */}
            <div>
              <label className="block font-medium text-[#1B2333] mb-3 text-xl">Je suis *</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "homme", label: "Un homme" },
                  { value: "femme", label: "Une femme" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => update("gender", opt.value)}
                    className={cn(
                      "min-h-[64px] px-3 rounded-xl text-lg md:text-xl font-medium border-2 whitespace-nowrap transition-all duration-300",
                      formData.gender === opt.value
                        ? "border-[#1B2333] bg-[#1B2333] text-white"
                        : "border-[#E5E0D8] bg-background text-[#1B2333] hover:border-[hsl(var(--gold))]",
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* RECHERCHE */}
            <div>
              <label className="block font-medium text-[#1B2333] mb-3 text-xl">Je recherche *</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "Un compagnon", label: "Un compagnon" },
                  { value: "Une compagne", label: "Une compagne" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => update("looking_for", opt.value)}
                    className={cn(
                      "min-h-[64px] px-3 rounded-xl text-lg md:text-xl font-medium border-2 whitespace-nowrap transition-all duration-300",
                      formData.looking_for === opt.value
                        ? "border-[#1B2333] bg-[#1B2333] text-white"
                        : "border-[#E5E0D8] bg-background text-[#1B2333] hover:border-[hsl(var(--gold))]",
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* TÉLÉPHONE */}
            <div>
              <label className="block font-medium text-[#1B2333] mb-3 text-xl">
                <Phone className="inline h-5 w-5 mr-1 -mt-0.5 text-[hsl(var(--gold))]" />
                Numéro de téléphone *
              </label>
              <div className="flex gap-3">
                <div className="h-14 px-4 flex items-center bg-muted rounded-xl text-lg font-medium text-foreground shrink-0">
                  🇫🇷 +33
                </div>
                <Input
                  placeholder="6 12 34 56 78"
                  className={cn("h-14 text-xl rounded-xl flex-1 border-[#E5E0D8]", interactiveClasses)}
                  value={formData.phone}
                  onChange={(e) => update("phone", formatPhone(e.target.value))}
                  inputMode="tel"
                  autoComplete="tel-national"
                />
              </div>
            </div>

            {/* SAVE */}
            <Button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="w-full min-h-[64px] bg-[#1B2333] hover:bg-[#1B2333]/90 text-white text-xl rounded-xl mt-4 shadow-lg transition-all active:scale-[0.98]"
            >
              <Save className="mr-2 h-5 w-5" />
              {saving ? "Enregistrement..." : "Enregistrer les modifications"}
            </Button>
          </div>
        </div>
      </section>

      {/* Locations – seamless continuation */}
      {profile && <LocationsSection profile={profile} onProfileUpdated={onProfileUpdated} />}
    </div>
  );
}
