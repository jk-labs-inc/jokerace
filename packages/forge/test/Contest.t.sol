// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.19;

import "@forge-std/Test.sol";
import "../src/Contest.sol";
import "../src/governance/Governor.sol";

contract ContestTest is Test {
    Contest public contest;
    Contest public anyoneCanSubmitContest;
    Contest public anyoneCanSubmitCostsAnEthContest;
    Contest public payPerVoteExpCurveContest;

    // BASIC INT PARAMS
    uint64 public constant CONTEST_START = 1681650000;
    uint64 public constant VOTING_DELAY = 10000;
    uint64 public constant VOTING_PERIOD = 10000;
    uint64 public constant NUM_ALLOWED_PROPOSAL_SUBMISSIONS = 3;
    uint64 public constant MAX_PROPOSAL_COUNT = 100;
    uint64 public constant ANYONE_CAN_SUBMIT = 1;

    // COST PARAMS
    uint256 public constant FIFTY_PERCENT_TO_CREATOR = 50;
    uint256 public constant ZERO_COST_TO_PROPOSE = 0;
    uint256 public constant ONE_ETH_COST_TO_PROPOSE = 1 ether;
    uint256 public constant ZERO_COST_TO_VOTE = 0;
    uint256 public constant STANDARD_COST_TO_VOTE = 100000000000000;
    uint256 public constant FLAT_PRICE_CURVE_TYPE = 0;
    uint256 public constant EXPONENTIAL_PRICE_CURVE_TYPE = 1;
    uint256 public constant ZERO_EXPONENT_MULTIPLE = 0;
    uint256 public constant STANDARD_EXPONENT_MULTIPLE = 33000000000000000; // for a terminal value 10x from min
    address public constant CREATOR_SPLIT_DESTINATION = CREATOR_ADDRESS;
    address public constant JK_LABS_SPLIT_DESTINATION = JK_LABS_ADDRESS;

    // SORTING INT PARAMS
    uint256 public constant SORTING_ENABLED = 1;
    uint256 public constant RANK_LIMIT_250 = 250;

    // METADATA CONSTRUCTOR PARAMS
    string public constant METADATA_FIELDS_SCHEMA =
        "{\'Test Address Field\': \'address\', \'Test String Field\': \'string\', \'Test Uint Field\': \'uint256\'}";

    Governor.IntConstructorArgs public payPerVoteExpCurveIntConstructorArgs = Governor.IntConstructorArgs(
        CONTEST_START,
        VOTING_DELAY,
        VOTING_PERIOD,
        NUM_ALLOWED_PROPOSAL_SUBMISSIONS,
        MAX_PROPOSAL_COUNT,
        SORTING_ENABLED,
        RANK_LIMIT_250,
        FIFTY_PERCENT_TO_CREATOR,
        ZERO_COST_TO_PROPOSE,
        STANDARD_COST_TO_VOTE,
        EXPONENTIAL_PRICE_CURVE_TYPE,
        STANDARD_EXPONENT_MULTIPLE,
        ANYONE_CAN_SUBMIT
    );

    Governor.ConstructorArgs public payPerVoteExpCurveNumParams = Governor.ConstructorArgs(
        payPerVoteExpCurveIntConstructorArgs,
        CREATOR_SPLIT_DESTINATION,
        JK_LABS_SPLIT_DESTINATION,
        METADATA_FIELDS_SCHEMA
    );

    address public constant JK_LABS_ADDRESS = 0xDc652C746A8F85e18Ce632d97c6118e8a52fa738;
    address public constant CREATOR_ADDRESS = 0xc109636a2b47f8b290cc134dd446Fcd7d7e0cC94;
    address public constant TEST_ADDRESS_1 = 0xd698e31229aB86334924ed9DFfd096a71C686900;
    address public constant TEST_ADDRESS_2 = 0x016C8780e5ccB32E5CAA342a926794cE64d9C364;

    // METADATA PARAMS
    address[] public safeSigners = [address(0)];
    uint8 public constant SAFE_THRESHOLD = 1;
    address[] public METADATA_FIELDS_ADDRESS_ARRAY = [CREATOR_ADDRESS]; // placeholder value
    string[] public METADATA_FIELDS_STRING_ARRAY = [METADATA_FIELDS_SCHEMA]; // placeholder value
    uint256[] public METADATA_FIELDS_UINT_ARRAY = [SAFE_THRESHOLD]; // placeholder value

    // PROPOSALS PARAMS
    uint256[] public proposalsToDelete;

    Governor.ProposalCore public firstProposal = Governor.ProposalCore({
        author: CREATOR_ADDRESS,
        description: "firstProposal",
        exists: true,
        targetMetadata: Governor.TargetMetadata({targetAddress: CREATOR_ADDRESS}),
        safeMetadata: Governor.SafeMetadata({signers: safeSigners, threshold: SAFE_THRESHOLD}),
        fieldsMetadata: Governor.FieldsMetadata({
            addressArray: METADATA_FIELDS_ADDRESS_ARRAY,
            stringArray: METADATA_FIELDS_STRING_ARRAY,
            uintArray: METADATA_FIELDS_UINT_ARRAY
        })
    });
    Governor.ProposalCore public secondProposal = Governor.ProposalCore({
        author: TEST_ADDRESS_1,
        description: "secondProposal",
        exists: true,
        targetMetadata: Governor.TargetMetadata({targetAddress: TEST_ADDRESS_1}),
        safeMetadata: Governor.SafeMetadata({signers: safeSigners, threshold: SAFE_THRESHOLD}),
        fieldsMetadata: Governor.FieldsMetadata({
            addressArray: METADATA_FIELDS_ADDRESS_ARRAY,
            stringArray: METADATA_FIELDS_STRING_ARRAY,
            uintArray: METADATA_FIELDS_UINT_ARRAY
        })
    });

    /////////////////////////////

    // SETUP

    function setUp() public {
        vm.startPrank(CREATOR_ADDRESS);

        contest =
            new Contest("test", "hello world", payPerVoteExpCurveNumParams);

        vm.stopPrank();
    }

    /////////////////////////////

    // GOVERNOR SETTINGS

    function testContestStart() public view {
        assertEq(contest.contestStart(), CONTEST_START);
    }

    function testVotingDelay() public view {
        assertEq(contest.votingDelay(), VOTING_DELAY);
    }

    function testVotingPeriod() public view {
        assertEq(contest.votingPeriod(), VOTING_PERIOD);
    }

    function testNumAllowedProposalSubmissions() public view {
        assertEq(contest.numAllowedProposalSubmissions(), NUM_ALLOWED_PROPOSAL_SUBMISSIONS);
    }

    function testMaxProposalCount() public view {
        assertEq(contest.maxProposalCount(), MAX_PROPOSAL_COUNT);
    }

    function testCreator() public view {
        assertEq(contest.creator(), CREATOR_ADDRESS);
    }

    /////////////////////////////

    // PROPOSING

    function testValidate() public {
        vm.prank(TEST_ADDRESS_1);
        contest.validateProposalData(firstProposal);
    }

    function testPropose() public {
        vm.warp(1681650001);
        vm.prank(TEST_ADDRESS_1);
        uint256 proposalId = contest.propose(firstProposal);
    }

    function testProposeDuplicateProposal() public {
        vm.warp(1681650001);
        vm.startPrank(TEST_ADDRESS_1);
        uint256 proposalId = contest.propose(firstProposal);
        vm.expectRevert(abi.encodeWithSelector(Governor.DuplicateSubmission.selector, proposalId));
        contest.propose(firstProposal);
        vm.stopPrank();
    }

    function testDeleteProposal() public {
        vm.warp(1681650001);
        vm.prank(TEST_ADDRESS_1);
        uint256 proposalId = contest.propose(firstProposal);

        proposalsToDelete.push(proposalId);
        vm.prank(CREATOR_ADDRESS);
        contest.deleteProposals(proposalsToDelete);
        assertEq(contest.proposalIsDeleted(proposalId), true);
    }

    function testProposeAnyoneCanCostIsOneEther() public {
        vm.warp(1681650001);
        vm.deal(address(UNTEST_ADDRESS_1), 1 ether); // give the proposer wei to pay the cost to propose
        vm.prank(UNTEST_ADDRESS_1);
        uint256 proposalId =
            anyoneCanSubmitCostsAnEthContest.propose{value: 1 ether}(unpermissionedAuthorProposal1, proof0);

        assertEq(proposalId, 115165251560031427429607767944389537131137037929814060832786039738764740468274);
        assertEq(CREATOR_ADDRESS.balance, 0.5 ether);
        assertEq(JK_LABS_ADDRESS.balance, 0.5 ether);
    }

    function testProposeAnyoneCanCostIsOneEtherNoMsgValue() public {
        vm.warp(1681650001);
        vm.prank(UNTEST_ADDRESS_1);
        vm.expectRevert(abi.encodeWithSelector(Governor.IncorrectCostSent.selector, 0, 1 ether));
        anyoneCanSubmitCostsAnEthContest.propose(unpermissionedAuthorProposal1, proof0);
    }

    function testProposeAnyoneCanCostIsOneEtherTooMuchMsgValue() public {
        vm.warp(1681650001);
        vm.deal(address(UNTEST_ADDRESS_1), 2 ether); // give the proposer wei to pay the cost to propose
        vm.prank(UNTEST_ADDRESS_1);
        vm.expectRevert(abi.encodeWithSelector(Governor.IncorrectCostSent.selector, 2 ether, 1 ether));
        anyoneCanSubmitCostsAnEthContest.propose{value: 2 ether}(unpermissionedAuthorProposal1, proof0);
    }

    /////////////////////////////

    // VOTING

    function testVote1() public {
        vm.startPrank(TEST_ADDRESS_1);

        vm.warp(1681650001);
        uint256 proposalId = contest.propose(firstProposal);
        vm.warp(1681660001);
        uint256 numVotes = contest.castVote(proposalId, 10 ether);

        vm.stopPrank();

        assertEq(numVotes, 10 ether);
    }

    function testVote2() public {
        vm.warp(1681650001);
        vm.prank(TEST_ADDRESS_1);
        uint256 proposalId = contest.propose(firstProposal, submissionProof1);
        vm.warp(1681660001);
        vm.prank(TEST_ADDRESS_2);
        uint256 numVotes = contest.castVote(proposalId, 100 ether);

        assertEq(totalVotes, 100 ether);
    }

    function testVoteWithoutProof() public {
        vm.startPrank(TEST_ADDRESS_1);

        vm.warp(1681650001);
        uint256 proposalId = contest.propose(firstProposal, submissionProof1);
        vm.warp(1681660001);
        contest.castVote(proposalId, 10 ether, 1 ether, votingProof1);
        uint256 totalVotesWithoutProof = contest.castVoteWithoutProof(proposalId, 1 ether);

        vm.stopPrank();

        assertEq(totalVotesWithoutProof, 10 ether);
    }

    function testVoteExpCurve1() public {
        vm.warp(1681665000);
        assertEq(payPerVoteExpCurveContest.currentPricePerVote(), 312000000000000); // 49.8% of way through
    }

    function testVoteExpCurve2() public {
        vm.warp(1681670000);
        assertEq(payPerVoteExpCurveContest.currentPricePerVote(), 975000000000000); // 99.6% of way through
    }

    function testCreatorCancelBeforeFirstVote() public {
        vm.startPrank(TEST_ADDRESS_1);
        vm.warp(1681650001);
        contest.propose(firstProposal, submissionProof1);
        vm.stopPrank();

        vm.prank(CREATOR_ADDRESS);
        contest.cancel();

        assertEq(contest.canceled(), true);
    }

    function testCreatorCancelAfterFirstVote() public {
        vm.startPrank(TEST_ADDRESS_1);
        vm.warp(1681650001);
        uint256 proposalId = contest.propose(firstProposal, submissionProof1);
        vm.warp(1681660001);
        contest.castVote(proposalId, 10 ether, 1 ether, votingProof1);
        vm.stopPrank();

        vm.startPrank(CREATOR_ADDRESS);
        vm.expectRevert(abi.encodeWithSelector(Governor.CanOnlyCancelBeforeFirstVote.selector));
        contest.cancel();
        vm.stopPrank();
    }

    function testJkLabsCancelBeforeFirstVote() public {
        vm.startPrank(TEST_ADDRESS_1);
        vm.warp(1681650001);
        contest.propose(firstProposal, submissionProof1);
        vm.stopPrank();

        vm.prank(JK_LABS_ADDRESS);
        contest.cancel();

        assertEq(contest.canceled(), true);
    }

    function testJkLabsCancelAfterFirstVote() public {
        vm.startPrank(TEST_ADDRESS_1);
        vm.warp(1681650001);
        uint256 proposalId = contest.propose(firstProposal);
        vm.warp(1681660001);
        contest.castVote(proposalId, 10 ether);
        vm.stopPrank();

        vm.startPrank(JK_LABS_ADDRESS);
        vm.expectRevert(abi.encodeWithSelector(Governor.CanOnlyCancelBeforeFirstVote.selector));
        contest.cancel();
        vm.stopPrank();
    }

    /////////////////////////////
}
