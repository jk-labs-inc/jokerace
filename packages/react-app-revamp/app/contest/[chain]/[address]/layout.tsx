"use client";
import LayoutViewContest from "@layouts/LayoutViewContest";
import React from "react";

const ContestLayout = ({ children }: { children: React.ReactNode }) => {
  return <LayoutViewContest>{children}</LayoutViewContest>;
};

export default ContestLayout;
