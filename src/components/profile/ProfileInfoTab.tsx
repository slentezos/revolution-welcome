import { ExternalLink, Lock } from "lucide-react";
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
  profile: (ProfileLocationData & { phone?: string | null; nationality?: string | null }) | null;
  onProfileUpdated: (next: ProfileLocationData) => void;
}

const NATIONALITY_LABELS: Record<string, { label: string; flag: string }> = {
  france: { label: "France", flag: "🇫🇷" },
  belgique: { label: "Belgique", flag: "🇧🇪" },
  suisse: { label: "Suisse", flag: "🇨🇭" },
  canada: { label: "Canada", flag: "🇨🇦" },
  maroc: { label: "Maroc", flag: "🇲🇦" },
  tunisie: { label: "Tunisie", flag: "🇹🇳" },
  algerie: { label: "Algérie", flag: "🇩🇿" },
  allemagne: { label: "Allemagne", flag: "🇩🇪" },
  espagne: { label: "Espagne", flag: "🇪🇸" },
  italie: { label: "Italie", flag: "🇮🇹" },
};

const GENDER_LABELS: Record<string, string> = {
  homme: "Homme",
  femme: "Femme",
  male: "Homme",
  female: "Femme",
};

const LOOKING_FOR_LABELS: Record<string, string> = {
  homme: "Un homme",
  femme: "Une femme",
  male: "Un homme",
  female: "Une femme",
  les_deux: "Les deux",
};

function formatBirthDate(iso: string) {
  if (!iso) return "Non renseignée";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

interface FieldProps {
  label: string;
  value: string;
  onContact: () => void;
}

function ReadOnlyField({ label, value, onContact }: FieldProps) {
  return (
    <div className="space-y-3">
      <label className="font-medium text-foreground text-xl block">{label}</label>
      <div className="relative">
        <div className="h-14 flex items-center px-4 text-xl bg-muted/40 border-2 border-muted text-foreground rounded-none pr-12">
          {value || <span className="text-muted-foreground italic">Non renseigné</span>}
        </div>
        <Lock className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" aria-label="Champ verrouillé" />
      </div>
      <button
        onClick={onContact}
        className="inline-flex items-center gap-2 font-medium text-muted-foreground hover:text-foreground transition-colors text-lg"
      >
        Demander une modification
        <ExternalLink className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function ProfileInfoTab({ formData, userEmail, onContactTab, profile, onProfileUpdated }: ProfileInfoTabProps) {
  const nat = profile?.nationality ? NATIONALITY_LABELS[profile.nationality] : null;
  const nationalityValue = nat ? `${nat.flag} ${nat.label}` : profile?.nationality || "";
  const genderValue = GENDER_LABELS[formData.gender] || formData.gender || "";
  const lookingForValue = LOOKING_FOR_LABELS[formData.looking_for] || formData.looking_for || "";

  return (
    <div>
      {/* Hero split */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        <div className="relative overflow-hidden aspect-[4/3] lg:aspect-auto lg:min-h-[60vh]">
          <img decoding="async" src={profileInfoImg} alt="Votre profil" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/20 to-transparent" />
        </div>
        <div className="flex flex-col justify-center bg-secondary px-8 md:px-16 lg:px-20 xl:px-28 py-16 lg:py-24">
          <span className="font-medium tracking-[0.3em] uppercase text-muted-foreground mb-4 block text-2xl">
            Informations personnelles
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-foreground mb-3 leading-tight">
            Mon Profil
          </h2>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-[hsl(var(--gold))] to-transparent mb-8" />
          <p className="text-muted-foreground leading-relaxed max-w-lg text-2xl">
            Vos informations sont protégées et figées pour garantir l'authenticité de votre profil.
            Pour toute correction, notre équipe est à votre écoute.
          </p>
        </div>
      </section>

      {/* Read-only info section */}
      <section className="bg-background py-16 md:py-24">
        <div className="px-6 md:px-16 lg:px-20 xl:px-28">
          {/* Notice */}
          <div className="mb-12 bg-secondary/40 border-l-4 border-[hsl(var(--gold))] px-6 py-5 rounded-r-lg max-w-3xl">
            <p className="text-foreground text-xl leading-relaxed">
              <span className="font-semibold">Vos données d'identité sont verrouillées.</span> Cette mesure protège
              l'intégrité de votre profil au sein du club. Pour toute modification, contactez notre équipe : nous
              traiterons votre demande sous 48 heures.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            <div className="space-y-8">
              <ReadOnlyField label="Prénom" value={formData.first_name} onContact={onContactTab} />
              <ReadOnlyField label="Nom" value={formData.last_name} onContact={onContactTab} />
              <ReadOnlyField label="Date de naissance" value={formatBirthDate(formData.birth_date)} onContact={onContactTab} />
              <ReadOnlyField label="Nationalité" value={nationalityValue} onContact={onContactTab} />
            </div>

            <div className="space-y-8">
              <ReadOnlyField label="Email" value={userEmail} onContact={onContactTab} />
              <ReadOnlyField label="Téléphone" value={profile?.phone || ""} onContact={onContactTab} />
              <ReadOnlyField label="Genre" value={genderValue} onContact={onContactTab} />
              <ReadOnlyField label="Je recherche" value={lookingForValue} onContact={onContactTab} />
            </div>
          </div>
        </div>
      </section>

      {profile && <LocationsSection profile={profile} onProfileUpdated={onProfileUpdated} />}
    </div>
  );
}
