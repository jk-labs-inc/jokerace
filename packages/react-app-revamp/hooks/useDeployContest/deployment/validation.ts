export const validateDeploymentPrerequisites = (
  address: string | undefined,
  chain: { id: number; name?: string } | undefined,
) => {
  if (!address || !chain) {
    throw new Error("Failed to prepare for deployment");
  }
  return { address: address as `0x${string}`, chain };
};
