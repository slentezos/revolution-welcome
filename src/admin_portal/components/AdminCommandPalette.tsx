import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { ADMIN_SECTIONS, type AdminSectionId } from "../core/navigation";
import { useAdminSection } from "../core/useAdminSection";
import { adminSupabase } from "../lib/supabase";
import { shortLocation } from "../lib/tunnel";

type MemberLite = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  postal_code: string | null;
  city_name: string | null;
};

export function AdminCommandPalette() {
  const [open, setOpen] = useState(false);
  const [members, setMembers] = useState<MemberLite[]>([]);
  const [loaded, setLoaded] = useState(false);
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

  // Lazy-load members on first open (keeps initial bundle light)
  useEffect(() => {
    if (!open || loaded) return;
    (async () => {
      try {
        const { data } = await adminSupabase.functions.invoke("admin-list-users");
        const arr = (data?.users ?? []) as MemberLite[];
        setMembers(
          arr.map((u) => ({
            id: u.id,
            email: u.email,
            first_name: u.first_name,
            last_name: u.last_name,
            postal_code: u.postal_code,
            city_name: u.city_name,
          }))
        );
      } catch {
        /* silent */
      } finally {
        setLoaded(true);
      }
    })();
  }, [open, loaded]);

  const goSection = (id: AdminSectionId) => {
    setSection(id);
    setOpen(false);
  };

  const openMember = (id: string) => {
    setSection("members");
    setOpen(false);
    // Allow MembersView to mount before dispatching
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("admin:open-member", { detail: id }));
    }, 50);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Rechercher un membre, une section…"
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
              onSelect={() => goSection(s.id)}
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
        <CommandSeparator />
        <CommandGroup
          heading={loaded ? `Membres (${members.length})` : "Membres (chargement…)"}
        >
          {members.slice(0, 200).map((m) => {
            const name = `${m.first_name} ${m.last_name}`.trim() || m.email;
            return (
              <CommandItem
                key={m.id}
                value={`${name} ${m.email} ${m.postal_code ?? ""} ${m.city_name ?? ""}`}
                onSelect={() => openMember(m.id)}
                className="text-base gap-3 py-2.5"
              >
                <div className="flex flex-col">
                  <span className="font-medium">{name}</span>
                  <span className="text-sm opacity-60">
                    {m.email} · {shortLocation(m)}
                  </span>
                </div>
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

/** Hidden helper so we keep the Link import side-effect free for tree-shaking. */
const _keepLink = Link;
void _keepLink;
