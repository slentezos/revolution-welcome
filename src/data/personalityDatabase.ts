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
      { label: "Calme", value: 75 },
      { label: "Abstrait", value: 60 },
      { label: "Tête", value: 85 },
      { label: "Flexibilité", value: 55 },
    ],
    intro:
      "Vous cherchez à le comprendre en profondeur avant de vous y engager. Vous avancez avec lucidité, en évaluant les choses avec recul, en prenant le temps de réfléchir. Vous fonctionnez à votre rythme, sans pression extérieure, et préférez une relation pensée, équilibrée, bien construite.",
    strengths: [
      "Capacité d'analyse et de recul",
      "Indépendance d'esprit",
      "Loyauté discrète mais réelle",
      "Profondeur de réflexion",
      "Calme intérieur et stabilité",
    ],
    weaknesses: [
      "Difficulté à exprimer vos émotions",
      "Tendance à intellectualiser les ressentis",
      "Besoin de solitude parfois mal compris",
      "Lenteur à vous engager",
      "Réticence à montrer vos failles",
    ],
    loveVision:
      "Pour vous, l'amour se comprend avant de se vivre. Vous avez besoin de saisir la logique d'une relation, ses contours, ses promesses, avant de vous y abandonner. Vous aimez avec sérieux, profondeur et fidélité, mais vos sentiments, vous ne savez pas toujours formuler.",
    balanceStress:
      "Vous vous ressourcez dans la solitude, le silence, la lecture ou la nature. Le stress vous pousse à vous isoler pour analyser, comprendre, structurer. Vous évitez les débordements émotionnels et préférez chercher des solutions rationnelles.",
    rapportToOthers:
      "Vous êtes pragmatique, factuel(le), peu démonstratif(ve). Vous écoutez plus que vous ne parlez, observez avant d'agir. Vous tenez vos engagements et respectez ceux des autres, mais exprimez peu vos émotions.",
    attractions: {
      comfortTitle: "Vous êtes à l'aise avec",
      comfort: [
        "Les personnes calmes, posées et réfléchies",
        "Les échanges sincères et nuancés",
        "Les relations qui respectent votre besoin d'espace",
        "Les partenaires capables d'autonomie",
        "Les contextes prévisibles et apaisés",
      ],
      drainTitle: "Vous vous épuisez avec",
      drain: [
        "Les personnalités envahissantes ou émotionnellement instables",
        "Les conversations superficielles ou bruyantes",
        "Les exigences relationnelles permanentes",
        "Les conflits ouverts et théâtraux",
        "Les rythmes effrénés et imprévisibles",
      ],
    },
    signature:
      "Vous avez besoin de calme pour aller à la rencontre de l'autre… et de clarté pour vous engager.",
  },
};

export function getProfile(id: string): PersonalityProfileData | undefined {
  return personalityDatabase[id];
}
