export interface ExtensionSupabase {
  name: string;
}

interface BelloResponse {
  redirectUrl: string;
}

const BELLO_API_URL = "https://api.bello.lol/v2/jokerace/redirectUrl";

export const fetchExtensions = async (): Promise<ExtensionSupabase[]> => {
  try {
    const response = await fetch("/api/extensions", { cache: "no-store" });

    if (!response.ok) {
      throw new Error("failed to fetch extensions");
    }

    const extensions: ExtensionSupabase[] = await response.json();
    return extensions;
  } catch (error) {
    console.error("error fetching extensions:", error);
    throw error;
  }
};

export const fetchBelloRedirectUrl = async (contractAddress: string, chain: string): Promise<BelloResponse> => {
  const apiUrl = `${BELLO_API_URL}?contractAddress=${contractAddress}&chain=${chain}`;

  try {
    const response = await fetch(apiUrl, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Error fetching from Bello API: ${response.statusText}`);
    }
    const data = (await response.json()) as BelloResponse;
    return data;
  } catch (e) {
    throw new Error(`Unexpected error in fetchBelloRedirectUrl: ${e instanceof Error ? e.message : e}`);
  }
};
