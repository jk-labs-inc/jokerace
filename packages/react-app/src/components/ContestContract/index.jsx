import { Card } from "antd";
import { useContractExistsAtAddress, useContractLoader } from "eth-hooks";
import React, { useMemo, useState } from "react";
import Address from "../Address";
import Balance from "../Balance";
import FunctionForm from "./FunctionForm";
import AllProposalIdsDisplayVariable from "./AllProposalIdsDisplayVariable";

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

const isQueryable = fn => (fn.stateMutability === "view" || fn.stateMutability === "pure") && fn.inputs.length === 0;

export default function ContestContract({
  customContract,
  account,
  gasPrice,
  signer,
  provider,
  name,
  show,
  price,
  blockExplorer,
  chainId,
  contractConfig,
}) {
  const contracts = useContractLoader(provider, contractConfig, chainId);
  console.log("CONTRACTS: ", contracts)
  let contract;
  if (!customContract) {
    contract = contracts ? contracts[name] : "";
  } else {
    contract = customContract;
  }

  const address = contract ? contract.address : "";
  const contractIsDeployed = useContractExistsAtAddress(provider, address);
  console.log("PROVIDER: ", provider)
  console.log("deployed?", contractIsDeployed)

  const displayedContractFunctions = useMemo(() => {
    const results = contract
      ? Object.entries(contract.interface.functions).filter(
          fn => fn[1]["type"] === "function" && !(show && show.indexOf(fn[1]["name"]) < 0),
        )
      : [];
    return results;
  }, [contract, show]);

  const [refreshRequired, triggerRefresh] = useState(false);
  
  console.log("functions: " + displayedContractFunctions);
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
  
  const contractDisplay = contract ?
    <div>
      <FunctionForm 
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
        gasPrice={gasPrice}
      />
    </div>
     :
    ""

  return (
    <div style={{ margin: "auto" }}>
      <Card
        title={
          <div style={{ fontSize: 24 }}>
            {name}
            <div style={{ float: "right" }}>
              <Address value={address} />
              <Balance address={address} provider={provider} price={price} />
            </div>
          </div>
        }
        size="large"
        style={{ marginTop: 25, width: "100%" }}
        loading={contractDisplay && contractDisplay.length <= 0}
      >
        {contractIsDeployed ? contractDisplay : noContractDisplay}
      </Card>
    </div>
  );
}
