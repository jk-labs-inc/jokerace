import React, { useCallback, useEffect, useState } from "react";

const UserVotesAndUsedDisplayVariable = ({ 
            userAddress,
            getVotesContractFunction,  
            contestAddressTotalVotesCastContractFunction, 
            constestSnapshotContractFunction, 
            proposalThresholdContractFunction,
            refreshRequired, triggerRefresh, provider }) => {
  const [contestSnapshot, setContestSnapshot] = useState("");
  const [proposalThreshold, setProposalThreshold] = useState("");
  const [totalVotes, setTotalVotes] = useState("");
  const [totalVotesCast, setTotalVotesCast] = useState("");

  const refresh = useCallback(async () => {
    try {
      const currentBlock = provider._lastBlockNumber - 10; // Subtract 10 to make sure that the provider isn't too far ahead of RPC/we get a "block not yet mined" error
      const contestSnapshotResponse = await constestSnapshotContractFunction();
      const proposalThresholdResponse = await proposalThresholdContractFunction();
      const totalVotesCastResponse = await contestAddressTotalVotesCastContractFunction(userAddress);
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
  }, [setContestSnapshot, setProposalThreshold, setTotalVotes, setTotalVotesCast, constestSnapshotContractFunction, proposalThresholdContractFunction, getVotesContractFunction, contestAddressTotalVotesCastContractFunction, triggerRefresh]);

  useEffect(() => {
    refresh();
  }, [refresh, refreshRequired, constestSnapshotContractFunction, proposalThresholdContractFunction, getVotesContractFunction, contestAddressTotalVotesCastContractFunction]);

  return (
    (provider._lastBlockNumber >= parseInt(contestSnapshot) - 10) ?
      (<div>
        You have {totalVotes/1e18} votes as of the snapshot at block {contestSnapshot}.
        You have cast {totalVotesCast/1e18} of those so far.
      </div>)
    : 
      (<div>
        You currently have {totalVotes/1e18} votes delegated to you. The snapshot block is at {contestSnapshot}.
        The proposal threshold for this contest (how many votes one must have to create a proposal) is {proposalThreshold/1e18}.
      </div>)
  );
};

export default UserVotesAndUsedDisplayVariable;
