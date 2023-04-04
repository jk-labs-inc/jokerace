// src/components/Header.tsx
import React from "react";
import { useRouter } from "next/router";
import LandingHeader from "./LandingHeader";
import MainHeader from "./MainHeader";

const Header: React.FC = () => {
  const router = useRouter();
  const pathname = router.pathname;

  if (pathname === "/") {
    return <LandingHeader />;
  }

  if (pathname === "/create") {
    return (
      <header>
        <h1>About Page Header</h1>
      </header>
    );
  }

  return <MainHeader />;
};

export default Header;
