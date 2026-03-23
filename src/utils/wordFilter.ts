// src/utils/wordFilter.ts

const BANNED_WORDS = [
  // --- SÉCURITÉ & ARNAQUES ---
  "virement",
  "rib",
  "argent",
  "paypal",
  "transcash",
  "pcs",
  "mandat",
  "western union",
  "héritage",
  "fortune",
  "banque",
  "coordonnées",
  "virement",
  "recharge",
  "coupon",
  "crypto",
  "bitcoin",

  // --- VULGARITÉ & GROSSIÈRETÉS ---
  "merde",
  "putain",
  "pute",
  "putes",
  "bordel",
  "chier",
  "chiant",
  "salope",
  "salopes",
  "salop",
  "salops",
  "bordel",

  // --- INSULTES & AGRESSIVITÉ ---
  "con",
  "cons",
  "connard",
  "connards",
  "connasse",
  "connasses",
  "enculé",
  "enculés",
  "enculer",
  "enfoiré",
  "enfoirés",
  "batard",
  "batards",
  "abruti",
  "abrutis",
  "crétin",
  "crétins",
  "débile",
  "débiles",
  "idiot",
  "idiots",
  "idiote",
  "idiotes",
  "salaud",
  "salauds",
  "mongol",
  "naze",
  "nase",
  "nases",
  "nique",
  "niquer",

  // --- CONTENU INAPPROPRIÉ / SEXUEL ---
  "bite",
  "bites",
  "couille",
  "couilles",
  "chatte",
  "chattes",
  "cul",
  "culs",
  "nichon",
  "nichons",
  "baise",
  "baiser",
  "sexe",
  "excitation",
  "excite",
  "excité",
  "porno",
  "pornographie",
  "cam",
  "webcam",

  // --- MENACES ---
  "mort",
  "tuer",
  "tue",
  "crever",
  "haine",
  "menace",
  "frapper",
];

/**
 * Analyse le message pour détecter des termes interdits.
 * Utilise des frontières de mots (\b) pour éviter les faux positifs
 * comme "téléchargent" qui contient "argent".
 */
export const checkMessage = (text: string): { isSafe: boolean } => {
  if (!text) return { isSafe: true };

  // On crée un pattern : \b(mot1|mot2|mot3)\b
  // Le 'i' signifie insensible à la casse (Majuscules/Minuscules)
  const escapedWords = BANNED_WORDS.map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const pattern = new RegExp(`\\b(${escapedWords.join("|")})\\b`, "i");

  const isSafe = !pattern.test(text);

  return { isSafe };
};
