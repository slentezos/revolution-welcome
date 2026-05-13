import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ADMIN_SECTIONS, type AdminSectionId } from "../core/navigation";
import { useAdminSection } from "../core/useAdminSection";

export function AdminCommandPalette() {
  const [open, setOpen] = useState(false);
  const { setSection } = useAdminSection();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (id: AdminSectionId) => {
    setSection(id);
    setOpen(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Tapez une commande ou recherchez une section…"
        className="text-base"
      />
      <CommandList>
        <CommandEmpty className="py-8 text-base text-slate-400">
          Aucun résultat.
        </CommandEmpty>
        <CommandGroup heading="Navigation">
          {ADMIN_SECTIONS.map((s) => (
            <CommandItem
              key={s.id}
              value={`${s.label} ${s.description}`}
              onSelect={() => go(s.id)}
              className="text-base gap-3 py-3"
            >
              <s.icon className="h-5 w-5" />
              <div className="flex flex-col">
                <span className="font-medium">{s.label}</span>
                <span className="text-sm opacity-60">{s.description}</span>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

/** Hidden helper so we keep the Link import side-effect free for tree-shaking. */
const _keepLink = Link;
void _keepLink;
