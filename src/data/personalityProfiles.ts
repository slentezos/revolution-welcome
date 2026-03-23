export interface PersonalityProfile {
  number: number;
  title: string;
  emoji: string;
  character: string;
  temperament: string[];
  strengths: string[];
  weaknesses: string[];
  loveVision: string;
  strengthsAndFragilities: string;
  attractions: string[];
  dailyLife: string[];
  affinities: string[];
}

export const mbtiProfiles: Record<string, PersonalityProfile> = {
  ESTJ: {
    number: 1,
    title: "Le Directeur organisé et fiable",
    emoji: "👔",
    character: "Organisé, fiable, déterminé",
    temperament: [
      "Vous êtes pragmatique et aimez structurer votre environnement. Naturellement leader, vous inspirez confiance par votre droiture.",
      "Vous avez besoin de repères clairs et d'un cadre stable pour vous épanouir. Votre sens de l'organisation est un atout précieux.",
      "Dans votre parcours, vous avez toujours été celui ou celle sur qui on pouvait compter. Votre fiabilité est votre signature.",
      "Vous aimez que les choses soient bien faites. Votre exigence, loin d'être un défaut, témoigne de votre profond respect pour les autres."
    ],
    strengths: ["Sens de l'organisation", "Fiabilité exemplaire", "Leadership naturel", "Droiture morale", "Capacité de décision", "Stabilité émotionnelle"],
    weaknesses: ["Rigidité dans les habitudes", "Difficulté à lâcher prise", "Tendance au contrôle", "Peu de place à l'improvisation", "Exigence parfois excessive", "Expression des émotions limitée"],
    loveVision: "Pour vous, l'amour se construit dans la durée et la fidélité. Vous recherchez un·e partenaire qui partage vos valeurs d'engagement et de stabilité. Vous êtes un pilier solide sur lequel on peut s'appuyer.",
    strengthsAndFragilities: "Votre force réside dans votre capacité à construire et à maintenir un cadre de vie rassurant. Votre fragilité est de parfois oublier que l'amour a aussi besoin de spontanéité et de légèreté.",
    attractions: [
      "Vous êtes attiré·e par des personnes authentiques et fiables, qui partagent votre vision d'une relation durable.",
      "Les personnalités trop instables ou imprévisibles peuvent vous déstabiliser.",
      "Vous appréciez les personnes qui ont des projets concrets et une vision claire de leur vie."
    ],
    dailyLife: [
      "Vous avez besoin de routine et de structure pour vous sentir bien.",
      "Face au stress, vous avez tendance à vous réfugier dans l'action et l'organisation."
    ],
    affinities: [
      "Vous vous sentez à l'aise avec des personnes stables, honnêtes et engagées.",
      "Vous vous sentez en difficulté avec les profils trop fantasques, changeants ou peu fiables."
    ]
  },
  ESTP: {
    number: 2,
    title: "L'Aventurier spontané et charismatique",
    emoji: "🏄",
    character: "Audacieux, spontané, charismatique",
    temperament: [
      "Vous vivez dans l'instant présent avec une intensité rare. Votre énergie contagieuse attire naturellement les autres vers vous.",
      "Vous aimez l'action, le mouvement, la nouveauté. La routine vous pèse et vous avez besoin de stimulation.",
      "Dans votre parcours, vous avez souvent été celui ou celle qui ose, qui propose, qui entraîne les autres dans l'aventure.",
      "Votre charisme naturel fait de vous une personne magnétique. Les gens aiment être en votre compagnie."
    ],
    strengths: ["Charisme naturel", "Spontanéité", "Adaptabilité", "Énergie communicative", "Sens pratique", "Courage"],
    weaknesses: ["Difficulté avec la routine", "Impatience", "Tendance à l'impulsivité", "Engagement parfois fluctuant", "Besoin constant de stimulation", "Superficialité possible"],
    loveVision: "Vous recherchez une relation dynamique et complice, pleine de surprises et de moments partagés. L'ennui est votre pire ennemi amoureux.",
    strengthsAndFragilities: "Votre force est votre capacité à rendre chaque moment excitant. Votre fragilité est de parfois fuir la profondeur émotionnelle au profit de la légèreté.",
    attractions: [
      "Vous êtes attiré·e par les personnes vives, drôles et spontanées.",
      "Les personnalités trop rigides ou contrôlantes vous étouffent.",
      "Vous avez besoin d'un·e partenaire qui sait aussi bien profiter de l'instant que construire des projets."
    ],
    dailyLife: [
      "Vous avez besoin de variété et de stimulation au quotidien.",
      "Face au stress, vous avez tendance à agir vite, parfois trop vite."
    ],
    affinities: [
      "Vous vous sentez à l'aise avec des personnes ouvertes, curieuses et dynamiques.",
      "Vous vous sentez en difficulté avec les profils trop sérieux, rigides ou moralisateurs."
    ]
  },
  ESFJ: {
    number: 3,
    title: "Le Protecteur chaleureux et attentionné",
    emoji: "🤗",
    character: "Chaleureux, attentionné, sociable",
    temperament: [
      "Vous êtes le ciment de votre entourage. Votre générosité et votre bienveillance créent des liens durables.",
      "Vous avez un don pour sentir ce dont les autres ont besoin. Votre empathie est naturelle et spontanée.",
      "Dans votre parcours, vous avez souvent été celui ou celle qui prend soin, qui maintient l'harmonie, qui rassemble.",
      "Votre chaleur humaine est votre plus beau trait. Les gens se sentent bien en votre présence."
    ],
    strengths: ["Empathie naturelle", "Sens du service", "Chaleur humaine", "Loyauté", "Capacité d'écoute", "Générosité"],
    weaknesses: ["Tendance à s'oublier", "Besoin d'approbation", "Difficulté à dire non", "Peur du conflit", "Sensibilité aux critiques", "Don excessif de soi"],
    loveVision: "En amour, vous donnez sans compter. Vous rêvez d'une relation harmonieuse où chacun prend soin de l'autre. La réciprocité est essentielle à votre bonheur.",
    strengthsAndFragilities: "Votre force est votre capacité à aimer et à prendre soin. Votre fragilité est de parfois trop donner au détriment de vos propres besoins.",
    attractions: [
      "Vous êtes attiré·e par des personnes reconnaissantes et attentionnées.",
      "Les personnalités égoïstes ou indifférentes vous blessent profondément.",
      "Vous avez besoin d'un·e partenaire qui sait aussi prendre soin de vous."
    ],
    dailyLife: [
      "Vous avez besoin de liens sociaux et de moments de partage pour vous sentir bien.",
      "Face au stress, vous avez tendance à vous suroccuper des autres pour éviter de penser à vos propres soucis."
    ],
    affinities: [
      "Vous vous sentez à l'aise avec des personnes chaleureuses, reconnaissantes et bienveillantes.",
      "Vous vous sentez en difficulté avec les profils distants, critiques ou ingrats."
    ]
  },
  ESFP: {
    number: 4,
    title: "L'Entertainer joyeux et expressif",
    emoji: "🎭",
    character: "Joyeux, expressif, généreux",
    temperament: [
      "Vous apportez de la lumière partout où vous passez. Votre joie de vivre est un don rare et précieux.",
      "Vous aimez la vie sous toutes ses formes : les plaisirs simples, les rencontres, les moments de partage.",
      "Dans votre parcours, vous avez toujours su créer une atmosphère chaleureuse et conviviale autour de vous.",
      "Votre expressivité est votre force. Vous savez communiquer vos émotions avec une authenticité désarmante."
    ],
    strengths: ["Joie de vivre", "Expressivité", "Générosité", "Sens de la fête", "Présence chaleureuse", "Authenticité"],
    weaknesses: ["Difficulté avec la solitude", "Tendance à éviter les sujets profonds", "Besoin constant de stimulation", "Gestion des émotions négatives", "Planification limitée", "Dispersement"],
    loveVision: "Vous cherchez un·e partenaire qui sait profiter de la vie et partager des moments de bonheur authentique. L'amour doit être joyeux et léger.",
    strengthsAndFragilities: "Votre force est votre capacité à illuminer le quotidien. Votre fragilité est de parfois fuir les moments difficiles ou les conversations profondes.",
    attractions: [
      "Vous êtes attiré·e par les personnes positives, enthousiastes et ouvertes.",
      "Les personnalités sombres ou pessimistes vous drainent.",
      "Vous avez besoin d'un·e partenaire qui partage votre goût pour les belles choses de la vie."
    ],
    dailyLife: [
      "Vous avez besoin de moments de plaisir et de convivialité chaque jour.",
      "Face au stress, vous avez tendance à vous distraire ou à chercher du réconfort social."
    ],
    affinities: [
      "Vous vous sentez à l'aise avec des personnes joyeuses, spontanées et généreuses.",
      "Vous vous sentez en difficulté avec les profils austères, critiques ou négatifs."
    ]
  },
  ENTJ: {
    number: 5,
    title: "Le Stratège visionnaire et ambitieux",
    emoji: "♟️",
    character: "Visionnaire, ambitieux, décisif",
    temperament: [
      "Vous avez une vision claire de l'avenir et la détermination pour y parvenir. Votre assurance inspire le respect.",
      "Vous aimez les défis et les projets ambitieux. La médiocrité n'a pas sa place dans votre vie.",
      "Dans votre parcours, vous avez toujours su identifier les opportunités et les saisir avec audace.",
      "Votre intelligence stratégique fait de vous un·e bâtisseur·se remarquable, capable de transformer vos visions en réalité."
    ],
    strengths: ["Vision stratégique", "Détermination", "Leadership", "Intelligence analytique", "Ambition", "Efficacité"],
    weaknesses: ["Impatience", "Tendance à dominer", "Difficulté à montrer sa vulnérabilité", "Perfectionnisme", "Intolérance à l'incompétence", "Manque de patience"],
    loveVision: "Vous recherchez un·e partenaire intellectuellement stimulant·e qui partage vos ambitions de vie. L'amour doit être un partenariat d'égaux.",
    strengthsAndFragilities: "Votre force est votre capacité à construire et à mener des projets ambitieux. Votre fragilité est de parfois oublier que l'amour demande aussi de la douceur et de la patience.",
    attractions: [
      "Vous êtes attiré·e par les personnes intelligentes, ambitieuses et indépendantes.",
      "Les personnalités passives ou sans ambition vous ennuient.",
      "Vous avez besoin d'un·e partenaire qui vous stimule et vous challenge intellectuellement."
    ],
    dailyLife: [
      "Vous avez besoin de projets et d'objectifs pour vous sentir épanoui·e.",
      "Face au stress, vous avez tendance à redoubler d'efforts et à planifier davantage."
    ],
    affinities: [
      "Vous vous sentez à l'aise avec des personnes compétentes, ambitieuses et directes.",
      "Vous vous sentez en difficulté avec les profils indécis, passifs ou sans vision."
    ]
  },
  ENTP: {
    number: 6,
    title: "L'Innovateur créatif et curieux",
    emoji: "💡",
    character: "Créatif, curieux, éloquent",
    temperament: [
      "Votre esprit vif et votre curiosité insatiable font de chaque conversation une aventure intellectuelle.",
      "Vous aimez explorer les idées, débattre, remettre en question. Votre créativité est sans limites.",
      "Dans votre parcours, vous avez souvent été celui ou celle qui propose des solutions originales et inattendues.",
      "Votre éloquence et votre charme intellectuel font de vous un·e interlocuteur·rice captivant·e."
    ],
    strengths: ["Créativité", "Curiosité intellectuelle", "Éloquence", "Adaptabilité mentale", "Sens de l'humour", "Vision innovante"],
    weaknesses: ["Difficulté à finaliser les projets", "Tendance à l'argumentation", "Ennui rapide", "Manque de constance", "Provocation parfois excessive", "Négligence des détails pratiques"],
    loveVision: "Vous êtes attiré·e par les esprits brillants. La complicité intellectuelle est votre langage amoureux. L'ennui est rédhibitoire.",
    strengthsAndFragilities: "Votre force est votre capacité à stimuler et à inspirer. Votre fragilité est de parfois privilégier le débat intellectuel au détriment de l'intimité émotionnelle.",
    attractions: [
      "Vous êtes attiré·e par les personnes vives d'esprit, cultivées et ouvertes au débat.",
      "Les personnalités fermées d'esprit ou intellectuellement passives vous frustrent.",
      "Vous avez besoin d'un·e partenaire qui nourrit votre curiosité et accepte vos remises en question."
    ],
    dailyLife: [
      "Vous avez besoin de stimulation intellectuelle et de nouveauté au quotidien.",
      "Face au stress, vous avez tendance à analyser excessivement ou à vous disperser."
    ],
    affinities: [
      "Vous vous sentez à l'aise avec des personnes ouvertes, curieuses et intellectuellement stimulantes.",
      "Vous vous sentez en difficulté avec les profils dogmatiques, rigides ou sans humour."
    ]
  },
  ENFJ: {
    number: 7,
    title: "Le Mentor inspirant et empathique",
    emoji: "🌟",
    character: "Inspirant, empathique, charismatique",
    temperament: [
      "Vous avez le don de révéler le meilleur chez les autres. Votre empathie naturelle crée des connexions profondes.",
      "Vous êtes un·e leader du cœur. Les gens viennent naturellement vers vous pour du soutien et de l'inspiration.",
      "Dans votre parcours, vous avez toujours cherché à faire grandir les autres et à créer du lien.",
      "Votre charisme bienveillant fait de vous une personne vers qui on se tourne dans les moments importants."
    ],
    strengths: ["Empathie profonde", "Charisme bienveillant", "Capacité d'inspiration", "Vision humaniste", "Communication chaleureuse", "Dévouement"],
    weaknesses: ["Tendance à se sacrifier", "Idéalisme parfois excessif", "Difficulté à recevoir", "Prise en charge des émotions d'autrui", "Perfectionnisme relationnel", "Épuisement émotionnel"],
    loveVision: "En amour, vous cherchez une relation profonde et significative, basée sur la croissance mutuelle. L'amour est pour vous un chemin de transformation partagé.",
    strengthsAndFragilities: "Votre force est votre capacité à créer des liens profonds et authentiques. Votre fragilité est de parfois vous perdre dans les besoins des autres au détriment des vôtres.",
    attractions: [
      "Vous êtes attiré·e par les personnes profondes, authentiques et en quête de sens.",
      "Les personnalités superficielles ou égocentrées vous déçoivent.",
      "Vous avez besoin d'un·e partenaire qui partage votre idéal d'une relation riche et nourrissante."
    ],
    dailyLife: [
      "Vous avez besoin de relations significatives et de moments de partage profond.",
      "Face au stress, vous avez tendance à vous occuper des autres pour oublier vos propres tensions."
    ],
    affinities: [
      "Vous vous sentez à l'aise avec des personnes profondes, bienveillantes et en quête de sens.",
      "Vous vous sentez en difficulté avec les profils cyniques, superficiels ou manipulateurs."
    ]
  },
  ENFP: {
    number: 8,
    title: "Le Séducteur élégant et charismatique",
    emoji: "🎭",
    character: "Passionné, imaginatif, authentique",
    temperament: [
      "Vous avez une aisance naturelle dans la relation. Vous savez capter l'attention, créer du lien, installer une dynamique. Sans en faire trop, vous avez ce sens du contact qui facilite les échanges.",
      "Vous êtes attentif(ve) à l'image que vous renvoyez et à la qualité de vos interactions. Vous aimez que les relations soient fluides, agréables, équilibrées.",
      "Vous avez besoin d'interaction. Le lien, les échanges, les regards comptent pour vous.",
      "Dans votre parcours, vous avez souvent développé cette capacité à vous adapter aux autres, à comprendre rapidement ce qui fonctionne dans la relation.",
      "Dans la relation, vous êtes présent(e), engageant(e), expressif(ve). Vous savez créer une proximité."
    ],
    strengths: ["Aisance relationnelle", "Charisme naturel", "Capacité d'adaptation", "Qualité de communication", "Présence", "Sens du lien"],
    weaknesses: ["Tendance à rester en surface", "Besoin de validation", "Difficulté à se livrer en profondeur", "Dépendance au regard de l'autre", "Gestion des conflits limitée", "Image parfois prioritaire"],
    loveVision: "Pour vous, l'amour passe par le lien et la qualité des échanges. Vous recherchez une relation vivante, agréable, où l'on se plaît mutuellement. Vous vous investissez lorsque le lien est fluide et valorisant. Vous attirez par votre présence et votre capacité à créer du lien.",
    strengthsAndFragilities: "Votre force est votre capacité à créer du lien rapidement et naturellement. Votre fragilité est de rester parfois dans une relation agréable mais pas toujours profonde.",
    attractions: [
      "Ne recherchez-vous pas plutôt quelqu'un de sincère, avec qui vous pouvez être vous-même, plutôt que quelqu'un avec qui vous devez toujours séduire ?",
      "Vous avez souvent été dans l'échange, dans la relation, dans l'image. Cela vous correspond, mais dans le quotidien, cela peut devenir fatigant.",
      "Vous pouvez être sensible à des personnes simples, authentiques, avec qui la relation ne repose pas sur le jeu ou la séduction.",
      "À l'inverse, les relations trop superficielles ou basées uniquement sur l'apparence peuvent vous lasser."
    ],
    dailyLife: [
      "Vous avez besoin d'interactions et de lien pour vous sentir bien.",
      "Face au stress, vous avez tendance à maintenir l'image ou à éviter les tensions."
    ],
    affinities: [
      "Vous vous sentez à l'aise avec des personnes ouvertes, naturelles et expressives.",
      "Vous vous sentez en difficulté avec les profils froids, fermés ou critiques."
    ]
  },
  ISTJ: {
    number: 9,
    title: "Le Gardien loyal et méthodique",
    emoji: "🏛️",
    character: "Loyal, méthodique, responsable",
    temperament: [
      "Vous êtes la personne sur qui on peut toujours compter. Votre fiabilité est votre plus grande force.",
      "Vous aimez l'ordre, la méthode, la constance. Ces qualités font de vous un·e partenaire de confiance.",
      "Dans votre parcours, vous avez toujours privilégié la qualité à la quantité, dans vos relations comme dans vos engagements.",
      "Votre loyauté est sans faille. Quand vous donnez votre parole, vous la tenez."
    ],
    strengths: ["Loyauté absolue", "Sens du devoir", "Fiabilité", "Constance", "Rigueur", "Honnêteté"],
    weaknesses: ["Résistance au changement", "Difficulté à exprimer ses émotions", "Rigidité", "Tendance à la routine", "Jugement parfois sévère", "Ouverture limitée"],
    loveVision: "Vous valorisez la fidélité et la constance. Vous construisez l'amour pierre par pierre, avec patience et dévouement.",
    strengthsAndFragilities: "Votre force est votre fiabilité et votre loyauté indéfectible. Votre fragilité est de parfois avoir du mal à montrer vos émotions et à vous adapter aux changements.",
    attractions: [
      "Vous êtes attiré·e par les personnes stables, honnêtes et respectueuses.",
      "Les personnalités trop changeantes ou peu fiables vous mettent mal à l'aise.",
      "Vous avez besoin d'un·e partenaire qui comprend la valeur de l'engagement et de la parole donnée."
    ],
    dailyLife: [
      "Vous avez besoin de routine et de prévisibilité pour vous sentir en sécurité.",
      "Face au stress, vous avez tendance à vous replier sur vos habitudes et vos certitudes."
    ],
    affinities: [
      "Vous vous sentez à l'aise avec des personnes fiables, honnêtes et respectueuses des engagements.",
      "Vous vous sentez en difficulté avec les profils imprévisibles, instables ou peu sincères."
    ]
  },
  ISTP: {
    number: 10,
    title: "L'Artisan indépendant et pragmatique",
    emoji: "🔧",
    character: "Indépendant, observateur, pragmatique",
    temperament: [
      "Vous êtes un esprit libre qui aime comprendre comment les choses fonctionnent. Votre calme est rassurant.",
      "Vous observez avant d'agir. Cette qualité vous permet de prendre des décisions réfléchies et pertinentes.",
      "Dans votre parcours, vous avez développé une grande autonomie et une capacité à résoudre les problèmes avec ingéniosité.",
      "Votre pragmatisme est votre boussole. Vous préférez les solutions concrètes aux théories abstraites."
    ],
    strengths: ["Indépendance", "Pragmatisme", "Calme sous pression", "Habileté technique", "Observation fine", "Autonomie"],
    weaknesses: ["Difficulté à exprimer ses sentiments", "Tendance à l'isolement", "Détachement émotionnel", "Résistance à l'engagement", "Communication limitée", "Patience limitée avec les émotions"],
    loveVision: "Vous cherchez un·e partenaire qui respecte votre indépendance tout en partageant des moments de qualité. L'amour se vit dans le concret, pas dans les grands discours.",
    strengthsAndFragilities: "Votre force est votre calme et votre capacité à gérer les situations difficiles. Votre fragilité est de parfois paraître distant·e ou peu investi·e émotionnellement.",
    attractions: [
      "Vous êtes attiré·e par les personnes autonomes, concrètes et respectueuses de votre espace.",
      "Les personnalités trop envahissantes ou émotionnellement exigeantes vous étouffent.",
      "Vous avez besoin d'un·e partenaire qui comprend votre besoin de solitude et d'autonomie."
    ],
    dailyLife: [
      "Vous avez besoin de moments seul·e et d'activités concrètes pour vous ressourcer.",
      "Face au stress, vous avez tendance à vous isoler ou à vous concentrer sur des tâches pratiques."
    ],
    affinities: [
      "Vous vous sentez à l'aise avec des personnes calmes, autonomes et pragmatiques.",
      "Vous vous sentez en difficulté avec les profils trop émotifs, envahissants ou dépendants."
    ]
  },
  ISFJ: {
    number: 11,
    title: "Le Dévoué bienveillant et persévérant",
    emoji: "🕊️",
    character: "Bienveillant, discret, persévérant",
    temperament: [
      "Votre dévouement silencieux est une forme d'amour rare. Vous mémorisez chaque détail qui compte.",
      "Vous prenez soin des autres avec une délicatesse et une attention remarquables. Votre discrétion est une force.",
      "Dans votre parcours, vous avez toujours été celui ou celle qui se souvient, qui anticipe, qui prend soin en silence.",
      "Votre persévérance est admirable. Vous ne baissez jamais les bras face aux difficultés."
    ],
    strengths: ["Bienveillance", "Attention aux détails", "Persévérance", "Discrétion", "Mémoire émotionnelle", "Fidélité"],
    weaknesses: ["Tendance à s'effacer", "Difficulté à demander de l'aide", "Surinvestissement", "Résistance au changement", "Auto-sacrifice", "Sensibilité aux critiques"],
    loveVision: "Vous offrez un amour profond et constant. La sécurité émotionnelle est au cœur de vos relations. Vous aimez dans les gestes du quotidien.",
    strengthsAndFragilities: "Votre force est votre dévouement et votre attention aux besoins de l'autre. Votre fragilité est de parfois vous oublier dans la relation.",
    attractions: [
      "Vous êtes attiré·e par les personnes stables, reconnaissantes et protectrices.",
      "Les personnalités égoïstes ou ingrates vous blessent profondément.",
      "Vous avez besoin d'un·e partenaire qui voit et apprécie vos gestes d'amour silencieux."
    ],
    dailyLife: [
      "Vous avez besoin de stabilité et de routines réconfortantes pour vous sentir bien.",
      "Face au stress, vous avez tendance à vous suroccuper des autres ou à vous replier sur vous-même."
    ],
    affinities: [
      "Vous vous sentez à l'aise avec des personnes stables, reconnaissantes et attentionnées.",
      "Vous vous sentez en difficulté avec les profils exigeants, critiques ou ingrats."
    ]
  },
  ISFP: {
    number: 12,
    title: "Le Poète sensible et harmonieux",
    emoji: "🎨",
    character: "Sensible, créatif, harmonieux",
    temperament: [
      "Vous percevez le monde avec une sensibilité unique. Votre richesse intérieure est un trésor à découvrir.",
      "Vous aimez la beauté sous toutes ses formes : la nature, l'art, les moments de grâce. Votre sens esthétique est raffiné.",
      "Dans votre parcours, vous avez développé une vie intérieure riche et une capacité d'émerveillement rare.",
      "Votre douceur et votre authenticité touchent ceux qui prennent le temps de vous connaître."
    ],
    strengths: ["Sensibilité artistique", "Authenticité", "Harmonie intérieure", "Douceur", "Écoute", "Sens esthétique"],
    weaknesses: ["Tendance à l'idéalisation", "Difficulté à s'affirmer", "Hypersensibilité", "Évitement des conflits", "Repli sur soi", "Perfectionnisme émotionnel"],
    loveVision: "Vous recherchez une relation douce et authentique, où les sentiments s'expriment avec délicatesse et où la beauté du quotidien est partagée.",
    strengthsAndFragilities: "Votre force est votre sensibilité et votre authenticité. Votre fragilité est de parfois idéaliser l'autre et souffrir de la réalité.",
    attractions: [
      "Vous êtes attiré·e par les personnes douces, authentiques et sensibles à la beauté.",
      "Les personnalités brutales ou insensibles vous font fuir.",
      "Vous avez besoin d'un·e partenaire qui comprend et respecte votre monde intérieur."
    ],
    dailyLife: [
      "Vous avez besoin de beauté, de calme et de moments de contemplation pour vous sentir bien.",
      "Face au stress, vous avez tendance à vous isoler dans votre monde intérieur."
    ],
    affinities: [
      "Vous vous sentez à l'aise avec des personnes douces, authentiques et respectueuses.",
      "Vous vous sentez en difficulté avec les profils agressifs, bruyants ou insensibles."
    ]
  },
  INTJ: {
    number: 13,
    title: "L'Architecte stratégique et perfectionniste",
    emoji: "🏗️",
    character: "Stratégique, indépendant, perfectionniste",
    temperament: [
      "Votre esprit analytique et votre vision à long terme font de vous un·e bâtisseur·se remarquable.",
      "Vous avez une capacité rare à voir au-delà de l'immédiat et à concevoir des plans ambitieux.",
      "Dans votre parcours, vous avez toujours cherché l'excellence et la cohérence dans tout ce que vous entreprenez.",
      "Votre indépendance d'esprit est votre force. Vous ne suivez pas les modes, vous créez vos propres chemins."
    ],
    strengths: ["Vision à long terme", "Intelligence stratégique", "Indépendance", "Perfectionnisme constructif", "Détermination", "Profondeur d'analyse"],
    weaknesses: ["Difficulté à faire confiance", "Exigence excessive", "Isolement", "Impatience intellectuelle", "Arrogance perçue", "Difficulté émotionnelle"],
    loveVision: "Vous cherchez un·e partenaire de vie qui comprend votre besoin de profondeur et de sens. L'amour doit être intelligent et durable.",
    strengthsAndFragilities: "Votre force est votre vision et votre profondeur. Votre fragilité est de parfois être perçu·e comme distant·e ou inaccessible.",
    attractions: [
      "Vous êtes attiré·e par les personnes intelligentes, profondes et indépendantes.",
      "Les personnalités superficielles ou conformistes vous ennuient.",
      "Vous avez besoin d'un·e partenaire qui respecte votre besoin d'autonomie et partage votre quête de sens."
    ],
    dailyLife: [
      "Vous avez besoin de solitude intellectuelle et de projets stimulants pour vous épanouir.",
      "Face au stress, vous avez tendance à vous isoler et à suranalyser."
    ],
    affinities: [
      "Vous vous sentez à l'aise avec des personnes intelligentes, profondes et autonomes.",
      "Vous vous sentez en difficulté avec les profils superficiels, envahissants ou sans ambition."
    ]
  },
  INTP: {
    number: 14,
    title: "Le Penseur analytique et original",
    emoji: "🔬",
    character: "Analytique, original, réfléchi",
    temperament: [
      "Votre monde intérieur est fascinant. Votre capacité d'analyse et votre originalité sont vos atouts.",
      "Vous aimez comprendre, décortiquer, explorer les idées. Votre curiosité intellectuelle est insatiable.",
      "Dans votre parcours, vous avez développé une pensée indépendante et une vision du monde unique.",
      "Votre originalité fait de vous un·e interlocuteur·rice passionnant·e pour qui prend le temps de vous écouter."
    ],
    strengths: ["Intelligence analytique", "Originalité", "Curiosité intellectuelle", "Indépendance de pensée", "Créativité conceptuelle", "Honnêteté intellectuelle"],
    weaknesses: ["Détachement émotionnel", "Difficulté dans les interactions sociales", "Procrastination", "Négligence du monde pratique", "Arrogance intellectuelle", "Difficulté à communiquer ses sentiments"],
    loveVision: "La connexion intellectuelle est essentielle pour vous. Vous cherchez un·e partenaire qui stimule votre esprit et accepte votre monde intérieur.",
    strengthsAndFragilities: "Votre force est votre intelligence et votre originalité. Votre fragilité est de parfois négliger la dimension émotionnelle de la relation.",
    attractions: [
      "Vous êtes attiré·e par les personnes intelligentes, curieuses et ouvertes d'esprit.",
      "Les personnalités anti-intellectuelles ou superficielles vous repoussent.",
      "Vous avez besoin d'un·e partenaire patient·e qui comprend votre besoin de réflexion et de solitude."
    ],
    dailyLife: [
      "Vous avez besoin de temps seul·e pour réfléchir et explorer vos idées.",
      "Face au stress, vous avez tendance à vous réfugier dans la réflexion ou la procrastination."
    ],
    affinities: [
      "Vous vous sentez à l'aise avec des personnes intelligentes, patientes et ouvertes aux idées originales.",
      "Vous vous sentez en difficulté avec les profils conformistes, bruyants ou intellectuellement fermés."
    ]
  },
  INFJ: {
    number: 15,
    title: "L'Idéaliste intuitif et profond",
    emoji: "🔮",
    character: "Intuitif, profond, déterminé",
    temperament: [
      "Vous avez une compréhension rare des autres. Votre intuition et votre profondeur sont des dons précieux.",
      "Vous percevez ce que les autres ne voient pas. Votre empathie va au-delà des mots et des apparences.",
      "Dans votre parcours, vous avez toujours cherché le sens profond des choses et des relations.",
      "Votre détermination silencieuse est remarquable. Quand vous croyez en quelque chose, rien ne peut vous arrêter."
    ],
    strengths: ["Intuition profonde", "Empathie rare", "Détermination", "Vision humaniste", "Profondeur émotionnelle", "Sens du sacré"],
    weaknesses: ["Perfectionnisme relationnel", "Tendance à l'idéalisation", "Épuisement empathique", "Difficulté à s'ouvrir", "Attentes élevées", "Isolement choisi"],
    loveVision: "Vous recherchez une âme sœur au sens propre : une connexion rare, profonde et transformatrice. L'amour doit avoir du sens.",
    strengthsAndFragilities: "Votre force est votre profondeur émotionnelle et votre intuition. Votre fragilité est de parfois attendre un idéal qui n'existe pas.",
    attractions: [
      "Vous êtes attiré·e par les personnes profondes, sincères et en quête de sens.",
      "Les personnalités superficielles ou malhonnêtes vous repoussent instinctivement.",
      "Vous avez besoin d'un·e partenaire qui partage votre quête d'authenticité et de profondeur."
    ],
    dailyLife: [
      "Vous avez besoin de solitude et de moments de réflexion pour vous ressourcer.",
      "Face au stress, vous avez tendance à vous isoler et à ruminer."
    ],
    affinities: [
      "Vous vous sentez à l'aise avec des personnes profondes, sincères et spirituellement ouvertes.",
      "Vous vous sentez en difficulté avec les profils superficiels, bruyants ou manipulateurs."
    ]
  },
  INFP: {
    number: 16,
    title: "Le Rêveur idéaliste et empathique",
    emoji: "🌙",
    character: "Idéaliste, empathique, créatif",
    temperament: [
      "Votre monde intérieur est d'une richesse infinie. Votre empathie naturelle touche les cœurs.",
      "Vous portez en vous un idéal de beauté et d'authenticité qui guide toutes vos relations.",
      "Dans votre parcours, vous avez toujours cherché la vérité et la sincérité dans vos liens.",
      "Votre sensibilité est un don. Elle vous permet de percevoir la beauté là où d'autres ne la voient pas."
    ],
    strengths: ["Empathie profonde", "Créativité", "Idéalisme", "Authenticité", "Richesse intérieure", "Sens de la beauté"],
    weaknesses: ["Hypersensibilité", "Tendance à l'idéalisation", "Difficulté avec la réalité", "Repli sur soi", "Perfectionnisme émotionnel", "Vulnérabilité aux déceptions"],
    loveVision: "Vous rêvez d'un amour qui transcende l'ordinaire, fait de compréhension mutuelle et de poésie. L'amour doit être beau et vrai.",
    strengthsAndFragilities: "Votre force est votre capacité à aimer avec une profondeur rare. Votre fragilité est de parfois souffrir de l'écart entre votre idéal et la réalité.",
    attractions: [
      "Vous êtes attiré·e par les personnes authentiques, sensibles et profondes.",
      "Les personnalités cyniques ou superficielles vous blessent.",
      "Vous avez besoin d'un·e partenaire qui comprend votre sensibilité et partage votre quête de beauté."
    ],
    dailyLife: [
      "Vous avez besoin de calme, de nature et de moments de rêverie pour vous ressourcer.",
      "Face au stress, vous avez tendance à vous replier dans votre monde intérieur."
    ],
    affinities: [
      "Vous vous sentez à l'aise avec des personnes douces, authentiques et rêveuses.",
      "Vous vous sentez en difficulté avec les profils durs, cyniques ou matérialistes."
    ]
  }
};

export function computeMBTI(answers: Record<string, number>): string {
  // Import-free: inline the question metadata for scoring
  const dimensionQuestions: Record<number, { id: number; reversed: boolean }[]> = {
    1: [ // E/I – Q1-9
      { id: 1, reversed: false }, { id: 2, reversed: false }, { id: 3, reversed: false },
      { id: 4, reversed: false }, { id: 5, reversed: false }, { id: 6, reversed: true },
      { id: 7, reversed: true }, { id: 8, reversed: true }, { id: 9, reversed: true },
    ],
    2: [ // N/S – Q10-18
      { id: 10, reversed: false }, { id: 11, reversed: false }, { id: 12, reversed: false },
      { id: 13, reversed: false }, { id: 14, reversed: true }, { id: 15, reversed: true },
      { id: 16, reversed: true }, { id: 17, reversed: true }, { id: 18, reversed: true },
    ],
    3: [ // T/F – Q19-33
      { id: 19, reversed: false }, { id: 20, reversed: false }, { id: 21, reversed: false },
      { id: 22, reversed: false }, { id: 23, reversed: false }, { id: 24, reversed: false },
      { id: 25, reversed: false }, { id: 26, reversed: false }, { id: 27, reversed: true },
      { id: 28, reversed: true }, { id: 29, reversed: true }, { id: 30, reversed: true },
      { id: 31, reversed: true }, { id: 32, reversed: true }, { id: 33, reversed: true },
    ],
    4: [ // J/P – Q34-42
      { id: 34, reversed: false }, { id: 35, reversed: false }, { id: 36, reversed: false },
      { id: 37, reversed: false }, { id: 38, reversed: true }, { id: 39, reversed: true },
      { id: 40, reversed: true }, { id: 41, reversed: true }, { id: 42, reversed: true },
    ],
  };

  const dims = [
    { dim: 1, letterHigh: "E", letterLow: "I" },
    { dim: 2, letterHigh: "N", letterLow: "S" },
    { dim: 3, letterHigh: "T", letterLow: "F" },
    { dim: 4, letterHigh: "J", letterLow: "P" },
  ];

  return dims.map(({ dim, letterHigh, letterLow }) => {
    let total = 0;
    let count = 0;
    for (const q of dimensionQuestions[dim]) {
      const val = answers[`q${q.id}`];
      if (val !== undefined) {
        total += q.reversed ? 6 - val : val;
        count++;
      }
    }
    const avg = count > 0 ? total / count : 3;
    return avg >= 3 ? letterHigh : letterLow;
  }).join("");
}

export function getDimensionScores(answers: Record<string, number>) {
  const dimensionQuestions: Record<number, { id: number; reversed: boolean }[]> = {
    1: [
      { id: 1, reversed: false }, { id: 2, reversed: false }, { id: 3, reversed: false },
      { id: 4, reversed: false }, { id: 5, reversed: false }, { id: 6, reversed: true },
      { id: 7, reversed: true }, { id: 8, reversed: true }, { id: 9, reversed: true },
    ],
    2: [
      { id: 10, reversed: false }, { id: 11, reversed: false }, { id: 12, reversed: false },
      { id: 13, reversed: false }, { id: 14, reversed: true }, { id: 15, reversed: true },
      { id: 16, reversed: true }, { id: 17, reversed: true }, { id: 18, reversed: true },
    ],
    3: [
      { id: 19, reversed: false }, { id: 20, reversed: false }, { id: 21, reversed: false },
      { id: 22, reversed: false }, { id: 23, reversed: false }, { id: 24, reversed: false },
      { id: 25, reversed: false }, { id: 26, reversed: false }, { id: 27, reversed: true },
      { id: 28, reversed: true }, { id: 29, reversed: true }, { id: 30, reversed: true },
      { id: 31, reversed: true }, { id: 32, reversed: true }, { id: 33, reversed: true },
    ],
    4: [
      { id: 34, reversed: false }, { id: 35, reversed: false }, { id: 36, reversed: false },
      { id: 37, reversed: false }, { id: 38, reversed: true }, { id: 39, reversed: true },
      { id: 40, reversed: true }, { id: 41, reversed: true }, { id: 42, reversed: true },
    ],
  };

  const dims = [
    { id: 1, label: "Extraverti", labelAlt: "Introverti", letterHigh: "E", letterLow: "I" },
    { id: 2, label: "Intuitif", labelAlt: "Concret", letterHigh: "N", letterLow: "S" },
    { id: 3, label: "Analytique", labelAlt: "Empathique", letterHigh: "T", letterLow: "F" },
    { id: 4, label: "Structuré", labelAlt: "Flexible", letterHigh: "J", letterLow: "P" },
  ];

  return dims.map(dim => {
    let total = 0, count = 0;
    for (const q of dimensionQuestions[dim.id]) {
      const val = answers[`q${q.id}`];
      if (val !== undefined) {
        total += q.reversed ? 6 - val : val;
        count++;
      }
    }
    const avg = count > 0 ? total / count : 3;
    const percent = Math.round(((avg - 1) / 4) * 100);
    const dominant = avg >= 3 ? dim.label : dim.labelAlt;
    const letter = avg >= 3 ? dim.letterHigh : dim.letterLow;
    return { ...dim, percent, dominant, letter };
  });
}
