import React, { useEffect, useState } from "react";
import { CheckCircle2, MapPin } from "lucide-react";
import { PINPOINT_MAPPING } from "@/data/locationData";

export const RegistrationLocationHeader = () => {
  const [data, setData] = useState({ zip: "", city: "" });

  useEffect(() => {
    // Lecture directe du localStorage
    const savedZip = localStorage.getItem("user_postal_code") || "";
    const savedCity = localStorage.getItem("user_city_name") || "";
    setData({ zip: savedZip, city: savedCity });
  }, []);

  if (!data.zip) return null;

  // Priorité absolue au mapping pour éviter le fallback "Nanterre"
  const finalCity = PINPOINT_MAPPING[data.zip] || data.city;
  const isPinpoint = !!PINPOINT_MAPPING[data.zip];

  return (
    <div className="w-full max-w-2xl mx-auto mb-10 p-6 border-l-4 border-[hsl(var(--gold))] rounded-r-2xl shadow-2xl flex items-center gap-4 animate-in fade-in zoom-in-95 bg-slate-50/[0.03]">
      {isPinpoint ? (
        <CheckCircle2 className="h-8 w-8 text-[hsl(var(--gold))]" />
      ) : (
        <MapPin className="h-8 w-8 text-[hsl(var(--gold))]" />
      )}
      <div>
        <p className="uppercase tracking-[0.2em] font-bold mb-1 text-destructive-foreground text-base">
          {isPinpoint ? "Localisation" : "Secteur d'adhésion identifié"}
        </p>
        <h2 className="text-2xl font-bold text-white">
          {finalCity} <span className="font-light text-destructive-foreground">({data.zip})</span>
        </h2>
      </div>
    </div>
  );
};
