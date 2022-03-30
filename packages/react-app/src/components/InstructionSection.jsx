import { Collapse } from "antd";
import React from "react";

const { Panel } = Collapse;

export default function InstructionSection() {
  return (
    <div>
      <h1 style={{marginTop: 64}}>Welcome to jokedao contests!</h1>
      <div style={{ border: "1px solid #cccccc", textAlign: "left", padding: 16, width: 800, margin: "auto", marginTop: 18 }}>
        <h2 style={{textAlign: "center"}}>Tips and Instructions Zone</h2>
        <p><b>Tip:</b> The very first thing you should make sure to do is connect your wallet and ensure that you are on the network you want to be both on the site and in your wallet.</p>
        <Collapse>
          <Panel header="Here are instructions for some adventures you may be on if you're interested!" key="1">
            <Collapse>
              <Panel header="I want to play the jokerace on Polygon!" key="1">
                <p>You will be airdropped tokens that are a snapshot of your holdings of $JOKE on Ethereum mainnet for a given race and they will be by default delegated to you (you can change this and delegate to someone else if you'd like, just make sure you do so before the snapshot block of the race). Just plug in the Contest address of the jokerace that is using those tokens and go!</p>
                <p>First jokerace airdrop token (JR1) address: 0xa82FFD215346963fC22eF3317A7bbA09c5692269</p>
              </Panel>
              <Panel header="I'd like to vote on something and/or make a DAO with a group of people!" key="2">
                <ol>
                  <li>Create a Generic Votes token (an <a href="https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#ERC20Votes">ERC20Votes</a> token).</li>
                  <li>Distribute that token to people you want to be able to vote by using <a href="https://multisender.app/">Multisender App</a> or by entering the token contract address into the below input field for ERC20Votes contract addresses and using the transfer function (don't forget to convert to multiply by 1e18 since ERC20 tokens have 18 decimals, you can do this by just pressing the star button).</li>
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
                      <li>Create a new GenericVotesToken on the chain that you would like the contest to be held on and distribute it based on a snapshot of your pre-existing token.</li>
                      <li>Bridge (if your tokens aren't already on the chain you would like to run contests on) and Wrap your pre-existent tokens to have them implement <a href="https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#ERC20Votes">ERC20Votes</a> functionality.</li>
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
        </Collapse>
      </div>
    </div>
  );
}
