// Database of the 16 personality profiles.
// Add new profiles by appending entries to `personalityDatabase`.
// The UI component (`PersonalityProfile.tsx`) consumes this structure unchanged.

export type Gender = "homme" | "femme";

export interface PersonalityMetric {
  label: string;
  value: number; // 0-100
}

export interface ComfortDrain {
  comfortTitle: string;
  comfort: string[];
  drainTitle: string;
  drain: string[];
}

export interface PersonalityProfileData {
  id: string;
  title: string;
  metrics: PersonalityMetric[];
  intro: string; // "Functioning"
  strengths: string[];
  weaknesses: string[];
  loveVision: string;
  balanceStress: string;
  rapportToOthers: string;
  attractions: ComfortDrain;
  signature: string;
  // Image slugs — paired with gender at render time:
  // resolved as `/assets/personalities/${gender}/${id}-hero.jpg` etc.
  imageSlug?: string;
}

/**
 * Resolves gender-specific endings written as "factuel(le)" / "engagé(e)".
 * - homme  → strips "(le)" / "(e)" → "factuel" / "engagé"
 * - femme  → keeps the inner letters → "factuelle" / "engagée"
 */
export function genderize(text: string, gender: Gender): string {
  return text.replace(/\(([^)]+)\)/g, (_, inner) => (gender === "femme" ? inner : ""));
}

export const personalityDatabase: Record<string, PersonalityProfileData> = {
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
      "Vous cherchez à le comprendre en profondeur à travers la logique et l'analyse. Vous avancez avec lucidité, en évaluant les choses avec recul, en prenant le temps de réfléchir. Vous fonctionnez à votre rythme, sans pression extérieure, et préférez une relation pensée, équilibrée, bien construite.",
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
      "Procrastination décisionnelle",
      "Expression limitée",
      "Froideur apparente",
    ],
    loveVision:
      "Pour vous, l'amour se comprend avant de se vivre. Vous avez besoin de saisir la logique d'une relation, ses contours, ses promesses, avant de vous y abandonner. Vous aimez avec sérieux, profondeur et fidélité, mais vos sentiments, vous ne savez pas toujours formuler.",
    balanceStress:
      "Vous vous ressourcez dans la solitude, le silence, la lecture ou la nature. Le stress vous pousse à vous isoler pour analyser, comprendre, structurer. Vous évitez les débordements émotionnels et préférez chercher des solutions rationnelles.",
    rapportToOthers:
      "Vous êtes pragmatique, factuel(le). Les objectifs et les résultats sont primordiaux, et chaque mot, chaque geste a son importance. Vos relations sont sélectives : vous tenez vos engagements et respectez ceux des autres, mais exprimez peu vos émotions.",
    attractions: {
      comfortTitle: "Vous êtes à l'aise avec",
      comfort: [
        "Personnes autonomes et vivantes",
        "Respect du rythme",
        "Stimulation intellectuelle",
        "Échanges sans jugement",
        "Chaleur et spontanéité",
      ],
      drainTitle: "Vous vous épuisez avec",
      drain: [
        "Personnes trop émotives",
        "Instabilité / Versatilité",
        "Rigidité et dirigisme",
        "Échanges superficiels",
        "Incohérence ou malhonnêteté",
      ],
    },
    signature:
      "Vous avez besoin de calme pour aller à la rencontre de l'autre… et de clarté pour vous engager.",
  },
};

export function getProfile(id: string): PersonalityProfileData | undefined {
  return personalityDatabase[id];
}
