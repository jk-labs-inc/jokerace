import { Button, Col, Divider, Row } from "antd";
import React, { useCallback, useEffect, useState } from "react";

import { tryToDisplay } from "./utils";
import ProposalDisplayVariable from "./ProposalDisplayVariable";

const AllProposalIdsDisplayVariable = ({ 
            getProposalInfoContractFunction, getProposalInfoFunctionInfo, 
            getAllProposalIdsContractFunction, getAllProposalIdsFunctionInfo, refreshRequired, 
            triggerRefresh, blockExplorer }) => {
  const [allProposals, setAllProposals] = useState([]);

  const refresh = useCallback(async () => {
    try {
      const funcResponse = await getAllProposalIdsContractFunction();
      setAllProposals(funcResponse);
      triggerRefresh(false);
    } catch (e) {
      console.log(e);
    }
  }, [setAllProposals, getAllProposalIdsContractFunction, triggerRefresh]);

  useEffect(() => {
    refresh();
  }, [refresh, refreshRequired, getAllProposalIdsContractFunction]);

  return allProposals.map(proposalId => 
    <ProposalDisplayVariable 
      proposalId={proposalId}
      getProposalInfoContractFunction={getProposalInfoContractFunction}
      getProposalInfoFunctionInfo={getProposalInfoFunctionInfo}
      refreshRequired={refreshRequired}
      triggerRefresh={triggerRefresh}
      blockExplorer={blockExplorer}
    />
  );
};

export default AllProposalIdsDisplayVariable;
