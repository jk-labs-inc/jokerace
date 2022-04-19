import { Collapse, Input } from "antd";
import React, { useState } from "react";
import { Contract } from "../components";
import DeployedContestContract from "../contracts/bytecodeAndAbi/Contest.sol/Contest.json";
import DeployedGenericVotesTimestampTokenContract from "../contracts/bytecodeAndAbi/GenericVotesTimestampToken.sol/GenericVotesTimestampToken.json";

const { Panel } = Collapse;

export default function InstructionSection({targetNetwork, price, signer, provider, address, blockExplorer}) {

  const [fullContestSearchInput, setFullContestSearchInput] = useState("");
  const [tokenSearchInput, setTokenSearchInput] = useState("");

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
            address: fullContestSearchInput
          }
        },
        name: targetNetwork.name
      }
    return customContestConfig;
  }
  
  function generateCustomTokenConfig() {
    let customTokenConfig = generateCustomConfigBase();
    customTokenConfig["deployedContracts"][targetNetwork.chainId][targetNetwork.name] =
      {
        chainId: targetNetwork.chainId.toString(),
        contracts: {
          GenericVotesTimestampToken: {
            abi: DeployedGenericVotesTimestampTokenContract.abi,
            address: tokenSearchInput
          }
        },
        name: targetNetwork.name
      }
    return customTokenConfig;
  }

  return (
    <div>
      <div style={{ border: "1px solid #cccccc", textAlign: "left", padding: 16, width: 800, margin: "auto", marginTop: 48 }}>
        <h3 style={{ textAlign: "center" }}><a href="https://docs.google.com/document/d/14NvQuYIv0CpSV8L5nR3iHwbnZ6yH--oywe2d_qDK3rE/edit?usp=sharing" target="_blank">Find contests here</a></h3>
        <Collapse>
          <Panel header="Tips and Instructions Zone">
            <h4 style={{marginTop: 6}}>We're open-source, check out the code on <a href="https://github.com/seanmc9/JokeDaoV2Dev" target="_blank">our Github</a>!</h4>
            <p><b>Tip:</b> The very first thing you should make sure to do is connect your wallet and ensure that you are on the network you want to be both on the site and in your wallet.</p>
            <p><b>Tip:</b> Currently addresses with enough votes (per the proposal threshold) can only submit one proposal each to a given contest.</p>
            <p><b>Tip:</b> In order to submit an image or gif, make sure that you submit only the link and that the link begins with "https://" and it is a direct link to the image file (it will end in .jpg or the file type of the media).</p>
            <Collapse>
              <Panel header="Here are instructions for some adventures you may be on if you're interested!" key="1">
                <Collapse>
                  <Panel header="I want to play the jokerace on Polygon!" key="1">
                    <p>You will be airdropped tokens that are a snapshot of your holdings of $JOKE on Ethereum mainnet for a given race and they will be by default delegated to you (you can change this and delegate to someone else if you'd like, just make sure you do so before the snapshot time of the contest). Just plug in the Contest address of the jokerace that is using those tokens (propose a joke if the race is currently queued or vote if the voting period is open)!</p>
                    <p>First jokerace contract address: 0x8f2877A461a4cD978edDbc46861192a63133e026</p>
                  </Panel>
                  <Panel header="I'd like to vote on something and/or make a DAO with a group of people!" key="2">
                    <ol>
                      <li>Create an ERC20VotesTimestamp token (an <a href="https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#ERC20Votes" target="_blank">ERC20Votes</a> token that tracks voting by time instead of block number).</li>
                      <li>Distribute that token to people you want to be able to vote by using <a href="https://www.coinvise.co/dashboard" target="_blank">Coinvise Airdrops</a>, <a href="https://multisender.app/" target="_blank">Multisender App</a>, your wallet provider, or really any site that allows you to send ERC20 tokens.</li>
                      <li>Create a Contest with the token you made in step one as the voting token.</li>
                      <li>Propose and Vote on your contest and experiment with governance!</li>
                    </ol>
                  </Panel>
                  <Panel header="I'd like to run a contest for my DAO!" key="3">
                    <p>That's awesome!! Do you already have a token you would like to use as the voting token?</p>
                    <Collapse>
                      <Panel header="Yes" key="1">
                        <p>Cool! There are two primary options for doing this!</p>
                        <ol>
                          <li>Create a new GenericVotesTimestampToken on the chain that you would like the contest to be held on and distribute it based on a snapshot of your pre-existing token.</li>
                          <li>Bridge (if your tokens aren't already on the chain you would like to run contests on) and Wrap your pre-existent tokens to have them implement ERC20VotesTimestamp functionality.</li>
                          </ol>
                      </Panel>
                      <Panel header="No" key="2">
                        <p>Cool! We suggest checking out the above adventure (I'd like to vote on something amongst a group of people!) for going from 0 to 1 on making a token, distributing it to the people you'd like to vote, making a contest, and getting going - just that group of people would be the members of your DAO!</p>
                      </Panel>
                    </Collapse>
                  </Panel>
                  <Panel header="I don't know what to do and/or I was just sent here by some shadowy super coder from this group called the joke cartel!" key="4">
                    <p>Try out creating a token and then a contest and just seeing how they work! Some fun experiments could be:</p>
                    <ol>
                      <li>Deciding which board game to play amongst friends but the one that gets the second most votes wins!</li>
                      <li>Do a decentralized Twitter poll by giving out tokens to your followers and having them vote in a contest where the results will be stored on-chain and you can see who voted for what!</li>
                      <li>If you are building a product, give tokens to your users and ask them to propose and vote on which features they would like to see implemented next!</li>
                    </ol>
                  </Panel>
                </Collapse>
              </Panel>
              <Panel header="Want to see and/or use the full function list of the Contest or token contracts?" key="2">
                <h4>Below are fields with which you can search the address of Contest and ERC20Votes types of contracts and access their full function lists</h4>
                <div>
                  <Input icon='search' placeholder='Search Contest full contract functions' value={fullContestSearchInput} onChange={(e) => setFullContestSearchInput(e.target.value.trim().replace(/['"]+/g, ''))} />
                </div>
                {fullContestSearchInput != "" ?
                  <Contract
                    name="Contest"
                    price={price}
                    signer={signer}
                    provider={provider}
                    address={address}
                    blockExplorer={blockExplorer}
                    contractConfig={generateCustomContestConfig(true)}
                    chainId={targetNetwork.chainId}
                  />
                : ""
                }
                <div>
                  {/* Get rid of any whitespace or extra quotation marks */}
                  <Input icon='search' placeholder='Search ERC20VotesTimestamp full contract functions' value={tokenSearchInput} onChange={(e) => setTokenSearchInput(e.target.value.trim().replace(/['"]+/g, ''))} />
                </div>
                {tokenSearchInput != "" ? 
                  <Contract
                    name="GenericVotesTimestampToken"
                    price={price}
                    signer={signer}
                    provider={provider}
                    address={address}
                    blockExplorer={blockExplorer}
                    contractConfig={generateCustomTokenConfig()}
                    chainId={targetNetwork.chainId}
                  /> 
                : ""}
                <div style={{ padding: 5, width: 800, margin: "auto", marginTop: 75 }}>
                  <h5>jokecartel was here</h5>
                </div>
              </Panel>
            </Collapse>
          </Panel>
        </Collapse>
      </div>
    </div>
  );
}
