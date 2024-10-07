export const canUploadLargeAllowlist = async (userAddress: string, requiredSize: number) => {
  try {
    const response = await fetch(
      `/api/contest/check-allowlist-permission?userAddress=${userAddress}&requiredSize=${requiredSize}`,
      { cache: "no-store" },
    );

    if (!response.ok) {
      throw new Error("Failed to check allowlist permission");
    }

    const { canUpload } = await response.json();
    return canUpload;
  } catch (error) {
    console.error("Error checking allowlist permission:", error);
    return false;
  }
};
