import React, { useState, useEffect } from "react";
import { Button, Card, Input } from "antd";
import { Contract, ContestContract, CreateRaceModal } from "../components";

export default function RacesPage({targetNetwork, price, signer, provider, address, blockExplorer, contractConfig}) {

  const [contestSearchInput, setContestSearchInput] = useState("0xd71929d7ad7d425acf6009d238257378c7fd2203");
  const [tokenSearchInput, setTokenSearchInput] = useState("0x003da13b325cba4d4477207871d8e7c7f2f5ad8e");
  const [isSubmitRaceModalVisible, setIsSubmitRaceModalVisible] = useState(false);  
  const [currentContest, setCurrentContest] = useState("");
  const [currentToken, setCurrentToken] = useState("");
  
  let customConfig = {};
  let fullConfigPath = contractConfig["deployedContracts"][targetNetwork.chainId][targetNetwork.name]["contracts"]

  if (contractConfig["deployedContracts"][targetNetwork.chainId]) {
    customConfig["deployedContracts"] = {};
    customConfig["deployedContracts"][targetNetwork.chainId] = {};
    customConfig["deployedContracts"][targetNetwork.chainId][targetNetwork.name] =
    (fullConfigPath["Contest"] && fullConfigPath["GenericVotesToken"]) ?
      {
        chainId: targetNetwork.chainId.toString(),
        contracts: {
          Contest: {
            abi: fullConfigPath["Contest"].abi,
            address: contestSearchInput
          },
          GenericVotesToken: {
            abi: fullConfigPath["GenericVotesToken"].abi,
            address: tokenSearchInput
          }
        },
        name: targetNetwork.name
      }
    : {};
      
  }

  console.log(customConfig)

  function searchContest() {
    setCurrentContest(
      <div>
        <ContestContract
          name="Contest"
          price={price}
          signer={signer}
          provider={provider}
          address={address}
          blockExplorer={blockExplorer}
          contractConfig={customConfig}
        />
        <Contract
          name="Contest"
          price={price}
          signer={signer}
          provider={provider}
          address={address}
          blockExplorer={blockExplorer}
          contractConfig={customConfig}
        />
      </div>
    );
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
        <Input icon='search' placeholder='Search contests...' onChange={(e) => setContestSearchInput(e.target.value)} />
        <Button onClick={searchContest}>Search Contests</Button>
      </div>
      <div>
        {currentContest}
      </div>
      <div>
        <Input icon='search' placeholder='Search tokens...' onChange={(e) => setTokenSearchInput(e.target.value)} />
        <Button onClick={searchToken}>Search ERC20Votes Tokens</Button>
      </div>
      <div>
        {currentToken}
      </div>
      <h5>jokecartel was here</h5>
    </div>
  );
}
