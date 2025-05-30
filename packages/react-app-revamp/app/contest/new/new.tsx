"use client";
import CreateFlow from "@components/_pages/Create";
import { ContractFactoryWrapper } from "@hooks/useContractFactory";

const NewContest = () => {
  return (
    <ContractFactoryWrapper>
      <CreateFlow />
    </ContractFactoryWrapper>
  );
};

export default NewContest;
