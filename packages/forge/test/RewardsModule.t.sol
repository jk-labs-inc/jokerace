// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@forge-std/Test.sol";
import "../src/Contest.sol";
import "../src/modules/RewardsModule.sol";

contract RewardsModuleTest is Test {
    // CONTEST VARS
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

    address public constant TARGET_ADDRESS = 0xd698e31229aB86334924ed9DFfd096a71C686900;
    address[] public safeSigners = [address(0)];
    uint8 public constant SAFE_THRESHOLD = 1;

    IGovernor.ProposalCore public proposal = IGovernor.ProposalCore({
        author: PERMISSIONED_ADDRESS,
        description: "proposalDescription",
        exists: true,
        targetMetadata: IGovernor.TargetMetadata({targetAddress: TARGET_ADDRESS}),
        safeMetadata: IGovernor.SafeMetadata({signers: safeSigners, threshold: SAFE_THRESHOLD})
    });
    IGovernor.ProposalCore public secondProposal = IGovernor.ProposalCore({
        author: PERMISSIONED_ADDRESS,
        description: "secondProposalDescription",
        exists: true,
        targetMetadata: IGovernor.TargetMetadata({targetAddress: TARGET_ADDRESS}),
        safeMetadata: IGovernor.SafeMetadata({signers: safeSigners, threshold: SAFE_THRESHOLD})
    });

    // REWARDS MODULE VARS
    RewardsModule public rewardsModulePaysTarget;
    RewardsModule public rewardsModulePaysAuthor;
    uint256[] public payees = [1, 2, 3];
    uint256[] public shares = [3, 2, 1];

    // SETUP

    function setUp() public {
        vm.prank(PERMISSIONED_ADDRESS);

        contest = new Contest("test",
                              "hello world",
                              SUB_AND_VOTING_MERKLE_ROOT,
                              SUB_AND_VOTING_MERKLE_ROOT,
                              numParams);

        rewardsModulePaysTarget = new RewardsModule(payees,
                                          shares,
                                          GovernorCountingSimple(contest),
                                          true);

        rewardsModulePaysAuthor = new RewardsModule(payees,
                                          shares,
                                          GovernorCountingSimple(contest),
                                          false);
    }

    // REWARDS

    function testReleaseToAuthor1() public {
        vm.startPrank(PERMISSIONED_ADDRESS);

        vm.warp(1681650001);
        uint256 proposalId = contest.propose(proposal, proof);
        vm.warp(1681660001);
        contest.castVote(proposalId, 0, 10000000000000000000, 1000000000000000000, proof);

        vm.warp(1681670001);
        vm.deal(address(rewardsModulePaysAuthor), 100); // give the rewards module wei to pay out
        rewardsModulePaysAuthor.release(1);

        vm.stopPrank();

        assertEq(PERMISSIONED_ADDRESS.balance, 50);
    }

    function testReleaseToTarget1() public {
        vm.startPrank(PERMISSIONED_ADDRESS);

        vm.warp(1681650001);
        uint256 proposalId = contest.propose(proposal, proof);
        vm.warp(1681660001);
        contest.castVote(proposalId, 0, 10000000000000000000, 1000000000000000000, proof);

        vm.warp(1681670001);
        vm.deal(address(rewardsModulePaysTarget), 100); // give the rewards module wei to pay out
        rewardsModulePaysTarget.release(1);

        vm.stopPrank();

        assertEq(TARGET_ADDRESS.balance, 50);
    }
}
