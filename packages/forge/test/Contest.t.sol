// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@forge-std/Test.sol";
import "../src/Contest.sol";

contract ContestTest is Test {
    Contest public contest;
    uint256[] numParams;
    bytes32[] proof;

    function setUp() public {
        numParams.push(0);            // _initialDownvotingAllowed
        numParams.push(100);          // _initialMaxProposalCount
        numParams.push(2);            // _initialNumAllowedProposalSubmissions,
        numParams.push(1696614513);   // _initialVotingPeriod,
        numParams.push(1691614513);   // _initialVotingDelay
        numParams.push(1581456009);   // _initialContestStart
        contest = new Contest("test",
                              "hello world",
                              bytes32(0xd0aa6a4e5b4e13462921d7518eebdb7b297a7877d6cfe078b0c318827392fb55),
                              bytes32(0xd0aa6a4e5b4e13462921d7518eebdb7b297a7877d6cfe078b0c318827392fb55),
                              numParams);
    }

    /*
        For the below merkle tree:
        {
            "decimals": 18,
            "airdrop": {
                "0x016C8780e5ccB32E5CAA342a926794cE64d9C364": 10,
                "0x185a4dc360ce69bdccee33b3784b0282f7961aea": 100
            }
        }
    */
    function testPropose() public {
        proof = [bytes32(0x005a0033b5a1ac5c2872d7689e0f064ad6d2287ab98439e44c822e1c46530033)];
        vm.startPrank(address(0x016C8780e5ccB32E5CAA342a926794cE64d9C364));
        uint256 proposalId = contest.propose('proposalDescription', proof);
        vm.stopPrank();
        assertEq(proposalId, 97841183246694117049131835047498378131093565157767228515338175708860829108582);
    }
}
