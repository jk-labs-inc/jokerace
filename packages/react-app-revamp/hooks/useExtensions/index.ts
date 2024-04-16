import { useQuery } from "@tanstack/react-query";
import { fetchExtensions } from "lib/extensions";

async function fetchEnabledExtensions() {
  const extensions = await fetchExtensions();
  return extensions;
}

export function useExtensions() {
  const {
    data: enabledExtensions,
    error,
    isLoading,
    isSuccess,
    isError,
  } = useQuery({
    queryKey: ["enabledExtensions"],
    queryFn: fetchEnabledExtensions,
  });

  return {
    enabledExtensions,
    error,
    isLoading,
    isSuccess,
    isError,
  };
}
