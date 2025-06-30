import { Charge, VoteType } from "@hooks/useDeployContest/types";
import React from "react";
import ChargeInfoContainer from "./components/Container";
import ChargeInfoFlat from "./components/Curve/Flat";
import { useContestStore } from "@hooks/useContest/store";
import { useShallow } from "zustand/shallow";
import { compareVersions } from "compare-versions";
import ChargeInfoCurve from "./components/Curve";

interface ChargeInfoProps {
  charge: Charge;
}

const ChargeInfo: React.FC<ChargeInfoProps> = ({ charge }) => {
  const version = useContestStore(useShallow(state => state.version));
  const chargeLabel = charge.voteType === VoteType.PerVote ? "charge per vote" : "charge to vote";

  if (charge.type.costToPropose === 0 && charge.type.costToVote === 0) {
    return (
      <ChargeInfoContainer>
        <p>charge to vote:</p>
        <p>gas fees only</p>
      </ChargeInfoContainer>
    );
  }

  if (compareVersions(version, "5.7") < 0) {
    return (
      <ChargeInfoContainer
        className={charge.voteType === VoteType.PerTransaction ? "text-neutral-11" : "text-neutral-9"}
      >
        <p>{chargeLabel}:</p>
        <ChargeInfoFlat />
      </ChargeInfoContainer>
    );
  }

  return (
    <ChargeInfoContainer className={charge.voteType === VoteType.PerTransaction ? "text-neutral-11" : "text-neutral-9"}>
      <p>{chargeLabel}:</p>
      <ChargeInfoCurve />
    </ChargeInfoContainer>
  );
};

export default ChargeInfo;
