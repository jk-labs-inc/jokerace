import { Button, Col, Divider, Row } from "antd";
import React, { useCallback, useEffect, useState } from "react";

import { tryToDisplay } from "./utils";
import AddressProposalVotes from "./AddressProposalVotes";
import VotingFunctionForm from "./VotingFunctionForm";

const UserVotesAndUsedDisplayVariable = ({ 
            proposalId, proposalTotalVotes,
            getProposalContractFunction, getProposalFunctionInfo, 
            addressesVotedContractFunction, addressesVotedFunctionInfo,
            proposalAddressVotesContractFunction, proposalAddressVotesFunctionInfo,
            castVoteContractFunction, castVoteFunctionInfo,
            refreshRequired, triggerRefresh, blockExplorer, provider, mainnetProvider, gasPrice }) => {
  const [proposalContent, setProposalContent] = useState([]);
  const [addressesVoted, setAddressesVoted] = useState([]);
  const [showIndividualVotes, setShowIndividualVotes] = useState(false);

  const toggleIndividualVotes = () => {
    setShowIndividualVotes(!showIndividualVotes)
  }

  const formatProposalString = (inputString) => {
    let retString = ""
    if (inputString) {
      retString = inputString.replace(/['"]+/g, '')
    }
    return retString;
  }

  const refresh = useCallback(async () => {
    try {
      const getProposalResponse = await getProposalContractFunction(proposalId);
      const addressesVotedResponse = await addressesVotedContractFunction(proposalId);
      setProposalContent(getProposalResponse);
      setAddressesVoted(addressesVotedResponse)
      triggerRefresh(false);
    } catch (e) {
      console.log(e);
    }
  }, [setProposalContent, getProposalContractFunction,
         addressesVotedContractFunction, triggerRefresh]);

  useEffect(() => {
    refresh();
  }, [refresh, refreshRequired, getProposalContractFunction, addressesVotedContractFunction]);

  return (
    <div>
      <Row>
        <Col span={14}>
          {/* It is second (proposalContent[1]) in the array because that's what the struct is for a Proposal: id, content, author */}
          <h2>{formatProposalString(tryToDisplay(proposalContent[1], false, blockExplorer))}</h2>
          <h2>Total Votes: {tryToDisplay(proposalTotalVotes/1e18, false, blockExplorer)}</h2>
          <Button onClick={toggleIndividualVotes}>Toggle Individual Address Votes</Button>
          {showIndividualVotes ? addressesVoted.map(userAddress => <AddressProposalVotes 
            proposalId={proposalId}
            userAddress={userAddress}
            proposalAddressVotesContractFunction={proposalAddressVotesContractFunction}
            proposalAddressVotesFunctionInfo={proposalAddressVotesFunctionInfo}
            refreshRequired={refreshRequired}
            triggerRefresh={triggerRefresh}
            blockExplorer={blockExplorer}
            mainnetProvider={mainnetProvider}/>) :
            ""}
        </Col>
        <Col
          span={8}
          style={{
            textAlign: "left",
            paddingRight: 6,
            fontSize: 24,
          }}
        >
          <VotingFunctionForm 
            proposalId={proposalId}
            castVoteContractFunction={castVoteContractFunction}
            castVoteFunctionInfo={castVoteFunctionInfo}
            provider={provider}
            gasPrice={gasPrice}
            triggerRefresh={triggerRefresh}
          />
        </Col>
        <Col span={2}>
          <h2>
            <Button type="link" onClick={refresh} icon="🔄" />
          </h2>
        </Col>
      </Row>
      <Divider />
    </div>
  );
};

export default UserVotesAndUsedDisplayVariable;
