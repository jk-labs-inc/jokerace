// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import "@openzeppelin/utils/math/SafeCast.sol";
import "@openzeppelin/utils/Address.sol";
import "./utils/GovernorMerkleVotes.sol";
import "./utils/GovernorSorting.sol";

/**
 * @dev Core of the governance system, designed to be extended though various modules.
 */
abstract contract Governor is GovernorSorting, GovernorMerkleVotes {
    using SafeCast for uint256;

    enum ContestState {
        NotStarted,
        Active,
        Canceled,
        Queued,
        Completed
    }

    enum Metadatas {
        Target,
        Safe
    }

    struct TargetMetadata {
        address targetAddress;
    }

    struct SafeMetadata {
        address[] signers;
        uint256 threshold;
    }

    struct ProposalCore {
        address author;
        bool exists;
        string description;
        TargetMetadata targetMetadata;
        SafeMetadata safeMetadata;
    }

    event JokeraceCreated(string name, address creator);
    event ProposalCreated(uint256 proposalId, address proposer);
    event ProposalsDeleted(uint256[] proposalIds);
    event ContestCanceled();
    event VoteCast(address indexed voter, uint256 proposalId, uint8 support, uint256 numVotes);
    event PaymentReleased(address to, uint256 amount);

    uint256 public constant METADATAS_COUNT = uint256(type(Metadatas).max) + 1;
    uint256 public constant AMOUNT_FOR_SUMBITTER_PROOF = 10000000000000000000;
    address public constant JK_LABS_ADDRESS = 0xDc652C746A8F85e18Ce632d97c6118e8a52fa738;

    string public name; // The title of the contest
    string public prompt;
    address public creator;
    uint256 public contestStart; // The Unix timestamp that the contest starts at.
    uint256 public votingDelay; // Number of seconds that submissions are open.
    uint256 public votingPeriod; // Number of seconds that voting is open.
    uint256 public numAllowedProposalSubmissions; // The number of proposals that an address who is qualified to propose can submit for this contest.
    uint256 public maxProposalCount; // Max number of proposals allowed in this contest.
    uint256 public downvotingAllowed; // If downvoting is enabled in this contest.
    uint256 public costToPropose;
    uint256 public percentageToCreator;

    uint256[] public proposalIds;
    uint256[] public deletedProposalIds;
    mapping(uint256 => bool) public proposalIsDeleted;
    bool public canceled;
    mapping(uint256 => ProposalCore) public proposals;
    mapping(address => uint256) public numSubmissions;
    address[] public proposalAuthors;
    address[] public addressesThatHaveVoted;

    mapping(address => uint256) public addressTotalVotes;
    mapping(address => bool) public addressTotalVotesVerified;
    mapping(address => bool) public addressSubmitterVerified;

    error AuthorIsNotSender(address author, address sender);
    error ZeroSignersInSafeMetadata();
    error ZeroThresholdInSafeMetadata();
    error UnexpectedMetadata(Metadatas unexpectedMetadata);
    error EmptyProposalDescription();

    error IncorrectCostToProposeSent(uint256 msgValue, uint256 costToPropose);
    error AddressNotPermissionedToSubmit();
    error ContestMustBeQueuedToPropose(ContestState currentState);
    error ContestMustBeActiveToVote(ContestState currentState);
    error SenderSubmissionLimitReached(uint256 numAllowedProposalSubmissions);
    error ContestSubmissionLimitReached(uint256 maxProposalCount);
    error DuplicateSubmission(uint256 proposalId);
    error CannotVoteOnDeletedProposal();
    error NeedAtLeastOneVoteToVote();

    error NeedToSubmitWithProofFirst();
    error NeedToVoteWithProofFirst();

    error OnlyCreatorCanDelete();
    error CannotDeleteWhenCompleted();

    error OnlyJkLabsOrCreatorCanCancel();
    error ContestAlreadyCancelled();

    constructor(
        string memory name_,
        string memory prompt_,
        bytes32 submissionMerkleRoot_,
        bytes32 votingMerkleRoot_,
        uint256 contestStart_,
        uint256 votingDelay_,
        uint256 votingPeriod_,
        uint256 numAllowedProposalSubmissions_,
        uint256 maxProposalCount_,
        uint256 downvotingAllowed_,
        uint256 costToPropose_,
        uint256 percentageToCreator_
    ) GovernorMerkleVotes(submissionMerkleRoot_, votingMerkleRoot_) {
        name = name_;
        prompt = prompt_;
        creator = msg.sender;
        contestStart = contestStart_;
        votingDelay = votingDelay_;
        votingPeriod = votingPeriod_;
        numAllowedProposalSubmissions = numAllowedProposalSubmissions_;
        maxProposalCount = maxProposalCount_;
        downvotingAllowed = downvotingAllowed_;
        costToPropose = costToPropose_;
        percentageToCreator = percentageToCreator_;

        emit JokeraceCreated(name_, msg.sender); // emit upon creation to be able to easily find jokeraces on a chain
    }

    function version() public pure returns (string memory) {
        return "4.15";
    }

    function hashProposal(ProposalCore memory proposal) public pure returns (uint256) {
        return uint256(keccak256(abi.encode(proposal)));
    }

    function state() public view returns (ContestState) {
        if (canceled) {
            return ContestState.Canceled;
        }

        if (contestStart >= block.timestamp) {
            return ContestState.NotStarted;
        }

        if (voteStart() >= block.timestamp) {
            return ContestState.Queued;
        }

        if (contestDeadline() >= block.timestamp) {
            return ContestState.Active;
        }

        return ContestState.Completed;
    }

    /**
     * @dev Return all proposals.
     */
    function getAllProposalIds() public view returns (uint256[] memory) {
        return proposalIds;
    }

    /**
     * @dev Return all proposal authors.
     */
    function getAllProposalAuthors() public view returns (address[] memory) {
        return proposalAuthors;
    }

    /**
     * @dev Return all addresses that have voted.
     */
    function getAllAddressesThatHaveVoted() public view returns (address[] memory) {
        return addressesThatHaveVoted;
    }

    /**
     * @dev Return all deleted proposals.
     */
    function getAllDeletedProposalIds() public view returns (uint256[] memory) {
        return deletedProposalIds;
    }

    /**
     * @dev Timestamp the contest vote begins. Votes open at the end of this block, so it is possible to propose
     * during this block.
     */
    function voteStart() public view returns (uint256) {
        return contestStart + votingDelay;
    }

    /**
     * @dev Returns if a proposal has been deleted or not.
     */
    function contestDeadline() public view returns (uint256) {
        return voteStart() + votingPeriod;
    }

    /**
     * @dev Retrieve proposal data.
     */
    function getProposal(uint256 proposalId) public view returns (ProposalCore memory) {
        return proposals[proposalId];
    }

    /**
     * @dev Remove deleted proposalIds from forVotesToProposalIds and decrement copy counts of the forVotes of proposalIds.
     */
    function _multiRmProposalIdFromForVotesMap(uint256[] calldata proposalIds) internal virtual;

    /**
     * @dev Register a vote with a given support and voting weight.
     *
     * Note: Support is generic and can represent various things depending on the voting system used.
     */
    function _countVote(uint256 proposalId, address account, uint8 support, uint256 numVotes, uint256 totalVotes)
        internal
        virtual;

    /**
     * @dev Verifies that `account` is permissioned to propose via merkle proof.
     */
    function verifyProposer(address account, bytes32[] calldata proof) public {
        if (!addressSubmitterVerified[account]) {
            if (submissionMerkleRoot == 0) {
                // if the submission root is 0, then anyone can submit
                return;
            }
            checkProof(account, AMOUNT_FOR_SUMBITTER_PROOF, proof, false); // will revert with NotInMerkle if not valid
            addressSubmitterVerified[account] = true;
        }
    }

    /**
     * @dev Verifies that all of the metadata in the proposal is valid.
     */
    function validateProposalData(ProposalCore memory proposal) public view {
        if (proposal.author != msg.sender) revert AuthorIsNotSender(proposal.author, msg.sender);
        for (uint256 index = 0; index < METADATAS_COUNT; index++) {
            Metadatas currentMetadata = Metadatas(index);
            if (currentMetadata == Metadatas.Target) {
                continue; // Nothing to check here since strictly typed to address
            } else if (currentMetadata == Metadatas.Safe) {
                if (proposal.safeMetadata.signers.length == 0) revert ZeroSignersInSafeMetadata();
                if (proposal.safeMetadata.threshold == 0) revert ZeroThresholdInSafeMetadata();
            } else {
                revert UnexpectedMetadata(currentMetadata);
            }
        }
        if (bytes(proposal.description).length == 0) revert EmptyProposalDescription();
    }

    /**
     * @dev Distribute the costToPropose to jk labs and the creator based on _percentageToCreator.
     */
    function _distributeCostToPropose() private {
        if (costToPropose > 0) {
            // Send proposal fee to jk labs address and creator
            uint256 sendingToJkLabs = (msg.value * (100 - percentageToCreator)) / 100;
            if (sendingToJkLabs > 0) {
                Address.sendValue(payable(JK_LABS_ADDRESS), sendingToJkLabs);
                emit PaymentReleased(JK_LABS_ADDRESS, sendingToJkLabs);
            }

            uint256 sendingToCreator = msg.value - sendingToJkLabs;
            if (sendingToCreator > 0) {
                Address.sendValue(payable(creator), sendingToCreator); // creator gets the extra wei in the case of rounding
                emit PaymentReleased(creator, sendingToCreator);
            }
        }
    }

    /**
     * @dev Create a new proposal.
     */
    function propose(ProposalCore calldata proposal, bytes32[] calldata proof) public payable returns (uint256) {
        if (msg.value != costToPropose) revert IncorrectCostToProposeSent(msg.value, costToPropose);

        verifyProposer(msg.sender, proof);
        validateProposalData(proposal);
        uint256 proposalId = _castProposal(proposal);

        _distributeCostToPropose();

        return proposalId;
    }

    /**
     * @dev Create a new proposal without a proof if you have already proposed with a proof.
     */
    function proposeWithoutProof(ProposalCore calldata proposal) public payable returns (uint256) {
        if (msg.value != costToPropose) revert IncorrectCostToProposeSent(msg.value, costToPropose);

        if (submissionMerkleRoot != 0) {
            // if the submission root is 0, then anyone can submit; otherwise, this address needs to have been verified
            if (!addressSubmitterVerified[msg.sender]) revert NeedToSubmitWithProofFirst();
        }
        validateProposalData(proposal);
        uint256 proposalId = _castProposal(proposal);

        _distributeCostToPropose();

        return proposalId;
    }

    function _castProposal(ProposalCore memory proposal) internal returns (uint256) {
        if (state() != ContestState.Queued) revert ContestMustBeQueuedToPropose(state());
        if (numSubmissions[msg.sender] == numAllowedProposalSubmissions) {
            revert SenderSubmissionLimitReached(numAllowedProposalSubmissions);
        }
        if ((proposalIds.length - deletedProposalIds.length) == maxProposalCount) {
            revert ContestSubmissionLimitReached(maxProposalCount);
        }

        uint256 proposalId = hashProposal(proposal);
        if (proposals[proposalId].exists) revert DuplicateSubmission(proposalId);

        proposalIds.push(proposalId);
        proposals[proposalId] = proposal;
        numSubmissions[msg.sender] += 1;
        proposalAuthors.push(msg.sender);

        emit ProposalCreated(proposalId, msg.sender);

        return proposalId;
    }

    /**
     * @dev Delete proposals.
     *
     * Emits a {IGovernor-ProposalsDeleted} event.
     */
    function deleteProposals(uint256[] calldata proposalIdsToDelete) public {
        if (msg.sender != creator) revert OnlyCreatorCanDelete();
        if (state() == ContestState.Completed) revert CannotDeleteWhenCompleted();

        for (uint256 index = 0; index < proposalIdsToDelete.length; index++) {
            uint256 currentProposalId = proposalIdsToDelete[index];
            if (!proposalIsDeleted[currentProposalId]) {
                // if this proposal hasn't already been deleted
                proposalIsDeleted[currentProposalId] = true;
                // this proposal now won't count towards the total number allowed in the contest
                // it will still count towards the total number of proposals that the user is allowed to submit though
                deletedProposalIds.push(currentProposalId);
            }
        }

        // we only do sorting if downvoting is disabled and if sorting is enabled
        if (downvotingAllowed == 0 && sortingEnabled == 1) {
            // remove proposalIds from forVotesToProposalIds (could contain proposalIds that have been deleted before, that's ok though)
            _multiRmProposalIdFromForVotesMap(proposalIdsToDelete);
        }

        emit ProposalsDeleted(proposalIds);
    }

    /**
     * @dev Cancels the contest.
     *
     * Emits a {IGovernor-ContestCanceled} event.
     */
    function cancel() public {
        if (((msg.sender != creator) && (msg.sender != JK_LABS_ADDRESS))) revert OnlyJkLabsOrCreatorCanCancel();

        ContestState status = state();
        if (status == ContestState.Canceled) revert ContestAlreadyCancelled();

        canceled = true;

        emit ContestCanceled();
    }

    /**
     * @dev Verifies that `account` is permissioned to vote with `totalVotes` via merkle proof.
     */
    function verifyVoter(address account, uint256 totalVotes, bytes32[] calldata proof) public {
        if (!addressTotalVotesVerified[account]) {
            checkProof(account, totalVotes, proof, true); // will revert with NotInMerkle if not valid
            addressTotalVotes[account] = totalVotes;
            addressTotalVotesVerified[account] = true;
        }
    }

    /**
     * @dev Cast a vote with a merkle proof.
     */
    function castVote(uint256 proposalId, uint8 support, uint256 totalVotes, uint256 numVotes, bytes32[] calldata proof)
        public
        returns (uint256)
    {
        address voter = msg.sender;
        if (proposalIsDeleted[proposalId]) revert CannotVoteOnDeletedProposal();
        verifyVoter(voter, totalVotes, proof);
        return _castVote(proposalId, voter, support, numVotes);
    }

    /**
     * @dev Cast a vote without a proof if you have already voted with a proof.
     */
    function castVoteWithoutProof(uint256 proposalId, uint8 support, uint256 numVotes) public returns (uint256) {
        address voter = msg.sender;
        if (proposalIsDeleted[proposalId]) revert CannotVoteOnDeletedProposal();
        if (!addressTotalVotesVerified[voter]) revert NeedToVoteWithProofFirst();
        return _castVote(proposalId, voter, support, numVotes);
    }

    /**
     * @dev Internal vote casting mechanism: Check that the vote is pending, that it has not been cast yet, retrieve
     * voting weight using addressTotalVotes() and call the {_countVote} internal function.
     *
     * Emits a {IGovernor-VoteCast} event.
     */
    function _castVote(uint256 proposalId, address account, uint8 support, uint256 numVotes)
        internal
        returns (uint256)
    {
        if (state() != ContestState.Active) revert ContestMustBeActiveToVote(state());
        if (numVotes == 0) revert NeedAtLeastOneVoteToVote();

        _countVote(proposalId, account, support, numVotes, addressTotalVotes[account]);

        addressesThatHaveVoted.push(msg.sender);

        emit VoteCast(account, proposalId, support, numVotes);

        return addressTotalVotes[account];
    }
}
