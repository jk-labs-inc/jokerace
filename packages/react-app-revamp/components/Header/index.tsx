import React from "react";
import { useRouter } from "next/router";
import LandingHeader from "./LandingHeader";
import MainHeader from "./MainHeader";
import CreateFlowHeader from "./CreateFlowHeader";

const Header: React.FC = () => {
  const router = useRouter();
  const pathname = router.pathname;

  if (pathname === "/") {
    return <LandingHeader />;
  }

  if (pathname.includes("/new")) {
    return <CreateFlowHeader />;
  }

  return <MainHeader />;
};

export default Header;
