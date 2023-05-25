import React from "react";
import { useRouter } from "next/router";
import LandingHeader from "./LandingHeader";
import MainHeader from "./MainHeader";
import CreateFlowHeader from "./CreateFlowHeader";
import { DeployContestWrapper } from "@hooks/useDeployContest/store";

const Header: React.FC = () => {
  const router = useRouter();
  const pathname = router.pathname;

  if (pathname === "/") {
    return <LandingHeader />;
  }

  if (pathname.includes("/new")) {
    return (
      <DeployContestWrapper>
        <CreateFlowHeader />
      </DeployContestWrapper>
    );
  }

  return <MainHeader />;
};

export default Header;
