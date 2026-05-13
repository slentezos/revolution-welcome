const BORDER = "var(--ap-border)";
const GOLD = "var(--ap-gold)";
const TEXT_MUTED = "var(--ap-muted)";

/**
 * High-density modular page container used by routes whose widgets
 * are still being assembled (Événements, CMS, Paramètres…).
 *
 * Layout:
 *  - Inherits the H1 + description rendered by SectionRouter.
 *  - Below: a dense grid of dashed-border slots ready to host modular widgets.
 */
export function PlaceholderView({
  title,
  slots = 6,
}: {
  title: string;
  description?: string;
  slots?: number;
}) {
  return (
    <section
      aria-label={title}
      className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
    >
      {Array.from({ length: slots }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border-2 border-dashed p-6 min-h-[180px] flex flex-col justify-between transition-colors hover:border-[color:var(--gold)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          style={{
            borderColor: BORDER,
            background: "rgba(20, 30, 51, 0.35)",
            // expose gold for hover via CSS var
            ["--gold" as string]: GOLD,
          }}
          tabIndex={0}
          role="region"
          aria-label={`Emplacement widget ${i + 1}`}
        >
          <div
            className="text-[11px] uppercase tracking-[0.18em]"
            style={{ color: GOLD }}
          >
            Module · {String(i + 1).padStart(2, "0")}
          </div>
          <div className="text-xl" style={{ color: TEXT_MUTED }}>
            Emplacement réservé pour un widget modulaire
            <span className="block opacity-70 mt-1 text-lg">
              Connectez ici un composant de la suite.
            </span>
          </div>
        </div>
      ))}
    </section>
  );
}
