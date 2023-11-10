import { useRouter } from "next/router";
import React from "react";
import CreateFlowHeader from "./CreateFlowHeader";
import LandingHeader from "./LandingHeader";
import MainHeader from "./MainHeader";

const Header: React.FC = () => {
  const router = useRouter();
  const pathname = router.pathname;

  if (pathname === "/") {
    return <LandingHeader />;
  }

  if (pathname.includes("/new")) {
    return <CreateFlowHeader />;
  }

  return <MainHeader showProfile={!pathname.includes("submission")} />;
};

export default Header;
