// French department prefixes mapped to regions (13 metropolitan regions)
const DEPARTMENT_TO_REGION: Record<string, { region: string; isIDF: boolean }> = {
  "01": { region: "Auvergne-Rhône-Alpes", isIDF: false },
  "03": { region: "Auvergne-Rhône-Alpes", isIDF: false },
  "07": { region: "Auvergne-Rhône-Alpes", isIDF: false },
  "15": { region: "Auvergne-Rhône-Alpes", isIDF: false },
  "26": { region: "Auvergne-Rhône-Alpes", isIDF: false },
  "38": { region: "Auvergne-Rhône-Alpes", isIDF: false },
  "42": { region: "Auvergne-Rhône-Alpes", isIDF: false },
  "43": { region: "Auvergne-Rhône-Alpes", isIDF: false },
  "63": { region: "Auvergne-Rhône-Alpes", isIDF: false },
  "69": { region: "Auvergne-Rhône-Alpes", isIDF: false },
  "73": { region: "Auvergne-Rhône-Alpes", isIDF: false },
  "74": { region: "Auvergne-Rhône-Alpes", isIDF: false },
  "21": { region: "Bourgogne-Franche-Comté", isIDF: false },
  "25": { region: "Bourgogne-Franche-Comté", isIDF: false },
  "39": { region: "Bourgogne-Franche-Comté", isIDF: false },
  "58": { region: "Bourgogne-Franche-Comté", isIDF: false },
  "70": { region: "Bourgogne-Franche-Comté", isIDF: false },
  "71": { region: "Bourgogne-Franche-Comté", isIDF: false },
  "89": { region: "Bourgogne-Franche-Comté", isIDF: false },
  "90": { region: "Bourgogne-Franche-Comté", isIDF: false },
  "22": { region: "Bretagne", isIDF: false },
  "29": { region: "Bretagne", isIDF: false },
  "35": { region: "Bretagne", isIDF: false },
  "56": { region: "Bretagne", isIDF: false },
  "18": { region: "Centre-Val de Loire", isIDF: false },
  "28": { region: "Centre-Val de Loire", isIDF: false },
  "36": { region: "Centre-Val de Loire", isIDF: false },
  "37": { region: "Centre-Val de Loire", isIDF: false },
  "41": { region: "Centre-Val de Loire", isIDF: false },
  "45": { region: "Centre-Val de Loire", isIDF: false },
  "2A": { region: "Corse", isIDF: false },
  "2B": { region: "Corse", isIDF: false },
  "20": { region: "Corse", isIDF: false },
  "08": { region: "Grand Est", isIDF: false },
  "10": { region: "Grand Est", isIDF: false },
  "51": { region: "Grand Est", isIDF: false },
  "52": { region: "Grand Est", isIDF: false },
  "54": { region: "Grand Est", isIDF: false },
  "55": { region: "Grand Est", isIDF: false },
  "57": { region: "Grand Est", isIDF: false },
  "67": { region: "Grand Est", isIDF: false },
  "68": { region: "Grand Est", isIDF: false },
  "88": { region: "Grand Est", isIDF: false },
  "02": { region: "Hauts-de-France", isIDF: false },
  "59": { region: "Hauts-de-France", isIDF: false },
  "60": { region: "Hauts-de-France", isIDF: false },
  "62": { region: "Hauts-de-France", isIDF: false },
  "80": { region: "Hauts-de-France", isIDF: false },
  "75": { region: "Île-de-France", isIDF: true },
  "77": { region: "Île-de-France", isIDF: true },
  "78": { region: "Île-de-France", isIDF: true },
  "91": { region: "Île-de-France", isIDF: true },
  "92": { region: "Île-de-France", isIDF: true },
  "93": { region: "Île-de-France", isIDF: true },
  "94": { region: "Île-de-France", isIDF: true },
  "95": { region: "Île-de-France", isIDF: true },
  "14": { region: "Normandie", isIDF: false },
  "27": { region: "Normandie", isIDF: false },
  "50": { region: "Normandie", isIDF: false },
  "61": { region: "Normandie", isIDF: false },
  "76": { region: "Normandie", isIDF: false },
  "16": { region: "Nouvelle-Aquitaine", isIDF: false },
  "17": { region: "Nouvelle-Aquitaine", isIDF: false },
  "19": { region: "Nouvelle-Aquitaine", isIDF: false },
  "23": { region: "Nouvelle-Aquitaine", isIDF: false },
  "24": { region: "Nouvelle-Aquitaine", isIDF: false },
  "33": { region: "Nouvelle-Aquitaine", isIDF: false },
  "40": { region: "Nouvelle-Aquitaine", isIDF: false },
  "47": { region: "Nouvelle-Aquitaine", isIDF: false },
  "64": { region: "Nouvelle-Aquitaine", isIDF: false },
  "79": { region: "Nouvelle-Aquitaine", isIDF: false },
  "86": { region: "Nouvelle-Aquitaine", isIDF: false },
  "87": { region: "Nouvelle-Aquitaine", isIDF: false },
  "09": { region: "Occitanie", isIDF: false },
  "11": { region: "Occitanie", isIDF: false },
  "12": { region: "Occitanie", isIDF: false },
  "30": { region: "Occitanie", isIDF: false },
  "31": { region: "Occitanie", isIDF: false },
  "32": { region: "Occitanie", isIDF: false },
  "34": { region: "Occitanie", isIDF: false },
  "46": { region: "Occitanie", isIDF: false },
  "48": { region: "Occitanie", isIDF: false },
  "65": { region: "Occitanie", isIDF: false },
  "66": { region: "Occitanie", isIDF: false },
  "81": { region: "Occitanie", isIDF: false },
  "82": { region: "Occitanie", isIDF: false },
  "44": { region: "Pays de la Loire", isIDF: false },
  "49": { region: "Pays de la Loire", isIDF: false },
  "53": { region: "Pays de la Loire", isIDF: false },
  "72": { region: "Pays de la Loire", isIDF: false },
  "85": { region: "Pays de la Loire", isIDF: false },
  "04": { region: "Provence-Alpes-Côte d'Azur", isIDF: false },
  "05": { region: "Provence-Alpes-Côte d'Azur", isIDF: false },
  "06": { region: "Provence-Alpes-Côte d'Azur", isIDF: false },
  "13": { region: "Provence-Alpes-Côte d'Azur", isIDF: false },
  "83": { region: "Provence-Alpes-Côte d'Azur", isIDF: false },
  "84": { region: "Provence-Alpes-Côte d'Azur", isIDF: false },
};

// Major cities by department prefix
const DEPARTMENT_TO_CITY: Record<string, string> = {
  "01": "Bourg-en-Bresse", "02": "Laon", "03": "Moulins", "04": "Digne-les-Bains",
  "05": "Gap", "06": "Nice", "07": "Privas", "08": "Charleville-Mézières",
  "09": "Foix", "10": "Troyes", "11": "Carcassonne", "12": "Rodez",
  "13": "Marseille", "14": "Caen", "15": "Aurillac", "16": "Angoulême",
  "17": "La Rochelle", "18": "Bourges", "19": "Tulle", "20": "Ajaccio",
  "2A": "Ajaccio", "2B": "Bastia",
  "21": "Dijon", "22": "Saint-Brieuc", "23": "Guéret", "24": "Périgueux",
  "25": "Besançon", "26": "Valence", "27": "Évreux", "28": "Chartres",
  "29": "Quimper", "30": "Nîmes", "31": "Toulouse", "32": "Auch",
  "33": "Bordeaux", "34": "Montpellier", "35": "Rennes", "36": "Châteauroux",
  "37": "Tours", "38": "Grenoble", "39": "Lons-le-Saunier", "40": "Mont-de-Marsan",
  "41": "Blois", "42": "Saint-Étienne", "43": "Le Puy-en-Velay", "44": "Nantes",
  "45": "Orléans", "46": "Cahors", "47": "Agen", "48": "Mende",
  "49": "Angers", "50": "Saint-Lô", "51": "Châlons-en-Champagne", "52": "Chaumont",
  "53": "Laval", "54": "Nancy", "55": "Bar-le-Duc", "56": "Vannes",
  "57": "Metz", "58": "Nevers", "59": "Lille", "60": "Beauvais",
  "61": "Alençon", "62": "Arras", "63": "Clermont-Ferrand", "64": "Pau",
  "65": "Tarbes", "66": "Perpignan", "67": "Strasbourg", "68": "Colmar",
  "69": "Lyon", "70": "Vesoul", "71": "Mâcon", "72": "Le Mans",
  "73": "Chambéry", "74": "Annecy", "75": "Paris",
  "76": "Rouen", "77": "Melun", "78": "Versailles",
  "79": "Niort", "80": "Amiens", "81": "Albi", "82": "Montauban",
  "83": "Toulon", "84": "Avignon", "85": "La Roche-sur-Yon", "86": "Poitiers",
  "87": "Limoges", "88": "Épinal", "89": "Auxerre", "90": "Belfort",
  "91": "Évry", "92": "Nanterre", "93": "Bobigny", "94": "Créteil", "95": "Cergy",
};

// Specific Paris postal codes to arrondissements
const PARIS_ARRONDISSEMENTS: Record<string, string> = {
  "75001": "Paris 1er", "75002": "Paris 2e", "75003": "Paris 3e", "75004": "Paris 4e",
  "75005": "Paris 5e", "75006": "Paris 6e", "75007": "Paris 7e", "75008": "Paris 8e",
  "75009": "Paris 9e", "75010": "Paris 10e", "75011": "Paris 11e", "75012": "Paris 12e",
  "75013": "Paris 13e", "75014": "Paris 14e", "75015": "Paris 15e", "75016": "Paris 16e",
  "75017": "Paris 17e", "75018": "Paris 18e", "75019": "Paris 19e", "75020": "Paris 20e",
};

export interface LocationInfo {
  postalCode: string;
  cityName: string;
  regionName: string;
  isIDF: boolean;
}

export function lookupPostalCode(postalCode: string): LocationInfo | null {
  if (!/^\d{5}$/.test(postalCode)) return null;

  const prefix = postalCode.substring(0, 2);
  const regionInfo = DEPARTMENT_TO_REGION[prefix];
  if (!regionInfo) return null;

  // Special handling for Paris arrondissements
  const cityName = prefix === "75"
    ? (PARIS_ARRONDISSEMENTS[postalCode] || "Paris")
    : (DEPARTMENT_TO_CITY[prefix] || "Commune");

  return {
    postalCode,
    cityName,
    regionName: regionInfo.region,
    isIDF: regionInfo.isIDF,
  };
}

// Persist location to localStorage
const LOCATION_KEY = "kalimera_location";

export function saveLocation(info: LocationInfo) {
  localStorage.setItem(LOCATION_KEY, JSON.stringify(info));
}

export function getStoredLocation(): LocationInfo | null {
  try {
    const stored = localStorage.getItem(LOCATION_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function clearStoredLocation() {
  localStorage.removeItem(LOCATION_KEY);
}
