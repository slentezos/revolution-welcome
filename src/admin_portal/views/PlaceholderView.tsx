const SURFACE = "#0F1828";
const BORDER = "#1F2A44";
const GOLD = "#C9A961";

export function PlaceholderView({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section
      className="rounded-xl border p-10 grid place-items-center min-h-[320px]"
      style={{ background: SURFACE, borderColor: BORDER }}
    >
      <div className="text-center max-w-lg">
        <div
          className="inline-block px-3 py-1 rounded-full border text-base mb-4"
          style={{ borderColor: BORDER, color: GOLD }}
        >
          Bientôt disponible
        </div>
        <h2 className="text-2xl font-semibold mb-3" style={{ color: "#F8FAFC" }}>
          {title}
        </h2>
        <p className="text-base opacity-70 leading-relaxed">{description}</p>
      </div>
    </section>
  );
}
