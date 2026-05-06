import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Save, ExternalLink } from "lucide-react";
import DateInput from "@/components/profile/DateInput";
import profileInfoImg from "@/assets/profile-info.jpg";

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
}

export default function ProfileInfoTab({ formData, setFormData, userEmail, saving, onSave, onContactTab }: ProfileInfoTabProps) {
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
            Gérez vos informations personnelles. Votre profil est protégé et visible uniquement par nos membres vérifiés.
          </p>
        </div>
      </section>

      {/* Form section */}
      <section className="bg-background py-16 md:py-24">
        <div className="px-6 md:px-16 lg:px-20 xl:px-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            <div className="space-y-8">
              <div className="space-y-3">
                <Label htmlFor="first_name" className="font-medium text-foreground text-xl">Prénom</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  className="h-14 text-lg border-2 border-muted bg-background focus:border-primary rounded-none" />
                
              </div>
              <div className="space-y-3">
                <Label htmlFor="last_name" className="font-medium text-foreground text-xl">Nom</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  className="h-14 text-lg border-2 border-muted bg-background focus:border-primary rounded-none" />
                
              </div>
              <DateInput
                value={formData.birth_date}
                onChange={(val) => setFormData({ ...formData, birth_date: val })}
                disabled={!!formData.birth_date}
              />
              {!!formData.birth_date && (
                <p className="text-muted-foreground text-xl -mt-2">
                  Votre date de naissance est définitive. Pour toute correction,{" "}
                  <button
                    type="button"
                    onClick={onContactTab}
                    className="font-semibold text-foreground underline underline-offset-4 hover:text-[hsl(var(--gold))] transition-colors"
                  >
                    contactez-nous
                  </button>
                  .
                </p>
              )}
            </div>

            <div className="space-y-8">
              <div className="space-y-3">
                <Label className="font-medium text-foreground text-xl">Email</Label>
                <Input value={userEmail} disabled className="h-14 text-lg bg-muted border-2 border-muted rounded-none" />
                <button
                  onClick={onContactTab}
                  className="inline-flex items-center gap-2 font-medium text-muted-foreground hover:text-foreground transition-colors mt-1 text-xl">
                  
                  Nous contacter pour modifier
                  <ExternalLink className="h-4 w-4" />
                </button>
              </div>

              <div className="pt-4">
                <Button
                  onClick={onSave}
                  disabled={saving}
                  className="btn-primary py-5 px-10 text-lg h-auto min-h-[56px] w-full lg:w-auto">
                  
                  <Save className="h-5 w-5 mr-3" />
                  {saving ? "Enregistrement..." : "Enregistrer les modifications"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>);

}