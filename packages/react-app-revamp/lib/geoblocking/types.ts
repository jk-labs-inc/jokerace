// country code type using ISO 3166-1 alpha-2 standard
export type CountryCode = string;

// feature identifiers that can be geoblocked
export type FeatureId = "proposals_voting";

export interface GeoblockingRule {
  featureId: FeatureId;
  blockedCountries: CountryCode[];
  isActive: boolean;
}

export interface UserLocation {
  countryCode: CountryCode;
  country: string;
}

export interface GeoblockingResult {
  isAllowed: boolean;
  reason?: string;
  userLocation?: UserLocation;
  appliedRule?: GeoblockingRule;
}
