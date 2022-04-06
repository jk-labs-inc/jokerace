import React, { useState, useEffect } from "react";
import { Button, Divider, Input, Collapse } from "antd";

import { ContestContract, CreateContestModal, CreateGenericVotesTokenModal } from "../components";
import DeployedContestContract from "../contracts/bytecodeAndAbi/Contest.sol/Contest.json";

const { Panel } = Collapse;

export default function ContestsPage({targetNetwork, price, signer, provider, mainnetProvider, address, blockExplorer}) {

  const [contestSearchInput, setContestSearchInput] = useState("");
  const [isCreateContestModalVisible, setIsCreateContestModalVisible] = useState(false);
  const [isCreateTokenModalVisible, setIsCreateTokenModalVisible] = useState(false);
  const [resultMessage, setResultMessage] = useState("")
  
  function generateCustomConfigBase() {
    let customConfigBase = {};
    customConfigBase["deployedContracts"] = {};
    customConfigBase["deployedContracts"][targetNetwork.chainId] = {};
    return customConfigBase;
  }

  function generateCustomContestConfig() {
    let customContestConfig = generateCustomConfigBase();
    customContestConfig["deployedContracts"][targetNetwork.chainId][targetNetwork.name] =
      {
        chainId: targetNetwork.chainId.toString(),
        contracts: {
          Contest: {
            abi: DeployedContestContract.abi,
            address: contestSearchInput
          }
        },
        name: targetNetwork.name
      }
    return customContestConfig;
  }
  
  const showContestModal = () => {
    setIsCreateContestModalVisible(true);
  };

  const showTokenModal = () => {
    setIsCreateTokenModalVisible(true);
  };
  
  useEffect(() => {
    if(window.localStorage.getItem('currentContest') != null) {
      setContestSearchInput(window.localStorage.getItem('currentContest'));
    }
  }, []);
  
  useEffect(() => {
    if((contestSearchInput != null) && (contestSearchInput != "null")) {
      window.localStorage.setItem('currentContest', contestSearchInput);
    }
  }, [contestSearchInput]);
  
  
  return (
    <div style={{ border: "1px solid #cccccc", padding: 16, width: 800, margin: "auto", marginTop: 48 }}>
      <Button onClick={() => {window.location.reload();}}>Refresh</Button>
      <Button type="primary" onClick={showTokenModal}>
        Create Generic Votes Token
      </Button>
      <Button type="primary" onClick={showContestModal}>
        Create Contest
      </Button>
      <CreateContestModal 
        modalVisible={isCreateContestModalVisible} 
        setModalVisible={setIsCreateContestModalVisible} 
        setResultMessage={setResultMessage} 
        signer={signer}
      />
      <CreateGenericVotesTokenModal 
        modalVisible={isCreateTokenModalVisible} 
        setModalVisible={setIsCreateTokenModalVisible} 
        setResultMessage={setResultMessage} 
        signer={signer}
      />
      <Button onClick={() => setResultMessage("")}>Clear message</Button>
      <div>
        <p>{resultMessage}</p>
      </div>
      <div>
        {/* Get rid of any whitespace or extra quotation marks */}
        <Input icon='search' placeholder='Enter Contest contract address here' value={contestSearchInput} onChange={(e) => setContestSearchInput(e.target.value.trim().replace(/['"]+/g, ''))} />
      </div>
      {contestSearchInput != "" ? 
        <ContestContract
          name="Contest"
          price={price}
          signer={signer}
          provider={provider}
          mainnetProvider={mainnetProvider}
          userAddress={address}
          blockExplorer={blockExplorer}
          contractConfig={generateCustomContestConfig()}
          chainId={targetNetwork.chainId}
        />
      : ""}
    </div>
  );
}
