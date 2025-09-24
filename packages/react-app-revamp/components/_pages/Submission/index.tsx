import SubmissionPageDesktopLayout from "@components/_pages/Submission/Desktop";
import { useRouter } from "next/navigation";
import { FC, useEffect } from "react";
import useEntryContractConfig from "./hooks/useEntryContractConfig";

interface SubmissionPageProps {
  contestInfo: {
    address: string;
    chain: string;
    chainId: number;
  };
  proposalId: string;
}

const SubmissionPage: FC<SubmissionPageProps> = ({ contestInfo, proposalId }) => {
  const router = useRouter();
  const { isLoading, isError } = useEntryContractConfig({
    address: contestInfo.address,
    chainId: contestInfo.chainId,
    proposalId: proposalId,
  });

  useEffect(() => {
    // prefetch close route
    const contestRoute = `/contest/${contestInfo.chain}/${contestInfo.address}`;
    router.prefetch(contestRoute);
  }, [contestInfo.chain, contestInfo.address, router]);

  //TODO: add loading and error states
  if (isLoading) {
    return <p>loading...</p>;
  }

  if (isError) {
    return <p>error</p>;
  }

  // if (isMobile) {
  //   return <SubmissionPageMobileLayout {...layoutProps} />;
  // }

  return <SubmissionPageDesktopLayout />;
};

export default SubmissionPage;
