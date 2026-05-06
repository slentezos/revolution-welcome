import type { NavigateFunction } from "react-router-dom";
import { lookupPostalCode, saveLocation, type LocationInfo } from "@/data/frenchPostalCodes";
import { PINPOINT_MAPPING } from "@/data/locationData";

/**
 * Centralized location transition handler.
 * Single source of truth for persisting location to localStorage and
 * routing into the inscription tunnel (or waitlist) without any
 * truncation or stale fallback risk.
 */
export function handleLocationTransition(
  postalCode: string,
  navigate: NavigateFunction,
  precomputedInfo?: LocationInfo | null
): boolean {
  const cleaned = String(postalCode).replace(/\D/g, "").slice(0, 5);
  if (cleaned.length !== 5) return false;

  const info = precomputedInfo ?? lookupPostalCode(cleaned);
  if (!info) return false;

  const preciseCity = PINPOINT_MAPPING[cleaned] || info.cityName;

  // Persist enriched location info
  saveLocation(info);
  localStorage.setItem("user_postal_code", cleaned);
  localStorage.setItem("user_city_name", preciseCity);

  if (info.isIDF) {
    navigate("/inscription");
  } else {
    navigate(
      `/liste-attente?dept=${cleaned.slice(0, 2)}&city=${encodeURIComponent(preciseCity)}`
    );
  }
  return true;
}
