import editorialHero from "@/assets/editorial-hero.jpg";
import editorialGarden from "@/assets/editorial-garden.jpg";
import editorialBistro from "@/assets/editorial-bistro.jpg";
import editorialSeine from "@/assets/editorial-seine.jpg";
import editorialArt from "@/assets/editorial-art.jpg";
import editorialReading from "@/assets/editorial-reading.jpg";
import editorialProvence from "@/assets/editorial-provence.jpg";
import editorialCooking from "@/assets/editorial-cooking.jpg";
import author1 from "@/assets/editorial-author-1.jpg";
import author2 from "@/assets/editorial-author-2.jpg";

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  author: { name: string; avatar: string };
  date: string;
  readTime: string;
  content: string[];
}

export const articles: Article[] = [
  {
    slug: "les-plus-belles-terrasses-parisiennes-pour-un-premier-rendez-vous",
    title: "Les plus belles terrasses parisiennes pour un premier rendez-vous",
    excerpt: "De Montmartre au Marais, notre sélection de terrasses intimistes où le charme parisien opère à chaque instant.",
    category: "Art de vivre",
    image: editorialHero,
    author: { name: "Catherine Morel", avatar: author2 },
    date: "12 mars 2026",
    readTime: "6 min",
    content: [
      "Paris regorge de terrasses secrètes où le temps semble suspendu. Pour un premier rendez-vous, le choix du lieu est essentiel : il doit être suffisamment calme pour se parler, assez beau pour impressionner, et idéalement situé pour prolonger la soirée d'une promenade.",
      "Au sommet de notre liste, Le Très Particulier, niché dans l'Hôtel Particulier Montmartre. Cette terrasse-jardin cachée, accessible par un passage discret de l'avenue Junot, offre un écrin de verdure improbable en plein Paris. Les cocktails y sont raffinés et l'ambiance, délicieusement confidentielle.",
      "Pour ceux qui préfèrent les quais, Le Vent d'Armor sur l'Île Saint-Louis propose une terrasse minuscule avec vue sur Notre-Dame. L'intimité y est naturelle, et les galettes bretonnes accompagnées d'un cidre fermier créent une atmosphère chaleureuse sans prétention.",
      "Côté Rive Gauche, le Café de Flore reste indémodable. Certes, c'est un classique, mais sa terrasse en angle offre un poste d'observation idéal sur le boulevard Saint-Germain. Commander un chocolat chaud Flore, c'est s'inscrire dans une tradition parisienne qui a fait ses preuves.",
      "Enfin, pour les amateurs de jardins cachés, Le Comptoir Général dans le 10ème arrondissement surprend par son décor dépaysant. Cette ancienne cour intérieure transformée en oasis tropicale est parfaite pour briser la glace dans un cadre original.",
      "Notre conseil : arrivez toujours un peu en avance pour choisir la meilleure table. En terrasse, les places d'angle sont les plus intimes et les plus flatteuses pour la conversation."
    ],
  },
  {
    slug: "jardins-secrets-de-paris-promenades-romantiques",
    title: "Jardins secrets de Paris : promenades romantiques",
    excerpt: "Loin des foules, découvrez ces havres de paix où la nature et l'élégance se rencontrent au cœur de la capitale.",
    category: "Promenades",
    image: editorialGarden,
    author: { name: "Philippe Durand", avatar: author1 },
    date: "8 mars 2026",
    readTime: "5 min",
    content: [
      "Paris cache des jardins d'une beauté insoupçonnée, parfaits pour une promenade à deux. Loin des sentiers battus du Luxembourg ou des Tuileries, ces écrins de verdure offrent l'intimité et le charme nécessaires à une rencontre mémorable.",
      "Le Jardin de la Vallée Suisse, au pied de la Butte Montmartre, est un secret bien gardé. Ses allées sinueuses bordées de roses anciennes mènent à un petit kiosque où l'on peut s'asseoir et contempler la ville en contrebas.",
      "Square du Vert-Galant, à la pointe de l'Île de la Cité, offre une perspective unique sur Paris. Descendez les marches du Pont-Neuf et retrouvez-vous au niveau de l'eau, entouré de saules pleureurs. Le coucher de soleil y est simplement magique.",
      "Pour les passionnés de botanique, le Jardin des Plantes recèle une roseraie méconnue, accessible par une porte latérale. En mai et juin, les centaines de variétés en fleur créent un spectacle olfactif et visuel incomparable.",
    ],
  },
  {
    slug: "lart-du-diner-en-tete-a-tete-guide-des-bistrots-raffines",
    title: "L'art du dîner en tête-à-tête : guide des bistrots raffinés",
    excerpt: "Ces adresses confidentielles où la gastronomie française se met au service de l'élégance et de la convivialité.",
    category: "Gastronomie",
    image: editorialBistro,
    author: { name: "Catherine Morel", avatar: author2 },
    date: "3 mars 2026",
    readTime: "7 min",
    content: [
      "Un dîner en tête-à-tête réussi tient autant à l'ambiance qu'à la qualité des mets. Les bistrots parisiens, avec leur authenticité et leur chaleur, offrent le cadre idéal pour une soirée où la conversation est reine.",
      "Chez Janou, dans le Marais, propose plus de 80 pastis différents et une cuisine provençale généreuse. La cour intérieure, éclairée aux bougies, est l'endroit rêvé pour un premier dîner sans la pression d'un restaurant étoilé.",
      "Au Bon Saint-Pourçain, rue Servandoni, c'est la simplicité qui séduit. Nappe à carreaux, carte courte, vins nature : l'essentiel est là, et rien de superflu ne vient distraire de l'essentiel – la personne en face de vous.",
    ],
  },
  {
    slug: "flaner-au-bord-de-la-seine-itineraires-pour-amoureux",
    title: "Flâner au bord de la Seine : itinéraires pour amoureux",
    excerpt: "Des quais de la Seine aux ponts emblématiques, ces parcours enchanteurs qui donnent le rythme aux plus belles rencontres.",
    category: "Promenades",
    image: editorialSeine,
    author: { name: "Philippe Durand", avatar: author1 },
    date: "25 février 2026",
    readTime: "5 min",
    content: [
      "La Seine est le fil conducteur de toutes les histoires d'amour parisiennes. Ses quais, classés au patrimoine mondial de l'UNESCO, offrent un décor naturellement romantique que nul décorateur ne saurait égaler.",
      "Notre itinéraire favori part du Pont des Arts, traverse l'Île de la Cité, longe les quais de la Tournelle et s'achève sur les berges aménagées du 13ème arrondissement. Comptez deux heures de marche tranquille, ponctuées d'arrêts devant les bouquinistes et les péniches.",
    ],
  },
  {
    slug: "sorties-culturelles-les-expositions-a-voir-a-deux",
    title: "Sorties culturelles : les expositions à voir à deux",
    excerpt: "Art, photographie, sculpture… Notre guide des expositions parisiennes qui créent la conversation et rapprochent les esprits.",
    category: "Culture",
    image: editorialArt,
    author: { name: "Catherine Morel", avatar: author2 },
    date: "18 février 2026",
    readTime: "4 min",
    content: [
      "Visiter une exposition ensemble, c'est partager des émotions, échanger des points de vue et découvrir la sensibilité de l'autre. Paris offre un programme culturel si riche qu'il y a toujours un événement parfait pour une sortie à deux.",
      "Le Musée de l'Orangerie, avec ses Nymphéas de Monet, reste l'un des lieux les plus apaisants et les plus inspirants de la capitale. La salle ovale invite naturellement au chuchotement et au rapprochement.",
    ],
  },
  {
    slug: "le-plaisir-de-lire-ensemble-nos-recommandations-litteraires",
    title: "Le plaisir de lire ensemble : nos recommandations littéraires",
    excerpt: "Romans, essais, poésie… Une sélection de lectures à partager qui nourrissent les conversations et les âmes.",
    category: "Culture",
    image: editorialReading,
    author: { name: "Philippe Durand", avatar: author1 },
    date: "10 février 2026",
    readTime: "6 min",
    content: [
      "Partager un livre, c'est offrir un morceau de son monde intérieur. Quand deux personnes lisent le même ouvrage, une passerelle invisible se crée entre elles, faite de références communes et de discussions passionnées.",
      "Notre première suggestion : « L'Élégance du hérisson » de Muriel Barbery. Ce roman délicat, qui se déroule dans un immeuble parisien du 7ème arrondissement, explore avec finesse les préjugés et les rencontres improbables.",
    ],
  },
  {
    slug: "escapades-en-provence-week-ends-romantiques",
    title: "Escapades en Provence : week-ends romantiques",
    excerpt: "Lavande, soleil et douceur de vivre. Nos adresses secrètes pour un week-end en amoureux au cœur de la Provence.",
    category: "Voyages",
    image: editorialProvence,
    author: { name: "Catherine Morel", avatar: author2 },
    date: "2 février 2026",
    readTime: "8 min",
    content: [
      "La Provence possède cette magie particulière qui transforme chaque moment en souvenir impérissable. Ses paysages de carte postale, ses villages perchés et sa lumière unique en font la destination idéale pour un premier week-end ensemble.",
      "Gordes, perché sur son rocher de calcaire blanc, offre des vues à couper le souffle sur le Luberon. L'hôtel La Bastide de Gordes, avec sa piscine surplombant la vallée, est un refuge de luxe discret où le temps s'arrête.",
    ],
  },
  {
    slug: "cuisiner-ensemble-le-secret-des-couples-heureux",
    title: "Cuisiner ensemble : le secret des couples heureux",
    excerpt: "Partager la préparation d'un repas, c'est déjà partager bien plus. Nos recettes et astuces pour un moment complice.",
    category: "Art de vivre",
    image: editorialCooking,
    author: { name: "Philippe Durand", avatar: author1 },
    date: "25 janvier 2026",
    readTime: "5 min",
    content: [
      "La cuisine est un langage universel de l'amour. Préparer un repas à deux, c'est créer ensemble, se coordonner, rire des petites maladresses et savourer le résultat de ses efforts communs.",
      "Pour un premier dîner cuisiné ensemble, optez pour des recettes simples mais élégantes. Un risotto aux champignons, par exemple : la cuisson lente du riz invite à la conversation, et le geste de remuer ensemble le plat crée une complicité naturelle.",
    ],
  },
];

export const categories = [...new Set(articles.map((a) => a.category))];
