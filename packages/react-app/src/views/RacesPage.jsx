import React, { useState, useEffect } from "react";
import { Button, Card, Input } from "antd";
import { Contract, CreateRaceModal } from "../components";

export default function RacesPage({targetNetwork, price, signer, provider, address, blockExplorer, contractConfig}) {

  const [searchInput, setSearchInput] = useState("");
  const [isSubmitRaceModalVisible, setIsSubmitRaceModalVisible] = useState(false);  
  const [currentContract, setCurrentContract] = useState("");

  const showModal = () => {
    setIsSubmitRaceModalVisible(true);
  };

  function searchRace() {
    let customConfig = {};
    
    customConfig["deployedContracts"] = {};
    customConfig["deployedContracts"][targetNetwork.chainId] = {};
    customConfig["deployedContracts"][targetNetwork.chainId][targetNetwork.name] = {
      chainId: targetNetwork.chainId.toString(),
      contracts: {
        Contest: {
          abi: contractConfig["deployedContracts"]["31337"]["localhost"]["contracts"]["Contest"].abi,
          address: searchInput
        }
      },
      name: targetNetwork.name
    };
    
    setCurrentContract(<Contract
        name="Contest"
        price={price}
        signer={signer}
        provider={provider}
        address={address}
        blockExplorer={blockExplorer}
        contractConfig={customConfig}
    />);
  }
  
  return (
    <div style={{ border: "1px solid #cccccc", padding: 16, width: 800, margin: "auto", marginTop: 64 }}>
      <Button onClick={() => {window.location.reload();}}>Refresh</Button>
      <Button type="primary" onClick={showModal}>
        Submit Race
      </Button>
      <CreateRaceModal modalVisible={isSubmitRaceModalVisible} setModalVisible={setIsSubmitRaceModalVisible} />
      <div>
        <Input icon='search' placeholder='Search races...' value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
        <Button onClick={searchRace}>Search</Button>
      </div>
      <div>
        {currentContract}
      </div>
      <h10>jokecartel was here</h10>
    </div>
  );
}
