import { Button, Col, Divider, Row } from "antd";
import React, { useCallback, useEffect, useState } from "react";

import { tryToDisplay } from "./utils";
import ProposalDisplayVariable from "./ProposalDisplayVariable";

const AllProposalIdsDisplayVariable = ({ 
            getAllProposalIdsContractFunction, getAllProposalIdsFunctionInfo, 
            getProposalContractFunction, getProposalFunctionInfo, 
            proposalVotesContractFunction, proposalVotesFunctionInfo,
            refreshRequired, triggerRefresh, blockExplorer }) => {
  const [allProposalIds, setAllProposalIds] = useState([]);

  const refresh = useCallback(async () => {
    try {
      const funcResponse = await getAllProposalIdsContractFunction();
      setAllProposalIds(funcResponse);
      triggerRefresh(false);
    } catch (e) {
      console.log(e);
    }
  }, [setAllProposalIds, getAllProposalIdsContractFunction, triggerRefresh]);

  useEffect(() => {
    refresh();
  }, [refresh, refreshRequired, getAllProposalIdsContractFunction]);

  return allProposalIds.map(proposalId => 
    <ProposalDisplayVariable 
      proposalId={proposalId}
      getProposalContractFunction={getProposalContractFunction}
      getProposalFunctionInfo={getProposalFunctionInfo}
      proposalVotesContractFunction={proposalVotesContractFunction}
      proposalVotesFunctionInfo={proposalVotesFunctionInfo}
      refreshRequired={refreshRequired}
      triggerRefresh={triggerRefresh}
      blockExplorer={blockExplorer}
    />
  );
};

export default AllProposalIdsDisplayVariable;
