import { Card, Button, Divider } from "antd";
import { useContractExistsAtAddress, useContractLoader } from "eth-hooks";
import React, { useMemo, useState } from "react";
import ProposingFunctionForm from "./ProposingFunctionForm";
import AllProposalIdsDisplayVariable from "./AllProposalIdsDisplayVariable";
import UserVotesAndUsedDisplayVariable from "./UserVotesAndUsedDisplayVariable";
import ContestInfoDisplayVariable from "./ContestInfoDisplayVariable";

const noContractDisplay = (
  <div>
    Loading...{" "}
    <div style={{ padding: 32 }}>
      You need to run{" "}
      <span
        className="highlight"
        style={{ marginLeft: 4, /* backgroundColor: "#f1f1f1", */ padding: 4, borderRadius: 4, fontWeight: "bolder" }}
      >
        yarn run chain
      </span>{" "}
      and{" "}
      <span
        className="highlight"
        style={{ marginLeft: 4, /* backgroundColor: "#f1f1f1", */ padding: 4, borderRadius: 4, fontWeight: "bolder" }}
      >
        yarn run deploy
      </span>{" "}
      to see your contract here.
    </div>
    <div style={{ padding: 32 }}>
      <span style={{ marginRight: 4 }} role="img" aria-label="warning">
        ☢️
      </span>
      Warning: You might need to run
      <span
        className="highlight"
        style={{ marginLeft: 4, /* backgroundColor: "#f1f1f1", */ padding: 4, borderRadius: 4, fontWeight: "bolder" }}
      >
        yarn run deploy
      </span>{" "}
      <i>again</i> after the frontend comes up!
    </div>
  </div>
);

export default function ContestContract({
  customContract,
  userAddress,
  gasPrice,
  signer,
  provider,
  mainnetProvider,
  name,
  show,
  blockExplorer,
  chainId,
  contractConfig,
}) {
  const contracts = useContractLoader(provider, contractConfig, chainId);
  let contract;
  if (!customContract) {
    contract = contracts ? contracts[name] : "";
  } else {
    contract = customContract;
  }

  const address = contract ? contract.address : "";
  const contractIsDeployed = useContractExistsAtAddress(provider, address);

  const displayedContractFunctions = useMemo(() => {
    const results = contract
      ? Object.entries(contract.interface.functions).filter(
          fn => fn[1]["type"] === "function" && !(show && show.indexOf(fn[1]["name"]) < 0),
        )
      : [];
    return results;
  }, [contract, show]);

  const [refreshRequired, triggerRefresh] = useState(false);
  
  const funcsDict = {};
  displayedContractFunctions.forEach(contractFuncInfo => {
    funcsDict[contractFuncInfo[1].name] = contractFuncInfo;
  });

  const getAllProposalIdsFuncInfo = funcsDict["getAllProposalIds"]
  const getProposalFuncInfo = funcsDict["getProposal"]
  const proposalVotesFuncInfo = funcsDict["proposalVotes"]
  const addressesVotedFuncInfo = funcsDict["proposalAddressesHaveVoted"]
  const proposalAddressVotesFuncInfo = funcsDict["proposalAddressVotes"]
  const proposeFuncInfo = funcsDict["propose"]
  const castVoteFuncInfo = funcsDict["castVote"]
  const getVotesFuncInfo = funcsDict["getVotes"]
  const contestAddressTotalVotesCastFuncInfo = funcsDict["contestAddressTotalVotesCast"]
  const contestSnapshotFuncInfo = funcsDict["contestSnapshot"]
  const proposalThresholdFuncInfo = funcsDict["proposalThreshold"]
  const stateFuncInfo = funcsDict["state"]
  const nameFuncInfo = funcsDict["name"]
  const tokenFuncInfo = funcsDict["token"]
  const voteStartFuncInfo = funcsDict["voteStart"]
  const contestDeadlineFuncInfo = funcsDict["contestDeadline"]
  
  const contractDisplay = contract ?
    <div>
      <div style={{ fontSize: 24 }}>
        <ContestInfoDisplayVariable
          nameContractFunction={contract[nameFuncInfo[0]]}
          tokenContractFunction={contract[tokenFuncInfo[0]]}
          address={address}
          refreshRequired={refreshRequired}
          triggerRefresh={triggerRefresh}
          blockExplorer={blockExplorer}
        />
        <Button onClick={() => {triggerRefresh(true)}}>Refresh Contest</Button>
      </div>
      <Divider />
      <UserVotesAndUsedDisplayVariable
        userAddress={userAddress}
        contestStateContractFunction={contract[stateFuncInfo[0]]}
        getVotesContractFunction={contract[getVotesFuncInfo[0]]}
        proposalThresholdContractFunction={contract[proposalThresholdFuncInfo[0]]}
        contestAddressTotalVotesCastContractFunction={contract[contestAddressTotalVotesCastFuncInfo[0]]}
        constestSnapshotContractFunction={contract[contestSnapshotFuncInfo[0]]}
        voteStartContractFunction={contract[voteStartFuncInfo[0]]}
        contestDeadlineContractFunction={contract[contestDeadlineFuncInfo[0]]}
        refreshRequired={refreshRequired}
        provider={provider}
        triggerRefresh={triggerRefresh}
      />
      <ProposingFunctionForm 
        contractFunction={contract.connect(signer)[proposeFuncInfo[0]]}
        functionInfo={proposeFuncInfo[1]}
        provider={provider}
        gasPrice={gasPrice}
        triggerRefresh={triggerRefresh}
      />
      <AllProposalIdsDisplayVariable
        getAllProposalIdsContractFunction={contract[getAllProposalIdsFuncInfo[0]]}
        getAllProposalIdsFunctionInfo={getAllProposalIdsFuncInfo}
        getProposalContractFunction={contract[getProposalFuncInfo[0]]}
        getProposalFunctionInfo={getProposalFuncInfo}
        proposalVotesContractFunction={contract[proposalVotesFuncInfo[0]]}
        proposalVotesFunctionInfo={proposalVotesFuncInfo}
        addressesVotedContractFunction={contract[addressesVotedFuncInfo[0]]}
        addressesVotedFunctionInfo={addressesVotedFuncInfo}
        proposalAddressVotesContractFunction={contract[proposalAddressVotesFuncInfo[0]]}
        proposalAddressVotesFunctionInfo={proposalAddressVotesFuncInfo}
        castVoteContractFunction={contract.connect(signer)[castVoteFuncInfo[0]]} // Different bc function, not display form
        castVoteFunctionInfo={castVoteFuncInfo[1]}
        refreshRequired={refreshRequired}
        triggerRefresh={triggerRefresh}
        blockExplorer={blockExplorer}
        provider={provider}
        mainnetProvider={mainnetProvider}
        gasPrice={gasPrice}
      />
    </div>
     :
    ""

  return (
    <div style={{ margin: "auto" }}>
      <Card
        size="large"
        style={{ marginTop: 25, width: "100%" }}
        loading={contractDisplay && contractDisplay.length <= 0}
      >
        {contractIsDeployed ? contractDisplay : noContractDisplay}
      </Card>
    </div>
  );
}
