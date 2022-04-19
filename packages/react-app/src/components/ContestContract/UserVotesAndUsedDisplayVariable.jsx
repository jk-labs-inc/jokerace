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
      const contestStateResponse = await contestStateContractFunction();
      setContestState(contestStateResponse.toString());
      const contestSnapshotResponse = await constestSnapshotContractFunction();
      setContestSnapshot(contestSnapshotResponse.toString());
      const proposalThresholdResponse = await proposalThresholdContractFunction();
      setProposalThreshold(proposalThresholdResponse.toString());
      const totalVotesCastResponse = await contestAddressTotalVotesCastContractFunction(userAddress);
      setTotalVotesCast(totalVotesCastResponse.toString());
      const voteStartResponse = await voteStartContractFunction();
      setVoteStart(voteStartResponse.toString());
      const contestDeadlineResponse = await contestDeadlineContractFunction();
      setContestDeadline(contestDeadlineResponse.toString());

      const delayedCurrentTimestamp = Date.now() - 30; // Delay by 30 seconds to make sure we're looking at a block that has been mined
      const timestampToCheck = (delayedCurrentTimestamp >= contestSnapshotResponse) ? contestSnapshotResponse : delayedCurrentTimestamp;
      const getVotesResponse = await getVotesContractFunction(userAddress, timestampToCheck);
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
        <div>You have {totalVotes/1e18} votes as of the snapshot at {new Date(parseInt(contestSnapshot) * 1000).toUTCString()}.</div>
        <div>You have cast {totalVotesCast/1e18} of them so far.</div>
        <div>You have {totalVotes/1e18 - totalVotesCast/1e18} votes left.</div>
        <Divider />
        <div>Contest State: {formatContestState(contestState)}</div>
        <div>Vote Start: {new Date(parseInt(voteStart) * 1000).toUTCString()} <Countdown value={new Date(parseInt(voteStart) * 1000)} valueStyle={{fontSize:12}}></Countdown></div>
        <div>Vote End: {new Date(parseInt(contestDeadline) * 1000).toUTCString()} <Countdown value={new Date(parseInt(contestDeadline) * 1000)} valueStyle={{fontSize:12}}></Countdown></div>
      </div>)
    : 
      (<div>
        <div>You currently have {totalVotes/1e18} votes delegated to you.</div>
        <div>The snapshot time is {new Date(parseInt(contestSnapshot) * 1000).toUTCString()}.</div>
        <div>The proposal threshold for this contest (how many votes one must have to create a proposal) is {proposalThreshold/1e18}.</div>
        <Divider />
        <div>Contest State: {formatContestState(contestState)}</div>
        <div>Vote Start: {new Date(parseInt(voteStart) * 1000).toUTCString()} <Countdown value={new Date(parseInt(voteStart) * 1000)} valueStyle={{fontSize:12}}></Countdown></div>
        <div>Vote End: {new Date(parseInt(contestDeadline) * 1000).toUTCString()} <Countdown value={new Date(parseInt(contestDeadline) * 1000)} valueStyle={{fontSize:12}}></Countdown></div>
      </div>)
  );
};

export default UserVotesAndUsedDisplayVariable;
