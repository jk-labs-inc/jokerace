import { Button, Col, Divider, Row } from "antd";
import React, { useCallback, useEffect, useState } from "react";

import { tryToDisplay } from "./utils";
import ProposalDisplayVariable from "./ProposalDisplayVariable";

const AllProposalIdsDisplayVariable = ({ 
            getAllProposalIdsContractFunction, getAllProposalIdsFunctionInfo, 
            getProposalContractFunction, getProposalFunctionInfo, 
            proposalVotesContractFunction, proposalVotesFunctionInfo,
            addressesVotedContractFunction, addressesVotedFunctionInfo,
            proposalAddressVotesContractFunction, proposalAddressVotesFunctionInfo,
            refreshRequired, triggerRefresh, blockExplorer, provider }) => {
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
      addressesVotedContractFunction={addressesVotedContractFunction}
      addressesVotedFunctionInfo={addressesVotedFunctionInfo}
      proposalAddressVotesContractFunction={proposalAddressVotesContractFunction}
      proposalAddressVotesFunctionInfo={proposalAddressVotesFunctionInfo}
      refreshRequired={refreshRequired}
      triggerRefresh={triggerRefresh}
      blockExplorer={blockExplorer}
      provider={provider}
    />
  );
};

export default AllProposalIdsDisplayVariable;
