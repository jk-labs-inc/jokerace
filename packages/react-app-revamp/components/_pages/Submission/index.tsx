import { useRouter } from "next/navigation";
import { FC, useEffect } from "react";
import SubmissionPageDesktopLayout from "@components/_pages/Submission/desktop";

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

  useEffect(() => {
    // prefetch close route
    const contestRoute = `/contest/${contestInfo.chain}/${contestInfo.address}`;
    router.prefetch(contestRoute);
  }, [contestInfo.chain, contestInfo.address, router]);

  // if (isMobile) {
  //   return <SubmissionPageMobileLayout {...layoutProps} />;
  // }

  return <SubmissionPageDesktopLayout contestInfo={contestInfo} proposalId={proposalId} />;
};

export default SubmissionPage;
