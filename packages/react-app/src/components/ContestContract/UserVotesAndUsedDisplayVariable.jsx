import { Divider } from "antd";
import React, { useCallback, useEffect, useState } from "react";

const UserVotesAndUsedDisplayVariable = ({ 
            userAddress,
            contestStateContractFunction,
            getVotesContractFunction,
            contestAddressTotalVotesCastContractFunction, 
            constestSnapshotContractFunction, 
            proposalThresholdContractFunction,
            refreshRequired, triggerRefresh, provider }) => {
  const [contestState, setContestState] = useState("");
  const [contestSnapshot, setContestSnapshot] = useState("");
  const [proposalThreshold, setProposalThreshold] = useState("");
  const [totalVotes, setTotalVotes] = useState("");
  const [totalVotesCast, setTotalVotesCast] = useState("");

  function formatContestState(stateInt) {
    if (stateInt == "0") {
      return "Active";
    }
    if (stateInt == "1") {
      return "Canceled";
    }
    if (stateInt == "2") {
      return "Queued";
    }
    if (stateInt == "3") {
      return "Completed";
    }
    return stateInt;
  }

  const refresh = useCallback(async () => {
    try {
      const currentBlock = provider._lastBlockNumber - 10; // Subtract 10 to make sure that the provider isn't too far ahead of RPC/we get a "block not yet mined" error
      const contestStateResponse = await contestStateContractFunction();
      const contestSnapshotResponse = await constestSnapshotContractFunction();
      const proposalThresholdResponse = await proposalThresholdContractFunction();
      const totalVotesCastResponse = await contestAddressTotalVotesCastContractFunction(userAddress);
      setContestState(contestStateResponse.toString());
      setContestSnapshot(contestSnapshotResponse.toString());
      setProposalThreshold(proposalThresholdResponse.toString());
      setTotalVotesCast(totalVotesCastResponse.toString())

      const blockToCheck = (currentBlock >= contestSnapshotResponse) ? contestSnapshotResponse : currentBlock;
      const getVotesResponse = await getVotesContractFunction(userAddress, blockToCheck);
      setTotalVotes(getVotesResponse.toString());
      triggerRefresh(false);
    } catch (e) {
      console.log(e);
    }
  }, [setContestState, setContestSnapshot, setProposalThreshold, setTotalVotes, setTotalVotesCast, 
    contestStateContractFunction, constestSnapshotContractFunction, proposalThresholdContractFunction, 
      getVotesContractFunction, contestAddressTotalVotesCastContractFunction, triggerRefresh]);

  useEffect(() => {
    refresh();
  }, [refresh, refreshRequired, contestStateContractFunction, constestSnapshotContractFunction, 
      proposalThresholdContractFunction, getVotesContractFunction, 
      contestAddressTotalVotesCastContractFunction]);

  return (
    (provider._lastBlockNumber >= parseInt(contestSnapshot) - 10) ?
      (<div>
        You have {totalVotes/1e18} votes as of the snapshot at block {contestSnapshot}.
        You have cast {totalVotesCast/1e18} of them so far.

        <div>Contest State: {formatContestState(contestState)}</div>
        <Divider />
      </div>)
    : 
      (<div>
        You currently have {totalVotes/1e18} votes delegated to you. The snapshot block is at {contestSnapshot}.
        The proposal threshold for this contest (how many votes one must have to create a proposal) is {proposalThreshold/1e18}.

        <div>Contest State: {formatContestState(contestState)}</div>
        <Divider />
      </div>)
  );
};

export default UserVotesAndUsedDisplayVariable;
