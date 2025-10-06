import SubmissionPageDesktopLayout from "@components/_pages/Submission/Desktop";
import useContestConfigStore from "@hooks/useContestConfig/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import SubmissionPageMobileLayout from "./Mobile";

const SubmissionPage = () => {
  const { contestConfig } = useContestConfigStore(state => state);
  const isMobile = useMediaQuery({ maxWidth: "968px" });
  const router = useRouter();

  useEffect(() => {
    // prefetch close route
    const contestRoute = `/contest/${contestConfig.chainName}/${contestConfig.address}`;
    router.prefetch(contestRoute);
  }, [contestConfig.chainName, contestConfig.address, router]);

  if (isMobile) {
    return <SubmissionPageMobileLayout />;
  }

  return <SubmissionPageDesktopLayout />;
};

export default SubmissionPage;
