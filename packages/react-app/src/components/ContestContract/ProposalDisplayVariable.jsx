import { Button, Col, Divider, Row } from "antd";
import React, { useCallback, useEffect, useState } from "react";

import { tryToDisplay } from "./utils";

const ProposalDisplayVariable = ({ 
            proposalId, 
            getProposalContractFunction, getProposalFunctionInfo, 
            proposalVotesContractFunction, proposalVotesFunctionInfo,
            refreshRequired, triggerRefresh, blockExplorer }) => {
  const [proposalContent, setProposalContent] = useState([]);
  const [proposalTotalVotes, setProposalTotalVotes] = useState([]);

  const refresh = useCallback(async () => {
    try {
      const getProposalResponse = await getProposalContractFunction(proposalId);
      const proposalTotalVotesResponse = await proposalVotesContractFunction(proposalId);
      setProposalContent(getProposalResponse);
      setProposalTotalVotes(proposalTotalVotesResponse);
      triggerRefresh(false);
    } catch (e) {
      console.log(e);
    }
  }, [setProposalContent, setProposalTotalVotes, getProposalContractFunction, proposalVotesContractFunction, triggerRefresh]);

  useEffect(() => {
    refresh();
  }, [refresh, refreshRequired, getProposalContractFunction, proposalVotesContractFunction]);

  return (
    <div>
      <Row>
        <Col
          span={8}
          style={{
            textAlign: "right",
            opacity: 0.333,
            paddingRight: 6,
            fontSize: 24,
          }}
        >
          {getProposalFunctionInfo[1].name}
        </Col>
        <Col span={14}>
          {/* It is second (proposalContent[1]) in the array because that's what the struct is for a Proposal: id, content, author */}
          <h2>{tryToDisplay(proposalContent[1], false, blockExplorer)}</h2>
          <h2>{tryToDisplay(proposalTotalVotes, false, blockExplorer)}</h2>
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

export default ProposalDisplayVariable;
