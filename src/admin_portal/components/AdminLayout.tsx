import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Command, LogOut, Moon, Search, Sun, User } from "lucide-react";
import { useAdminTheme } from "../core/AdminTheme";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ADMIN_SECTIONS, type AdminSectionId } from "../core/navigation";
import { useAdminSection } from "../core/useAdminSection";
import { useAdminContext } from "../core/AdminProviders";
import { AdminCommandPalette } from "./AdminCommandPalette";

const NAVY = "var(--ap-bg)";
const NAVY_SURFACE = "var(--ap-surface)";
const NAVY_BORDER = "var(--ap-border)";
const GOLD = "var(--ap-gold)";
const TEXT = "var(--ap-text)";
const TEXT_MUTED = "var(--ap-muted)";

export function AdminLayout({ children }: { children: ReactNode }) {
  const { sidebarOpen, toggleSidebar } = useAdminContext();
  const { section, setSection } = useAdminSection();
  const { theme, toggleTheme } = useAdminTheme();
  const current = ADMIN_SECTIONS.find((s) => s.id === section);

  return (
    <div
      data-admin-theme={theme}
      className="min-h-screen flex font-sans antialiased"
      style={{
        background: "var(--ap-bg)",
        color: TEXT,
        fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
      }}
    >
      {/* Sidebar */}
      <aside
        className="shrink-0 flex flex-col border-r transition-[width] duration-200 ease-out"
        style={{
          width: sidebarOpen ? 264 : 76,
          background: "var(--ap-surface)",
          borderColor: NAVY_BORDER,
          boxShadow: "var(--ap-elev-1)",
        }}
      >
        <div
          className="h-16 flex items-center gap-3 px-5 border-b"
          style={{ borderColor: NAVY_BORDER }}
        >
          <div
            className="h-9 w-9 rounded-md grid place-items-center font-semibold"
            style={{ background: GOLD, color: NAVY }}
          >
            K
          </div>
          {sidebarOpen && (
            <div className="leading-tight">
              <div
                className="text-[11px] uppercase tracking-[0.18em]"
                style={{ color: TEXT_MUTED }}
              >
                Kalimera
              </div>
              <div className="text-base font-semibold" style={{ color: GOLD }}>
                Private Admin
              </div>
            </div>
          )}
        </div>

        <nav
          className="flex-1 p-3 flex flex-col gap-1"
          aria-label="Navigation principale"
        >
          {ADMIN_SECTIONS.map((s) => {
            const active = s.id === section;
            return (
              <div key={s.id} className="contents">
                {"separatorBefore" in s && s.separatorBefore && (
                  <div
                    role="separator"
                    aria-hidden
                    className="my-2 h-px"
                    style={{ background: NAVY_BORDER }}
                  />
                )}
                <NavButton
                  id={s.id}
                  label={s.label}
                  Icon={s.icon}
                  active={active}
                  collapsed={!sidebarOpen}
                  onClick={() => setSection(s.id)}
                />
              </div>
            );
          })}
        </nav>

        {sidebarOpen && (
          <div
            className="px-4 pb-3 pt-2 flex items-center gap-2"
            style={{ color: TEXT_MUTED }}
          >
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ background: "#10B981", boxShadow: "0 0 8px #10B981" }}
              aria-hidden
            />
            <span className="text-base">v1.0 · Production Ready</span>
          </div>
        )}

        {/* Theme toggle (Day/Night) */}
        <div
          className="px-3 pb-3 pt-1"
          style={{ borderTop: `1px solid ${NAVY_BORDER}` }}
        >
          <button
            onClick={toggleTheme}
            className="w-full h-12 flex items-center gap-3 px-3 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{
              background: "var(--ap-hover)",
              color: TEXT_MUTED,
              outlineColor: GOLD,
            }}
            aria-label={theme === "light" ? "Activer le mode nuit" : "Activer le mode jour"}
            title={theme === "light" ? "Mode nuit" : "Mode jour"}
          >
            <span
              className="h-7 w-7 rounded-full grid place-items-center shrink-0"
              style={{ background: GOLD, color: "var(--ap-surface)" }}
              aria-hidden
            >
              {theme === "light" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </span>
            {sidebarOpen && (
              <span className="text-base">
                {theme === "light" ? "Mode jour" : "Mode nuit"}
              </span>
            )}
          </button>
        </div>

        <button
          onClick={toggleSidebar}
          className="h-12 border-t flex items-center justify-center gap-2 text-base hover:bg-[var(--ap-hover)] transition-colors"
          style={{ borderColor: NAVY_BORDER, color: TEXT_MUTED }}
          aria-label={sidebarOpen ? "Réduire le menu" : "Étendre le menu"}
        >
          <ChevronLeft
            className={`h-5 w-5 transition-transform ${sidebarOpen ? "" : "rotate-180"}`}
          />
          {sidebarOpen && <span>Réduire</span>}
        </button>
      </aside>

      {/* Main column */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top header */}
        <header
          className="h-16 px-6 flex items-center gap-4 border-b sticky top-0 z-30 backdrop-blur"
          style={{
            background: "var(--ap-header-bg)",
            borderColor: NAVY_BORDER,
          }}
        >
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-base min-w-0">
            <Link
              to="?section=command-center"
              className="hover:opacity-100 transition-opacity"
              style={{ color: TEXT_MUTED }}
            >
              Admin
            </Link>
            <span style={{ color: TEXT_MUTED }}>/</span>
            <span className="font-medium truncate" style={{ color: TEXT }}>
              {current?.label ?? "—"}
            </span>
          </nav>

          <div className="flex-1" />

          {/* Cmd+K hint */}
          <button
            onClick={() => {
              const ev = new KeyboardEvent("keydown", {
                key: "k",
                metaKey: true,
                bubbles: true,
              });
              window.dispatchEvent(ev);
            }}
            className="hidden md:flex items-center gap-2 h-10 px-3 rounded-md border text-base hover:bg-white/5 transition-colors"
            style={{ borderColor: NAVY_BORDER, color: TEXT_MUTED }}
          >
            <Search className="h-4 w-4" />
            <span>Rechercher</span>
            <span
              className="ml-2 inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-sm"
              style={{ borderColor: NAVY_BORDER }}
            >
              <Command className="h-3.5 w-3.5" />K
            </span>
          </button>

          {/* Avatar dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="h-10 w-10 rounded-full grid place-items-center border hover:bg-white/5 transition-colors"
                style={{ borderColor: NAVY_BORDER }}
                aria-label="Compte administrateur"
              >
                <Avatar className="h-9 w-9">
                  <AvatarFallback
                    className="text-base font-semibold"
                    style={{ background: NAVY_SURFACE, color: GOLD }}
                  >
                    AD
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 border"
              style={{
                background: NAVY_SURFACE,
                borderColor: NAVY_BORDER,
                color: TEXT,
              }}
            >
              <DropdownMenuLabel className="text-base">
                Administrateur
                <div
                  className="font-normal text-sm mt-0.5"
                  style={{ color: TEXT_MUTED }}
                >
                  Internal access
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator style={{ background: NAVY_BORDER }} />
              <DropdownMenuItem className="text-base gap-2 cursor-pointer">
                <User className="h-4 w-4" /> Profil
              </DropdownMenuItem>
              <DropdownMenuItem className="text-base gap-2 cursor-pointer">
                <LogOut className="h-4 w-4" /> Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-[1400px] mx-auto px-8 py-8 text-base">
            {children}
          </div>
        </main>
      </div>

      <AdminCommandPalette />
    </div>
  );
}

function NavButton({
  id,
  label,
  Icon,
  active,
  collapsed,
  onClick,
}: {
  id: AdminSectionId;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  active: boolean;
  collapsed: boolean;
  onClick: () => void;
}) {
  return (
    <Link
      to={`?section=${id}`}
      onClick={(e) => {
        // Let react-router handle the URL; also sync our hook immediately.
        e.preventDefault();
        onClick();
      }}
      className="group flex items-center gap-3 h-12 px-3 rounded-md transition-colors text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E1626]"
      style={{
        background: active ? "rgba(201, 169, 97, 0.10)" : "transparent",
        color: active ? GOLD : TEXT_MUTED,
        boxShadow: active ? "inset 2px 0 0 0 " + GOLD : undefined,
        outlineColor: GOLD,
      }}
      title={collapsed ? label : undefined}
      aria-label={label}
      aria-current={active ? "page" : undefined}
    >
      <Icon className="h-5 w-5 shrink-0" />
      {!collapsed && <span className="truncate">{label}</span>}
    </Link>
  );
}
