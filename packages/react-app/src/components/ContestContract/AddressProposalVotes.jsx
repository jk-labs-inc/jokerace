import { Collapse } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import Address from "../Address";

import { tryToDisplay } from "./utils";

const { Panel } = Collapse;

const AddressProposalVotes = ({ userAddress, proposalId, proposalAddressVotesContractFunction, proposalAddressVotesFunctionInfo,
   refreshRequired, triggerRefresh, blockExplorer, mainnetProvider }) => {
  const [variable, setVariable] = useState("");

  const refresh = useCallback(async () => {
    try {
      const funcResponse = await proposalAddressVotesContractFunction(proposalId, userAddress);
      setVariable(funcResponse);
      triggerRefresh(false);
    } catch (e) {
      console.log(e);
    }
  }, [setVariable, proposalAddressVotesContractFunction, triggerRefresh]);

  useEffect(() => {
    refresh();
  }, [refresh, refreshRequired, proposalAddressVotesContractFunction]);

  return (
    <div>
      <p><Address address={userAddress} ensProvider={mainnetProvider} fontSize={16} blockExplorer={blockExplorer} />: {tryToDisplay(variable/1e18, false, blockExplorer)}</p>
    </div>
  );
};

export default AddressProposalVotes;
