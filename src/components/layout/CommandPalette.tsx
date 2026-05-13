import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useUIState } from "@/core/ui-state";

const routes = [
  { label: "Command Center", path: "/" },
  { label: "Matrice des Membres", path: "/members" },
  { label: "Hub de Modération", path: "/moderation" },
  { label: "Radar d'Expansion", path: "/expansion" },
  { label: "FinOps & Abonnements", path: "/finops" },
  { label: "Gestion des Événements", path: "/events" },
  { label: "CMS & Blog", path: "/cms" },
];

export function CommandPalette() {
  const { isCommandPaletteOpen, setCommandPaletteOpen } = useUIState();
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandPaletteOpen(!isCommandPaletteOpen);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isCommandPaletteOpen, setCommandPaletteOpen]);

  return (
    <CommandDialog open={isCommandPaletteOpen} onOpenChange={setCommandPaletteOpen}>
      <CommandInput placeholder="Rechercher une page, un membre…" />
      <CommandList>
        <CommandEmpty>Aucun résultat.</CommandEmpty>
        <CommandGroup heading="Navigation">
          {routes.map((r) => (
            <CommandItem
              key={r.path}
              onSelect={() => {
                navigate(r.path);
                setCommandPaletteOpen(false);
              }}
            >
              {r.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
