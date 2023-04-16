// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@forge-std/Test.sol";
import "../src/Contest.sol";

contract ContestTest is Test {
    Contest public contest;
    uint256[] numParams;
    bytes32[] proof;

    function setUp() public {
        numParams.push(1681650000); // _initialContestStart
        numParams.push(10000); // _initialVotingDelay
        numParams.push(10000); // _initialVotingPeriod,
        numParams.push(2); // _initialNumAllowedProposalSubmissions,
        numParams.push(100); // _initialMaxProposalCount
        numParams.push(0); // _initialDownvotingAllowed
        emit log_array(numParams);
        contest = new Contest("test",
                              "hello world",
                              bytes32(0xd0aa6a4e5b4e13462921d7518eebdb7b297a7877d6cfe078b0c318827392fb55),
                              bytes32(0xd0aa6a4e5b4e13462921d7518eebdb7b297a7877d6cfe078b0c318827392fb55),
                              numParams);
    }

    /*
        For this merkle tree:
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

        vm.warp(1681650001);
        uint256 proposalId = contest.propose("proposalDescription", proof);

        vm.stopPrank();

        assertEq(proposalId, 97841183246694117049131835047498378131093565157767228515338175708860829108582);
    }

    function testVote() public {
        proof = [bytes32(0x005a0033b5a1ac5c2872d7689e0f064ad6d2287ab98439e44c822e1c46530033)];

        vm.startPrank(address(0x016C8780e5ccB32E5CAA342a926794cE64d9C364));

        vm.warp(1681650001);
        uint256 proposalId = contest.propose("proposalDescription", proof);
        vm.warp(1681660001);
        uint256 totalVotes = contest.castVote(proposalId, 0, 10000000000000000000, 1000000000000000000, proof);

        vm.stopPrank();

        assertEq(totalVotes, 10000000000000000000);
    }
}
