import { getSubmitters } from "lib/buckets/submitters";
import { useCallback, useEffect, useState } from "react";

type Submitter = {
  address: string;
};

const useSubmitters = (submissionMerkleRoot: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [submitters, setSubmitters] = useState<Submitter[]>([]);

  const fetchSubmitters = useCallback(async () => {
    setIsLoading(true);
    try {
      const { submitters } = await getSubmitters(submissionMerkleRoot);
      const processedSubmitters = submitters.map(submitter => ({
        address: submitter.address,
      }));
      setSubmitters(processedSubmitters);
    } catch (e) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [submissionMerkleRoot]);

  const retry = () => {
    fetchSubmitters();
  };

  useEffect(() => {
    fetchSubmitters();
  }, [fetchSubmitters]);

  return { isLoading, isError, submitters, retry };
};

export default useSubmitters;
