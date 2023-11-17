// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

/**
 * @dev Interface of the {Governor} core.
 */
abstract contract IGovernor {
    enum ContestState {
        NotStarted,
        Active,
        Canceled,
        Queued,
        Completed
    }

    uint256 public constant METADATAS_COUNT = uint256(type(Metadatas).max) + 1;

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

    /**
     * @dev Emitted when a jokerace is created.
     */
    event JokeraceCreated(string name, address creator);

    /**
     * @dev Emitted when a proposal is created.
     */
    event ProposalCreated(uint256 proposalId, address proposer);

    /**
     * @dev Emitted when proposals are deleted.
     */
    event ProposalsDeleted(uint256[] proposalIds);

    /**
     * @dev Emitted when a contest is canceled.
     */
    event ContestCanceled();

    /**
     * @dev Emitted when a vote is cast.
     */
    event VoteCast(address indexed voter, uint256 proposalId, uint8 support, uint256 numVotes);

    /**
     * @notice module:core
     * @dev Name of the contest.
     */
    function name() public view virtual returns (string memory);

    /**
     * @notice module:core
     * @dev Prompt of the contest.
     */
    function prompt() public view virtual returns (string memory);

    /**
     * @notice module:core
     * @dev Cost to propose to this contest.
     */
    function costToPropose() public view virtual returns (uint256);

    /**
     * @notice module:core
     * @dev Percent of the cost to propose that goes to the creator.
     */
    function percentageToCreator() public view virtual returns (uint256);

    /**
     * @notice module:core
     * @dev Version of the contest contract.
     */
    function version() public view virtual returns (string memory);

    /**
     * @notice module:core
     * @dev Hashing function used to build the proposal id from the proposal details.
     */
    function hashProposal(ProposalCore memory proposal) public pure virtual returns (uint256);

    /**
     * @notice module:core
     * @dev Current state of a Contest, following Compound's convention
     */
    function state() public view virtual returns (ContestState);

    /**
     * @notice module:core
     * @dev Timestamp the contest starts at. Submissions open at the end of this block, so it is not possible to propose
     * during this block.
     */
    function contestStart() public view virtual returns (uint256);

    /**
     * @notice module:core
     * @dev Timestamp the contest vote begins. Votes open at the end of this block, so it is possible to propose
     * during this block.
     */
    function voteStart() public view virtual returns (uint256);

    /**
     * @notice module:core
     * @dev Timestamp at which votes close. Votes close at the end of this block, so it is possible to cast a vote
     * during this block.
     */
    function contestDeadline() public view virtual returns (uint256);

    /**
     * @notice module:user-config
     * @dev Delay, in seconds, between the proposal is created and the vote starts. This can be increassed to
     * leave time for users to buy voting power, of delegate it, before the voting of a proposal starts.
     */
    function votingDelay() public view virtual returns (uint256);

    /**
     * @notice module:user-config
     * @dev Delay, in seconds, between the vote start and vote ends.
     *
     * NOTE: The {votingDelay} can delay the start of the vote. This must be considered when setting the voting
     * duration compared to the voting delay.
     */
    function votingPeriod() public view virtual returns (uint256);

    /**
     * @notice module:core
     * @dev Creator of the contest, has the power to cancel the contest and delete proposals in it.
     */
    function creator() public view virtual returns (address);

    /**
     * @dev Verifies that `account` is permissioned to propose via merkle proof.
     */
    function verifyProposer(address account, bytes32[] calldata proof) public virtual;

    /**
     * @dev Verifies that all of the metadata in the proposal is valid.
     */
    function validateProposalData(ProposalCore memory proposal) public virtual;

    /**
     * @dev Create a new proposal. Vote start {IGovernor-votingDelay} blocks after the proposal is created and ends
     * {IGovernor-votingPeriod} blocks after the voting starts.
     *
     * Emits a {ProposalCreated} event.
     */
    function propose(ProposalCore calldata proposal, bytes32[] calldata proof)
        public
        payable
        virtual
        returns (uint256 proposalId);

    /**
     * @dev Create a new proposal. Vote start {IGovernor-votingDelay} blocks after the proposal is created and ends
     * {IGovernor-votingPeriod} blocks after the voting starts.
     *
     * Emits a {ProposalCreated} event.
     */
    function proposeWithoutProof(ProposalCore calldata proposal) public payable virtual returns (uint256 proposalId);

    /**
     * @dev Verifies that `account` is permissioned to vote with `totalVotes` via merkle proof.
     */
    function verifyVoter(address account, uint256 totalVotes, bytes32[] calldata proof) public virtual;

    /**
     * @dev Cast a vote with a merkle proof.
     *
     * Emits a {VoteCast} event.
     */
    function castVote(uint256 proposalId, uint8 support, uint256 totalVotes, uint256 numVotes, bytes32[] calldata proof)
        public
        virtual
        returns (uint256 balance);

    /**
     * @dev Cast a vote without including the merkle proof.
     *
     * Emits a {VoteCast} event.
     */
    function castVoteWithoutProof(uint256 proposalId, uint8 support, uint256 numVotes)
        public
        virtual
        returns (uint256 balance);
}
