import { Collapse } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import Address from "../Address";

import { tryToDisplay } from "./utils";

const { Panel } = Collapse;

const AddressProposalVotes = ({ userAddress, proposalId, proposalAddressVotesContractFunction, proposalAddressVotesFunctionInfo,
   refreshRequired, triggerRefresh, blockExplorer, provider }) => {
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
      <Collapse>
        <Panel header={<Address address={userAddress} ensProvider={provider} blockExplorer={blockExplorer} />} key="1">
          <p>{tryToDisplay(variable, false, blockExplorer)}</p>
        </Panel>
      </Collapse>
    </div>
  );
};

export default AddressProposalVotes;
