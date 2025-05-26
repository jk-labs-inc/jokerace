import { IP_API_URL, IP_API_KEY } from "./config";
import { UserLocation } from "./types";

const fetchLocationFromAPI = async (): Promise<UserLocation> => {
  try {
    const urlWithKey = `${IP_API_URL}?key=${IP_API_KEY}`;

    const response = await fetch(urlWithKey, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      countryCode: data.countryCode || "UNKNOWN",
      country: data.country || "Unknown",
    };
  } catch (error) {
    console.warn("geolocation API failed:", error);

    return {
      countryCode: "UNKNOWN",
      country: "Unknown",
    };
  }
};

export const getUserLocation = async (): Promise<UserLocation> => {
  try {
    const location = await fetchLocationFromAPI();
    return location;
  } catch (error) {
    console.error("failed to get user location:", error);

    const defaultLocation: UserLocation = {
      countryCode: "UNKNOWN",
      country: "Unknown",
    };

    return defaultLocation;
  }
};

export const isLocationDetectionAvailable = (): boolean => {
  return typeof window !== "undefined" && typeof fetch !== "undefined";
};
