// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@forge-std/Test.sol";
import "../src/Contest.sol";

contract ContestTest is Test {
    Contest public contest;
    uint64 public constant CONTEST_START = 1681650000;
    uint64 public constant VOTING_DELAY = 10000;
    uint64 public constant VOTING_PERIOD = 10000;
    uint64 public constant NUM_ALLOWED_PROPOSAL_SUBMISSIONS = 2;
    uint64 public constant MAX_PROPOSAL_COUNT = 100;
    uint64 public constant DOWNVOTING_ALLOWED = 0;
    uint256[] public numParams = [
        CONTEST_START,
        VOTING_DELAY,
        VOTING_PERIOD,
        NUM_ALLOWED_PROPOSAL_SUBMISSIONS,
        MAX_PROPOSAL_COUNT,
        DOWNVOTING_ALLOWED
    ];

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
    address public constant PERMISSIONED_ADDRESS = 0x016C8780e5ccB32E5CAA342a926794cE64d9C364;
    bytes32 public constant SUB_AND_VOTING_MERKLE_ROOT =
        bytes32(0xd0aa6a4e5b4e13462921d7518eebdb7b297a7877d6cfe078b0c318827392fb55);
    bytes32[] public proof = [bytes32(0x005a0033b5a1ac5c2872d7689e0f064ad6d2287ab98439e44c822e1c46530033)];

    address public constant DEFAULT_TARGET_ADDRESS = 0x016C8780e5ccB32E5CAA342a926794cE64d9C364;
    address[] public safeSigners = [address(0)];
    uint8 public constant SAFE_THRESHOLD = 1;
    IGovernor.ProposalCore public proposal = IGovernor.ProposalCore({
        author: msg.sender,
        description: "proposalDescription",
        exists: true,
        targetMetadata: IGovernor.TargetMetadata({targetAddress: DEFAULT_TARGET_ADDRESS}),
        safeMetadata: IGovernor.SafeMetadata({signers: safeSigners, threshold: SAFE_THRESHOLD})
    });
    IGovernor.ProposalCore public secondProposal = IGovernor.ProposalCore({
        author: msg.sender,
        description: "secondProposalDescription",
        exists: true,
        targetMetadata: IGovernor.TargetMetadata({targetAddress: DEFAULT_TARGET_ADDRESS}),
        safeMetadata: IGovernor.SafeMetadata({signers: safeSigners, threshold: SAFE_THRESHOLD})
    });

    function setUp() public {
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

    function testValidate() public {
        bool validated = contest.validateProposalData(proposal);

        assertEq(validated, true);
    }

    function testPropose() public {
        vm.startPrank(PERMISSIONED_ADDRESS);

        vm.warp(1681650001);
        uint256 proposalId = contest.propose(proposal, proof);

        vm.stopPrank();

        assertEq(proposalId, 2901242392636705081991988272742551360295662537271695090215194041398924040922);
    }

    function testProposeWithoutProof() public {
        vm.startPrank(PERMISSIONED_ADDRESS);

        vm.warp(1681650001);
        uint256 firstProposalId = contest.propose(proposal, proof);
        uint256 secondProposalId = contest.proposeWithoutProof(secondProposal);

        vm.stopPrank();

        assertEq(firstProposalId, 2901242392636705081991988272742551360295662537271695090215194041398924040922);
        assertEq(secondProposalId, 103496870058056576765841579243895962431381781568664359263565324319479366224263);
    }

    function testVote() public {
        vm.startPrank(PERMISSIONED_ADDRESS);

        vm.warp(1681650001);
        uint256 proposalId = contest.propose(proposal, proof);
        vm.warp(1681660001);
        uint256 totalVotes = contest.castVote(proposalId, 0, 10000000000000000000, 1000000000000000000, proof);

        vm.stopPrank();

        assertEq(totalVotes, 10000000000000000000);
    }

    function testVoteWithoutProof() public {
        vm.startPrank(PERMISSIONED_ADDRESS);

        vm.warp(1681650001);
        uint256 proposalId = contest.propose(proposal, proof);
        vm.warp(1681660001);
        contest.castVote(proposalId, 0, 10000000000000000000, 1000000000000000000, proof);
        uint256 totalVotesWithoutProof = contest.castVoteWithoutProof(proposalId, 0, 1000000000000000000);

        vm.stopPrank();

        assertEq(totalVotesWithoutProof, 10000000000000000000);
    }
}
