// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.5.0) (governance/Governor.sol)

pragma solidity ^0.8.0;

import "@openzeppelin/utils/cryptography/ECDSA.sol";
import "@openzeppelin/utils/cryptography/draft-EIP712.sol";
import "@openzeppelin/utils/introspection/ERC165.sol";
import "@openzeppelin/utils/math/SafeCast.sol";
import "@openzeppelin/utils/Address.sol";
import "@openzeppelin/utils/Context.sol";
import "./IGovernor.sol";
import "./GovernorMerkleVotes.sol";

/**
 * @dev Core of the governance system, designed to be extended though various modules.
 *
 * This contract is abstract and requires several function to be implemented in various modules:
 *
 * - A counting module must implement {quorum}, {_quorumReached}, {_voteSucceeded} and {_countVote}
 * - A voting module must implement {getVotes}
 * - Additionaly, the {votingPeriod} must also be implemented
 *
 * _Available since v4.3._
 */
abstract contract Governor is Context, ERC165, EIP712, GovernorMerkleVotes, IGovernor {
    using SafeCast for uint256;

    bytes32 public constant BALLOT_TYPEHASH = keccak256("Ballot(uint256 proposalId,uint8 support)");
    uint64 public constant AMOUNT_FOR_SUMBITTER_PROOF = 10000000000000000000;
    mapping(address => uint256) public addressTotalVotes;
    mapping(address => bool) public addressTotalVotesVerified;
    mapping(address => bool) public addressSubmitterVerified;

    uint256[] private _proposalIds;
    mapping(uint256 => uint256) private _deletedProposalIds;
    string private _name;
    string private _prompt;
    bool private _canceled;
    mapping(uint256 => ProposalCore) private _proposals;
    mapping(address => uint256) private _numSubmissions;

    /// @notice Thrown if there is metadata included in a proposal that isn't covered in data validation
    error TooManyMetadatas();

    /**
     * @dev Restrict access of functions to the governance executor, which may be the Governor itself or a timelock
     * contract, as specified by {_executor}. This generally means that function with this modifier must be voted on and
     * executed through the governance protocol.
     */
    modifier onlyGovernance() {
        require(_msgSender() == _executor(), "Governor: onlyGovernance");
        _;
    }

    /**
     * @dev Sets the value for {name} and {version}
     */
    constructor(string memory name_, string memory prompt_, bytes32 submissionMerkleRoot_, bytes32 votingMerkleRoot_)
        GovernorMerkleVotes(submissionMerkleRoot_, votingMerkleRoot_)
        EIP712(name_, version())
    {
        _name = name_;
        _prompt = prompt_;
    }

    /**
     * @dev Function to receive ETH that will be handled by the governor
     * (disabled if executor is a third party contract)
     */
    receive() external payable virtual {
        require(_executor() == address(this));
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override(IERC165, ERC165) returns (bool) {
        return interfaceId == type(IGovernor).interfaceId || super.supportsInterface(interfaceId);
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
     * @dev See {IGovernor-version}.
     */
    function version() public view virtual override returns (string memory) {
        return "3.1";
    }

    /**
     * @dev See {IGovernor-hashProposal}.
     *
     * The proposal id is produced by hashing the RLC encoded `targets` array, the `values` array, the `calldatas` array
     * and the descriptionHash (bytes32 which itself is the keccak256 hash of the description string). This proposal id
     * can be produced from the proposal data which is part of the {ProposalCreated} event. It can even be computed in
     * advance, before the proposal is submitted.
     *
     * Note that the chainId and the governor address are not part of the proposal id computation. Consequently, the
     * same proposal (with same operation and same description) will have the same id if submitted on multiple governors
     * accross multiple networks. This also means that in order to execute the same operation twice (on the same
     * governor) the proposer will have to change the description in order to avoid proposal id conflicts.
     */
    function hashProposal(ProposalCore memory proposal) public pure virtual override returns (uint256) {
        return uint256(keccak256(abi.encode(proposal)));
    }

    /**
     * @dev See {IGovernor-state}.
     */
    function state() public view virtual override returns (ContestState) {
        if (_canceled) {
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
        return _proposalIds;
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
     * @dev _"The number of proposals that an address who is qualified to propose can submit for this contest"_.
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
     * @dev Retrieve proposal data"_.
     */
    function getProposal(uint256 proposalId) public view virtual returns (ProposalCore memory) {
        return _proposals[proposalId];
    }

    /**
     * @dev Get the number of proposal submissions for a given address.
     */
    function getNumSubmissions(address account) public view virtual returns (uint256) {
        return _numSubmissions[account];
    }

    /**
     * @dev Returns if a proposal has been deleted or not (0 if not, 1 if it has been deleted).
     */
    function isProposalDeleted(uint256 proposalId) public view virtual returns (uint256) {
        return _deletedProposalIds[proposalId];
    }

    /**
     * @dev Register a vote with a given support and voting weight.
     *
     * Note: Support is generic and can represent various things depending on the voting system used.
     */
    function _countVote(uint256 proposalId, address account, uint8 support, uint256 numVotes, uint256 totalVotes)
        internal
        virtual;

    /**
     * @dev See {IGovernor-verifySubmitter}.
     */
    function verifySubmitter(address account, bytes32[] calldata proof) public override returns (bool verified) {
        if (!addressSubmitterVerified[account]) {
            checkProof(account, AMOUNT_FOR_SUMBITTER_PROOF, proof, false); // will revert with NotInMerkle if not valid
            addressSubmitterVerified[account] = true;
        }
        return true;
    }

    /**
     * @dev See {IGovernor-validateProposalData}.
     */
    function validateProposalData(ProposalCore memory proposal) public virtual override returns (bool dataValidated) {
        for (uint256 index = 0; index < METADATAS_COUNT; index++) {
            Metadatas currentMetadata = Metadatas(index);
            if (currentMetadata == Metadatas.Target) {
                continue; // Nothing to check here since strictly typed to address
            } else if (currentMetadata == Metadatas.Safe) {
                require(
                    proposal.safeMetadata.signers.length != 0,
                    "GovernorMetadataValidation: there cannot be zero signers in safeMetadata"
                );
                require(
                    proposal.safeMetadata.threshold != 0,
                    "GovernorMetadataValidation: threshold cannot be zero in safeMetadata"
                );
                require(proposal.safeMetadata.signers.length != 0);
            } else {
                revert TooManyMetadatas();
            }
        }
        require(bytes(proposal.description).length != 0, "Governor: empty proposal");
        return true;
    }

    /**
     * @dev See {IGovernor-propose}.
     */
    function propose(ProposalCore memory proposal, bytes32[] calldata proof)
        public
        virtual
        override
        returns (uint256)
    {
        require(verifySubmitter(msg.sender, proof), "Governor: address is not permissioned to submit");
        validateProposalData(proposal);
        return _castProposal(proposal);
    }

    /**
     * @dev See {IGovernor-proposeWithoutProof}.
     */
    function proposeWithoutProof(ProposalCore memory proposal) public virtual override returns (uint256) {
        require(addressSubmitterVerified[msg.sender], "Governor: address is not permissioned to submit");
        validateProposalData(proposal);
        return _castProposal(proposal);
    }

    function _castProposal(ProposalCore memory proposal) internal virtual returns (uint256) {
        require(state() == ContestState.Queued, "Governor: contest must be queued for proposals to be submitted");
        require(
            _numSubmissions[msg.sender] < numAllowedProposalSubmissions(),
            "Governor: the same cannot submit more than the numAllowedProposalSubmissions for this contest"
        );
        require(_proposalIds.length < maxProposalCount(), "Governor: the max number of proposals have been submitted");

        uint256 proposalId = hashProposal(proposal);
        require(!_proposals[proposalId].exists, "Governor: duplicate proposals not allowed");

        _proposalIds.push(proposalId);
        _proposals[proposalId] = proposal;
        _numSubmissions[msg.sender] += 1;

        emit ProposalCreated(proposalId, _msgSender());

        return proposalId;
    }

    /**
     * @dev Delete proposals.
     *
     * Emits a {IGovernor-ProposalsDeleted} event.
     */
    function deleteProposals(uint256[] memory proposalIds) public virtual {
        require(msg.sender == creator(), "Governor: only the contest creator can delete proposals");
        require(
            state() != ContestState.Completed,
            "Governor: deletion of proposals after the end of a contest is not allowed"
        );

        for (uint256 index = 0; index < proposalIds.length; index++) {
            if (_deletedProposalIds[proposalIds[index]] != 1) {
                _deletedProposalIds[proposalIds[index]] = 1;
                _proposals[proposalIds[index]].description =
                    "This proposal has been deleted by the creator of the contest.";
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
        require(msg.sender == creator());

        ContestState status = state();

        require(status != ContestState.Canceled && status != ContestState.Completed, "Governor: contest not active");
        _canceled = true;

        emit ContestCanceled();
    }

    /**
     * @dev See {IGovernor-verifyTotalVotes}.
     */
    function verifyTotalVotes(address account, uint256 totalVotes, bytes32[] calldata proof)
        public
        override
        returns (bool verified)
    {
        if (!addressTotalVotesVerified[account]) {
            checkProof(account, totalVotes, proof, false); // will revert with NotInMerkle if not valid
            addressTotalVotes[account] = totalVotes;
            addressTotalVotesVerified[account] = true;
        }
        return true;
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
        address voter = _msgSender();
        verifyTotalVotes(voter, totalVotes, proof);
        return _castVote(proposalId, voter, support, numVotes, "");
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
        address voter = _msgSender();
        require(
            addressTotalVotesVerified[voter],
            "Governor: you need to cast a vote with the proof at least once and you haven't yet"
        );
        return _castVote(proposalId, voter, support, numVotes, "");
    }

    /**
     * @dev Internal vote casting mechanism: Check that the vote is pending, that it has not been cast yet, retrieve
     * voting weight using addressTotalVotes() and call the {_countVote} internal function.
     *
     * Emits a {IGovernor-VoteCast} event.
     */
    function _castVote(uint256 proposalId, address account, uint8 support, uint256 numVotes, string memory reason)
        internal
        virtual
        returns (uint256)
    {
        require(state() == ContestState.Active, "Governor: vote not currently active");
        require(numVotes > 0, "Governor: cannot vote with 0 or fewer votes");

        require(
            addressTotalVotesVerified[account],
            "Governor: you need to verify your number of votes against the merkle root first"
        );
        _countVote(proposalId, account, support, numVotes, addressTotalVotes[account]);

        emit VoteCast(account, proposalId, support, numVotes, reason);

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
