import { CheckCircle2, MapPin } from "lucide-react";
import { PINPOINT_MAPPING } from "@/data/locationData";

export default function RegistrationLocationHeader() {
  const postalCode = typeof window !== "undefined" ? localStorage.getItem("user_postal_code") : null;
  const cityName = typeof window !== "undefined" ? localStorage.getItem("user_city_name") : null;

  if (!postalCode || !cityName) return null;

  const isPrecise = !!PINPOINT_MAPPING[postalCode];
  const Icon = isPrecise ? CheckCircle2 : MapPin;
  const label = isPrecise ? "Localisation précise" : "Secteur identifié";

  return (
    <div className="w-full bg-[hsl(var(--gold))]/10 border-b border-[hsl(var(--gold))]/30">
      <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-center gap-2 text-base md:text-lg text-foreground">
        <Icon className="h-5 w-5 text-[hsl(var(--gold))] flex-shrink-0" />
        <span className="font-medium">
          {label} : <strong>{cityName}</strong> ({postalCode})
        </span>
      </div>
    </div>
  );
}
