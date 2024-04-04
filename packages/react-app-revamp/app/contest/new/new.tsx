"use client";
import CreateFlow from "@components/_pages/Create";
import { ContractFactoryWrapper } from "@hooks/useContractFactory";
import { RewardsWrapper } from "@hooks/useRewards/store";

const NewContest = () => {
  return (
    <ContractFactoryWrapper>
      <RewardsWrapper>
        <CreateFlow />
      </RewardsWrapper>
    </ContractFactoryWrapper>
  );
};

export default NewContest;
