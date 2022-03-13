import React, { useState, useEffect } from "react";
import { Button, Card, Input } from "antd";
import { Contract, CreateRaceModal } from "../components";

export default function RacesPage({targetNetwork, price, signer, provider, address, blockExplorer, contractConfig}) {

  const [contestSearchInput, setContestSearchInput] = useState("");
  const [tokenSearchInput, setTokenSearchInput] = useState("");
  const [isSubmitRaceModalVisible, setIsSubmitRaceModalVisible] = useState(false);  
  const [currentContest, setCurrentContest] = useState("");
  const [currentToken, setCurrentToken] = useState("");
  
  let customConfig = {};

  if (contractConfig["deployedContracts"][targetNetwork.chainId]) {
    customConfig["deployedContracts"] = {};
    customConfig["deployedContracts"][targetNetwork.chainId] = {};
    customConfig["deployedContracts"][targetNetwork.chainId][targetNetwork.name] = {
      chainId: targetNetwork.chainId.toString(),
      contracts: {
        Contest: {
          // TODO: Add error handling/path for if people try to call this and the targetNetwork doesn't have an entry in the hardhat deployedContracts
          abi: contractConfig["deployedContracts"][targetNetwork.chainId][targetNetwork.name]["contracts"]["Contest"].abi,
          address: contestSearchInput
        },
        GenericVotesToken: {
          abi: contractConfig["deployedContracts"][targetNetwork.chainId][targetNetwork.name]["contracts"]["GenericVotesToken"].abi,
          address: tokenSearchInput
        }
      },
      name: targetNetwork.name
    };
  }

  function searchContest() {
    setCurrentContest(<Contract
      name="Contest"
      price={price}
      signer={signer}
      provider={provider}
      address={address}
      blockExplorer={blockExplorer}
      contractConfig={customConfig}
    />);
  }

  function searchToken() {
    setCurrentToken(<Contract
      name="GenericVotesToken"
      price={price}
      signer={signer}
      provider={provider}
      address={address}
      blockExplorer={blockExplorer}
      contractConfig={customConfig}
    />);
  }

  const showModal = () => {
    setIsSubmitRaceModalVisible(true);
  };
  
  return (
    <div style={{ border: "1px solid #cccccc", padding: 16, width: 800, margin: "auto", marginTop: 64 }}>
      <Button onClick={() => {window.location.reload();}}>Refresh</Button>
      <Button type="primary" onClick={showModal}>
        Submit Contest
      </Button>
      <CreateRaceModal modalVisible={isSubmitRaceModalVisible} setModalVisible={setIsSubmitRaceModalVisible} />
      <div>
        <Input icon='search' placeholder='Search contests...' value={contestSearchInput} onChange={(e) => setContestSearchInput(e.target.value)} />
        <Button onClick={searchContest}>Search Contests</Button>
      </div>
      <div>
        {currentContest}
      </div>
      <div>
        <Input icon='search' placeholder='Search tokens...' value={tokenSearchInput} onChange={(e) => setTokenSearchInput(e.target.value)} />
        <Button onClick={searchToken}>Search ERC20Votes Tokens</Button>
      </div>
      <div>
        {currentToken}
      </div>
      <h10>jokecartel was here</h10>
    </div>
  );
}
