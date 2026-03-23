export interface PersonalityQuestion {
  id: number;
  text: string;
  /** If true, score is reversed (6 - value) for MBTI computation */
  reversed: boolean;
  /** MBTI dimension: 1=E/I, 2=N/S, 3=T/F, 4=J/P */
  dimension: 1 | 2 | 3 | 4;
}

export const personalityQuestions: PersonalityQuestion[] = [
  // ── Dimension 1: Extraversion (E) vs Introversion (I) ── Q1–Q9
  { id: 1, text: "Vous supportez mal la solitude", reversed: false, dimension: 1 },
  {
    id: 2,
    text: "Vous êtes réputé pour mettre de l'ambiance dans une soirée ou à l'occasion d'un weekend entre amis",
    reversed: false,
    dimension: 1,
  },
  { id: 3, text: "Vos amis vous décriraient comme étant enjoué et extraverti", reversed: false, dimension: 1 },
  { id: 4, text: "Vous avez besoin des autres pour vous ressourcer", reversed: false, dimension: 1 },
  {
    id: 5,
    text: "Vous êtes à l'aise à l'idée d'aller à un cocktail où vous ne connaissez pas grand monde",
    reversed: false,
    dimension: 1,
  },
  { id: 6, text: "En réunion, vous ne prenez pas facilement la parole de vous-même", reversed: true, dimension: 1 },
  {
    id: 7,
    text: "Pour votre anniversaire, vous préférez une soirée intime à une grande fête organisée par vos amis",
    reversed: true,
    dimension: 1,
  },
  { id: 8, text: "Vous aimez travailler seul dans un endroit calme et retiré", reversed: true, dimension: 1 },
  {
    id: 9,
    text: "Vous êtes plutôt timide et avez du mal à défendre vos idées en public",
    reversed: true,
    dimension: 1,
  },

  // ── Dimension 2: Intuition (N) vs Sensation (S) ── Q10–Q18
  {
    id: 10,
    text: "Vous aimez être confronté à des idées nouvelles, originales, inattendues, voire dérangeantes",
    reversed: false,
    dimension: 2,
  },
  {
    id: 11,
    text: "Vous êtes en quête permanente de nouvelles expériences et de nouveaux domaines de connaissances à explorer",
    reversed: false,
    dimension: 2,
  },
  {
    id: 12,
    text: "Lors du montage d'un meuble, vous suivez instinctivement votre intuition plutôt que de vous soucier du mode d'emploi",
    reversed: false,
    dimension: 2,
  },
  { id: 13, text: "Vous appréciez les dilemmes éthiques et les débats philosophiques", reversed: false, dimension: 2 },
  {
    id: 14,
    text: "Vous vous appuyez de préférence sur les faits concrets plutôt que sur votre intuition",
    reversed: true,
    dimension: 2,
  },
  { id: 15, text: "Vous êtes plus à l'aise dans le concret que dans l'abstrait", reversed: true, dimension: 2 },
  { id: 16, text: "Vous préférez l'approche structurée et méthodique à l'improvisation", reversed: true, dimension: 2 },
  { id: 17, text: "Vous remarquez d'abord les détails pratiques", reversed: true, dimension: 2 },
  {
    id: 18,
    text: "Vous vous lassez ou perdez tout intérêt lorsque la discussion devient trop théorique",
    reversed: true,
    dimension: 2,
  },

  // ── Dimension 3: Pensée (T) vs Sentiment (F) ── Q19–Q33
  {
    id: 19,
    text: "En général, vous prenez vos décisions de façon logique et rationnelle",
    reversed: false,
    dimension: 3,
  },
  { id: 20, text: "Vous restez calme dans les conflits ou quand les autres s'énervent", reversed: false, dimension: 3 },
  { id: 21, text: "Les situations de stress vous stimulent", reversed: false, dimension: 3 },
  { id: 22, text: "Vous êtes direct(e) et sans détour, même si cela dérange", reversed: false, dimension: 3 },
  { id: 23, text: "Vous préférez être juste plutôt que compatissant(e)", reversed: false, dimension: 3 },
  { id: 24, text: "Vous avez du mal avec des arguments émotionnels", reversed: false, dimension: 3 },
  { id: 25, text: "Vous manquez rarement de confiance en vous", reversed: false, dimension: 3 },
  { id: 26, text: "Vous accordez plus d'importance à l'efficacité qu'au ressenti", reversed: false, dimension: 3 },
  { id: 27, text: "Vous vous sentez mal quand quelqu'un est blessé par vos actes", reversed: true, dimension: 3 },
  { id: 28, text: "Vous avez horreur des tensions et des situations conflictuelles", reversed: true, dimension: 3 },
  { id: 29, text: "Vous cherchez à créer de l'harmonie autour de vous", reversed: true, dimension: 3 },
  { id: 30, text: "Vous avez du mal à dire non pour ne pas blesser", reversed: true, dimension: 3 },
  { id: 31, text: "Vous êtes sensible à ce que les autres ressentent", reversed: true, dimension: 3 },
  { id: 32, text: "Vos erreurs même anciennes continuent de vous préoccuper", reversed: true, dimension: 3 },
  { id: 33, text: "Vous supportez mal les critiques", reversed: true, dimension: 3 },

  // ── Dimension 4: Jugement (J) vs Perception (P) ── Q34–Q42
  { id: 34, text: "Vous organisez volontiers vos journées à l'avance", reversed: false, dimension: 4 },
  { id: 35, text: "Vous êtes plutôt ponctuel(le) et prévoyant(e)", reversed: false, dimension: 4 },
  {
    id: 36,
    text: "Vous préférez terminer ce que vous avez commencé avant d'entreprendre autre chose",
    reversed: false,
    dimension: 4,
  },
  {
    id: 37,
    text: "Vous réalisez les projets que vous vous êtes fixé méthodiquement sans sauter d'étapes",
    reversed: false,
    dimension: 4,
  },
  { id: 38, text: "Vous avez du mal à vous décider", reversed: true, dimension: 4 },
  { id: 39, text: "Vous changez souvent de plan en cours d'exécution", reversed: true, dimension: 4 },
  { id: 40, text: "Vous préférez improviser plutôt que planifier", reversed: true, dimension: 4 },
  { id: 41, text: "Vous changez facilement vos plans si une meilleure option apparaît", reversed: true, dimension: 4 },
  { id: 42, text: "Vous vous retrouvez souvent à faire les choses à la dernière minute", reversed: true, dimension: 4 },
];

/** Question ranges for each wizard part */
export const wizardParts = [
  { title: "Partie 1", start: 1, end: 9 },
  { title: "Partie 2", start: 10, end: 18 },
  { title: "Partie 3", start: 19, end: 33 },
  { title: "Partie 4", start: 34, end: 42 },
];

export const likertOptions = [
  { value: 5, label: "Vraiment oui" },
  { value: 4, label: "Plutôt oui" },
  { value: 3, label: "Neutre" },
  { value: 2, label: "Plutôt non" },
  { value: 1, label: "Vraiment non" },
];
