const tags = [
  "Critères approfondis",
  "Profils avec vidéo",
  "Île de France",
  "Accompagnement personnalisé",
  "Bienveillance",
  "Test de personnalité",
  "Senior +50 ans",
  "Messagerie",
  "Goal Setting",
  "80% d'affinité",
  "Smart Exercice",
  "Conseils de rencontre",
  "40 rubriques - 200 critères",
];

export default function TagsSection() {
  return (
    <section className="py-12 bg-secondary overflow-hidden">
      <div className="container-main mx-auto px-4 md:px-8">
        <div className="flex flex-wrap justify-center gap-3">
          {tags.map((tag, index) => (
            <span
              key={index}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-default ${
                tag === "Senior +50 ans"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-foreground hover:bg-accent"
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
