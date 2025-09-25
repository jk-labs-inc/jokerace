import SubmissionPageDesktopLayout from "@components/_pages/Submission/Desktop";
import useContestConfigStore from "@hooks/useContestConfig/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const SubmissionPage = () => {
  const { contestConfig } = useContestConfigStore(state => state);
  const router = useRouter();

  useEffect(() => {
    // prefetch close route
    const contestRoute = `/contest/${contestConfig.chainName}/${contestConfig.address}`;
    router.prefetch(contestRoute);
  }, [contestConfig.chainName, contestConfig.address, router]);

  // if (isMobile) {
  //   return <SubmissionPageMobileLayout {...layoutProps} />;
  // }

  return <SubmissionPageDesktopLayout />;
};

export default SubmissionPage;
