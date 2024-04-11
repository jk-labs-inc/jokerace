import { useQuery } from "@tanstack/react-query";
import { fetchBelloRedirectUrl } from "lib/extensions";

export const useBelloRedirectUrl = (contractAddress: string, chain: string) => {
  const { data, error, isLoading, isError } = useQuery({
    queryKey: ["belloRedirectUrl", contractAddress, chain],
    queryFn: () => fetchBelloRedirectUrl(contractAddress, chain),
  });

  return {
    redirectUrl: data?.redirectUrl,
    isLoading,
    isError,
    error,
  };
};
