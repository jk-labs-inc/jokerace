import { Collapse } from "antd";
import React from "react";

const { Panel } = Collapse;

export default function Header() {
  return (
    <div>
      <h1 style={{marginTop: 64}}>Welcome to jokedao contests!</h1>
      <div style={{ border: "1px solid #cccccc", textAlign: "left", padding: 16, width: 800, margin: "auto", marginTop: 18 }}>
        <h2 style={{textAlign: "center"}}>Tips and Instructions Zone</h2>
        <p><b>Tip:</b> The very first thing you should make sure to do is connect your wallet and ensure that you are on the network you want to be both on the site and in your wallet.</p>
        <p><b>Tip:</b> In order to vote with <a href="https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#ERC20Votes">ERC20Votes</a> tokens you need to have delegated them to yourself, always make sure that you've done this before the snapshot of a contest you'd like to vote in.</p>
        <Collapse>
          <Panel header="Here are instructions for some adventures you may be on if you're interested!" key="1">
            <Collapse>
              <Panel header="I want to play the jokerace on Polygon!" key="1">
                <p>Bridge: You need to bridge your <a href="https://etherscan.io/address/0xa973c558265ad458031fa3067071646836df7713">$JOKE</a> from Ethereum mainnet to Polygon mainnet using the <a href="https://wallet.polygon.technology/bridge/">Polygon Bridge</a>.</p>
                <p>Wrap:</p>
                <ol>
                  <li>Once you've bridged, you will need to wrap your tokens on Polygon so that they can be used for voting (have <a href="https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#ERC20Votes">ERC20Votes</a> functionality).</li>
                  <li>To do this, enter the official $JOKE token ERC20Votes wrapping contract address (*address here once deployed*) into the below input box for Wrapping contracts.</li>
                  <li>Then call the deposit function with the number of tokens (don't forget to convert to multiply by 1e18 since ERC20 tokens have 18 decimals, you can do this by just pressing the star button) you'd like to wrap.</li>
                </ol>
                <p>Delegate</p>
                <ol>
                  <li>In order to vote (and propose if a contest has a required number of votes for an address to propose a joke), you need to delegate the votes of your tokens to yourself (or who you'd like to delegate to if that is someone else)!</li>
                  <li>Delegate your votes by entering the Wrapped JOKE contract address into the below input for ERC20Votes tokens and call the delegate function with the address you would like to delegate to.</li>
                </ol>
                <p>Propose and Vote: Now you're good to go, enter the contract address of the jokerace you are playing in the top input field and you can get to proposing and voting on jokes!!</p>
              </Panel>
              <Panel header="I'd like to vote on something amongst a group of people!" key="2">
                <ol>
                  <li>Create a Generic Votes token (an <a href="https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#ERC20Votes">ERC20Votes</a>  token).</li>
                  <li>Distribute that token to people you want to be able to vote by using <a href="https://disperse.app/">Disperse App</a> or by entering the token contract address into the below input field for ERC20Votes contract addresses and using the transfer function (don't forget to convert to multiply by 1e18 since ERC20 tokens have 18 decimals, you can do this by just pressing the star button).</li>
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
                      <li>Mint new tokens based on a snapshot of your pre-existing tokens on the chain that you would like for use on proposals.</li>
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
