export async function toggleContestVisibility(
  contestAddress: string,
  networkName: string,
  userAddress: string,
  isHidden: boolean,
): Promise<void> {
  try {
    const response = await fetch("/api/contest/toggle-contest-visibility", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contestAddress,
        networkName,
        userAddress,
        isHidden,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to toggle contest visibility");
    }
  } catch (error) {
    console.error("Error toggling contest visibility:", error);
    throw error;
  }
}
