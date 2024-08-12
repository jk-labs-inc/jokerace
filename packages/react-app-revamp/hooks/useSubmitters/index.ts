import { useQuery } from "@tanstack/react-query";
import { getSubmitters } from "lib/buckets/submitters";

type Submitter = {
  address: string;
};

const useSubmitters = (submissionMerkleRoot: string, isV3: boolean) => {
  const fetchSubmitters = async () => {
    const { submitters } = await getSubmitters(submissionMerkleRoot);
    return submitters.map(submitter => ({
      address: submitter.address,
    }));
  };

  const {
    data: submitters,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Submitter[], Error>({
    queryKey: ["submitters", submissionMerkleRoot],
    queryFn: fetchSubmitters,
    enabled: isV3 && !!submissionMerkleRoot,
  });

  return {
    submitters: submitters ?? [],
    isLoading,
    isError,
    error,
    retry: refetch,
  };
};

export default useSubmitters;
