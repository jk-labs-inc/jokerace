// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/utils/math/SafeCast.sol";
import "@openzeppelin/utils/Address.sol";
import "./IGovernor.sol";
import "./GovernorMerkleVotes.sol";
import "./extensions/GovernorSorting.sol";

/**
 * @dev Core of the governance system, designed to be extended though various modules.
 */
abstract contract Governor is GovernorSorting, GovernorMerkleVotes, IGovernor {
    using SafeCast for uint256;

    event PaymentReleased(address to, uint256 amount);

    uint256 public constant AMOUNT_FOR_SUMBITTER_PROOF = 10000000000000000000;
    address public constant JK_LABS_ADDRESS = 0xDc652C746A8F85e18Ce632d97c6118e8a52fa738;

    string private _name;
    string private _prompt;

    uint256[] public proposalIds;
    uint256[] public deletedProposalIds;
    mapping(uint256 => bool) public proposalIsDeleted;
    bool public canceled;
    mapping(uint256 => ProposalCore) public proposals;
    mapping(address => uint256) public numSubmissions;
    address[] public proposalAuthors;
    address[] public addressesThatHaveVoted;
    uint256 private _costToPropose;
    uint256 private _percentageToCreator;

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
    error CannotCancelACompletedContest();

    /**
     * @dev Sets the value for {name} and {version}
     */
    constructor(
        string memory name_,
        string memory prompt_,
        bytes32 submissionMerkleRoot_,
        bytes32 votingMerkleRoot_,
        uint256 costToPropose_,
        uint256 percentageToCreator_
    ) GovernorMerkleVotes(submissionMerkleRoot_, votingMerkleRoot_) {
        _name = name_;
        _prompt = prompt_;
        _costToPropose = costToPropose_;
        _percentageToCreator = percentageToCreator_;

        emit JokeraceCreated(name_, msg.sender); // emit upon creation to be able to easily find jokeraces on a chain
    }

    /**
     * @dev See {IGovernor-name}.
     */
    function name() public view virtual override returns (string memory) {
        return _name;
    }

    /**
     * @dev See {IGovernor-prompt}.
     */
    function prompt() public view virtual override returns (string memory) {
        return _prompt;
    }

    /**
     * @dev See {IGovernor-costToPropose}.
     */
    function costToPropose() public view virtual override returns (uint256) {
        return _costToPropose;
    }

    /**
     * @dev See {IGovernor-percentageToCreator}.
     */
    function percentageToCreator() public view virtual override returns (uint256) {
        return _percentageToCreator;
    }

    /**
     * @dev See {IGovernor-version}.
     */
    function version() public view virtual override returns (string memory) {
        return "4.2";
    }

    /**
     * @dev See {IGovernor-hashProposal}.
     */
    function hashProposal(ProposalCore memory proposal) public pure virtual override returns (uint256) {
        return uint256(keccak256(abi.encode(proposal)));
    }

    /**
     * @dev See {IGovernor-state}.
     */
    function state() public view virtual override returns (ContestState) {
        if (canceled) {
            return ContestState.Canceled;
        }

        uint256 contestStartTimestamp = contestStart();

        if (contestStartTimestamp >= block.timestamp) {
            return ContestState.NotStarted;
        }

        uint256 voteStartTimestamp = voteStart();

        if (voteStartTimestamp >= block.timestamp) {
            return ContestState.Queued;
        }

        uint256 deadlineTimestamp = contestDeadline();

        if (deadlineTimestamp >= block.timestamp) {
            return ContestState.Active;
        }

        return ContestState.Completed;
    }

    /**
     * @dev Return all proposals.
     */
    function getAllProposalIds() public view virtual returns (uint256[] memory) {
        return proposalIds;
    }

    /**
     * @dev Return all proposal authors.
     */
    function getAllProposalAuthors() public view virtual returns (address[] memory) {
        return proposalAuthors;
    }

    /**
     * @dev Return all addresses that have voted.
     */
    function getAllAddressesThatHaveVoted() public view virtual returns (address[] memory) {
        return addressesThatHaveVoted;
    }

    /**
     * @dev Return all deleted proposals.
     */
    function getAllDeletedProposalIds() public view virtual returns (uint256[] memory) {
        return deletedProposalIds;
    }

    /**
     * @dev See {IGovernor-voteStart}.
     */
    function voteStart() public view virtual override returns (uint256) {
        return contestStart() + votingDelay();
    }

    /**
     * @dev See {IGovernor-contestDeadline}.
     */
    function contestDeadline() public view virtual override returns (uint256) {
        return voteStart() + votingPeriod();
    }

    /**
     * @dev The number of proposals that an address who is qualified to propose can submit for this contest.
     */
    function numAllowedProposalSubmissions() public view virtual returns (uint256) {
        return 1;
    }

    /**
     * @dev Max number of proposals allowed in this contest
     */
    function maxProposalCount() public view virtual returns (uint256) {
        return 100;
    }

    /**
     * @dev If downvoting is enabled in this contest.
     */
    function downvotingAllowed() public view virtual returns (uint256) {
        return 0; // 0 == false, 1 == true
    }

    /**
     * @dev Retrieve proposal data.
     */
    function getProposal(uint256 proposalId) public view virtual returns (ProposalCore memory) {
        return proposals[proposalId];
    }

    /**
     * @dev Get the number of proposal submissions for a given address.
     */
    function getNumSubmissions(address account) public view virtual returns (uint256) {
        return numSubmissions[account];
    }

    /**
     * @dev Returns if a proposal has been deleted or not.
     */
    function isProposalDeleted(uint256 proposalId) public view virtual returns (bool) {
        return proposalIsDeleted[proposalId];
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
     * @dev See {IGovernor-verifyProposer}.
     */
    function verifyProposer(address account, bytes32[] calldata proof) public override {
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
     * @dev See {IGovernor-validateProposalData}.
     */
    function validateProposalData(ProposalCore memory proposal) public virtual override {
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
        if (_costToPropose > 0) {
            // Send proposal fee to jk labs address and creator
            uint256 sendingToJkLabs = (msg.value * (100 - _percentageToCreator)) / 100;
            if (sendingToJkLabs > 0) {
                Address.sendValue(payable(JK_LABS_ADDRESS), sendingToJkLabs);
                emit PaymentReleased(JK_LABS_ADDRESS, sendingToJkLabs);
            }

            uint256 sendingToCreator = msg.value - sendingToJkLabs;
            if (sendingToCreator > 0) {
                Address.sendValue(payable(creator()), sendingToCreator); // creator gets the extra wei in the case of rounding
                emit PaymentReleased(creator(), sendingToCreator);
            }
        }
    }

    /**
     * @dev See {IGovernor-propose}.
     */
    function propose(ProposalCore calldata proposal, bytes32[] calldata proof)
        public
        payable
        virtual
        override
        returns (uint256)
    {
        if (msg.value != _costToPropose) revert IncorrectCostToProposeSent(msg.value, _costToPropose);

        verifyProposer(msg.sender, proof);
        validateProposalData(proposal);
        uint256 proposalId = _castProposal(proposal);

        _distributeCostToPropose();

        return proposalId;
    }

    /**
     * @dev See {IGovernor-proposeWithoutProof}.
     */
    function proposeWithoutProof(ProposalCore calldata proposal) public payable virtual override returns (uint256) {
        if (msg.value != _costToPropose) revert IncorrectCostToProposeSent(msg.value, _costToPropose);

        if (submissionMerkleRoot != 0) {
            // if the submission root is 0, then anyone can submit; otherwise, this address needs to have been verified
            if (!addressSubmitterVerified[msg.sender]) revert NeedToSubmitWithProofFirst();
        }
        validateProposalData(proposal);
        uint256 proposalId = _castProposal(proposal);

        _distributeCostToPropose();

        return proposalId;
    }

    function _castProposal(ProposalCore memory proposal) internal virtual returns (uint256) {
        if (state() != ContestState.Queued) revert ContestMustBeQueuedToPropose(state());
        if (numSubmissions[msg.sender] == numAllowedProposalSubmissions()) revert SenderSubmissionLimitReached(numAllowedProposalSubmissions());
        if ((proposalIds.length - deletedProposalIds.length) == maxProposalCount()) revert ContestSubmissionLimitReached(maxProposalCount());

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
    function deleteProposals(uint256[] calldata proposalIdsToDelete) public virtual {
        if (msg.sender != creator()) revert OnlyCreatorCanDelete();
        if (state() == ContestState.Completed) revert CannotDeleteWhenCompleted();

        for (uint256 index = 0; index < proposalIdsToDelete.length; index++) {
            uint256 currentProposalId = proposalIdsToDelete[index];
            if (!proposalIsDeleted[currentProposalId]) {
                // if this proposal hasn't already been deleted
                proposalIsDeleted[currentProposalId] = true;
                // this proposal now won't count towards the total number allowed in the contest
                // it will still count towards the total number of proposals that the user is allowed to submit though
                deletedProposalIds.push(currentProposalId);

                // we only do sorting if downvoting is disabled and if sorting is enabled
                if (downvotingAllowed() == 0 && sortingEnabled == 1) {
                    // remove proposalIds from forVotesToProposalIds
                    _multiRmProposalIdFromForVotesMap(proposalIdsToDelete);
                }
            }
        }

        emit ProposalsDeleted(proposalIds);
    }

    /**
     * @dev
     *
     * Emits a {IGovernor-ContestCanceled} event.
     */
    function cancel() public virtual {
        if (((msg.sender != creator()) && (msg.sender != JK_LABS_ADDRESS))) revert OnlyJkLabsOrCreatorCanCancel();

        ContestState status = state();

        if (status == ContestState.Canceled) revert ContestAlreadyCancelled();
        if (status == ContestState.Completed) revert CannotCancelACompletedContest();
        canceled = true;

        emit ContestCanceled();
    }

    /**
     * @dev See {IGovernor-verifyVoter}.
     */
    function verifyVoter(address account, uint256 totalVotes, bytes32[] calldata proof)
        public
        override
    {
        if (!addressTotalVotesVerified[account]) {
            checkProof(account, totalVotes, proof, true); // will revert with NotInMerkle if not valid
            addressTotalVotes[account] = totalVotes;
            addressTotalVotesVerified[account] = true;
        }
    }

    /**
     * @dev See {IGovernor-castVote}.
     */
    function castVote(uint256 proposalId, uint8 support, uint256 totalVotes, uint256 numVotes, bytes32[] calldata proof)
        public
        virtual
        override
        returns (uint256)
    {
        address voter = msg.sender;
        if (isProposalDeleted(proposalId)) revert CannotVoteOnDeletedProposal();
        verifyVoter(voter, totalVotes, proof);
        return _castVote(proposalId, voter, support, numVotes);
    }

    /**
     * @dev See {IGovernor-castVoteWithoutProof}.
     */
    function castVoteWithoutProof(uint256 proposalId, uint8 support, uint256 numVotes)
        public
        virtual
        override
        returns (uint256)
    {
        address voter = msg.sender;
        if (isProposalDeleted(proposalId)) revert CannotVoteOnDeletedProposal();
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
        virtual
        returns (uint256)
    {
        if (state() != ContestState.Active) revert ContestMustBeActiveToVote(state());
        if (numVotes == 0) revert NeedAtLeastOneVoteToVote();

        _countVote(proposalId, account, support, numVotes, addressTotalVotes[account]);

        addressesThatHaveVoted.push(msg.sender);

        emit VoteCast(account, proposalId, support, numVotes);

        return addressTotalVotes[account];
    }

    /**
     * @dev Address through which the governor executes action. Will be overloaded by module that execute actions
     * through another contract such as a timelock.
     */
    function _executor() internal view virtual returns (address) {
        return address(this);
    }
}
