// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@forge-std/Test.sol";
import "../src/Contest.sol";

contract ContestTest is Test {
    Contest public contest;
    Contest public anyoneCanSubmitContest;
    uint64 public constant CONTEST_START = 1681650000;
    uint64 public constant VOTING_DELAY = 10000;
    uint64 public constant VOTING_PERIOD = 10000;
    uint64 public constant NUM_ALLOWED_PROPOSAL_SUBMISSIONS = 3;
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
        Voting merkle tree:
        {
            "decimals": 18,
            "airdrop": {
                "0xd698e31229aB86334924ed9DFfd096a71C686900": 10,
                "0x5b45e296C06ab3dAD836BCBc0fBd7a4b75b83C02": 100
            }
        }

        Submission merkle tree (both are value 10 because that's just the dummy value 
        that we make proposal merkle trees have and check against for a simpler flow):
        {
            "decimals": 18,
            "airdrop": {
                "0xd698e31229aB86334924ed9DFfd096a71C686900": 10,
                "0x5b45e296C06ab3dAD836BCBc0fBd7a4b75b83C02": 10
            }
        }
    */
    bytes32 public constant VOTING_MERKLE_ROOT =
        bytes32(0xdb0fd5147843d56c8f32dd8b2ab5bfe04c1fe199d121790ff805fb0f0f7019c5);
    bytes32 public constant SUBMISSION_MERKLE_ROOT =
        bytes32(0x7665f9790e783f13b614dacf6e7624e755b188e1bb086d301855d73f9b81fa85);
    bytes32 public constant SUB_ZERO_MERKLE_ROOT =
        bytes32(0x0000000000000000000000000000000000000000000000000000000000000000);
    address public constant CREATOR_ADDRESS_1 = 0xc109636a2b47f8b290cc134dd446Fcd7d7e0cC94;
    address public constant PERMISSIONED_ADDRESS_1 = 0xd698e31229aB86334924ed9DFfd096a71C686900;
    address public constant PERMISSIONED_ADDRESS_2 = 0x5b45e296C06ab3dAD836BCBc0fBd7a4b75b83C02;
    address public constant UNPERMISSIONED_ADDRESS_1 = 0x016C8780e5ccB32E5CAA342a926794cE64d9C364;
    bytes32[] public proof0 = [bytes32(0x0000000000000000000000000000000000000000000000000000000000000000)];
    bytes32[] public votingProof1 = [bytes32(0xf712e9f1bed1665ca7b426db8e09d438375a76fc5cf8052b6abae75233a117e7)];
    bytes32[] public votingProof2 = [bytes32(0x3704b461c09457df5491016097977d5364e607b59049ca6d36dfb9c16d03a2bf)];
    bytes32[] public submissionProof1 = [bytes32(0x3525e2aa1b921658191cfccf7e63bf6bcac64a0315ca9eb04f2bcc08975d431f)];
    bytes32[] public submissionProof2 = [bytes32(0x3704b461c09457df5491016097977d5364e607b59049ca6d36dfb9c16d03a2bf)];
    address[] public safeSigners = [address(0)];
    uint8 public constant SAFE_THRESHOLD = 1;

    IGovernor.ProposalCore public firstProposalPA1 = IGovernor.ProposalCore({
        author: PERMISSIONED_ADDRESS_1,
        description: "firstProposalPA1",
        exists: true,
        targetMetadata: IGovernor.TargetMetadata({targetAddress: PERMISSIONED_ADDRESS_1}),
        safeMetadata: IGovernor.SafeMetadata({signers: safeSigners, threshold: SAFE_THRESHOLD})
    });
    IGovernor.ProposalCore public secondProposalPA1 = IGovernor.ProposalCore({
        author: PERMISSIONED_ADDRESS_1,
        description: "secondProposalPA1",
        exists: true,
        targetMetadata: IGovernor.TargetMetadata({targetAddress: PERMISSIONED_ADDRESS_2}),
        safeMetadata: IGovernor.SafeMetadata({signers: safeSigners, threshold: SAFE_THRESHOLD})
    });
    IGovernor.ProposalCore public firstProposalPA2 = IGovernor.ProposalCore({
        author: PERMISSIONED_ADDRESS_2,
        description: "firstProposalPA2",
        exists: true,
        targetMetadata: IGovernor.TargetMetadata({targetAddress: PERMISSIONED_ADDRESS_2}),
        safeMetadata: IGovernor.SafeMetadata({signers: safeSigners, threshold: SAFE_THRESHOLD})
    });
    IGovernor.ProposalCore public unpermissionedAuthorProposal1 = IGovernor.ProposalCore({
        author: UNPERMISSIONED_ADDRESS_1,
        description: "unpermissionedAuthorProposal1",
        exists: true,
        targetMetadata: IGovernor.TargetMetadata({targetAddress: PERMISSIONED_ADDRESS_1}),
        safeMetadata: IGovernor.SafeMetadata({signers: safeSigners, threshold: SAFE_THRESHOLD})
    });

    function setUp() public {
        vm.startPrank(CREATOR_ADDRESS_1);

        contest = new Contest("test",
                              "hello world",
                              SUBMISSION_MERKLE_ROOT,
                              VOTING_MERKLE_ROOT,
                              numParams);

        anyoneCanSubmitContest = new Contest("test",
                              "hello world",
                              SUB_ZERO_MERKLE_ROOT,
                              VOTING_MERKLE_ROOT,
                              numParams);

        vm.stopPrank();
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
        assertEq(contest.creator(), CREATOR_ADDRESS_1);
    }

    // PROPOSING AND VOTING

    function testValidate() public {
        vm.prank(PERMISSIONED_ADDRESS_1);
        bool validated = contest.validateProposalData(firstProposalPA1);

        assertEq(validated, true);
    }

    function testPropose() public {
        vm.warp(1681650001);
        vm.prank(PERMISSIONED_ADDRESS_1);
        uint256 proposalId = contest.propose(firstProposalPA1, submissionProof1);

        assertEq(proposalId, 49056523107705728825615382688395286440062072247511095534135796452139198417529);
    }

    function testProposeAnyone() public {
        vm.warp(1681650001);
        vm.prank(UNPERMISSIONED_ADDRESS_1);
        uint256 proposalId = anyoneCanSubmitContest.propose(unpermissionedAuthorProposal1, proof0);

        assertEq(proposalId, 98473096201093600303872109595179192229910158899541901113356700720980320499920);
    }

    function testProposeWithoutProof() public {
        vm.warp(1681650001);
        vm.startPrank(PERMISSIONED_ADDRESS_1);
        uint256 firstProposalId = contest.propose(firstProposalPA1, submissionProof1);
        uint256 secondProposalId = contest.proposeWithoutProof(secondProposalPA1);
        vm.stopPrank();

        assertEq(firstProposalId, 49056523107705728825615382688395286440062072247511095534135796452139198417529);
        assertEq(secondProposalId, 54769785658820412218609810676735378376293272785081650547477539805570535635325);
    }

    function testProposeAnyoneWithoutProof() public {
        vm.warp(1681650001);
        vm.prank(UNPERMISSIONED_ADDRESS_1);
        uint256 proposalId = anyoneCanSubmitContest.proposeWithoutProof(unpermissionedAuthorProposal1);

        assertEq(proposalId, 98473096201093600303872109595179192229910158899541901113356700720980320499920);
    }

    function testProposeAuthorIsntSender() public {
        vm.warp(1681650001);
        vm.prank(PERMISSIONED_ADDRESS_1);
        vm.expectRevert(bytes("Governor: the proposal author must be msg.sender"));
        contest.propose(unpermissionedAuthorProposal1, submissionProof1);
    }

    function testProposeWithoutProofAuthorIsntSender() public {
        vm.warp(1681650001);
        vm.prank(PERMISSIONED_ADDRESS_1);
        contest.propose(firstProposalPA1, submissionProof1);
        vm.prank(PERMISSIONED_ADDRESS_1);
        vm.expectRevert(bytes("Governor: the proposal author must be msg.sender"));
        contest.proposeWithoutProof(unpermissionedAuthorProposal1);
    }

    function testVote1() public {
        vm.startPrank(PERMISSIONED_ADDRESS_1);

        vm.warp(1681650001);
        uint256 proposalId = contest.propose(firstProposalPA1, submissionProof1);
        vm.warp(1681660001);
        uint256 totalVotes = contest.castVote(proposalId, 0, 10 ether, 1 ether, votingProof1);

        vm.stopPrank();

        assertEq(totalVotes, 10 ether);
    }

    function testVote2() public {
        vm.warp(1681650001);
        vm.prank(PERMISSIONED_ADDRESS_1);
        uint256 proposalId = contest.propose(firstProposalPA1, submissionProof1);
        vm.warp(1681660001);
        vm.prank(PERMISSIONED_ADDRESS_2);
        uint256 totalVotes = contest.castVote(proposalId, 0, 100 ether, 1 ether, votingProof2);

        assertEq(totalVotes, 100 ether);
    }

    function testVoteWithoutProof() public {
        vm.startPrank(PERMISSIONED_ADDRESS_1);

        vm.warp(1681650001);
        uint256 proposalId = contest.propose(firstProposalPA1, submissionProof1);
        vm.warp(1681660001);
        contest.castVote(proposalId, 0, 10 ether, 1 ether, votingProof1);
        uint256 totalVotesWithoutProof = contest.castVoteWithoutProof(proposalId, 0, 1 ether);

        vm.stopPrank();

        assertEq(totalVotesWithoutProof, 10 ether);
    }
}
