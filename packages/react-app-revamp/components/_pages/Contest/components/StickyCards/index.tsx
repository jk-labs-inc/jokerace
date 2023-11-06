import React, { useState, useEffect } from "react";
import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";
import ContestCountdown from "./components/Countdown";
import VotingContestQualifier from "./components/VotingQualifier";
import useContestEvents from "@hooks/useContestEvents";

const ContestStickyCards = () => {
  const contestStatus = useContestStatusStore(state => state.contestStatus);
  const { displayReloadBanner } = useContestEvents();

  if (contestStatus === ContestStatus.VotingClosed) return null;

  return (
    <div
      className={`flex flex-col bg-true-black sticky ${displayReloadBanner ? "top-[105px]" : "-top-[1px]"} z-10 mt-12`}
    >
      <div className="flex gap-4 py-4">
        <ContestCountdown />
        <VotingContestQualifier />
      </div>
      <hr className="border-primary-2 border" />
    </div>
  );
};

export default ContestStickyCards;
