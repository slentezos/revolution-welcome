export const personalityDatabase: Record<string, PersonalityProfileData> = {
  // 1. LE STRATÈGE (INTP)
  strategiste: {
    id: "strategiste",
    title: "Le Stratège indépendant et analytique",
    imageSlug: "strategiste",
    metrics: [
      { label: "Se ressource dans le calme", value: 75 },
      { label: "Préfère l'abstrait", value: 60 },
      { label: "Décide avec la tête", value: 85 },
      { label: "Aime la flexibilité", value: 55 },
    ],
    intro:
      "Vous cherchez à comprendre en profondeur à travers la logique et l'analyse. Votre curiosité intellectuelle alimente votre créativité. On vous qualifie volontiers d’esprit original. Vous avez tendance à approfondir les idées, parfois jusqu’à repousser le moment de les concrétiser.",
    strengths: [
      "Créatif(ve) et curieux(se)",
      "Décisions réfléchies",
      "Indépendant(e)",
      "Compréhension profonde",
      "Exigence personnelle",
    ],
    weaknesses: [
      "Analyse excessive",
      "Manque d'implication de l'autre",
      "Retard de décision",
      "Expression limitée",
      "Froideur apparente",
    ],
    loveVision:
      "Pour vous, l’amour se comprend avant de se vivre. Les élans trop rapides vous mettent mal à l’aise. Vous avez besoin de temps et d’espace. Votre prudence peut vous faire paraître distant(e). Votre attachement est discret, mais sincère et durable.",
    balanceStress:
      "Vous vous ressourcez dans la solitude et avez besoin de calme pour réfléchir. Vous refusez les cadres trop rigides. Face au stress, vous cherchez des explications et des solutions rationnelles.",
    rapportToOthers:
      "Vous êtes pragmatique, factuel(le). Les objectifs et les résultats sont primordiaux. Votre capacité d’analyse aide les autres à clarifier leurs idées et à dépassionner les débats.",
    attractions: {
      comfortTitle: "Vous êtes à l'aise avec",
      comfort: [
        "Personnes autonomes et vivantes",
        "Respect du rythme",
        "Stimulation intellectuelle",
        "Échanges sans jugement",
        "Spontanéité",
      ],
      drainTitle: "Vous vous épuisez avec",
      drain: [
        "Émotivité envahissante",
        "Imprévisibilité",
        "Rigidité et dirigisme",
        "Échanges superficiels",
        "Incohérence",
      ],
    },
    signature: "Vous avez besoin de calme pour aller à la rencontre de l’autre… et de clarté pour vous engager.",
  },

  // 2. LE VISIONNAIRE (INFJ)
  visionnaire: {
    id: "visionnaire",
    title: "Le Visionnaire inspiré et profond",
    imageSlug: "visionnaire",
    metrics: [
      { label: "Se ressource dans le calme", value: 80 },
      { label: "Préfère l'abstrait", value: 70 },
      { label: "Décide avec le cœur", value: 75 },
      { label: "Aime l'organisation", value: 85 },
    ],
    intro:
      "Vous faites partie des idéalistes profonds. Vous cherchez à comprendre les dynamiques humaines. Au-delà des apparences, vous percevez rapidement le sens profond des situations. Vous êtes guidé(e) par une vision intérieure de ce qui peut être harmonisé.",
    strengths: [
      "Perception des intentions",
      "Engagement sincère",
      "Loyauté",
      "Stabilité relationnelle",
      "Projection durable",
    ],
    weaknesses: [
      "Ressenti non exprimé",
      "Idéalisation excessive",
      "Oubli de soi",
      "Repli en cas de déception",
      "Explosion émotionnelle",
    ],
    loveVision:
      "Vous ne cherchez pas une relation par défaut, mais une relation profonde et sincère. Vous ressentez intensément, mais vous exprimez vos émotions avec pudeur. Vous avez besoin d’authenticité absolue.",
    balanceStress:
      "Vous avez besoin d’un minimum de structure. Les environnements désordonnés vous fatiguent. Face au stress, vous préférez vous replier sur vous-même pour préserver votre intensité intérieure.",
    rapportToOthers:
      "Vous êtes bienveillant(e) et attentif(ve). Vous apportez de l’écoute et une capacité à percevoir ce qui n'est pas exprimé. Vos relations sont peu nombreuses mais intenses.",
    attractions: {
      comfortTitle: "Vous êtes à l'aise avec",
      comfort: [
        "Personnes alignées",
        "Engagement sincère",
        "Profondeur et authenticité",
        "Équilibre émotionnel",
        "Respect de l'empathie",
      ],
      drainTitle: "Vous vous épuisez avec",
      drain: ["Relations superficielles", "Incohérence", "Ambiguïté", "Manque d'implication", "Absence d'évolution"],
    },
    signature: "Vous avez besoin de sens pour vous engager… et de cohérence pour rester.",
  },

  // 3. LE MÉDIATEUR (INFP)
  mediateur: {
    id: "mediateur",
    title: "Le Médiateur attentif et apaisant",
    imageSlug: "mediateur",
    metrics: [
      { label: "Se ressource dans le calme", value: 90 },
      { label: "Préfère l'abstrait", value: 65 },
      { label: "Décide avec le cœur", value: 85 },
      { label: "Aime la flexibilité", value: 75 },
    ],
    intro:
      "Vous évoluez dans le registre du ressenti et des valeurs. Très sensible et profondément empathique, vous percevez le monde à travers ce qui vous touche ou vous semble juste. Votre quête de sens est votre moteur.",
    strengths: ["Finesse perceptive", "Bienveillance et générosité", "Créativité", "Adaptabilité", "Idéalisme"],
    weaknesses: [
      "Évitement des conflits",
      "Idéalisation forte",
      "Difficulté d'action",
      "Bridage des émotions",
      "Désillusions amères",
    ],
    loveVision:
      "Vous cherchez une relation sincère où chacun peut être soi. Vous êtes attiré(e) par des partenaires capables d'apprécier votre sensibilité sans la juger. Une fois engagé(e), vous multipliez les attentions délicates.",
    balanceStress:
      "Vous vous ressourcez dans la solitude et un univers intérieur riche. Vous avez besoin de liberté. Face au stress, vous absorbez les émotions des autres, ce qui peut vous épuiser intérieurement.",
    rapportToOthers:
      "Vous êtes profondément bienveillant(e). Vous évitez les conflits. Vous n’essayez pas de convaincre, mais d'être authentiquement présent(e). Si vous vous sentez brusqué(e), vous vous refermez.",
    attractions: {
      comfortTitle: "Vous êtes à l'aise avec",
      comfort: [
        "Bienveillance et chaleur",
        "Profondeur émotionnelle",
        "Ouverture d'esprit",
        "Respect du monde intérieur",
        "Authenticité",
      ],
      drainTitle: "Vous vous épuisez avec",
      drain: [
        "Personnes froides ou rationnelles",
        "Relations conflictuelles",
        "Rigidité et intrusion",
        "Rejet du ressenti",
        "Ironie",
      ],
    },
    signature: "Vous avez besoin de douceur pour vous ouvrir… et de confiance pour rester.",
  },

  // 4. LE PROTECTEUR (ISFJ)
  protecteur: {
    id: "protecteur",
    title: "Le Protecteur solide et attentionné",
    imageSlug: "protecteur",
    metrics: [
      { label: "Se ressource dans le calme", value: 70 },
      { label: "Préfère le concret", value: 80 },
      { label: "Décide avec le cœur", value: 60 },
      { label: "Aime l'organisation", value: 90 },
    ],
    intro:
      "Vous êtes dans le concret. Vous vous appuyez sur l'expérience et ce qui a fait ses preuves. Prudent(e) et dévoué(e), vous portez une attention particulière aux détails et au confort de votre entourage.",
    strengths: ["Fiabilité et loyauté", "Attention aux autres", "Source d'harmonie", "Solidité", "Diplomatie"],
    weaknesses: [
      "Difficulté à dire non",
      "Évitement du conflit",
      "Peur de l'imprévu",
      "Frustration accumulée",
      "Besoin de reconnaissance",
    ],
    loveVision:
      "L’amour se construit dans la durée. Vous cherchez la stabilité et la sécurité. Vous avez besoin d’une relation claire et sincère. Vous donnez beaucoup et avez besoin de réciprocité émotionnelle.",
    balanceStress:
      "Vous vous ressourcez dans des environnements calmes et familiers. Les changements brusques vous fatiguent. Face au stress, vous essayez de maintenir l'équilibre, parfois au détriment de vos propres limites.",
    rapportToOthers:
      "Vous observez et vous vous adaptez pour être utile. Fiable et rassurant(e), vous ne vous précipitez pas dans la relation. Vous avez besoin de temps pour installer une confiance durable.",
    attractions: {
      comfortTitle: "Vous êtes à l'aise avec",
      comfort: [
        "Fidélité aux engagements",
        "Gestes du quotidien",
        "Clarté des intentions",
        "Stabilité émotionnelle",
        "Régularité",
      ],
      drainTitle: "Vous vous épuisez avec",
      drain: [
        "Incohérence",
        "Désintérêt pour le quotidien",
        "Égoïsme ou manque de tact",
        "Ingratitude",
        "Désengagement",
      ],
    },
    signature: "Vous avez besoin de sécurité pour vous ouvrir… et de reconnaissance pour rester.",
  },

  // 5. LE PILIER (ISTJ)
  pilier: {
    id: "pilier",
    title: "Le Pilier fiable et constant",
    imageSlug: "pilier",
    metrics: [
      { label: "Se ressource dans le calme", value: 75 },
      { label: "Préfère le concret", value: 85 },
      { label: "Décide avec la tête", value: 90 },
      { label: "Aime l'organisation", value: 95 },
    ],
    intro:
      "Vous évoluez dans le registre du concret et du rationnel. Vous prisez l'expérience, la structure et l'ordre. L'honnêteté et l'intégrité sont au cœur de votre fonctionnement rigoureux et réfléchi.",
    strengths: [
      "Fiabilité et sécurité",
      "Respect des engagements",
      "Structure et organisation",
      "Décisions réfléchies",
      "Construction durable",
    ],
    weaknesses: [
      "Expression limitée des émotions",
      "Mal à l'aise avec l'incertitude",
      "Exigence envers autrui",
      "Difficulté à lâcher prise",
      "Tendance au surmenage",
    ],
    loveVision:
      "Vous recherchez la confiance avant l’intensité. Vous avez besoin d’une relation sans ambiguïté. Votre engagement est total et s'exprime par des petits actes attentionnés au quotidien.",
    balanceStress:
      "Vous vous ressourcez dans le calme et l'ordre. La désorganisation vous fatigue. Face au stress, vous cherchez à reprendre le contrôle par l'analyse des faits et l'organisation.",
    rapportToOthers:
      "Réservé(e), vous privilégiez l'action aux discours. Vous tenez votre parole et attendez la même chose des autres. Votre stabilité est un repère précieux pour votre entourage.",
    attractions: {
      comfortTitle: "Vous êtes à l'aise avec",
      comfort: [
        "Honnêteté et maturité",
        "Responsabilité",
        "Respect du cadre",
        "Clarté des intentions",
        "Maîtrise des émotions",
      ],
      drainTitle: "Vous vous épuisez avec",
      drain: ["Manque de fiabilité", "Imprévisibilité", "Illogisme", "Désordre et instabilité", "Agressivité"],
    },
    signature: "Vous avez besoin de stabilité pour vous engager… et de cohérence pour rester.",
  }, // 6. LE CHARMEUR (ESFP)
  charmeur: {
    id: "charmeur",
    title: "Le Charmeur élégant et charismatique",
    imageSlug: "charmeur",
    metrics: [
      { label: "Se ressource dans l'action", value: 85 },
      { label: "Préfère le concret", value: 80 },
      { label: "Décide avec le cœur", value: 70 },
      { label: "Aime la flexibilité", value: 90 },
    ],
    intro:
      "Vous vivez dans l’instant présent et cherchez à profiter de chaque moment. Vous êtes guidé(e) par vos émotions et votre intuition. On recherche votre présence pour votre enthousiasme et votre joie de vivre.",
    strengths: [
      "Chaleureux(se) et accessible",
      "Joie et légèreté",
      "Spontanéité",
      "Vivre l'instant présent",
      "Mise à l'aise d'autrui",
    ],
    weaknesses: [
      "Fuite des contraintes",
      "Paraît superficiel(le)",
      "Difficulté de projection durable",
      "Imprévisibilité",
      "Impulsivité",
    ],
    loveVision:
      "Pour vous, l’amour doit être simple, naturel et vivant. Vous recherchez une relation fluide pour partager des moments concrets et agréables, sans pression ni formalisme excessif.",
    balanceStress:
      "Vous préférez adapter, improviser et suivre votre rythme. Face au stress, vous cherchez à l'évacuer rapidement. Vous préférez changer de sujet ou bouger plutôt que de vous enfoncer dans l'analyse.",
    rapportToOthers:
      "Vous vous ressourcez au contact des autres. Vous allez vers autrui avec facilité. Vous apportez volontiers soutien et réconfort, car pour vous, l’ambiance se doit d’être positive.",
    attractions: {
      comfortTitle: "Vous êtes à l'aise avec",
      comfort: [
        "Personnes positives et naturelles",
        "Structurantes mais non rigides",
        "Complémentarité",
        "Profondeur",
        "Respect de la spontanéité",
      ],
      drainTitle: "Vous vous épuisez avec",
      drain: [
        "Personnes négatives ou contrôlantes",
        "Dépendance affective",
        "Analyse permanente",
        "Planification à l'excès",
        "Fermeture d'esprit",
      ],
    },
    signature: "Vous avez besoin de légèreté pour entrer en relation… et de complicité pour vous engager.",
  },

  // 7. LE SOUTIEN (ESFJ)
  soutien: {
    id: "soutien",
    title: "Le Soutien chaleureux et engagé",
    imageSlug: "soutien",
    metrics: [
      { label: "Se ressource dans l'échange", value: 90 },
      { label: "Préfère le concret", value: 75 },
      { label: "Décide avec le cœur", value: 80 },
      { label: "Aime l'organisation", value: 85 },
    ],
    intro:
      "Vous évoluez dans le concret et la réalité. Sensible aux traditions et aux bonnes manières, vous aimez que les choses soient claires et sécurisantes. Vous êtes guidé(e) par vos valeurs et le sens du devoir.",
    strengths: [
      "Sens du service",
      "Organisation et fiabilité",
      "Chaleur humaine",
      "Respect des engagements",
      "Harmonisation du groupe",
    ],
    weaknesses: [
      "Besoin excessif d'approbation",
      "Difficulté face à la critique",
      "Rigidité sur les principes",
      "Oubli de ses propres besoins",
      "Crainte du changement",
    ],
    loveVision:
      "L’amour est pour vous un engagement sérieux. Vous êtes dévoué(e) et attentif(ve) aux besoins de l'autre. Vous construisez un foyer stable et chaleureux, basé sur la loyauté et le respect mutuel.",
    balanceStress:
      "Vous vous épanouissez dans la structure. Face au stress, vous avez tendance à en faire trop pour restaurer l'harmonie. Vous avez besoin de reconnaissance pour l'énergie que vous donnez.",
    rapportToOthers:
      "Vous êtes tourné(e) vers les autres. Très sociable, vous savez créer des liens solides. Vous attendez en retour de la politesse, de la gratitude et un partage des valeurs communes.",
    attractions: {
      comfortTitle: "Vous êtes à l'aise avec",
      comfort: [
        "Personnes reconnaissantes",
        "Partage des valeurs",
        "Stabilité et politesse",
        "Engagement clair",
        "Sécurité affective",
      ],
      drainTitle: "Vous vous épuisez avec",
      drain: [
        "Manque de gratitude",
        "Conflits ouverts",
        "Désorganisation",
        "Indifférence",
        "Non-respect des traditions",
      ],
    },
    signature: "Vous avez besoin de partage pour vous épanouir… et de loyauté pour rester.",
  },

  // 8. L'IDÉALISTE (ENFP)
  idealiste: {
    id: "idealiste",
    title: "L'Idéaliste enthousiaste et créatif",
    imageSlug: "idealiste",
    metrics: [
      { label: "Se ressource dans l'échange", value: 85 },
      { label: "Préfère l'abstrait", value: 80 },
      { label: "Décide avec le cœur", value: 75 },
      { label: "Aime la flexibilité", value: 90 },
    ],
    intro:
      "Vous voyez la vie comme une multitude de possibilités. Curieux(se) et imaginatif(ve), vous êtes attiré(e) par la nouveauté. Votre enthousiasme est communicatif et vous avez un don pour inspirer les autres.",
    strengths: ["Créativité sans limite", "Optimisme contagieux", "Adaptabilité", "Écoute empathique", "Visionnaire"],
    weaknesses: [
      "Éparpillement",
      "Difficulté avec la routine",
      "Hypersensibilité à la critique",
      "Inconstance",
      "Besoin de stimulation permanente",
    ],
    loveVision:
      "L'amour est une aventure passionnante. Vous cherchez une connexion d'âme à âme, pleine de découvertes. Vous avez besoin que votre partenaire partage vos rêves et respecte votre besoin de liberté.",
    balanceStress:
      "Vous détestez les cadres trop rigides. Sous stress, vous pouvez devenir anxieux(se) et perdre votre focus. Vous avez besoin de sens et de passion dans tout ce que vous entreprenez.",
    rapportToOthers:
      "Très sociable et ouvert(e), vous percevez le potentiel de chacun. Vous détestez le jugement et privilégiez l'authenticité. Vous savez mettre de la magie dans les relations du quotidien.",
    attractions: {
      comfortTitle: "Vous êtes à l'aise avec",
      comfort: ["Esprits ouverts", "Créativité partagée", "Authenticité", "Liberté de mouvement", "Projets stimulants"],
      drainTitle: "Vous vous épuisez avec",
      drain: ["Personnes rigides", "Routine administrative", "Pessimisme", "Contrôle excessif", "Manque d'imagination"],
    },
    signature: "Vous avez besoin de magie pour vibrer… et d'authenticité pour vous engager.",
  },

  // 9. L'INSPIRATEUR (ENFJ)
  inspirateur: {
    id: "inspirateur",
    title: "L'Inspirateur passionné et fédérateur",
    imageSlug: "inspirateur",
    metrics: [
      { label: "Se ressource dans l'échange", value: 95 },
      { label: "Préfère l'abstrait", value: 75 },
      { label: "Décide avec le cœur", value: 85 },
      { label: "Aime l'organisation", value: 80 },
    ],
    intro:
      "Vous possédez un charisme naturel mis au service des autres. Empathique et structuré(e), vous savez fédérer les énergies vers un but commun. Vous avez une vision claire de ce que les relations devraient être.",
    strengths: [
      "Leadership empathique",
      "Excellente communication",
      "Fiabilité",
      "Sens de l'harmonie",
      "Inspiration d'autrui",
    ],
    weaknesses: [
      "Tendance au contrôle",
      "Trop d'idéalisation",
      "Difficulté à déléguer l'émotionnel",
      "Culpabilité",
      "Besoin de reconnaissance",
    ],
    loveVision:
      "Pour vous, l'amour est un projet de vie à construire ensemble. Vous êtes très investi(e) et attendez une implication totale. Vous cherchez un partenaire qui partage votre vision du monde.",
    balanceStress:
      "Vous avez besoin que tout soit en ordre autour de vous. Face au stress, vous redoublez d'efforts pour aider les autres, quitte à vous oublier vous-même.",
    rapportToOthers:
      "Vous êtes un pilier pour votre entourage. Vous savez écouter et guider avec douceur mais fermeté. Vous attendez des relations basées sur la croissance mutuelle et la sincérité.",
    attractions: {
      comfortTitle: "Vous êtes à l'aise avec",
      comfort: ["Engagement sincère", "Partage d'idéaux", "Clarté émotionnelle", "Maturité", "Coopération"],
      drainTitle: "Vous vous épuisez avec",
      drain: ["Égoïsme", "Cynisme", "Inconstance", "Absence de vision", "Manque de gratitude"],
    },
    signature: "Vous avez besoin d'harmonie pour rayonner… et de projet commun pour rester.",
  },

  // 10. L'AVENTURIER (ESTP)
  aventurier: {
    id: "aventurier",
    title: "L'Aventurier spontané et pragmatique",
    imageSlug: "aventurier",
    metrics: [
      { label: "Se ressource dans l'action", value: 90 },
      { label: "Préfère le concret", value: 95 },
      { label: "Décide avec la tête", value: 70 },
      { label: "Aime la flexibilité", value: 85 },
    ],
    intro:
      "Vous vivez dans l’instant présent avec une intensité rare. Pragmatique et réactif(ve), vous préférez l'action aux longs discours. Vous avez un sens aigu de l'observation et savez saisir les opportunités.",
    strengths: ["Énergie débordante", "Sens pratique", "Charisme naturel", "Adaptabilité", "Prise de décision rapide"],
    weaknesses: [
      "Impatience",
      "Manque de tact",
      "Risques inconsidérés",
      "Difficulté avec les concepts abstraits",
      "Instabilité",
    ],
    loveVision:
      "L'amour se vit plus qu'il ne se discute. Vous cherchez un(e) partenaire de jeu, prêt(e) à partager des expériences fortes et concrètes. Vous fuyez les complications émotionnelles inutiles.",
    balanceStress:
      "La routine vous étouffe. Face au stress, vous bougez : sport, voyage ou nouveau projet. Vous avez besoin de résultats immédiats pour rester motivé(e).",
    rapportToOthers:
      "Direct(e) et franc(he), on apprécie votre honnêteté. Vous êtes très à l'aise socialement et savez détendre l'atmosphère. Vous attendez des autres qu'ils soient aussi réactifs que vous.",
    attractions: {
      comfortTitle: "Vous êtes à l'aise avec",
      comfort: ["Spontanéité", "Action", "Humour et franchise", "Indépendance", "Goût du risque"],
      drainTitle: "Vous vous épuisez avec",
      drain: ["Cérébralité excessive", "Lenteur", "Plaintes constantes", "Cadres trop rigides", "Manque de réalisme"],
    },
    signature: "Vous avez besoin d'action pour vous sentir vivant… et de liberté pour vous engager.",
  }, // 11. L'ORGANISATEUR (ESTJ)
  organisateur: {
    id: "organisateur",
    title: "L'Organisateur pragmatique et structuré",
    imageSlug: "organisateur",
    metrics: [
      { label: "Se ressource dans l'action", value: 85 },
      { label: "Préfère le concret", value: 90 },
      { label: "Décide avec la tête", value: 85 },
      { label: "Aime l'organisation", value: 95 },
    ],
    intro:
      "Vous êtes un(e) bâtisseur(se) dans l'âme. Vous aimez l'ordre, les règles claires et l'efficacité. Vous prenez des décisions rapidement en vous basant sur des faits concrets et une logique implacable.",
    strengths: ["Sens des responsabilités", "Pragmatisme", "Capacité à diriger", "Honnêteté", "Efficacité redoutable"],
    weaknesses: [
      "Intransigeance",
      "Difficulté à exprimer l'émotion",
      "Patience limitée",
      "Besoin de contrôle",
      "Peut paraître autoritaire",
    ],
    loveVision:
      "Vous concevez l'amour comme un partenariat solide et loyal. Vous n'aimez pas les ambiguïtés. Vous montrez votre attachement en protégeant votre partenaire et en organisant un quotidien sécurisant.",
    balanceStress:
      "Le désordre et l'incompétence vous épuisent. Face au stress, vous avez tendance à redoubler d'autorité pour reprendre le contrôle de la situation. Vous avez besoin de résultats tangibles.",
    rapportToOthers:
      "Franc(he) et direct(e), vous dites ce que vous pensez. Vous attendez des autres qu'ils soient fiables et tiennent leurs engagements. Vous êtes un pilier sur lequel on peut compter.",
    attractions: {
      comfortTitle: "Vous êtes à l'aise avec",
      comfort: ["Personnes fiables", "Respect des règles", "Discussions franches", "Objectifs clairs", "Stabilité"],
      drainTitle: "Vous vous épuisez avec",
      drain: ["Manque de ponctualité", "Émotivité excessive", "Désorganisation", "Indécision", "Incohérence logique"],
    },
    signature: "Vous avez besoin de structure pour avancer… et de loyauté absolue pour rester.",
  },

  // 12. LE LEADER (ENTJ)
  leader: {
    id: "leader",
    title: "Le Leader visionnaire et déterminé",
    imageSlug: "leader",
    metrics: [
      { label: "Se ressource dans l'action", value: 85 },
      { label: "Préfère l'abstrait", value: 75 },
      { label: "Décide avec la tête", value: 90 },
      { label: "Aime l'organisation", value: 90 },
    ],
    intro:
      "Vous êtes naturellement porté(e) vers le leadership. Stratège dans l'âme, vous aimez relever des défis et transformer vos visions en réalité. Votre esprit critique et votre détermination sont vos plus grands atouts.",
    strengths: ["Vision stratégique", "Charisme intellectuel", "Détermination", "Efficacité", "Confiance en soi"],
    weaknesses: [
      "Dominant(e)",
      "Peu tolérant(e) à l'erreur",
      "Peut paraître froid(e)",
      "Néglige les sentiments",
      "Impatience",
    ],
    loveVision:
      "L'amour est un objectif d'excellence comme un autre. Vous cherchez un partenaire intellectuellement stimulant, capable de vous tenir tête et de partager vos ambitions sur le long terme.",
    balanceStress:
      "L'inefficacité vous stresse profondément. Sous pression, vous pouvez devenir cassant(e) et vous isoler dans le travail. Vous avez besoin de défis intellectuels constants.",
    rapportToOthers:
      "Exigeant(e) avec vous-même, vous l'êtes aussi avec les autres. Vous aimez les débats d'idées et respectez ceux qui savent argumenter. Les banalités vous ennuient rapidement.",
    attractions: {
      comfortTitle: "Vous êtes à l'aise avec",
      comfort: [
        "Stimulation intellectuelle",
        "Compétence",
        "Débats d'idées",
        "Ambition partagée",
        "Esprit de décision",
      ],
      drainTitle: "Vous vous épuisez avec",
      drain: ["Incompétence", "Sensiblerie", "Manque de vision", "Paresse", "Irrationalité"],
    },
    signature: "Vous avez besoin de stimulation pour vous intéresser… et d'admiration mutuelle pour vous engager.",
  },

  // 13. L'INVENTEUR (ENTP)
  inventeur: {
    id: "inventeur",
    title: "L'Inventeur astucieux et non-conformiste",
    imageSlug: "inventeur",
    metrics: [
      { label: "Se ressource dans l'échange", value: 85 },
      { label: "Préfère l'abstrait", value: 85 },
      { label: "Décide avec la tête", value: 80 },
      { label: "Aime la flexibilité", value: 90 },
    ],
    intro:
      "Vous êtes un(e) explorateur(rice) d'idées. Vous aimez comprendre comment les choses fonctionnent pour mieux les réinventer. La routine est votre ennemie. Vous brillez par votre répartie et votre agilité mentale.",
    strengths: [
      "Esprit vif et créatif",
      "Excellente répartie",
      "Capacité d'innovation",
      "Indépendance",
      "Curiosité insatiable",
    ],
    weaknesses: [
      "Tendance à la provocation",
      "Manque de constance",
      "S'ennuie vite",
      "Difficulté à terminer",
      "Insensibilité apparente",
    ],
    loveVision:
      "Pour vous, l'amour doit être une source de croissance et d'apprentissage continu. Vous cherchez un partenaire qui saura vous surprendre et vous suivre dans vos cheminements intellectuels.",
    balanceStress:
      "Les tâches répétitives vous épuisent. Face au stress, vous cherchez des échappatoires dans de nouvelles idées. Vous avez besoin d'une grande liberté d'action.",
    rapportToOthers:
      "Vous aimez challenger les autres. Le débat est pour vous une forme de connexion. Vous n'êtes pas toujours à l'aise avec le soutien émotionnel pur, préférant offrir des solutions ingénieuses.",
    attractions: {
      comfortTitle: "Vous êtes à l'aise avec",
      comfort: ["Esprits agiles", "Débats stimulants", "Nouveauté", "Flexibilité", "Humour intellectuel"],
      drainTitle: "Vous vous épuisez avec",
      drain: ["Conformisme", "Règles strictes", "Routine", "Esprits fermés", "Conversations superficielles"],
    },
    signature: "Vous avez besoin d'être surpris(e) pour vous intéresser… et de liberté pour rester.",
  },

  // 14. L'ARTISTE (ISFP)
  artiste: {
    id: "artiste",
    title: "L'Artiste sensible et spontané",
    imageSlug: "artiste",
    metrics: [
      { label: "Se ressource dans le calme", value: 80 },
      { label: "Préfère le concret", value: 80 },
      { label: "Décide avec le cœur", value: 85 },
      { label: "Aime la flexibilité", value: 85 },
    ],
    intro:
      "Vous êtes un esprit libre, en quête de beauté et d'harmonie. Discret(e) mais profondément chaleureux(se), vous vivez dans l'instant et exprimez votre créativité à travers des actions esthétiques et concrètes.",
    strengths: [
      "Esthétisme et créativité",
      "Sensibilité authentique",
      "Ouverture d'esprit",
      "Observation fine",
      "Adaptabilité",
    ],
    weaknesses: [
      "Difficulté d'anticipation",
      "Sensibilité à la critique",
      "Fuit les conflits",
      "Indécision",
      "Besoin de trop d'espace",
    ],
    loveVision:
      "L'amour se vit dans le partage d'instants présents et de plaisirs simples. Vous n'aimez pas les déclarations grandiloquentes, préférant prouver votre affection par des gestes tendres et silencieux.",
    balanceStress:
      "Vous vous ressourcez dans la nature ou l'art. Face aux contraintes strictes, vous préférez fuir physiquement ou mentalement. Vous avez besoin de vivre à votre propre rythme.",
    rapportToOthers:
      "Plutôt réservé(e), vous mettez du temps à accorder votre confiance. Vous fuyez ceux qui cherchent à vous contrôler ou à vous imposer un cadre. Vous êtes un(e) partenaire doux(ce) et tolérant(e).",
    attractions: {
      comfortTitle: "Vous êtes à l'aise avec",
      comfort: ["Tolérance", "Beauté et harmonie", "Indépendance", "Douceur", "Plaisirs simples"],
      drainTitle: "Vous vous épuisez avec",
      drain: ["Jugement", "Agressivité", "Cérébralité excessive", "Cadres rigides", "Pressions temporelles"],
    },
    signature: "Vous avez besoin de douceur pour vous révéler… et de respect de votre rythme pour vous engager.",
  },

  // 15. L'ARTISAN (ISTP)
  artisan: {
    id: "artisan",
    title: "L'Artisan pragmatique et indépendant",
    imageSlug: "artisan",
    metrics: [
      { label: "Se ressource dans le calme", value: 85 },
      { label: "Préfère le concret", value: 90 },
      { label: "Décide avec la tête", value: 85 },
      { label: "Aime la flexibilité", value: 85 },
    ],
    intro:
      "Vous êtes un(e) observateur(rice) silencieux(se) du monde qui vous entoure. Pragmatique et réactif(ve), vous analysez les situations de façon logique pour intervenir avec une précision redoutable au moment opportun.",
    strengths: ["Calme sous pression", "Efficacité pratique", "Indépendance", "Curiosité technique", "Réactivité"],
    weaknesses: [
      "Fermeture émotionnelle",
      "Imprévisibilité",
      "Peut paraître distant(e)",
      "Aversion pour l'engagement à long terme",
      "Franc-parler brutal",
    ],
    loveVision:
      "Vous cherchez une relation simple, basée sur le partage d'activités concrètes et le respect mutuel de l'espace de chacun. Les drames émotionnels vous font rapidement fuir.",
    balanceStress:
      "Le calme absolu est votre sanctuaire. Vous évacuez le stress par l'activité physique ou manuelle. Vous avez besoin que vos actions produisent des résultats tangibles et immédiats.",
    rapportToOthers:
      "Économe en mots, vous préférez l'action. Vous ne cherchez pas à diriger les autres, ni à être dirigé(e). Vous appréciez les relations équilibrées où chacun garde sa pleine autonomie.",
    attractions: {
      comfortTitle: "Vous êtes à l'aise avec",
      comfort: ["Indépendance", "Esprit pratique", "Silence partagé", "Activités concrètes", "Flexibilité"],
      drainTitle: "Vous vous épuisez avec",
      drain: [
        "Dépendance affective",
        "Règles inutiles",
        "Sur-analyse",
        "Conversations interminables",
        "Emprises émotionnelles",
      ],
    },
    signature: "Vous avez besoin d'autonomie pour respirer… et d'une complicité silencieuse pour rester.",
  },

  // 16. L'ARCHITECTE (INTJ)
  architecte: {
    id: "architecte",
    title: "L'Architecte visionnaire et exigeant",
    imageSlug: "architecte",
    metrics: [
      { label: "Se ressource dans le calme", value: 85 },
      { label: "Préfère l'abstrait", value: 85 },
      { label: "Décide avec la tête", value: 90 },
      { label: "Aime l'organisation", value: 90 },
    ],
    intro:
      "Vous êtes un(e) stratège indépendant(e), guidé(e) par une vision claire et une logique implacable. Vous cherchez constamment à optimiser, comprendre et perfectionner les systèmes et les idées qui vous entourent.",
    strengths: [
      "Vision stratégique claire",
      "Logique de fer",
      "Indépendance d'esprit",
      "Exigence intellectuelle",
      "Détermination",
    ],
    weaknesses: [
      "Perfectionnisme paralysant",
      "Intolérance à l'incompétence",
      "Froideur émotionnelle",
      "Arrogance intellectuelle",
      "Difficulté à s'adapter",
    ],
    loveVision:
      "Pour vous, choisir un(e) partenaire est une décision rationnelle autant qu'un élan du cœur. Vous cherchez une alliance intellectuelle forte, capable de soutenir vos ambitions et de résister à votre analyse critique.",
    balanceStress:
      "Vous vous réfugiez dans vos pensées pour structurer vos plans. Face au stress, vous pouvez devenir excessivement critique et vous isoler pour résoudre le problème seul(e).",
    rapportToOthers:
      "Vos relations sont très sélectives. Vous privilégiez la qualité à la quantité. Vous n'avez que faire des conventions sociales si elles manquent de logique. Vous attendez de vos proches une grande honnêteté intellectuelle.",
    attractions: {
      comfortTitle: "Vous êtes à l'aise avec",
      comfort: ["Stimulation intellectuelle", "Profondeur d'analyse", "Rigueur", "Objectifs clairs", "Autonomie"],
      drainTitle: "Vous vous épuisez avec",
      drain: ["Superficialité", "Irrationalité", "Emportements émotionnels", "Incompétence", "Micro-management"],
    },
    signature: "Vous avez besoin de respect intellectuel pour vous intéresser… et de profondeur pour vous engager.",
  },
};
