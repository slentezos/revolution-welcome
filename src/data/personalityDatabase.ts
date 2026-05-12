export type Gender = "homme" | "femme";

export interface PersonalityMetric {
  label: string;
  value: number;
}

export interface PersonalityAttractions {
  comfortTitle: string;
  comfort: string[];
  drainTitle: string;
  drain: string[];
}

export interface PersonalityProfileData {
  id: string;
  title: string;
  imageSlug?: string;
  metrics: PersonalityMetric[];
  intro?: string;
  strengths?: string[];
  weaknesses?: string[];
  loveVision?: string;
  balanceStress?: string;
  rapportToOthers?: string;
  fonctionnement?: string;
  rapportAuxAutres?: string;
  equilibre?: string;
  visionAmour?: string;
  pointsForts?: string[];
  fragilites?: string[];
  attractions?: PersonalityAttractions;
  signature?: string;
}

export function genderize(text: string, gender: Gender): string {
  if (!text) return text;
  if (gender === "femme") {
    return text.replace(/\(([a-zà-ÿ]+)\)/gi, "$1");
  }
  return text.replace(/\(([a-zà-ÿ]+)\)/gi, "");
}

export function getProfile(id: string): PersonalityProfileData | undefined {
  return personalityDatabase[id];
}

export const personalityDatabase: Record<string, PersonalityProfileData> = {
  // 1. LE STRATÈGE (INTP)
 strategiste: {
    id: "strategiste",
    title: "Le Stratège indépendant et analytique",
    imageSlug: "strategiste",
    metrics: [{ label: "Se ressource dans le calme", value: 75 }, { label: "Préfère l’abstrait", value: 60 }, { label: "Décide avec la tête", value: 85 }, { label: "Aime la flexibilité", value: 55 }],
    fonctionnement: "Vous cherchez à le comprendre en profondeur à travers la logique et l’analyse. Votre curiosité intellectuelle alimente votre créativité. On vous qualifie volontiers d’esprit original. Vous avez tendance à approfondir les idées, parfois jusqu’à repousser le moment de les concrétiser, voire à remettre en question une idée même après l’avoir adoptée.\n\nVous évoluez clairement dans le domaine des idées. Vous voyez le monde à travers les concepts. Les échanges superficiels vous lassent vite. Vous faites preuve d’honnêteté intellectuelle. Vous n’êtes pas dogmatique : vous savez remettre en question vos opinions et reconnaissez vos erreurs à condition que la contradiction soit sensée et bien construite.",
    rapportAuxAutres: "Vous êtes pragmatique, factuel(le). Les objectifs et les résultats sont primordiaux. Vous attendez de même de votre entourage. Vous cherchez à comprendre les situations sans émotions. Votre capacité d’analyse et de recul aident les autres à clarifier leurs idées, à envisager différentes perspectives, à dépassionner les débats. Exigeant(e) sur la qualité des idées et la cohérence des opinions, vous ne discutez pas pour meubler le vide, les mots ont leur importance.\n\nVos relations sont sélectives, stimulantes intellectuellement et basées sur la liberté d’être soi. L’autre peut être différent, mais vous supportez mal les réactions émotionnelles, les jugements sans recul ou les contradictions stériles. Vous pouvez sembler distant(e) car vous exprimez peu vos émotions.",
    equilibre: "Vous vous ressourcez dans la solitude et avez besoin de calme pour réfléchir. Vous refusez les cadres trop rigides, les décisions précipitées. Réfléchi, vous ne réagissez pas à chaud. Indépendant(e) d’esprit, vous résistez à la pression sociale, aux opinions toutes faites et aux approches émotionnelles.\n\nVous ne parlez pas facilement de ce que vous ressentez. Cela peut donner l’impression que vous êtes en retrait au moment où l’on attend une implication de votre part. Quand le ton monte, vous évitez de vous emporter. Face au stress, vous cherchez des explications et des solutions rationnelles.",
    visionAmour: "Pour vous, l’amour se comprend avant de se vivre. Les élans trop rapides vous mettent mal à l’aise. Vous avez besoin de temps et d’espace. Votre prudence peut vous faire paraitre distant(e) et peu motivé(e).\n\nVous êtes attiré(e) par des profils expressifs, chaleureux et non directifs. Votre attachement est discret, mais sincère et durable. Les difficultés apparaissent lorsque l’autre attend des preuves émotionnelles que vous ne savez pas toujours formuler.",
    pointsForts: ["Vous êtes créatif(ve) et curieux(se) intellectuellement", "Vous prenez des décisions réfléchies, rarement impulsives", "Vous êtes indépendant(e) et difficile à influencer", "Vous cherchez à comprendre en profondeur", "Vous êtes exigent envers vous-même"],
    fragilites: ["Vous avez tendance à analyser au lieu de vivre le moment.", "Vous n’associez pas toujours l’autre à votre réflexion.", "À force de réfléchir, vous retardez la décision.", "Vous ressentez profondément mais vous exprimez peu.", "Votre manque de spontanéité peut passer pour de la froideur"],
    attractions: {
      comfortTitle: "Vous vous sentez bien avec des personnes ou les situations",
      comfort: ["autonomes, expressives et vivantes", "respectueuses de votre rythme et de votre créativité", "curieuses, ouvertes et stimulantes intellectuellement", "capables d’échanger librement, sans jugement ni rigidité", "apportant chaleur et spontanéité, sans chercher à vous cadrer"],
      drainTitle: "Vous vous épuisez avec les personnes ou les situations",
      drain: ["trop émotives, envahissantes, demandeuses", "trop souvent imprévisibles, déstabilisantes, versatiles", "rigides et dirigistes qui imposent leur façon de penser", "les échanges en surface qui ne stimulent pas votre réflexion", "les discours superficiels, incohérents ou malhonnêtes"]
    },
    signature: "Vous avez besoin de calme pour aller à la rencontre de l’autre… et de clarté pour vous engager."
  },
  visionnaire: {
    id: "visionnaire",
    title: "Le Visionnaire inspiré et profond",
    imageSlug: "visionnaire",
    metrics: [{ label: "Se ressource dans le calme", value: 80 }, { label: "Préfère l’abstrait", value: 70 }, { label: "Décide avec le cœur", value: 75 }, { label: "Aime l’organisation", value: 85 }],
    fonctionnement: "Vous faites partie des idéalistes profonds. Vous cherchez à comprendre les dynamiques humaines. Au-delà des apparences, vous percevez rapidement le sens profond des situations. Vous êtes guidé(e) par une vision intérieure de ce qui peut être harmonisé.\n\nVous avez un sens aigu des responsabilités. Quand vous croyez en une idée ou un projet, vous vous y investissez avec une persévérance remarquable. Votre calme apparent cache une grande intensité intérieure et une volonté ferme de faire de vos idéaux une réalité.",
    rapportAuxAutres: "Vous êtes bienveillant(e) et attentif(ve). Vous apportez de l'écoute et une capacité à percevoir ce qui n'est pas exprimé. Vous cherchez naturellement à aider les autres à s'accomplir.\n\nVos relations sont peu nombreuses mais intenses. Vous privilégiez la profondeur à la quantité. Vous avez besoin d'authenticité et de sincérité dans vos échanges. On apprécie votre loyauté et votre capacité à offrir un soutien stable et réfléchi.",
    equilibre: "Vous avez besoin d’un minimum de structure pour vous sentir serein(e). Les environnements trop désordonnés ou imprévisibles vous fatiguent. Vous appréciez que les choses soient planifiées.\n\nFace au stress, vous avez tendance à vous replier sur vous-même pour préserver votre équilibre. Vous vous ressourcez dans le calme et la réflexion. La solitude vous est nécessaire pour traiter vos ressentis et retrouver votre énergie créative.",
    visionAmour: "Pour vous, l'amour est une quête d'absolu. Vous ne cherchez pas une relation par défaut, mais une connexion d'âme sincère. Les élans superficiels ne vous touchent guère.\n\nVous ressentez intensément, mais vous exprimez vos émotions avec une certaine pudeur. Vous avez besoin d'un partenaire qui comprenne votre besoin de profondeur et respecte votre jardin secret. Votre attachement est solide, basé sur des valeurs partagées.",
    pointsForts: ["Grande finesse de perception des intentions", "Engagement sincère et profond", "Loyauté sans faille", "Stabilité relationnelle", "Capacité à se projeter durablement"],
    fragilites: ["Tendance à garder ses ressentis pour soi", "Exigence et idéalisation parfois excessives", "Oubli de ses propres besoins", "Repli sur soi en cas de déception", "Risque d'explosion émotionnelle si trop de pression"],
    attractions: {
      comfortTitle: "Vous vous sentez bien avec des personnes ou les situations",
      comfort: ["parfaitement alignées avec leurs valeurs", "démontrant un engagement sincère", "offrant profondeur et authenticité", "respectant l'empathie et la sensibilité", "recherchant un équilibre émotionnel"],
      drainTitle: "Vous vous épuisez avec les personnes ou les situations",
      drain: ["superficielles et inconstantes", "démontrant de l'incohérence", "vivant dans l'ambiguïté permanente", "manquant d'implication réelle", "sans volonté d'évolution personnelle"]
    },
    signature: "Vous avez besoin de sens pour vous engager… et de cohérence pour rester."
  },
  mediateur: {
    id: "mediateur",
    title: "Le Médiateur attentif et apaisant",
    imageSlug: "mediateur",
    metrics: [{ label: "Se ressource dans le calme", value: 90 }, { label: "Préfère l’abstrait", value: 65 }, { label: "Décide avec le cœur", value: 85 }, { label: "Aime la flexibilité", value: 75 }],
    fonctionnement: "Vous évoluez dans le registre du ressenti et des valeurs. Très sensible et profondément empathique, vous percevez le monde à travers ce qui vous touche ou vous semble juste. Votre quête de sens est votre moteur.\n\nVous avez un esprit curieux et ouvert. Vous n'aimez pas les jugements hâtifs. Vous préférez explorer les possibilités plutôt que d'imposer des certitudes. Votre créativité s'exprime souvent dans votre façon d'envisager la vie, avec une touche d'idéalisme et de douceur.",
    rapportAuxAutres: "Vous êtes profondément bienveillant(e). Vous évitez les conflits que vous vivez comme des agressions. Vous n’essayez pas de convaincre les autres, mais d'être authentiquement présent(e).\n\nDans vos relations, vous cherchez l'harmonie. Vous êtes un(e) confident(e) précieux(se), capable d'une écoute sans jugement. Si vous vous sentez brusqué(e) ou incompris(e), vous avez tendance à vous refermer dans votre univers intérieur pour vous protéger.",
    equilibre: "Vous vous ressourcez dans la solitude et un univers intérieur riche. Vous avez besoin de liberté et de flexibilité pour suivre vos inspirations du moment.\n\nFace au stress, vous avez tendance à absorber les émotions des autres, ce qui peut vous épuiser. Vous avez besoin de temps pour faire le tri dans vos ressentis. Vous refusez les cadres trop rigides qui brident votre spontanéité et votre créativité.",
    visionAmour: "L'amour est pour vous une rencontre de deux sensibilités. Vous cherchez une relation sincère où chacun peut être soi, sans masque. Vous avez besoin d'une connexion émotionnelle forte.\n\nVous êtes attiré(e) par des partenaires capables d'apprécier votre monde intérieur sans chercher à le changer. Une fois engagé(e) et en confiance, vous êtes d'une loyauté absolue et multipliez les attentions délicates.",
    pointsForts: ["Finesse perceptive exceptionnelle", "Grande bienveillance et générosité de cœur", "Créativité et imagination", "Grande adaptabilité", "Idéalisme inspirant"],
    fragilites: ["Évitement excessif des conflits", "Tendance à l'idéalisation forte", "Difficulté à passer à l'action concrète", "Tendance à brider ses propres émotions", "Risque de désillusions amères"],
    attractions: {
      comfortTitle: "Vous vous sentez bien avec des personnes ou les situations",
      comfort: ["dégageant bienveillance et chaleur", "offrant une vraie profondeur émotionnelle", "faisant preuve d'ouverture d'esprit", "respectant votre monde intérieur", "recherchant l'authenticité pure"],
      drainTitle: "Vous vous épuisez avec les personnes ou les situations",
      drain: ["froides, purement rationnelles", "source de conflits permanents", "faisant preuve de rigidité et d'intrusion", "rejetant le ressenti au profit de la logique", "utilisant l'ironie ou le cynisme"]
    },
    signature: "Vous avez besoin de douceur pour vous ouvrir… et de confiance pour rester."
  }
  protecteur: {
    id: "protecteur",
    title: "Le Protecteur solide et attentionné",
    imageSlug: "protecteur",
    metrics: [{ label: "Se ressource dans le calme", value: 70 }, { label: "Préfère le concret", value: 80 }, { label: "Décide avec le cœur", value: 60 }, { label: "Aime la structure", value: 90 }],
    fonctionnement: "Vous êtes dans le concret. Vous vous appuyez sur ce qui a été expérimenté, sur ce qui a fait ses preuves. Vous êtes prudent(e) face aux idées trop abstraites ou aux changements sans base concrète. Vous avez un sens prononcé du devoir et de la responsabilité envers les autres. Votre perfectionnisme vous pousse à donner le meilleur de vous-même.\n\nVous êtes dévoué(e), discret(e) et attentif(ve) aux besoins de votre entourage. Par souci d'efficacité, vous aimez que les choses soient anticipées, claires et organisées car vous avez du mal avec le changement ou l’imprévu. Sensible et empathique, vous portez une attention particulière aux détails et au confort des personnes autour de vous.",
    rapportAuxAutres: "Vous observez, vous écoutez, vous vous adaptez. Vous ne cherchez pas à attirer l’attention ou à vous imposer mais à être utile. Vous êtes profondément attentif(ve) aux besoins et aux ressentis des autres. Vous donnez beaucoup, souvent sans rien dire.\n\nVous cherchez à faire ce qui est juste et préserve l’harmonie. Profondément loyal(e), vous êtes fiable et rassurant(e). Vous privilégiez les liens sincères et durables. Dans la relation, vous ne vous précipitez pas. Vous avez besoin de temps pour installer la confiance. Vous avancez progressivement avec sérieux. Lorsque vous vous engagez, vous êtes solide, attentionné(e) et profondément impliqué(e).",
    equilibre: "Vous vous ressourcez seul(e) ou dans des environnements calmes et familiers. Vous êtes attentif(ve) aux besoins des autres parfois au détriment des vôtres. Les changements brusques, les sollicitations permanentes ou les tensions vous fatiguent. Vous avez besoin de stabilité pour vous sentir bien.\n\nFace au stress, vous cherchez à maintenir l’équilibre. A force de vous oublier pour préserver les autres, maintenir l’harmonie et éviter le conflit, vous pouvez sans le montrer ressentir une certaine lassitude. Vous gagnerez en équilibre en apprenant à poser davantage vos limites.",
    visionAmour: "Pour vous, l’amour se construit dans la durée. Vous ne cherchez pas l’intensité immédiate mais la stabilité, la confiance et la sécurité. Vous avez besoin d’une relation claire, sincère, où chacun respecte l’autre.\n\nVous êtes attentif(ve), engagé(e) et attentionné(e). Vous donnez beaucoup. Quand vous aimez, vous construisez, vous protégez, vous vous impliquez intensément. Vous avez besoin de réciprocité émotionnelle. L’indifférence vous heurte profondément.",
    pointsForts: ["Vous êtes fiable, loyal et rassurant(e)", "Vous êtes attentif(ve) aux autres", "Vous êtes source de stabilité et d’harmonie", "Vous construisez sur la durée", "Vous communiquez avec calme et diplomatie"],
    fragilites: ["Vous avez du mal à dire non", "Vous évitez les conflits, même nécessaires", "Vous supportez mal l’imprévu et le désordre", "A force de vous effacer, vous accumulez des frustrations", "Vous attendez de la reconnaissance sans oser la demander"],
    attractions: {
      comfortTitle: "Vous vous sentez bien avec des personnes ou les situations",
      comfort: ["fidèles à leurs engagements", "sensibles aux gestes du quotidien", "claires dans leurs intentions, sans ambiguïté", "émotionnellement stables, capables de rassurer", "prêtes à construire dans la durée avec régularité"],
      drainTitle: "Vous vous épuisez avec les personnes ou les situations",
      drain: ["incohérentes dans leurs attitudes et leurs engagements", "hermétiques aux petites attentions du quotidien", "égoïstes, grossières, négatives ou manquant de tact", "incapables de s’investir ou de tenir leurs promesses", "ingrates ou insensibles aux efforts que vous faites pour elles"]
    },
    signature: "Vous avez besoin de sécurité pour vous ouvrir… et de reconnaissance pour rester."
  },
  pilier: {
    id: "pilier",
    title: "Le Pilier fiable et constant",
    imageSlug: "pilier",
    metrics: [{ label: "Se ressource dans le calme", value: 75 }, { label: "Préfère le concret", value: 85 }, { label: "Décide avec la tête", value: 90 }, { label: "Aime la structure", value: 95 }],
    fonctionnement: "Vous évoluez dans le registre du concret et du rationnel. Vous vous appuyez sur ce qui est tangible, vérifiable, éprouvé. Les discours théoriques, les projections incertaines ou les changements sans raison vous laissent sceptique. Vous prisez l'expérience, la structure, l’ordre et le respect des règles. L'honnêteté et l'intégrité sont au cœur de votre fonctionnement.\n\nVotre sens du devoir vous pousse à aller jusqu’au bout de vos engagements. Vos décisions sont réfléchies. Votre approche est rigoureuse. Vous analysez les faits, évaluez les conséquences, choisissez ce qui vous semble logique. Vous ne vous laissez pas influencer facilement. Vous êtes solide et cohérent(e), mais parfois perçu(e) comme distant(e) ou insensible.",
    rapportAuxAutres: "Plutôt réservé(e), vous privilégiez l’action aux discours. Vous ne ressentez pas le besoin de vous exposer, de prendre toute la place, et de partager vos émotions. Vous ne multipliez pas les échanges, vous préférez les liens solides, construits dans le temps. Vous ne vous engagez pas à la légère, vous prenez votre temps avant de vous engager.\n\nVous êtes fiable et constant(e). Les autres peuvent compter sur votre stabilité et sens du devoir. Vous tenez vos engagements et accordez de l’importance à la parole donnée. Exigeant(e) avec vous même, vous attendez des autres qu’ils soient fiables, efficaces et responsables. Cela peut parfois passer pour de l’intransigeance ou un manque de compréhension des sensibilités de chacun.",
    equilibre: "Vous vous ressourcez seul(e) et avez besoin de calme pour vous recentrer. Les environnements désorganisés, bruyants ou imprévisibles vous fatiguent. Face au stress, vous cherchez à reprendre le contrôle. Vous vous concentrez sur les faits, les solutions, l’organisation. Vous avez du mal à exprimer ce que vous ressentez.\n\nVous vous organisez de manière structurée et aimez que les choses soient claires et anticipées. Vous prenez vos engagements au sérieux et avancez étape par étape. Votre pragmatisme vous permet de rester calme et rationnel face aux difficultés. Cela vous rend fiable, mais peu à l’aise avec l’imprévu.",
    visionAmour: "En amour, vous recherchez avant tout la confiance, pas l’intensité immédiate. Vous avez besoin d’une relation sans ambiguïté. Vous avancez progressivement, mais avec sérieux. Votre engagement est dans la durée.\n\nLes petits actes attentionnés du quotidien sont votre façon de montrer votre affection. Vous vous sentez en sécurité auprès de partenaires fiables et constants. Pourtant, les profils plus spontanés peuvent à la fois vous séduire et vous déstabiliser.",
    pointsForts: ["Vous êtes fiable et sécurisant(e)", "Vous respectez vos engagements", "Vous êtes structuré(e) et organisé(e)", "Vous prenez des décisions réfléchies", "Vous construisez dans la durée"],
    fragilites: ["Vous exprimez peu vos émotions", "Vous supportez mal l’imprévu et l’incertitude", "Vous êtes exigeant(e) avec les autres", "Vous avez du mal à lâcher prise", "Vous avez tendance à en faire trop"],
    attractions: {
      comfortTitle: "Vous vous sentez bien avec des personnes ou les situations",
      comfort: ["constantes et engagées dans leurs actes", "matures, honnêtes, fiables et responsables", "rigoureuses, organisées et respectueuses du cadre", "claires dans leurs intentions, sans ambiguïté", "mesurées dans leurs réactions et maîtrisant leurs émotions"],
      drainTitle: "Vous vous épuisez avec les personnes ou les situations",
      drain: ["désorganisées ou peu fiables dans leurs engagements", "imprévisibles ou changeant constamment de direction", "incohérentes ou illogiques dans leurs décisions", "peu respectueuses des règles ou des cadres", "qui génèrent du stress, de l’instabilité, de l'agressivité"]
    },
    signature: "Vous avez besoin de stabilité pour vous engager… et de cohérence pour rester."
  },
  charmeur: {
    id: "charmeur",
    title: "Le Charmeur élégant et charismatique",
    imageSlug: "charmeur",
    metrics: [{ label: "Se ressource avec les autres", value: 85 }, { label: "Préfère le concret", value: 80 }, { label: "Décide avec le cœur", value: 70 }, { label: "Aime la flexibilité", value: 90 }],
    fonctionnement: "Vous vivez dans l’instant présent et cherchez à profiter de chaque moment. Vous aimez ce qui est réel, vivant et concret. Les discours trop théoriques ou les projections lointaines vous lassent rapidement. Vous prenez vos décisions en fonction de ce que vous ressentez. Vous avez besoin de mouvement, de stimulation, et vous ennuyez vite dans la routine.\n\nVous êtes guidé(e) par vos émotions, votre intuition du moment et vos envies. Vous cherchez avant tout à vous sentir bien. Vous êtes plutôt naturel(le) et spontané(e). On recherche volontiers votre présence pour votre enthousiasme, votre joie de vivre, et votre énergie. Vous avez un vrai talent pour créer du lien et apporter de la chaleur autour de vous.",
    rapportAuxAutres: "Vous vous ressourcez au contact des autres. L’échange, le mouvement, la présence vous stimulent. Le silence prolongé, la solitude vous pèsent. Vous allez vers les autres avec facilité. Vous aimez partager vos expériences et vos ressentis avec vos proches. Vous êtes sélectif(ve) sans en avoir l’air. Vous percevez finement les émotions des autres. Votre convivialité n’affecte pas votre lucidité.\n\nVous apportez volontiers soutien et réconfort dans les moments difficiles. De nature expressive, vous communiquez avec naturel, sans filtre excessif. Vous êtes attentif(ve) au bien-être de ceux qui vous entourent. Vous aimez faire plaisir, divertir, rassembler. Pour vous, l’ambiance se doit d’être positive et joyeuse. Le rire est la meilleure thérapie.",
    equilibre: "Vous vous organisez de manière souple. Vous n’aimez pas les contraintes rigides, ni les plans figés. Vous préférez adapter, improviser, suivre votre rythme. Cela vous rend vivant(e) et flexible… mais parfois imprévisible. Votre goût du plaisir immédiat peut vous éloigner des responsabilités à long terme.\n\nFace au stress, vous cherchez à l’évacuer rapidement sans toujours en chercher la cause profonde. Vous préférez changer de sujet, bouger, parler. Si la pression devient trop forte, vous pouvez vous esquiver sans explication. Votre défi serait de structurer vos projets sans perdre votre spontanéité et votre fantaisie.",
    visionAmour: "Pour vous, l’amour doit être simple, naturel et vivant. Il peut être intense, mais surtout vécu dans l’instant présent. Vous recherchez une relation fluide pour partager des moments concrets et agréables. Vous ne cherchez pas à tout définir.\n\nVous avez besoin que le lien se fasse naturellement, sans pression. Vous êtes attiré(e) par des profils rassurants qui stabilisent votre énergie. Les personnalités trop cérébrales vous ennuient. Vous avez besoin que la relation reste vivante, spontanée et stimulante au quotidien.",
    pointsForts: ["Vous êtes chaleureux(se) et accessible", "Vous apportez de la joie et de la légèreté", "Vous êtes spontané(e) et naturel(le)", "Vous vivez le moment présent", "Vous savez mettre les autres à l’aise"],
    fragilites: ["Vous fuyez les contraintes, les sujets dérangeants", "Votre manque de constance peut vous faire paraître superficiel", "Vous avez du mal à vous projeter dans la durée", "Vous pouvez être imprévisible et dérangeant(e)", "Vous suivez souvent vos impulsions, sans toujours prendre de recul"],
    attractions: {
      comfortTitle: "Vous vous sentez bien avec des personnes ou les situations",
      comfort: ["ouvertes et positives, naturelles et chaleureuses", "structurantes, sans être rigides ni contrôlantes", "qui vous ressemblent, sans être votre double", "capables d’apporter de la profondeur", "respectueuse de votre spontanéité"],
      drainTitle: "Vous vous épuisez avec les personnes ou les situations",
      drain: ["rigides, négatives ou contrôlantes", "trop exigeantes ou dans la dépendance affective", "dans l’analyse permanente, qui coupent tout élan", "qui veulent tout définir, cadrer ou planifier à l’excès", "fermées d’esprit ou peu ouvertes au changement"]
    },
    signature: "Vous avez besoin de légèreté pour entrer en relation… et de complicité pour vous engager."
  }
soutien: {
    id: "soutien",
    title: "Le Soutien chaleureux et engagé",
    imageSlug: "soutien",
    metrics: [{ label: "Se ressource avec les autres", value: 90 }, { label: "Préfère le concret", value: 75 }, { label: "Décide avec le cœur", value: 80 }, { label: "Aime la structure", value: 85 }],
    fonctionnement: "Vous évoluez dans le concret et la réalité. Vous vous appuyez sur ce qui est visible, vécu et partagé. Vous accordez de l’importance aux traditions. Vous êtes sensible aux règles et aux bonnes manières. Vous aimez que les choses soient claires, organisées et sécurisantes. Vous prenez vos décisions en fonction de ce que vous ressentez et de l’impact sur les autres.\n\nVous êtes guidé(e) par vos valeurs, votre sens du bien et du mal, et votre volonté de faire plaisir. Vous cherchez à créer de l’harmonie autour de vous. Votre sens du devoir vous pousse à prendre soin de votre entourage. Vous êtes chaleureux(se), attentionné(e), généreux(se) et fiable. Vous avez à cœur de tenir votre rôle et de contribuer activement au bien-être du groupe.",
    rapportAuxAutres: "De tempérament chaleureux et ouvert, vous aimez rassembler autour de vous. Vous vous ressourcez au contact des autres. Vous aimez partager, rendre service. Vous trouvez votre énergie dans les relations et dans le fait de vous sentir utile. Vous êtes attentif(ve) aux besoins des autres. Vous percevez leurs émotions et apportez volontiers soutien, réconfort dans les moments difficiles.\n\nVotre attention aux détails et aux besoins de chacun rend votre présence rassurante et structurante. Vous communiquez facilement, avec simplicité et sincérité. Vous attendez en retour de la reconnaissance et de l’attention. Vous avez besoin de sentir que votre implication est appréciée. Vous êtes sensible au regard et à la gratitude des autres.",
    equilibre: "Vous aimez prévoir, organiser, structurer. Vous avez besoin de cadre pour vous sentir en sécurité. Cela vous rend fiable mais votre attachement aux valeurs, aux traditions peut vous rendre rigide. Face au stress, vous vous impliquez activement car vous avez tendance à vous inquiéter pour les autres.\n\nA vouloir tout prendre sur vous, vous pouvez vous surinvestir et ressentir les difficultés que vous n’avez pas réussi à résoudre comme un échec personnel. En cas de conflit, vous cherchez à rétablir l’harmonie sans penser à vous. C'est épuisant sur la durée. Votre défi serait d’accepter que votre soif d’harmonie a ses limites et de penser davantage à vous sans culpabiliser.",
    visionAmour: "Pour vous, l'amour s'exprime par les gestes, les attentions, la présence au quotidien. Vous aimez prendre soin de l’autre, l’entourer affectueusement, lui créer un cadre sécurisant. En retour, vous avez besoin de sentir que vous comptez réellement pour lui/elle.\n\nDerrière votre générosité, il y a une forte attente de reconnaissance et de réciprocité. Vous vous épanouissez avec des partenaires expressifs et chaleureux. Les difficultés apparaissent si l’autre est distant, peu reconnaissant ou remet en cause votre besoin de stabilité.",
    pointsForts: ["Vous êtes chaleureux(se) et attentionné(e)", "Vous êtes fiable et engagé(e)", "Vous savez créer du lien et de la proximité", "Vous êtes à l’écoute des autres", "Vous apportez stabilité et sécurité"],
    fragilites: ["Vous avez du mal avec le conflit", "Vous attendez beaucoup des autres", "Vous pouvez être exigeant(e) ou contrôlant(e)", "Vous avez tendance à vous oublier pour les autres", "Vous avez du mal à dire non, par peur de décevoir"],
    attractions: {
      comfortTitle: "Vous vous sentez bien avec des personnes ou les situations",
      comfort: ["fiables, sincères, respectueuses et attentionnées", "qui reconnaissent et apprécient votre engagement", "chaleureuses et rassurantes dans leurs attitudes", "qui répondent avec réciprocité", "qui ne profitent pas abusivement de votre générosité"],
      drainTitle: "Vous vous épuisez avec les personnes ou les situations",
      drain: ["froides, distantes ou peu démonstratives", "désorganisées qui créent du désordre autour d’elles", "instables ou peu fiables qui ne s’engagent pas", "peu valorisantes, négatives, ingrates ou indifférentes", "qui évitent les échanges et laissent les tensions s’installer"]
    },
    signature: "Vous avez besoin de vous sentir utile pour vous engager … et de reconnaissance pour vous réaliser"
  },
  enthousiaste: {
    id: "enthousiaste",
    title: "L’Enthousiaste enjoué et rayonnant",
    imageSlug: "enthousiaste",
    metrics: [{ label: "Se ressource avec les autres", value: 85 }, { label: "Préfère l’abstrait", value: 80 }, { label: "Décide avec le cœur", value: 75 }, { label: "Aime la flexibilité", value: 90 }],
    fonctionnement: "Vous évoluez dans le registre de l’intuition et des possibilités. Vous aimez explorer, imaginer, créer des correspondances entre les idées. Vous êtes attiré(e) par ce qui est nouveau, original, stimulant. Vous êtes une personnalité enthousiaste, créative et profondément humaine. Votre imagination et votre curiosité entretiennent une vision du monde pleine de sens. La vie vous semble passionnante.\n\nVous croyez en l’importance des relations humaines. Vous prenez vos décisions en fonction de ce que vous ressentez et de ce qui vous inspire. Vous êtes guidé(e) par vos valeurs, vos élans et votre désir d’authenticité. Vous avez une capacité naturelle à créer du lien et à transmettre votre énergie aux autres.",
    rapportAuxAutres: "Vous êtes chaleureux(se), expressif(ve) et très communicatif(ve). Sociable, vous allez facilement vers les autres. Vous aimez partager, inspirer et rassembler autour de vous. Votre énergie positive et votre spontanéité vous rendent naturellement attirant(e). Vous pouvez être très enthousiaste dans les échanges, mais aussi rapidement déçu(e) lorsqu’ils manquent de profondeur.\n\nVous savez encourager, motiver, féliciter. Vous êtes attentif(ve) aux émotions et aux intentions de ceux qui vous entourent. Vous percevez ce qui se joue derrière les mots. Vous oscillez entre légèreté joyeuse et profondeur émotionnelle. Sensible, vous pouvez surinterpréter les comportements des autres. Vous avez besoin de liberté dans les échanges.",
    equilibre: "Vous avez tendance à multiplier les idées, les projets, les envies. Vous aimez commencer, explorer, tester. Cela vous rend créatif(ve), vivant(e)… mais parfois dispersé(e). Vous avez souvent du mal à finir vos projets. Votre enthousiasme contagieux peut être difficile à maintenir dans la durée.\n\nFace au stress, vous pouvez vous sentir submergé(e) et vouloir fuir les contraintes. Vous ne supportez pas la routine et les cadres trop rigides. Votre défi pourrait être de canaliser votre énergie et de vous efforcer de tenir vos objectifs.",
    visionAmour: "Pour vous, l’amour est une aventure. Elle doit être intense et généreuse. Vous recherchez une relation riche en échanges et en surprises. Vous avez besoin de complicité, de vibrations, de vous sentir compris(e) et d’être stimulé(e).\n\nVous êtes naturellement attiré(e) par des profils qui ont de la personnalité, capables de canaliser votre énergie, d’adhérer à vos projets sans vous brider. Les difficultés apparaissent lorsque la routine s'installe, lorsque vos attentes sont trop élevées ou quand l’autre ne partage plus votre fougue.",
    pointsForts: ["Vous êtes enthousiaste et inspirant(e)", "Vous êtes créatif(ve) et imaginatif(ve)", "Vous savez créer du lien facilement", "Vous apportez énergie et optimisme", "Vous êtes empathique et à l’écoute"],
    fragilites: ["Vous avez tendance à vous disperser", "Vous fuyez les contraintes trop fortes", "Vous êtes très sensible aux déceptions", "Vous pouvez idéaliser les relations", "Vous avez du mal avec la routine"],
    attractions: {
      comfortTitle: "Vous vous sentez bien avec des personnes ou les situations",
      comfort: ["authentiques sincères et profondes", "qui respectent votre liberté et votre spontanéité", "capables de vous aider à vous ancrer sans vous brider", "ouvertes, curieuses et enthousiastes", "les échanges fluides, naturels et pleins de vie"],
      drainTitle: "Vous vous épuisez avec les personnes ou les situations",
      drain: ["rigides, fermées, peu ouvertes aux idées nouvelles", "trop directives ou contrôlantes", "dans la routine, sans imagination", "ternes, superficielles ou peu sincères", "qui freinent votre élan ou votre créativité"]
    },
    signature: "Lorsque vous vous engagez pleinement,… vous devenez une source d’inspiration lumineuse."
  },
  reveur: {
    id: "reveur",
    title: "Le Rêveur libre et sensible",
    imageSlug: "reveur",
    metrics: [{ label: "Se ressource dans le calme", value: 80 }, { label: "Préfère le concret", value: 80 }, { label: "Décide avec le cœur", value: 85 }, { label: "Aime la flexibilité", value: 85 }],
    fonctionnement: "Vous évoluez dans le registre du ressenti et du concret. Vous êtes sensible, libre et attentif(ve) à ce que vous vivez dans l’instant. Vous aimez ce qui est simple, vrai et tangible. Vous vous exprimez davantage par vos choix et votre manière d’être que par les mots. Vous exprimez peu vos émotions de manière directe.\n\nVotre sensibilité nourrit votre perception du monde et influence vos décisions au quotidien. Ouvert(e) d’esprit, vous acceptez les différences sans jugement. Vous êtes guidé(e) par ce que vous ressentez et par votre besoin d’être en accord avec vous-même. Vous êtes attentif(ve) aux ambiances, aux sensations et à ce qui rend une expérience agréable et harmonieuse.",
    rapportAuxAutres: "Vous recherchez l’harmonie et des relations simples, sincères. Discret(e) mais chaleureux(se), vous privilégiez les liens proches, affectueux et authentiques. Vous ne vous imposez pas, mais votre présence est appréciée pour sa douceur et sa sincérité. Vous savez être présent(e), soutenir et apaiser avec délicatesse.\n\nVotre sensibilité vous permet de percevoir finement, comprendre, voire partager les émotions des autres. Vous exprimez souvent votre attention davantage par des gestes concrets que par des mots. Vous avez besoin de liberté, de respiration émotionnelle, et de ne pas vous sentir contraint(e) dans vos relations, pour rester fidèle à vous-même.",
    equilibre: "Vous avez besoin de liberté et supportez mal les cadres rigides. Vous aimez suivre votre rythme, vos envies. Vous êtes guidé(e) par vos valeurs, votre ressenti. Votre spontanéité vous rend vivant(e), mais peut rendre difficile la planification à long terme. Parfois, vous doutez de vous ou craignez de décevoir.\n\nFace aux tensions, vous avez tendance à vous retirer plutôt qu’à vous confronter. Les environnements trop directs ou conflictuels vous déstabilisent. Vous gagneriez en équilibre en acceptant un peu de structure et en exprimant davantage ce que vous ressentez.",
    visionAmour: "Pour vous, l’amour est une relation douce et sincère. Vous recherchez un lien simple et naturel, sans rapport de force où l’on peut être soi sans avoir à se justifier. Vous avez besoin de vous sentir libre tout en étant profondément connecté(e).\n\nVous exprimez vos sentiments de manière discrète, à travers ce qui vous touche. Vous êtes sensible aux ambiances qui créent un sentiment de proximité et de confiance. Vous ne supportez pas les profils trop structurants ou intrusifs.",
    pointsForts: ["Vous êtes sensible et authentique", "Vous êtes créatif(ve) et inspiré(e)", "Vous êtes ouvert(e) et tolérant(e)", "Vous êtes à l’écoute et délicat(e)", "Vous apportez douceur et harmonie"],
    fragilites: ["Vous pouvez fuir les contraintes rigides", "Votre grande sensibilité est source de vulnérabilité", "Vous avez du mal à verbaliser clairement vos besoins", "Vous évitez les conflits même s'ils sont nécessaires", "Vous avez du mal à vous affirmer et doutez souvent de vous"],
    attractions: {
      comfortTitle: "Vous vous sentez bien avec des personnes ou les situations",
      comfort: ["bienveillantes et respectueuses", "ouvertes d’esprit et sans jugement", "non envahissantes, capables d’être présentes sans s’imposer", "douces qui vous aident à vous ancrer dans le réel sans vous brider", "sensibles à ce qui est vrai, beau et sincère dans la relation"],
      drainTitle: "Vous vous épuisez avec les personnes ou les situations",
      drain: ["intrusives ou ne respectant pas votre espace personnel", "brusques, autoritaires ou dans le contrôle", "cyniques, dures, insensibles, conflictuelles", "peu authentiques ou artificielles dans leur comportement", "qui imposent un rythme sans place à la réflexion"]
    },
    signature: "En échange de votre indépendance… vous offrez au monde beauté et douceur."
  }
guide: {
    id: "guide",
    title: "Le Guide impliqué et structurant",
    imageSlug: "guide",
    metrics: [{ label: "Se ressource avec les autres", value: 95 }, { label: "Préfère l’abstrait", value: 75 }, { label: "Décide avec le cœur", value: 85 }, { label: "Aime structurer", value: 80 }],
    fonctionnement: "Vous êtes un leader guidé par des valeurs fortes et humanistes. Votre charisme naturel vous permet de fédérer et motiver autour de vous. Idéaliste, vous défendez avec conviction ce que vous jugez juste. Vous ne vous contentez pas d’observer les dynamiques, vous mesurez les enjeux, anticiper les réactions. Vous n’hésitez pas à prendre des initiatives.\n\nVous avez une capacité naturelle à organiser les échanges, à redéfinir le contexte, à faire avancer les choses. Vous avez besoin de cohérence. Vous ne supportez pas les situations floues ou bloquées. Votre efficacité est reconnue mais elle peut également gêner par la place centrale que vous pouvez être amené à prendre parfois même sans vous en rendre compte.",
    rapportAuxAutres: "Vous êtes inevesti(e) dans vos relations. Votre empathie vous donne une compréhension fine des émotions des autres. Vous excellez dans la communication, à la fois persuasive et bienveillante. Vous savez créer du lien, encourager, donner confiance et prenez plaisir à accompagner les autres vers leur plein potentiel. Votre présence favorise l’harmonie et la coopération.\n\nVous recherchez des liens authentiques et porteurs de sens. Vous êtes reconnu(e) pour votre optimisme même face à l'adversité, votre dynamisme, votre esprit constructif. Vous prenez souvent un rôle moteur dans les interactions. Si la relation devient incohérente avec des tensions non dites, vous pouvez ressentir de la frustration et prendre du recul.",
    equilibre: "Vous êtes très investi(e) dans vos relations et attentif(ve) aux autres. Vous avez à cœur d’aider les personnes à évoluer et à donner du sens à ce qu’elles vivent. Votre engagement peut parfois être perçu comme trop directif, voire intrusif. Vous gagneriez en équilibre en acceptant le rythme, les choix de chacun, sans vouloir les orienter.\n\nFace au stress, vous cherchez à comprendre les blocages pour faire évoluer la situation. Les incohérences, les non-dits ou l’absence de progression vous affectent. Vous pouvez ressentir de la frustration lorsque les choses stagnent. Vous vous apaisez en prenant du recul et en acceptant de ne pas tout porter.",
    visionAmour: "Pour vous une relation doit être active. Vous ne vous contentez pas d'un lien agréable. Vous avez besoin d'une relation vivante qui évolue et progresse de façon harmonieuse. Vous attendez de l'autre qu'il s'implique réellement.\n\nVous êtes attiré(e) par des profils sensibles et ouverts qui partagent votre dynamisme. Vous avez tendance à placer les besoins de votre partenaire avant les vôtres. Attention au surinvestissement sans réciprocité !",
    pointsForts: ["Vous apportez efficacité, cohérence et continuité", "Vous êtes attentif(ve) aux autres", "Vous êtes dynamique et motivant(e)", "Vous êtes factuel(le), fiable et impliqué(e)", "Vous savez assumer vos responsabilités"],
    fragilites: ["Vous pouvez en faire trop, prendre trop de place", "Vous avez du mal à lâcher prise, à laisser faire", "Vous pouvez devenir exigeant(e) et directif(ve)", "Votre interventionnisme peut finir par exaspérer", "Vous pouvez réagir durement si vous vous sentez dépassé(e)"],
    attractions: {
      comfortTitle: "Vous vous sentez bien avec des personnes ou les situations",
      comfort: ["réactives et prêtes à accepter votre dynamisme", "conscientes et admiratives de votre valeur ajoutée", "qui partagent votre goût pour l’action", "capables de vous enrichir par leur regard et leur sensibilité", "ouvertes au changement"],
      drainTitle: "Vous vous épuisez avec les personnes ou les situations",
      drain: ["fuyantes, passives ou peu engagées", "rebelles à votre autorité, à votre rythme", "fermées au dialogue ou difficiles à faire évoluer", "qui ne reconnaissent pas votre valeur ajoutée", "souffrant de votre manque de fantaisie"]
    },
    signature: "Vous allez volontiers à la rencontre de l’autre… mais il vous faut de la gratitude pour perdurer"
  },
  entrepreneur: {
    id: "entrepreneur",
    title: "L’Entrepreneur audacieux et déterminé",
    imageSlug: "entrepreneur",
    metrics: [{ label: "Se ressource avec les autres", value: 90 }, { label: "Préfère le concret", value: 95 }, { label: "Décide avec la tête", value: 70 }, { label: "Aime la flexibilité", value: 85 }],
    fonctionnement: "Vous êtes dans la réalité du moment présent. Vous vous appuyez sur ce qui est concret, tangible et directement observable. Vous accordez de l’importance aux faits et à l’expérience. Les discours théoriques ou les anticipations hasardeuses vous intéressent peu. Vos décisions sont plutôt rapides, voire instinctives, et orientées vers l'action immédiate.\n\nSpontané(e) et réactif(ve), vous avez tendance à agir d’abord puis à ajuster ensuite. Vous vous adaptez facilement aux situations et aux imprévus. Vous privilégiez ce qui fonctionne concrètement plutôt que les règles ou les cadres établis. Votre sens pratique vous permet de gérer efficacement les situations sur le moment.",
    rapportAuxAutres: "Vous êtes direct et à l’aise pour vous exprimer. Toutefois, vous privilégiez l’action aux discours. Vous allez droit au but, avec le souci de l’efficacité plus que celui de l’image. Vous ne ressentez pas le besoin de partager vos émotions. Vous êtes exigeant(e). Vous attendez des autres qu’ils soient fiables, constants et responsables.\n\nVous ne vous laissez pas influencer facilement. Votre rigueur peut passer pour de l’intransigeance ou un manque de compréhension. Malgré votre charisme, vous êtes parfois perçu(e) comme distant(e) ou peu sensible. Vous êtes sélectif(ve) dans vos relations. Vous allez naturellement vers ce qui est vivant, direct et engageant, plutôt que vers des relations trop routinières ou prévisibles.",
    equilibre: "Vous aimez être entouré(e). Tourné(e) vers l’extérieur, les autres sont une source d’énergie pour vous. Vous êtes à l’aise dans l’action, les échanges et les situations qui bougent. Face au stress, vous avez tendance à agir rapidement et à chercher des solutions concrètes dans l’instant.\n\nVous êtes pragmatique, réactif(ve), attiré(e) par les défis immédiats, les opportunités et une certaine prise de risque. Vous avez du mal parfois à exprimer vos émotions. Vous gagneriez en équilibre en prenant plus de recul, en anticipant davantage et en restant attentif(ve) aux émotions des autres.",
    visionAmour: "Pour vous, l’amour est une construction solide qui passe plus par l’action que par la discussion. Vous recherchez avant tout la confiance mais vous n’êtes pas insensible à l’intensité immédiate. La relation fonctionne quand elle reste légère mais réelle.\n\nVous avez besoin d’une relation claire, sans ambiguïté. Vous avancez progressivement, mais avec sérieux. Quand vous vous engagez, c’est dans la durée avec loyauté, constance et fiabilité.",
    pointsForts: ["Vous êtes réactif(ve) et à l’aise dans l’action", "Vous savez vous adapter rapidement aux situations", "Vous êtes direct(e), concret(e) et orienté(e) résultats", "Vous mettez facilement les autres à l’aise", "Vous savez saisir les opportunités et agir au bon moment"],
    fragilites: ["Vous exprimez peu vos émotions en profondeur", "Vous pouvez manquer de patience face aux autres", "Vous avez tendance à en faire trop dans l’action", "Vous pouvez paraitre brusque, direct(e) ou rigide", "Vous décidez vite sans parfois en mesurer les conséquences"],
    attractions: {
      comfortTitle: "Vous vous sentez bien avec des personnes ou les situations",
      comfort: ["stimulantes intellectuellement", "réactives, fiables, capables de suivre votre rythme", "spontanées, sans détour, à l’aise dans l’échange direct", "ouvertes, curieuses, prêtes à tenter plutôt qu’à théoriser", "qui respectent votre liberté et votre besoin d’autonomie"],
      drainTitle: "Vous vous épuisez avec les personnes ou les situations",
      drain: ["lentes à décider ou confinées dans l'hésitation", "trop dans l’analyse ou dans les discours sans action", "émotionnellement envahissantes ou dramatiques", "peu fiables dans leurs engagements", "ayant du mal avec l'initiative ou la prise de risques"]
    },
    signature: "Vous avez besoin de challenge pour vous investir… et d’actions pour vous réaliser."
  },
  intrepide: {
    id: "intrepide",
    title: "L’Intrépide libre et pragmatique",
    imageSlug: "intrepide",
    metrics: [{ label: "Se ressource dans le calme", value: 85 }, { label: "Préfère le concret", value: 90 }, { label: "Décide avec la tête", value: 85 }, { label: "Aime la flexibilité", value: 85 }],
    fonctionnement: "Vous évoluez dans le registre du concret et de l’action. Vos décisions reposent sur ce qui est tangible, vérifiable et expérimenté. Les discours abstraits ou les longues théories vous intéressent peu. Votre approche est logique, pragmatique et orientée efficacité. Vous exprimez peu vos émotions et privilégiez une approche rationnelle, même dans les situations délicates.\n\nVous allez droit au problème, en identifiant rapidement ce qui fonctionne ou non, et en cherchant la solution la plus simple et directe. Vous aimez garder votre liberté d’action et de décision. Les cadres rigides, les règles inutiles ou les contraintes excessives vous pèsent. Vous êtes adaptable, réactif(ve) et à l’aise face à l’imprévu.",
    rapportAuxAutres: "Vous êtes plutôt réservé(e) et discret(e). Vous n’éprouvez pas le besoin de vous exprimer constamment, ni de partager vos pensées ou vos émotions. Vous privilégiez les échanges simples, naturels, sincères, sans surenchère émotionnelle. Vous fonctionnez de manière indépendante dans vos relations, sans chercher un échange constant.\n\nVotre manière d’être peut parfois être perçue comme distante ou détachée. En réalité, vous avez simplement besoin de temps et de confiance pour vous ouvrir. Vous montrez votre attachement davantage par vos actes que par vos paroles. Vous êtes présent(e) quand il le faut, fiable dans les moments importants, même si vous n’exprimez pas toujours ce que vous ressentez.",
    equilibre: "Vous préférez vous resourcer seul. Face au stress, vous cherchez à reprendre le contrôle. Vous vous concentrez sur les faits, les solutions, l’organisation. Vous avez du mal à exprimer ce que vous ressentez. Vous vous organisez de manière structurée et aimez que les choses soient claires, planifiées, anticipées.\n\nVous respectez vos engagements. Vous avancez étape par étape. Votre pragmatisme vous permet de rester calme et rationnel face aux difficultés. Doté(e) d’une grande réactivité, vous êtes à l’aise avec les défis immédiats, les prises de risque, les imprévus de dernière minute.",
    visionAmour: "Vous concevez l’amour comme une relation libre et fluide. Vous avez besoin de vous sentir sans contrainte, sans attentes excessives. Votre espace personnel doit être respecté. Vous recherchez la confiance, pas l’intensité immédiate.\n\nL’indépendance est essentielle pour vous. Fidèle sans être démonstratif(ve), les manifestations émotionnelles vous mettent mal à l’aise. Les personnalités envahissantes ou trop en demande vous étouffent mais vous appréciez les profils expressifs qui équilibrent votre tempérament introverti.",
    pointsForts: ["Vous êtes pragmatique, efficace et autonome", "Vous gardez votre calme face aux situations complexes", "Vous êtes adaptable, vous savez vous ajuster rapidement", "Vous êtes libre, indépendant(e) et peu influençable.", "Vous percevez les opportunités avant les autres"],
    fragilites: ["Vous pouvez paraître distant(e) ou peu impliqué(e)", "Vous pouvez avoir du mal à exprimer vos sentiments", "L’absence de liberté d’action vous indispose au plus haut point", "Vous pouvez fuir les contraintes relationnelles trop lourdes", "L’absence de concret ou de résultats visibles vous démotive"],
    attractions: {
      comfortTitle: "Vous vous sentez bien avec des personnes ou les situations",
      comfort: ["autonomes et peu envahissantes", "simples, concrètes et naturelles dans leur manière d’être", "respectueuses de votre espace et de votre rythme", "ouvertes à des expériences partagées, sans attentes ni pression", "à l’aise dans le concret, dans l'action, partantes pour l'aventure"],
      drainTitle: "Vous vous épuisez avec les personnes ou les situations",
      drain: ["les relations fusionnelles ou envahissantes", "Les attentes émotionnelles excessives", "les environnements rigides, les conventions pesantes", "les conflits répétitifs sans solution concrète", "les analyses pointilleuses sans passage à l’action"]
    },
    signature: "Vous avez besoin de temps pour vous ouvrir… et de confiance pour vous maintenir."
  }
organisateur: {
    id: "organisateur",
    title: "L’Organisateur fiable et méthodique",
    imageSlug: "organisateur",
    metrics: [{ label: "Se ressource dans le calme", value: 75 }, { label: "Préfère le concret", value: 90 }, { label: "Décide avec la tête", value: 85 }, { label: "Aime structurer", value: 95 }],
    fonctionnement: "Soucieux(se) d’efficacité, votre approche directe repose sur une vision concrète des choses. Vous êtes un leader pragmatique orienté vers l’action. Le besoin de structure est central dans votre fonctionnement. Le réel prime toujours sur l’abstrait. Vous valorisez l’ordre et le respect des règles et des traditions.\n\nVotre engagement est sans faille, presque une ligne de conduite. Très conscient de vos responsabilités, vous menez vos missions jusqu’au bout. Vous aimez diriger et vous le faite volontiers car vous excellez dans la gestion, l’organisation et la mise en œuvre des projets. Votre honnêteté et votre rigueur inspirent confiance et respect.",
    rapportAuxAutres: "Les relations reposent avant tout sur la fiabilité et la cohérence. Dans votre entourage, vous avez à cœur de garantir un cadre clair, stable et fonctionnel. Vous attendez des autres le même engagement et le même sérieux. Votre communication est directe, sans détour ni artifice. Votre franchise et votre souci du résultat peuvent parfois vous faire paraître strict(e) ou inflexible.\n\nVous privilégiez les méthodes éprouvées et pouvez avoir du mal à accepter des approches différentes des vôtres. Les grands débats théoriques vous irritent lorsqu’ils remettent en cause ce qui vous semble évident. Dans certaines situations, vous pouvez avoir tendance à privilégier l’efficacité au détriment de la prise en compte des sensibilités individuelles.",
    equilibre: "Vous vous épanouissez dans l’action, l’organisation et la mise en œuvre concrète. Vous avez besoin de structure, de clarté et d’objectifs précis pour avancer efficacement. Vous prenez naturellement les choses en main et veillez à ce que tout fonctionne de manière logique et ordonnée.\n\nLes imprévus ou le manque de cadre peuvent vous déstabiliser. Face au stress, vous avez tendance à renforcer le contrôle. Vous gagneriez en équilibre avec plus de souplesse, en laissant davantage d'initiatives aux autres et en étant plus attentif à leurs besoins et à leurs émotions.",
    visionAmour: "Pour vous, l’amour s’inscrit dans une logique de construction et de confiance. C'est un sentiment qui doit reposer sur une relation solide, loyale et durable, sur un engagement réel. Vous attendez de l'autre la même implication.\n\nL’attachement se démontre par des actes concrets, par la présence et la constance. Il se concrétise par des projets communs, une organisation du couple à deux, menés dans un cadre rassurant.",
    pointsForts: ["Votre capacité à faire avancer les choses", "Votre engagement inspire confiance et respect", "Votre souci du résultat et votre capacité à l’atteindre", "Votre pragmatisme, votre rigueur et votre honnêteté", "Votre sens des responsabilités et du devoir"],
    fragilites: ["Vous avez tendance à vous réfugier dans l’action", "Vous pouvez avoir un attachement excessif à l’ordre et à la tradition", "Vous avez du mal à accepter des approches différentes et originales", "Vous avez du mal à comprendre et à gérer les émotions", "Vous avez tendance à vouloir tout contrôler"],
    attractions: {
      comfortTitle: "Vous vous sentez bien avec des personnes ou les situations",
      comfort: ["qui partagent le même souci d’efficacité", "qui acceptent votre leadership", "respectueuses des engagements, des conventions", "soucieuses de la priorité des objectifs", "qui communiquent de manière directe et vont droit au but"],
      drainTitle: "Vous vous épuisez avec les personnes ou les situations",
      drain: ["inconstantes dans leurs opinions et peu fiables", "nébuleuses, manquant de rigueur, approximatives", "qui contournent les règles ou jouent sur les non-dits", "inefficaces, qui parlent beaucoup mais agissent peu", "de mauvaise foi, incapables de reconnaître leurs responsabilités"]
    },
    signature: "Très attaché(e) aux faits… vous privilégiez le concret à l’optimisme béat."
  },
  decideur: {
    id: "decideur",
    title: "Le Décideur direct et structurant",
    imageSlug: "decideur",
    metrics: [{ label: "Se ressource avec les autres", value: 85 }, { label: "Préfère l’abstrait", value: 75 }, { label: "Décide avec la tête", value: 90 }, { label: "Aime structurer", value: 90 }],
    fonctionnement: "Vous êtes dans l’action. Vous voyez rapidement ce qui doit être fait et comment y parvenir. Votre esprit est structuré, stratégique, orienté résultats. Vous aimez décider, organiser, avancer. Leader naturel, porté par une forte assurance et un grand charisme, vous prenez facilement la direction des opérations et avancez avec détermination.\n\nStratège, vous savez planifier sur le long terme. Les défis vous stimulent qu’ils soient simples ou complexes. Votre volonté et votre discipline vous permettent de réussir là où d’autres abandonnent. Vous excellez dans l’organisation et la mobilisation des talents autour de vous. L’inefficacité, l’hésitation ou le manque de clarté vous agacent rapidement.",
    rapportAuxAutres: "Vous êtes exigeant(e) et direct(e). Vous attendez des autres qu’ils partagent votre goût pour la compétition et la performance. Très rationnel(le), vous privilégiez l’efficacité au détriment des considérations émotionnelles. Vous respectez les personnes solides, capables de s’engager et de tenir leurs positions. Vous supportez mal l’indécision ou le manque de rigueur.\n\nVous prenez naturellement le leadership. Vous savez mobiliser, organiser, structurer. Vous pouvez manquer de tact en pointant les erreurs ou les faiblesses des autres. Votre attitude directive, votre niveau d’exigence élevé peut vous donner une image de personne dure et inflexible. Votre culture du résultat peut aboutir à un épuisement, voire un rejet de votre entourage.",
    equilibre: "Très autonome, vous avez besoin d’échanges stimulants et d’environnements dynamiques. Vous pouvez avoir du mal à ralentir. L’inaction vous met mal à l’aise. Vous êtes constamment tourné(e) vers l’amélioration et la performance. Face au stress, vous accélérez. Vous prenez encore plus le contrôle.\n\nCela peut accroitre votre efficacité pour surmonter la difficulté mais réduire votre capacité à admettre vos erreurs, tout en vous éloignant des autres. Votre principal défi serait d’intégrer davantage la dimension humaine et émotionnelle. Accepter que tout n'est pas qu'une question d’efficacité.",
    visionAmour: "Vous avez tendance à envisager le couple comme un partenariat. Vous avez besoin d’un échange stimulant et structurant. Lors de la rencontre, vous êtes observateur(trice) mais aussi rapidement décisionnaire. Si la personne vous semble correspondre, vous vous investissez sans compter. Sinon, vous n'avez pas de temps à perdre.\n\nUne fois engagé(e), vous êtes fiable, constant(e) et protecteur(trice). Vous attendez en retour une implication équivalente. Vous êtes attiré(e) par des profils profonds et sensibles qui « humanisent » votre tendance à dominer.",
    pointsForts: ["Vous êtes dynamique, structurant(e), efficace", "Leader naturel, vous entrainez dans votre sillage", "Vous êtes déterminé(e) et discipliné(e)", "Vous apportez vision, ambition et énergie", "Vous persévérez là où d’autres abandonnent"],
    fragilites: ["Vous pouvez aller trop vite et ne pas laisser le temps à l’autre", "Votre exigence peut être perçue comme insupportable", "Vous privilégiez parfois l’efficacité au détriment de l’humain", "Votre besoin de contrôle risque de freiner la spontanéité", "Le ton de vos remarques peut être blessant"],
    attractions: {
      comfortTitle: "Vous vous sentez bien avec des personnes ou les situations",
      comfort: ["solides, fiables et capables de tenir leurs engagements", "ambitieuses qui visent haut et assument leurs responsabilités", "capables de décider et d’agir rapidement", "capables de vous apporter un peu de rondeur", "suffisamment affirmées pour vous tenir tête avec intelligence"],
      drainTitle: "Vous vous épuisez avec les personnes ou les situations",
      drain: ["indécises, passives, qui retardent les décisions, dépendantes", "rebelles, désorganisées, envahissantes", "trop émotives, qui laissent leurs états d’âme guider leurs choix", "incapables de suivre votre rythme, qui vous font perdre du temps", "ayant le même attrait pour le commandement"]
    },
    signature: "Vous avez besoin de défis et de mouvement pour aller à la rencontre de l’autre… et d’une vision claire pour vous engager."
  },
  concepteur: {
    id: "concepteur",
    title: "Le Concepteur rigoureux et indépendant",
    imageSlug: "concepteur",
    metrics: [{ label: "Se ressource dans le calme", value: 85 }, { label: "Préfère l’abstrait", value: 85 }, { label: "Décide avec la tête", value: 90 }, { label: "Aime structurer", value: 90 }],
    fonctionnement: "Vous évoluez dans un univers d’idées, de vision globale et d’anticipation. Esprit stratégique, vous cherchez à analyser, structurer et améliorer ce qui vous entoure. Indépendant(e), vous pensez par vous-même et remettez en question les idées toutes faites. Vous ne suivez pas, vous cherchez à comprendre, puis vous agissez.\n\nVous privilégiez la logique, les faits et l’efficacité plutôt que les conventions sociales. Votre objectif n’est pas seulement d’innover, mais de construire des solutions qui fonctionnent. Vous avancez avec détermination sans attendre l’approbation des autres. Votre curiosité intellectuelle vous pousse à approfondir tout ce qui vous intéresse.",
    rapportAuxAutres: "Vous êtes réservé(e), sélectif(ve) et exigeant(e). Peu attiré(e) par les interactions superficielles, vous privilégiez des relations profondes. Vous recherchez des échanges de qualité, fondés sur la réflexion, la cohérence et l’authenticité. Vous êtes exigeant(e), autant envers vous-même qu’envers votre entourage. Vous vous ressourcez dans le calme et la solitude.\n\nVous respectez les personnes solides intellectuellement et créatives, capables de nuances et ouverts à la discussion. Vous pouvez vous montrer sceptique face aux « bons sentiments ». L’irrationalité, ou les réactions excessives vous déstabilisent. Derrière une apparence réservée, vous restez sensible et compréhensif(ve) mais vous exprimez peu cette dimension.",
    equilibre: "Vous avez besoin de calme, de solitude et de recul pour fonctionner pleinement. C’est dans ces moments que vous structurez vos idées et affinez votre vision. Vous pouvez vous enfermer dans votre monde intérieur au point de vous couper des autres.\n\nFace au stress, vous vous repliez sur l’analyse plutôt que sur la confrontation. Votre principal défi serait d’intégrer davantage la dimension humaine et émotionnelle. Prendre en compte des ressentis des autres, même si ce n'est pas rationnel. Accepter que tout ne repose pas uniquement sur la logique.",
    visionAmour: "Vous recherchez avant tout la « faisabilité », pas l’intensité immédiate. Vous prenez le temps de découvrir l’autre. Quand vous vous engagez, c’est dans la durée avec loyauté. Peu de mots doux mais des actes concrets d'affection dans le quotidien.\n\nVotre analyse de ce qu’il convient de faire et votre volonté d'aider peut parfois négliger les attentes émotionnelles de votre partenaire qui a simplement besoin de réconfort pas d’une solution. La relation fonctionne lorsque chacun conserve son autonomie tout en partageant une vision commune.",
    pointsForts: ["Vous êtes créatif(ve), lucide et structuré(e)", "Vous excellez à vous projeter dans le futur", "Esprit stratégique, vous analysez et donnez une cohérence", "Vous êtes indépendant(e), autonome et déterminé(e)", "Vous apportez recul, clarté, et exigence dans la relation"],
    fragilites: ["Vous pouvez paraître dur(e), arrogant(e) ou froid(e)", "Vous privilégiez la logique au détriment des émotions", "Votre besoin de maîtrise peut freiner la spontanéité", "Vous avez du mal à recevoir des conseils ou à lâcher le contrôle", "Vous pouvez devenir cynique envers ceux qui vous déçoivent"],
    attractions: {
      comfortTitle: "Vous vous sentez bien avec des personnes ou les situations",
      comfort: ["capables de comprendre votre univers sans vouloir le brusquer", "stimulantes intellectuellement", "profondes, autonomes et indépendantes", "capables de prendre du recul et d’avoir une vision d’ensemble", "cohérentes dans leur réflexion et leurs décisions"],
      drainTitle: "Vous vous épuisez avec les personnes ou les situations",
      drain: ["passives, superficielles ou sans profondeur de réflexion", "envahissantes, intrusives de votre espace personnel", "trop guidées par l’émotion plutôt que par la logique", "sans curiosité, ni capacité de remise en question", "manquant de cohérence entre leurs objectifs et leurs actions"]
    },
    signature: "Vous avez besoin de maîtriser ce que vous ressentez pour aller vers l’autre… et d’une cohérence totale pour vous engager."
  },
  explorateur: {
    id: "explorateur",
    title: "L’Explorateur audacieux et stimulant",
    imageSlug: "explorateur",
    metrics: [{ label: "Se ressource avec les autres", value: 85 }, { label: "Préfère l’abstrait", value: 85 }, { label: "Décide avec la tête", value: 80 }, { label: "Aime la flexibilité", value: 90 }],
    fonctionnement: "Vous évoluez dans le registre des idées et de l’exploration. Vous êtes vif(ve), curieux(se) et profondément stimulé(e) par les défis intellectuels. Vous aimez questionner, débattre et remettre en cause les idées établies. Votre esprit anticonformiste nourrit votre capacité d’innovation. Votre pensée est inventive et constamment en mouvement.\n\nVous dépassez les évidences, repoussez les limites, explorez en dehors des cadres classiques. Vous êtes naturellement attiré(e) par la nouveauté. Dans les échanges avec les autres, vous aimez débattre, en jouant avec les idées et les points de vue. Vous préférez imaginer et débattre plutôt que de mettre en œuvre et assurer un suivi.",
    rapportAuxAutres: "Vous apportez dans vos relations de l’énergie, de la stimulation et une grande ouverture d’esprit. Vous aimez questionner, débattre et explorer de nouvelles idées avec les autres. Vous appréciez les personnes capables de vous challenger intellectuellement.\n\nVous savez relancer les échanges, bousculer les points de vue et apporter des perspectives différentes. Vos relations sont libres et évolutives. Votre humour et votre audace sont stimulants pour votre entourage. Toutefois, votre tendance à contredire systématiquement peut paraitre stérile et agaçante.",
    equilibre: "Vous vous ressourcez dans le mouvement, les échanges et la stimulation intellectuelle. Les environnements figés ou répétitifs vous fatiguent rapidement. Vous avez besoin de liberté, de nouveauté, de partage et d’espace pour confronter vos idées.\n\nLes cadres trop rigides ou les contraintes trop fortes vous freinent. Vous excellez dans l’art de l’argumentation et êtes en recherche permanente de nouvelles perspectives. Vous gagneriez en équilibre en restant attentif au concret, à l'impact de vos idées, et aux émotions des autres. Votre défi serait un meilleur engagement dans la gestion de vos projets.",
    visionAmour: "Vous recherchez avant tout une relation vivante, stimulante et évolutive, une connexion mentale forte. Vous avez besoin d’échanges, de complicité intellectuelle et de surprises.\n\nAinsi, vous aimez séduire, surprendre et provoquer des émotions, tout en gardant votre liberté. La routine vous éteint, tandis que la nouveauté vous nourrit. Vous séduisez par votre esprit, votre humour, votre spontanéité. La relation fonctionne quand elle reste un espace d’exploration et non de fixation.",
    pointsForts: ["Vous apportez légèreté, humour et créativité", "Vous êtes ouvert(e), adaptable et curieux(se)", "Vous insufflez du mouvement et de la nouveauté", "Vous inspirez par votre originalité", "Vous apportez des perspectives différentes"],
    fragilites: ["Vous avez du mal à vous inscrire dans la durée", "Vous pouvez déstabiliser par vos contradictions", "Vous pouvez privilégier l’idée au détriment de l’action", "Vous avez tendance à gérer trop de projets en même temps", "Vous pouvez avoir des difficultés à faire preuve d’empathie"],
    attractions: {
      comfortTitle: "Vous vous sentez bien avec des personnes ou les situations",
      comfort: ["indépendantes, originales et ouvertes d’esprit", "originales, vives, curieuses et spontanées", "capables d’échanges et de réparties", "intuitives, cérébrales mais actives", "partageant votre goût pour l’exploration"],
      drainTitle: "Vous vous épuisez avec les personnes ou les situations",
      drain: ["monotones, rigides ou bornées", "routinières ou conventionnelles, sans fantaisie", "susceptibles ou trop émotives dans les échanges", "dépourvues d’imagination ou de curiosité intellectuelle", "qui refusent ou prennent les échanges d’idées de manière personnelle"]
    },
    signature: "Vous avez besoin de stimulation pour vous investir… et de liberté pour vous attacher"
  }