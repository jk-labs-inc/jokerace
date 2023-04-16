// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@forge-std/Test.sol";
import "../src/Contest.sol";

contract ContestTest is Test {
    Contest public contest;
    uint256[] public numParams;
    bytes32[] public proof;

    address public constant PERMISSIONED_ADDRESS = 0x016C8780e5ccB32E5CAA342a926794cE64d9C364;

    uint64 public constant CONTEST_START = 1681650000;
    uint64 public constant VOTING_DELAY = 10000;
    uint64 public constant VOTING_PERIOD = 10000;
    uint64 public constant NUM_ALLOWED_PROPOSAL_SUBMISSIONS = 2;
    uint64 public constant MAX_PROPOSAL_COUNT = 100;
    uint64 public constant DOWNVOTING_ALLOWED = 0;

    function setUp() public {
        numParams.push(CONTEST_START);
        numParams.push(VOTING_DELAY);
        numParams.push(VOTING_PERIOD);
        numParams.push(NUM_ALLOWED_PROPOSAL_SUBMISSIONS);
        numParams.push(MAX_PROPOSAL_COUNT);
        numParams.push(DOWNVOTING_ALLOWED);

        vm.prank(PERMISSIONED_ADDRESS);
        
        contest = new Contest("test",
                              "hello world",
                              bytes32(0xd0aa6a4e5b4e13462921d7518eebdb7b297a7877d6cfe078b0c318827392fb55),
                              bytes32(0xd0aa6a4e5b4e13462921d7518eebdb7b297a7877d6cfe078b0c318827392fb55),
                              numParams);
    }

    // GOVERNOR SETTINGS
    function testContestStart() public {
        assertEq(contest.contestStart(), CONTEST_START);
    }

    function testVotingDelay() public {
        assertEq(contest.votingDelay(), VOTING_DELAY);
    }

    function testVotingPeriod() public {
        assertEq(contest.votingPeriod(), VOTING_PERIOD);
    }

    function testNumAllowedProposalSubmissions() public {
        assertEq(contest.numAllowedProposalSubmissions(), NUM_ALLOWED_PROPOSAL_SUBMISSIONS);
    }

    function testMaxProposalCount() public {
        assertEq(contest.maxProposalCount(), MAX_PROPOSAL_COUNT);
    }

    function testDownvotingAllowed() public {
        assertEq(contest.downvotingAllowed(), DOWNVOTING_ALLOWED);
    }

    function testCreator() public {
        assertEq(contest.creator(), PERMISSIONED_ADDRESS);
    }

    // PROPOSING AND VOTING
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

        vm.startPrank(PERMISSIONED_ADDRESS);

        vm.warp(1681650001);
        uint256 proposalId = contest.propose("proposalDescription", proof);

        vm.stopPrank();

        assertEq(proposalId, 97841183246694117049131835047498378131093565157767228515338175708860829108582);
    }

    function testVote() public {
        proof = [bytes32(0x005a0033b5a1ac5c2872d7689e0f064ad6d2287ab98439e44c822e1c46530033)];

        vm.startPrank(PERMISSIONED_ADDRESS);

        vm.warp(1681650001);
        uint256 proposalId = contest.propose("proposalDescription", proof);
        vm.warp(1681660001);
        uint256 totalVotes = contest.castVote(proposalId, 0, 10000000000000000000, 1000000000000000000, proof);

        vm.stopPrank();

        assertEq(totalVotes, 10000000000000000000);
    }

    function testVoteWithoutProof() public {
        proof = [bytes32(0x005a0033b5a1ac5c2872d7689e0f064ad6d2287ab98439e44c822e1c46530033)];

        vm.startPrank(PERMISSIONED_ADDRESS);

        vm.warp(1681650001);
        uint256 proposalId = contest.propose("proposalDescription", proof);
        vm.warp(1681660001);
        contest.castVote(proposalId, 0, 10000000000000000000, 1000000000000000000, proof);
        uint256 totalVotesWithoutProof = contest.castVoteWithoutProof(proposalId, 0, 1000000000000000000);

        vm.stopPrank();

        assertEq(totalVotesWithoutProof, 10000000000000000000);
    }
}
