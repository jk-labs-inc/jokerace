import { FeatureId } from "./types";

export const IP_API_URL = "https://pro.ip-api.com/json";

export const IP_API_KEY = process.env.NEXT_PUBLIC_IP_API_KEY;

export const FEATURE_BLOCKING_CONFIG: Record<FeatureId, string[]> = {
  proposals_voting: ["US"],
};

export function getBlockedCountriesForFeature(featureId: FeatureId): string[] {
  return FEATURE_BLOCKING_CONFIG[featureId] || [];
}

export function isCountryBlockedForFeature(countryCode: string, featureId: FeatureId): boolean {
  const blockedCountries = getBlockedCountriesForFeature(featureId);
  return blockedCountries.includes(countryCode);
}
