const SENSITIVE_TERMS = [
  "virement", "rib", "argent", "paypal", "transcash", "pcs",
  "mandat", "western union", "héritage",
  // Common French insults
  "connard", "connasse", "salaud", "salope", "enculé", "putain",
  "merde", "nique", "fdp", "ntm", "pd", "pute", "bordel",
  "crétin", "imbécile", "débile", "abruti", "con ", "conne",
  "ta gueule", "ferme la", "dégage", "casse toi",
];

export function checkMessage(text: string): { isSafe: boolean } {
  const normalized = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const termsNormalized = SENSITIVE_TERMS.map((t) =>
    t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  );
  const isSafe = !termsNormalized.some((term) => normalized.includes(term));
  return { isSafe };
}
