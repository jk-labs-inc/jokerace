import { Divider, Statistic } from "antd";
import React, { useCallback, useEffect, useState } from "react";

const { Countdown } = Statistic;

const UserVotesAndUsedDisplayVariable = ({ 
            userAddress,
            contestStateContractFunction,
            getVotesContractFunction,
            contestAddressTotalVotesCastContractFunction, 
            constestSnapshotContractFunction, 
            proposalThresholdContractFunction,
            voteStartContractFunction,
            contestDeadlineContractFunction,
            refreshRequired, triggerRefresh, provider }) => {
  const [contestState, setContestState] = useState("");
  const [contestSnapshot, setContestSnapshot] = useState("");
  const [proposalThreshold, setProposalThreshold] = useState("");
  const [totalVotes, setTotalVotes] = useState("");
  const [totalVotesCast, setTotalVotesCast] = useState("");
  const [voteStart, setVoteStart] = useState("");
  const [contestDeadline, setContestDeadline] = useState("");

  function formatContestState(stateInt) {
    if (stateInt == "0") {
      return "Active (voting is open)";
    }
    if (stateInt == "1") {
      return "Canceled";
    }
    if (stateInt == "2") {
      return "Queued (proposal submissions are open)";
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
      const voteStartResponse = await voteStartContractFunction();
      const contestDeadlineResponse = await contestDeadlineContractFunction();
      setContestState(contestStateResponse.toString());
      setContestSnapshot(contestSnapshotResponse.toString());
      setProposalThreshold(proposalThresholdResponse.toString());
      setTotalVotesCast(totalVotesCastResponse.toString());
      setVoteStart(voteStartResponse.toString());
      setContestDeadline(contestDeadlineResponse.toString());

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
    ((Date.now()) >= (parseInt(voteStart) * 1000)) ?
      (<div>
        <div>You have {totalVotes/1e18} votes as of the snapshot at block {contestSnapshot}.</div>
        <div>You have cast {totalVotesCast/1e18} of them so far.</div>
        <div>You have {totalVotes/1e18 - totalVotesCast/1e18} votes left.</div>
        <Divider />
        <div>Contest State: {formatContestState(contestState)}</div>
        <div>Vote Start: {new Date(parseInt(voteStart) * 1000).toUTCString()} <Countdown value={new Date(parseInt(voteStart) * 1000)} valueStyle={{fontSize:12}}></Countdown></div>
        <div>Vote End: {new Date(parseInt(contestDeadline) * 1000).toUTCString()} <Countdown value={new Date(parseInt(contestDeadline) * 1000)} valueStyle={{fontSize:12}}></Countdown></div>
        <Divider />
      </div>)
    : 
      (<div>
        <div>You currently have {totalVotes/1e18} votes delegated to you.</div>
        <div>The snapshot block is {contestSnapshot}.</div>
        <div>The proposal threshold for this contest (how many votes one must have to create a proposal) is {proposalThreshold/1e18}.</div>
        <Divider />
        <div>Contest State: {formatContestState(contestState)}</div>
        <div>Vote Start: {new Date(parseInt(voteStart) * 1000).toUTCString()} <Countdown value={new Date(parseInt(voteStart) * 1000)} valueStyle={{fontSize:12}}></Countdown></div>
        <div>Vote End: {new Date(parseInt(contestDeadline) * 1000).toUTCString()} <Countdown value={new Date(parseInt(contestDeadline) * 1000)} valueStyle={{fontSize:12}}></Countdown></div>
        <Divider />
      </div>)
  );
};

export default UserVotesAndUsedDisplayVariable;
