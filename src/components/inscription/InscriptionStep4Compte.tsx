import { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search, CheckCircle2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

const NATIONALITIES = [
{ value: "france", label: "France", flag: "🇫🇷" },
{ value: "belgique", label: "Belgique", flag: "🇧🇪" },
{ value: "suisse", label: "Suisse", flag: "🇨🇭" },
{ value: "canada", label: "Canada", flag: "🇨🇦" },
{ value: "maroc", label: "Maroc", flag: "🇲🇦" },
{ value: "tunisie", label: "Tunisie", flag: "🇹🇳" },
{ value: "algerie", label: "Algérie", flag: "🇩🇿" },
{ value: "allemagne", label: "Allemagne", flag: "🇩🇪" },
{ value: "espagne", label: "Espagne", flag: "🇪🇸" },
{ value: "italie", label: "Italie", flag: "🇮🇹" }];


interface Props {
  formData: {
    nationality: string;
    email: string;
    password: string;
    acceptTerms: boolean;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  onSubmit: () => void;
  onBack: () => void;
  errors: Record<string, string>;
  loading: boolean;
}

export default function InscriptionStep4Compte({ formData, setFormData, onSubmit, onBack, errors, loading }: Props) {
  const [nationalitySearch, setNationalitySearch] = useState("");
  const [nationalityOpen, setNationalityOpen] = useState(false);

  const update = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const filteredNationalities = NATIONALITIES.filter((n) =>
  n.label.toLowerCase().includes(nationalitySearch.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="text-center mb-10">
        <h1 className="font-heading text-3xl md:text-4xl font-semibold text-foreground mb-3">
          Créez votre compte
        </h1>
        <p className="text-muted-foreground text-lg">
          Dernière étape avant de rejoindre la communauté
        </p>
      </div>

      <div>
        <label className="block font-medium text-foreground mb-3 text-xl">Nationalité *</label>
        <Popover open={nationalityOpen} onOpenChange={setNationalityOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-14 w-full justify-between font-normal text-base rounded-xl">
              {formData.nationality ?
              <span className="flex items-center gap-3">
                  <span className="text-2xl">{NATIONALITIES.find((n) => n.value === formData.nationality)?.flag}</span>
                  {NATIONALITIES.find((n) => n.value === formData.nationality)?.label}
                </span> :

              <span className="text-muted-foreground text-xl">Sélectionnez votre nationalité</span>
              }
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-3 rounded-xl" align="start">
            <div className="flex items-center gap-2 border-b border-border pb-3 mb-3 px-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                className="flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
                placeholder="Rechercher un pays..."
                value={nationalitySearch}
                onChange={(e) => setNationalitySearch(e.target.value)} />
              
            </div>
            <div className="max-h-[240px] overflow-y-auto space-y-1">
              {filteredNationalities.map((nat) =>
              <button
                key={nat.value}
                type="button"
                className={`flex items-center gap-3 w-full rounded-lg px-3 py-3 text-base hover:bg-accent transition-colors ${
                formData.nationality === nat.value ? "bg-accent" : ""}`
                }
                onClick={() => {
                  update("nationality", nat.value);
                  setNationalityOpen(false);
                  setNationalitySearch("");
                }}>
                
                  <span className="text-2xl">{nat.flag}</span>
                  {nat.label}
                  {formData.nationality === nat.value &&
                <CheckCircle2 className="h-4 w-4 text-primary ml-auto" />
                }
                </button>
              )}
              {filteredNationalities.length === 0 &&
              <p className="text-lg text-muted-foreground text-center py-3">Aucun résultat</p>
              }
            </div>
          </PopoverContent>
        </Popover>
        {errors.nationality && <p className="text-destructive text-lg mt-2">{errors.nationality}</p>}
      </div>

      <div>
        <label className="block font-medium text-foreground mb-3 text-xl">Adresse email *</label>
        <Input
          type="email"
          placeholder="votre@email.com"
          className="h-14 text-xl rounded-xl"
          value={formData.email}
          onChange={(e) => update("email", e.target.value)}
          autoComplete="email" />
        
        {errors.email && <p className="text-destructive text-lg mt-2">{errors.email}</p>}
      </div>

      <div>
        <label className="block font-medium text-foreground mb-3 text-xl">Mot de passe *</label>
        <Input
          type="password"
          placeholder="Minimum 6 caractères"
          className="h-14 text-xl rounded-xl"
          value={formData.password}
          onChange={(e) => update("password", e.target.value)}
          autoComplete="new-password"
          minLength={6} />
        
        {errors.password && <p className="text-destructive text-lg mt-2">{errors.password}</p>}
        <p className="text-muted-foreground mt-2 text-lg">Au moins 6 caractères</p>
      </div>

      <div className="flex items-start gap-3 py-2">
        <Checkbox
          id="terms"
          checked={formData.acceptTerms}
          onCheckedChange={(checked) => update("acceptTerms", !!checked)}
          className="mt-0.5 h-5 w-5" />
        
        <label htmlFor="terms" className="text-muted-foreground leading-relaxed cursor-pointer text-lg">
          J'accepte les{" "}
          <a href="/conditions" target="_blank" rel="noopener noreferrer" className="text-primary font-medium hover:underline">
            conditions générales
          </a>{" "}
          et la{" "}
          <a href="/confidentialite" target="_blank" rel="noopener noreferrer" className="text-primary font-medium hover:underline">
            politique de confidentialité
          </a>
        </label>
      </div>
      {errors.acceptTerms && <p className="text-destructive text-lg -mt-4">{errors.acceptTerms}</p>}

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="h-14 text-base rounded-xl flex-1">
          
          <ArrowLeft className="mr-2 h-5 w-5" />
          Retour
        </Button>
        <Button
          type="button"
          onClick={onSubmit}
          className="btn-primary h-14 rounded-xl flex-[2] text-xl"
          disabled={loading}>
          
          {loading ? "Création en cours..." : "Créer mon compte"}
        </Button>
      </div>
    </div>);

}