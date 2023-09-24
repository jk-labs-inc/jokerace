// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@forge-std/Test.sol";
import "@openzeppelin/token/ERC20/presets/ERC20PresetFixedSupply.sol";
import "../src/Contest.sol";
import "../src/modules/RewardsModule.sol";

contract RewardsModuleTest is Test {
    // CONTEST VARS
    Contest public contest;
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
    address public constant CREATOR_ADDRESS_1 = 0xc109636a2b47f8b290cc134dd446Fcd7d7e0cC94;
    address public constant PERMISSIONED_ADDRESS_1 = 0xd698e31229aB86334924ed9DFfd096a71C686900;
    address public constant PERMISSIONED_ADDRESS_2 = 0x5b45e296C06ab3dAD836BCBc0fBd7a4b75b83C02;
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
        targetMetadata: IGovernor.TargetMetadata({targetAddress: PERMISSIONED_ADDRESS_1}),
        safeMetadata: IGovernor.SafeMetadata({signers: safeSigners, threshold: SAFE_THRESHOLD})
    });
    IGovernor.ProposalCore public thirdProposalPA1 = IGovernor.ProposalCore({
        author: PERMISSIONED_ADDRESS_1,
        description: "thirdProposalPA1",
        exists: true,
        targetMetadata: IGovernor.TargetMetadata({targetAddress: PERMISSIONED_ADDRESS_1}),
        safeMetadata: IGovernor.SafeMetadata({signers: safeSigners, threshold: SAFE_THRESHOLD})
    });
    IGovernor.ProposalCore public firstProposalPA2 = IGovernor.ProposalCore({
        author: PERMISSIONED_ADDRESS_2,
        description: "firstProposalPA2",
        exists: true,
        targetMetadata: IGovernor.TargetMetadata({targetAddress: PERMISSIONED_ADDRESS_2}),
        safeMetadata: IGovernor.SafeMetadata({signers: safeSigners, threshold: SAFE_THRESHOLD})
    });

    // DELETION VARS
    uint256[] public proposalsToDelete;

    // REWARDS MODULE VARS
    RewardsModule public rewardsModulePaysTarget;
    RewardsModule public rewardsModulePaysAuthor;
    uint256[] public payees = [1, 2, 3];
    uint256[] public shares = [3, 2, 1];

    // ERC20 VARS
    ERC20PresetFixedSupply public testERC20;
    uint256 public constant INITIAL_TEST_ERC20_SUPPLY = 100;

    /////////////////////////////

    // SETUP

    function setUp() public {
        vm.startPrank(CREATOR_ADDRESS_1);

        testERC20 = new ERC20PresetFixedSupply("test", "TEST", INITIAL_TEST_ERC20_SUPPLY, CREATOR_ADDRESS_1);

        contest = new Contest("test",
                              "hello world",
                              SUBMISSION_MERKLE_ROOT,
                              VOTING_MERKLE_ROOT,
                              numParams);

        rewardsModulePaysTarget = new RewardsModule(payees,
                                          shares,
                                          GovernorCountingSimple(contest),
                                          true);

        rewardsModulePaysAuthor = new RewardsModule(payees,
                                          shares,
                                          GovernorCountingSimple(contest),
                                          false);

        vm.stopPrank();
    }

    /////////////////////////////

    // WITHDRAWALS

    // Only the creator can withdraw, and they can do so at any time
    function testCreatorWithdrawNative() public {
        vm.warp(1681650001);
        vm.deal(address(rewardsModulePaysAuthor), 100); // give the rewards module wei to be withdrawn
        vm.prank(CREATOR_ADDRESS_1);
        rewardsModulePaysAuthor.withdrawRewards();

        assertEq(CREATOR_ADDRESS_1.balance, 100);
    }

    // Only the creator can withdraw, and they can do so at any time
    function testCreatorWithdrawERC20() public {
        vm.warp(1681650001);
        vm.deal(address(rewardsModulePaysAuthor), 100); // give the rewards module wei to be withdrawn
        vm.prank(CREATOR_ADDRESS_1);
        rewardsModulePaysAuthor.withdrawRewards();

        assertEq(CREATOR_ADDRESS_1.balance, 100);
    }

    /////////////////////////////

    // REGULAR RELEASES

    //// PATTERN BELOW: AUTHOR + NATIVE, AUTHOR + ERC20, TARGET + NATIVE, TARGET + ERC20

    //// 1 PROPOSAL AT 1 VOTE

    // 1 proposal at 1 vote; release to author of rank 1
    function testReleaseToAuthorFirstPlace1WithNative() public {
        vm.startPrank(PERMISSIONED_ADDRESS_1);

        vm.warp(1681650001);
        uint256 proposalId = contest.propose(firstProposalPA1, submissionProof1);
        vm.warp(1681660001);
        contest.castVote(proposalId, 0, 10 ether, 1 ether, votingProof1);

        vm.warp(1681670001);
        vm.deal(address(rewardsModulePaysAuthor), 100); // give the rewards module wei to pay out
        rewardsModulePaysAuthor.release(proposalId);

        vm.stopPrank();

        assertEq(PERMISSIONED_ADDRESS_1.balance, 50);
    }

    // 1 proposal at 1 vote; release to author of rank 1
    function testReleaseToAuthorFirstPlace1WithERC20() public {
        vm.startPrank(PERMISSIONED_ADDRESS_1);

        vm.warp(1681650001);
        uint256 proposalId = contest.propose(firstProposalPA1, submissionProof1);
        vm.warp(1681660001);
        contest.castVote(proposalId, 0, 10 ether, 1 ether, votingProof1);

        vm.stopPrank();

        vm.warp(1681670001);
        vm.prank(CREATOR_ADDRESS_1);
        testERC20.transfer(address(rewardsModulePaysAuthor), 100); // give the rewards module ERC20 to pay out
        rewardsModulePaysAuthor.release(testERC20, proposalId);

        assertEq(testERC20.balanceOf(PERMISSIONED_ADDRESS_1), 50);
    }

    // 1 proposal at 1 vote; release to target of rank 1
    function testReleaseToTargetFirstPlace1WithNative() public {
        vm.startPrank(PERMISSIONED_ADDRESS_1);

        vm.warp(1681650001);
        uint256 proposalId = contest.propose(firstProposalPA1, submissionProof1);
        vm.warp(1681660001);
        contest.castVote(proposalId, 0, 10 ether, 1 ether, votingProof1);

        vm.warp(1681670001);
        vm.deal(address(rewardsModulePaysTarget), 100); // give the rewards module wei to pay out
        rewardsModulePaysTarget.release(proposalId);

        vm.stopPrank();

        assertEq(PERMISSIONED_ADDRESS_1.balance, 50);
    }

    // 1 proposal at 1 vote; release to target of rank 1
    function testReleaseToTargetFirstPlace1WithERC20() public {
        vm.startPrank(PERMISSIONED_ADDRESS_1);

        vm.warp(1681650001);
        uint256 proposalId = contest.propose(firstProposalPA1, submissionProof1);
        vm.warp(1681660001);
        contest.castVote(proposalId, 0, 10 ether, 1 ether, votingProof1);

        vm.stopPrank();

        vm.warp(1681670001);
        vm.prank(CREATOR_ADDRESS_1);
        testERC20.transfer(address(rewardsModulePaysTarget), 100); // give the rewards module ERC20 to pay out
        rewardsModulePaysTarget.release(testERC20, proposalId);

        assertEq(testERC20.balanceOf(PERMISSIONED_ADDRESS_1), 50);
    }

//     // 1 proposal at 1 vote; release to author of rank 2; revert with error message
//     function testReleaseToAuthorSecondPlace1WithNative() public {
//         vm.startPrank(PERMISSIONED_ADDRESS_1);

//         vm.warp(1681650001);
//         uint256 proposalId = contest.propose(firstProposalPA1, submissionProof1);
//         vm.warp(1681660001);
//         contest.castVote(proposalId, 0, 10 ether, 1 ether, votingProof1);

//         vm.stopPrank();

//         vm.warp(1681670001);
//         vm.deal(address(rewardsModulePaysAuthor), 100); // give the rewards module wei to pay out
//         vm.expectRevert(
//             bytes("RewardsModule: there are not enough proposals for that ranking to exist, taking ties into account")
//         );
//         rewardsModulePaysAuthor.release(2);
//     }

//     // 1 proposal at 1 vote; release to author of rank 2; revert with error message
//     function testReleaseToAuthorSecondPlace1WithERC20() public {
//         vm.startPrank(PERMISSIONED_ADDRESS_1);

//         vm.warp(1681650001);
//         uint256 proposalId = contest.propose(firstProposalPA1, submissionProof1);
//         vm.warp(1681660001);
//         contest.castVote(proposalId, 0, 10 ether, 1 ether, votingProof1);

//         vm.stopPrank();

//         vm.warp(1681670001);
//         vm.prank(CREATOR_ADDRESS_1);
//         testERC20.transfer(address(rewardsModulePaysAuthor), 100); // give the rewards module ERC20 to pay out
//         vm.expectRevert(
//             bytes("RewardsModule: there are not enough proposals for that ranking to exist, taking ties into account")
//         );
//         rewardsModulePaysAuthor.release(testERC20, 2);
//     }

//     // 1 proposal at 1 vote; release to target of rank 2; revert with error message
//     function testReleaseToTargetSecondPlace1WithNative() public {
//         vm.startPrank(PERMISSIONED_ADDRESS_1);

//         vm.warp(1681650001);
//         uint256 proposalId = contest.propose(firstProposalPA1, submissionProof1);
//         vm.warp(1681660001);
//         contest.castVote(proposalId, 0, 10 ether, 1 ether, votingProof1);

//         vm.stopPrank();

//         vm.warp(1681670001);
//         vm.deal(address(rewardsModulePaysTarget), 100); // give the rewards module wei to pay out
//         vm.expectRevert(
//             bytes("RewardsModule: there are not enough proposals for that ranking to exist, taking ties into account")
//         );
//         rewardsModulePaysTarget.release(2);
//     }

//     // 1 proposal at 1 vote; release to target of rank 2; revert with error message
//     function testReleaseToTargetSecondPlace1WithERC20() public {
//         vm.startPrank(PERMISSIONED_ADDRESS_1);

//         vm.warp(1681650001);
//         uint256 proposalId = contest.propose(firstProposalPA1, submissionProof1);
//         vm.warp(1681660001);
//         contest.castVote(proposalId, 0, 10 ether, 1 ether, votingProof1);

//         vm.stopPrank();

//         vm.warp(1681670001);
//         vm.prank(CREATOR_ADDRESS_1);
//         testERC20.transfer(address(rewardsModulePaysTarget), 100); // give the rewards module ERC20 to pay out
//         vm.expectRevert(
//             bytes("RewardsModule: there are not enough proposals for that ranking to exist, taking ties into account")
//         );
//         rewardsModulePaysTarget.release(testERC20, 2);
//     }

//     //// 2 PROPOSALS WITH DIFFERENT AUTHORS

//     // 2 proposals with different authors, at 1 and 5 votes; release to author of rank 1
//     function testReleaseToAuthorFirstPlace2WithNative() public {
//         vm.warp(1681650001);
//         vm.prank(PERMISSIONED_ADDRESS_1);
//         uint256 proposalId1 = contest.propose(firstProposalPA1, submissionProof1);
//         vm.prank(PERMISSIONED_ADDRESS_2);
//         uint256 proposalId2 = contest.propose(firstProposalPA2, submissionProof2);
//         vm.warp(1681660001);
//         vm.prank(PERMISSIONED_ADDRESS_1);
//         contest.castVote(proposalId1, 0, 10 ether, 1 ether, votingProof1);
//         vm.prank(PERMISSIONED_ADDRESS_1);
//         contest.castVote(proposalId2, 0, 10 ether, 5 ether, votingProof1);

//         vm.warp(1681670001);
//         vm.deal(address(rewardsModulePaysAuthor), 100); // give the rewards module wei to pay out
//         rewardsModulePaysAuthor.release(1);

//         assertEq(PERMISSIONED_ADDRESS_2.balance, 50);
//     }

//     // 2 proposals with different authors, at 1 and 5 votes; release to author of rank 1
//     function testReleaseToAuthorFirstPlace2WithERC20() public {
//         vm.warp(1681650001);
//         vm.prank(PERMISSIONED_ADDRESS_1);
//         uint256 proposalId1 = contest.propose(firstProposalPA1, submissionProof1);
//         vm.prank(PERMISSIONED_ADDRESS_2);
//         uint256 proposalId2 = contest.propose(firstProposalPA2, submissionProof2);
//         vm.warp(1681660001);
//         vm.prank(PERMISSIONED_ADDRESS_1);
//         contest.castVote(proposalId1, 0, 10 ether, 1 ether, votingProof1);
//         vm.prank(PERMISSIONED_ADDRESS_1);
//         contest.castVote(proposalId2, 0, 10 ether, 5 ether, votingProof1);

//         vm.warp(1681670001);
//         vm.prank(CREATOR_ADDRESS_1);
//         testERC20.transfer(address(rewardsModulePaysAuthor), 100); // give the rewards module ERC20 to pay out
//         rewardsModulePaysAuthor.release(testERC20, 1);

//         assertEq(testERC20.balanceOf(PERMISSIONED_ADDRESS_2), 50);
//     }

//     // 2 proposals with different authors, at 1 and 5 votes; release to target of rank 1
//     function testReleaseToTargetFirstPlace2WithNative() public {
//         vm.warp(1681650001);
//         vm.prank(PERMISSIONED_ADDRESS_1);
//         uint256 proposalId1 = contest.propose(firstProposalPA1, submissionProof1);
//         vm.prank(PERMISSIONED_ADDRESS_2);
//         uint256 proposalId2 = contest.propose(firstProposalPA2, submissionProof2);
//         vm.warp(1681660001);
//         vm.prank(PERMISSIONED_ADDRESS_1);
//         contest.castVote(proposalId1, 0, 10 ether, 1 ether, votingProof1);
//         vm.prank(PERMISSIONED_ADDRESS_1);
//         contest.castVote(proposalId2, 0, 10 ether, 5 ether, votingProof1);

//         vm.warp(1681670001);
//         vm.deal(address(rewardsModulePaysTarget), 100); // give the rewards module wei to pay out
//         rewardsModulePaysTarget.release(1);

//         assertEq(PERMISSIONED_ADDRESS_2.balance, 50);
//     }

//     // 2 proposals with different authors, at 1 and 5 votes; release to target of rank 1
//     function testReleaseToTargetFirstPlace2WithERC20() public {
//         vm.warp(1681650001);
//         vm.prank(PERMISSIONED_ADDRESS_1);
//         uint256 proposalId1 = contest.propose(firstProposalPA1, submissionProof1);
//         vm.prank(PERMISSIONED_ADDRESS_2);
//         uint256 proposalId2 = contest.propose(firstProposalPA2, submissionProof2);
//         vm.warp(1681660001);
//         vm.prank(PERMISSIONED_ADDRESS_1);
//         contest.castVote(proposalId1, 0, 10 ether, 1 ether, votingProof1);
//         vm.prank(PERMISSIONED_ADDRESS_1);
//         contest.castVote(proposalId2, 0, 10 ether, 5 ether, votingProof1);

//         vm.warp(1681670001);
//         vm.prank(CREATOR_ADDRESS_1);
//         testERC20.transfer(address(rewardsModulePaysTarget), 100); // give the rewards module ERC20 to pay out
//         rewardsModulePaysTarget.release(testERC20, 1);

//         assertEq(testERC20.balanceOf(PERMISSIONED_ADDRESS_2), 50);
//     }

//     /////////////////////////////

//     // TIES

//     //// 2 PROPOSALS WITH DIFFERENT AUTHORS

//     // 2 proposals with different authors, both at 1 vote; send back to creator
//     function testFirstPlaceTieWithNative() public {
//         vm.warp(1681650001);
//         vm.prank(PERMISSIONED_ADDRESS_1);
//         uint256 proposalId1 = contest.propose(firstProposalPA1, submissionProof1);
//         vm.prank(PERMISSIONED_ADDRESS_2);
//         uint256 proposalId2 = contest.propose(firstProposalPA2, submissionProof2);
//         vm.warp(1681660001);
//         vm.prank(PERMISSIONED_ADDRESS_1);
//         contest.castVote(proposalId1, 0, 10 ether, 1 ether, votingProof1);
//         vm.prank(PERMISSIONED_ADDRESS_1);
//         contest.castVote(proposalId2, 0, 10 ether, 1 ether, votingProof1);

//         vm.warp(1681670001);
//         vm.deal(address(rewardsModulePaysAuthor), 100); // give the rewards module wei to pay out
//         rewardsModulePaysAuthor.release(1);

//         assertEq(CREATOR_ADDRESS_1.balance, 50);
//     }

//     // 2 proposals with different authors, both at 1 vote; send back to creator
//     function testFirstPlaceTieWithERC20() public {
//         vm.warp(1681650001);
//         vm.prank(PERMISSIONED_ADDRESS_1);
//         uint256 proposalId1 = contest.propose(firstProposalPA1, submissionProof1);
//         vm.prank(PERMISSIONED_ADDRESS_2);
//         uint256 proposalId2 = contest.propose(firstProposalPA2, submissionProof2);
//         vm.warp(1681660001);
//         vm.prank(PERMISSIONED_ADDRESS_1);
//         contest.castVote(proposalId1, 0, 10 ether, 1 ether, votingProof1);
//         vm.prank(PERMISSIONED_ADDRESS_1);
//         contest.castVote(proposalId2, 0, 10 ether, 1 ether, votingProof1);

//         vm.warp(1681670001);
//         vm.prank(CREATOR_ADDRESS_1);
//         testERC20.transfer(address(rewardsModulePaysAuthor), 100); // give the rewards module ERC20 to pay out
//         rewardsModulePaysAuthor.release(testERC20, 1);

//         assertEq(testERC20.balanceOf(CREATOR_ADDRESS_1), 50);
//     }

//     // 2 proposals with different authors, both at 0 votes; send back to creator
//     function testFirstPlaceTieWithZeroVotesWithNative() public {
//         vm.warp(1681650001);
//         vm.prank(PERMISSIONED_ADDRESS_1);
//         contest.propose(firstProposalPA1, submissionProof1);
//         vm.prank(PERMISSIONED_ADDRESS_2);
//         contest.propose(firstProposalPA2, submissionProof2);

//         vm.warp(1681670001);
//         vm.deal(address(rewardsModulePaysAuthor), 100); // give the rewards module wei to pay out
//         rewardsModulePaysAuthor.release(1);

//         assertEq(CREATOR_ADDRESS_1.balance, 50);
//     }

//     // 2 proposals with different authors, both at 0 votes; send back to creator
//     function testFirstPlaceTieWithZeroVotesWithERC20() public {
//         vm.warp(1681650001);
//         vm.prank(PERMISSIONED_ADDRESS_1);
//         contest.propose(firstProposalPA1, submissionProof1);
//         vm.prank(PERMISSIONED_ADDRESS_2);
//         contest.propose(firstProposalPA2, submissionProof2);

//         vm.warp(1681670001);
//         vm.prank(CREATOR_ADDRESS_1);
//         testERC20.transfer(address(rewardsModulePaysAuthor), 100); // give the rewards module ERC20 to pay out
//         rewardsModulePaysAuthor.release(testERC20, 1);

//         assertEq(testERC20.balanceOf(CREATOR_ADDRESS_1), 50);
//     }

//     // 2 proposals with different authors, both at 0 votes; send back to creator
//     function testSecondPlaceTieWithZeroVotesWithNative() public {
//         vm.warp(1681650001);
//         vm.prank(PERMISSIONED_ADDRESS_1);
//         contest.propose(firstProposalPA1, submissionProof1);
//         vm.prank(PERMISSIONED_ADDRESS_2);
//         contest.propose(firstProposalPA2, submissionProof2);

//         vm.warp(1681670001);
//         vm.deal(address(rewardsModulePaysAuthor), 100); // give the rewards module wei to pay out
//         vm.expectRevert(
//             bytes("RewardsModule: there are not enough proposals for that ranking to exist, taking ties into account")
//         );
//         rewardsModulePaysAuthor.release(2);
//     }

//     // 2 proposals with different authors, both at 0 votes; send back to creator
//     function testSecondPlaceTieWithZeroVotesWithERC20() public {
//         vm.warp(1681650001);
//         vm.prank(PERMISSIONED_ADDRESS_1);
//         contest.propose(firstProposalPA1, submissionProof1);
//         vm.prank(PERMISSIONED_ADDRESS_2);
//         contest.propose(firstProposalPA2, submissionProof2);

//         vm.warp(1681670001);
//         vm.prank(CREATOR_ADDRESS_1);
//         testERC20.transfer(address(rewardsModulePaysAuthor), 100); // give the rewards module ERC20 to pay out
//         vm.expectRevert(
//             bytes("RewardsModule: there are not enough proposals for that ranking to exist, taking ties into account")
//         );
//         rewardsModulePaysAuthor.release(testERC20, 2);
//     }

//     //// 3 PROPOSALS FROM 2 DIFFERENT AUTHORS

//     // 3 proposals from 2 different authors, 1 at 3 votes and 2 at 1 vote; send back to creator
//     function testSecondPlaceTieWithNative() public {
//         vm.warp(1681650001);
//         vm.prank(PERMISSIONED_ADDRESS_1);
//         uint256 proposalId1 = contest.propose(firstProposalPA1, submissionProof1);
//         vm.prank(PERMISSIONED_ADDRESS_1);
//         uint256 proposalId2 = contest.propose(secondProposalPA1, submissionProof1);
//         vm.prank(PERMISSIONED_ADDRESS_2);
//         uint256 proposalId3 = contest.propose(firstProposalPA2, submissionProof2);
//         vm.warp(1681660001);
//         vm.startPrank(PERMISSIONED_ADDRESS_1);
//         contest.castVote(proposalId1, 0, 10 ether, 3 ether, votingProof1);
//         contest.castVote(proposalId2, 0, 10 ether, 1 ether, votingProof1);
//         contest.castVote(proposalId3, 0, 10 ether, 1 ether, votingProof1);
//         vm.stopPrank();

//         vm.warp(1681670001);
//         vm.deal(address(rewardsModulePaysAuthor), 100); // give the rewards module wei to pay out
//         rewardsModulePaysAuthor.release(2);

//         assertEq(CREATOR_ADDRESS_1.balance, 33);
//     }

//     // 3 proposals from 2 different authors, 1 at 3 votes and 2 at 1 vote; send back to creator
//     function testSecondPlaceTieWithERC20() public {
//         vm.warp(1681650001);
//         vm.prank(PERMISSIONED_ADDRESS_1);
//         uint256 proposalId1 = contest.propose(firstProposalPA1, submissionProof1);
//         vm.prank(PERMISSIONED_ADDRESS_1);
//         uint256 proposalId2 = contest.propose(secondProposalPA1, submissionProof1);
//         vm.prank(PERMISSIONED_ADDRESS_2);
//         uint256 proposalId3 = contest.propose(firstProposalPA2, submissionProof2);
//         vm.warp(1681660001);
//         vm.startPrank(PERMISSIONED_ADDRESS_1);
//         contest.castVote(proposalId1, 0, 10 ether, 3 ether, votingProof1);
//         contest.castVote(proposalId2, 0, 10 ether, 1 ether, votingProof1);
//         contest.castVote(proposalId3, 0, 10 ether, 1 ether, votingProof1);
//         vm.stopPrank();

//         vm.warp(1681670001);
//         vm.prank(CREATOR_ADDRESS_1);
//         testERC20.transfer(address(rewardsModulePaysAuthor), 100); // give the rewards module ERC20 to pay out
//         rewardsModulePaysAuthor.release(testERC20, 2);

//         assertEq(testERC20.balanceOf(CREATOR_ADDRESS_1), 33);
//     }

//     //// 4 PROPOSALS FROM 2 DIFFERENT AUTHORS

//     // 4 proposals from 2 different authors, 1 at 3 votes and 2 at 2 votes, and 1 at 1 vote; send back to creator
//     function testSecondPlaceTiePayOutThirdPlaceWithNative() public {
//         vm.warp(1681650001);
//         vm.prank(PERMISSIONED_ADDRESS_1);
//         uint256 proposalId1 = contest.propose(firstProposalPA1, submissionProof1);
//         vm.prank(PERMISSIONED_ADDRESS_1);
//         uint256 proposalId2 = contest.propose(secondProposalPA1, submissionProof1);
//         vm.prank(PERMISSIONED_ADDRESS_2);
//         uint256 proposalId3 = contest.propose(firstProposalPA2, submissionProof2);
//         vm.prank(PERMISSIONED_ADDRESS_1);
//         uint256 proposalId4 = contest.propose(thirdProposalPA1, submissionProof1);
//         vm.warp(1681660001);
//         vm.startPrank(PERMISSIONED_ADDRESS_1);
//         contest.castVote(proposalId1, 0, 10 ether, 3 ether, votingProof1);
//         contest.castVote(proposalId2, 0, 10 ether, 2 ether, votingProof1);
//         contest.castVote(proposalId3, 0, 10 ether, 2 ether, votingProof1);
//         contest.castVote(proposalId4, 0, 10 ether, 1 ether, votingProof1);
//         vm.stopPrank();

//         vm.warp(1681670001);
//         vm.deal(address(rewardsModulePaysAuthor), 100); // give the rewards module wei to pay out
//         rewardsModulePaysAuthor.release(3);

//         assertEq(CREATOR_ADDRESS_1.balance, 16);
//     }

//     // 4 proposals from 2 different authors, 1 at 3 votes and 2 at 2 votes, and 1 at 1 vote; send back to creator
//     function testSecondPlaceTiePayOutThirdPlaceWithERC20() public {
//         vm.warp(1681650001);
//         vm.prank(PERMISSIONED_ADDRESS_1);
//         uint256 proposalId1 = contest.propose(firstProposalPA1, submissionProof1);
//         vm.prank(PERMISSIONED_ADDRESS_1);
//         uint256 proposalId2 = contest.propose(secondProposalPA1, submissionProof1);
//         vm.prank(PERMISSIONED_ADDRESS_2);
//         uint256 proposalId3 = contest.propose(firstProposalPA2, submissionProof2);
//         vm.prank(PERMISSIONED_ADDRESS_1);
//         uint256 proposalId4 = contest.propose(thirdProposalPA1, submissionProof1);
//         vm.warp(1681660001);
//         vm.startPrank(PERMISSIONED_ADDRESS_1);
//         contest.castVote(proposalId1, 0, 10 ether, 3 ether, votingProof1);
//         contest.castVote(proposalId2, 0, 10 ether, 2 ether, votingProof1);
//         contest.castVote(proposalId3, 0, 10 ether, 2 ether, votingProof1);
//         contest.castVote(proposalId4, 0, 10 ether, 1 ether, votingProof1);
//         vm.stopPrank();

//         vm.warp(1681670001);
//         vm.prank(CREATOR_ADDRESS_1);
//         testERC20.transfer(address(rewardsModulePaysAuthor), 100); // give the rewards module ERC20 to pay out
//         rewardsModulePaysAuthor.release(testERC20, 3);

//         assertEq(testERC20.balanceOf(CREATOR_ADDRESS_1), 16);
//     }

//     /////////////////////////////

//     // NO PROPOSALS

//     // No proposals; revert with error message
//     function testFirstPlaceTieWithZeroProposalsWithNative() public {
//         vm.warp(1681670001);
//         vm.deal(address(rewardsModulePaysAuthor), 100); // give the rewards module wei to pay out
//         vm.expectRevert(bytes("GovernorSorting: cannot sort a list of zero length"));
//         rewardsModulePaysAuthor.release(1);
//     }

//     // No proposals; revert with error message
//     function testFirstPlaceTieWithZeroProposalsWithERC20() public {
//         vm.warp(1681670001);
//         vm.prank(CREATOR_ADDRESS_1);
//         testERC20.transfer(address(rewardsModulePaysAuthor), 100); // give the rewards module ERC20 to pay out
//         vm.expectRevert(bytes("GovernorSorting: cannot sort a list of zero length"));
//         rewardsModulePaysAuthor.release(testERC20, 1);
//     }

//     /////////////////////////////

//     // RELEASES WITH DELETIONS

//     //// 2 PROPOSALS WITH DIFFERENT AUTHORS, 1 DELETED

//     // 2 proposals with different authors, at 1 and 5 votes, the one with 5 votes is deleted; release to author of rank 1
//     function testReleaseToAuthorFirstPlace2WithActualFirstPlaceDeleted() public {
//         vm.warp(1681650001);
//         vm.prank(PERMISSIONED_ADDRESS_1);
//         uint256 proposalId1 = contest.propose(firstProposalPA1, submissionProof1);
//         vm.prank(PERMISSIONED_ADDRESS_2);
//         uint256 proposalId2 = contest.propose(firstProposalPA2, submissionProof2);
//         vm.warp(1681660001);
//         vm.prank(PERMISSIONED_ADDRESS_1);
//         contest.castVote(proposalId1, 0, 10 ether, 1 ether, votingProof1);
//         vm.prank(PERMISSIONED_ADDRESS_1);
//         contest.castVote(proposalId2, 0, 10 ether, 5 ether, votingProof1);

//         proposalsToDelete.push(proposalId2);
//         vm.prank(CREATOR_ADDRESS_1);
//         contest.deleteProposals(proposalsToDelete);

//         vm.warp(1681670001);
//         vm.deal(address(rewardsModulePaysAuthor), 100); // give the rewards module wei to pay out
//         rewardsModulePaysAuthor.release(1);

//         assertEq(PERMISSIONED_ADDRESS_1.balance, 50);
//     }

//     // 2 proposals with different authors, at 1 and 5 votes, the one with 1 vote is deleted; release to author of rank 1
//     function testReleaseToAuthorFirstPlace2WithActualSecondPlaceDeleted() public {
//         vm.warp(1681650001);
//         vm.prank(PERMISSIONED_ADDRESS_1);
//         uint256 proposalId1 = contest.propose(firstProposalPA1, submissionProof1);
//         vm.prank(PERMISSIONED_ADDRESS_2);
//         uint256 proposalId2 = contest.propose(firstProposalPA2, submissionProof2);
//         vm.warp(1681660001);
//         vm.prank(PERMISSIONED_ADDRESS_1);
//         contest.castVote(proposalId1, 0, 10 ether, 1 ether, votingProof1);
//         vm.prank(PERMISSIONED_ADDRESS_1);
//         contest.castVote(proposalId2, 0, 10 ether, 5 ether, votingProof1);

//         proposalsToDelete.push(proposalId1);
//         vm.prank(CREATOR_ADDRESS_1);
//         contest.deleteProposals(proposalsToDelete);

//         vm.warp(1681670001);
//         vm.deal(address(rewardsModulePaysAuthor), 100); // give the rewards module wei to pay out
//         rewardsModulePaysAuthor.release(1);

//         assertEq(PERMISSIONED_ADDRESS_2.balance, 50);
//     }

//     /////////////////////////////
}
