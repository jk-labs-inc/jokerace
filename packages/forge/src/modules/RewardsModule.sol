// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/utils/Address.sol";
import "@openzeppelin/utils/Context.sol";
import "../governance/IGovernor.sol";
import "../governance/extensions/GovernorCountingSimple.sol";

/**
 * @title RewardsModule
 * @dev This contract allows to split Ether payments among a group of accounts. The sender does not need to be aware
 * that the Ether will be split in this way, since it is handled transparently by the contract.
 *
 * The split can be in equal parts or in any other arbitrary proportion. The way this is specified is by assigning each
 * account to a number of shares. Of all the Ether that this contract receives, each account will then be able to claim
 * an amount proportional to the percentage of total shares they were assigned. The distribution of shares is set at the
 * time of contract deployment and can't be updated thereafter.
 *
 * `RewardsModule` follows a _pull payment_ model. This means that payments are not automatically forwarded to the
 * accounts but kept in this contract, and the actual transfer is triggered as a separate step by calling the {release}
 * function.
 *
 * NOTE: This contract assumes that ERC20 tokens will behave similarly to native tokens (Ether). Rebasing tokens, and
 * tokens that apply fees during transfers, are likely to not be supported as expected. If in doubt, we encourage you
 * to run tests before sending real value to this contract.
 */
contract RewardsModule is Context {
    event PayeeAdded(uint256 ranking, uint256 shares);
    event PaymentReleased(address to, uint256 amount);
    event ERC20PaymentReleased(IERC20 indexed token, address to, uint256 amount);
    event PaymentReceived(address from, uint256 amount);
    event RewardWithdrawn(address by, uint256 amount);
    event ERC20RewardWithdrawn(IERC20 indexed token, address by, uint256 amount);

    uint256 private _totalShares;
    uint256 private _totalReleased;

    mapping(uint256 => uint256) private _shares;
    mapping(uint256 => uint256) private _released;
    uint256[] private _payees;

    mapping(IERC20 => uint256) private _erc20TotalReleased;
    mapping(IERC20 => mapping(uint256 => uint256)) private _erc20Released;

    GovernorCountingSimple private immutable _underlyingContest;
    address private immutable _creator;
    bool private immutable _paysOutTarget; // if true, pay out target address; if false, pay out proposal author

    /**
     * @dev Creates an instance of `RewardsModule` where each ranking in `payees` is assigned the number of shares at
     * the matching position in the `shares` array.
     *
     * All rankings in `payees` must be non-zero. Both arrays must have the same non-zero length, and there must be no
     * duplicates in `payees`.
     */
    constructor(
        uint256[] memory payees,
        uint256[] memory shares_,
        GovernorCountingSimple underlyingContest_,
        bool paysOutTarget_
    ) payable {
        require(payees.length == shares_.length, "RewardsModule: payees and shares length mismatch");
        require(payees.length > 0, "RewardsModule: no payees");

        for (uint256 i = 0; i < payees.length; i++) {
            _addPayee(payees[i], shares_[i]);
        }

        require(_totalShares != 0, "RewardsModule: the total number of shares cannot equal 0");

        _paysOutTarget = paysOutTarget_;
        _underlyingContest = underlyingContest_;
        _creator = msg.sender;
    }

    /**
     * @dev The Ether received will be logged with {PaymentReceived} events. Note that these events are not fully
     * reliable: it's possible for a contract to receive Ether without triggering this function. This only affects the
     * reliability of the events, and not the actual splitting of Ether.
     */
    receive() external payable virtual {
        emit PaymentReceived(msg.sender, msg.value);
    }

    /**
     * @dev Version of the rewards module. Default: "1"
     */
    function version() public view virtual returns (string memory) {
        return "4.2";
    }

    /**
     * @dev Getter for the total shares held by payees.
     */
    function totalShares() public view returns (uint256) {
        return _totalShares;
    }

    /**
     * @dev Getter for the creator of this rewards contract.
     */
    function creator() public view returns (address) {
        return _creator;
    }

    /**
     * @dev Getter for the total amount of Ether already released.
     */
    function totalReleased() public view returns (uint256) {
        return _totalReleased;
    }

    /**
     * @dev Getter for the total amount of `token` already released. `token` should be the address of an IERC20
     * contract.
     */
    function totalReleased(IERC20 token) public view returns (uint256) {
        return _erc20TotalReleased[token];
    }

    /**
     * @dev Getter for the amount of shares held by a ranking.
     */
    function shares(uint256 ranking) public view returns (uint256) {
        return _shares[ranking];
    }

    /**
     * @dev Getter for the amount of Ether already released to a payee.
     */
    function released(uint256 ranking) public view returns (uint256) {
        return _released[ranking];
    }

    /**
     * @dev Getter for the amount of `token` tokens already released to a payee. `token` should be the address of an
     * IERC20 contract.
     */
    function released(IERC20 token, uint256 ranking) public view returns (uint256) {
        return _erc20Released[token][ranking];
    }

    /**
     * @dev Getter for list of rankings that will be paid out.
     */
    function getPayees() public view returns (uint256[] memory) {
        return _payees;
    }

    /**
     * @dev Getter for whether this pays out the target address or author of a proposal.
     */
    function paysOutTarget() public view returns (bool) {
        return _paysOutTarget;
    }

    /**
     * @dev Getter for the underlying contest.
     */
    function underlyingContest() public view returns (GovernorCountingSimple) {
        return _underlyingContest;
    }

    /**
     * @dev Getter for the amount of payee's releasable Ether.
     */
    function releasable(uint256 ranking) public view returns (uint256) {
        uint256 totalReceived = address(this).balance + totalReleased();
        return _pendingPayment(ranking, totalReceived, released(ranking));
    }

    /**
     * @dev Getter for the amount of payee's releasable `token` tokens. `token` should be the address of an
     * IERC20 contract.
     */
    function releasable(IERC20 token, uint256 ranking) public view returns (uint256) {
        uint256 totalReceived = token.balanceOf(address(this)) + totalReleased(token);
        return _pendingPayment(ranking, totalReceived, released(token, ranking));
    }

    /**
     * @dev Run release checks.
     */
    function runReleaseChecks(uint256 ranking) public view {
        require(
            _underlyingContest.downvotingAllowed() == 0,
            "RewardsModule: rankings don't work with downvoting enabled on the contest"
        );
        require(
            _underlyingContest.state() == IGovernor.ContestState.Completed,
            "RewardsModule: contest must be completed for rewards to be paid out"
        );
        require(ranking != 0, "RewardsModule: ranking must be 1 or greater");
        require(_shares[ranking] > 0, "RewardsModule: ranking has no shares");
    }

    /**
     * @dev Return address to pay out for a given ranking.
     */
    function getAddressToPayOut(uint256 ranking) public view returns (address) {
        address addressToPayOut;
        uint256 determinedRankingIdxInSortedRanks = _underlyingContest.getRankIndex(ranking);

        // if the ranking that we land on is tied or it's below a tied ranking, send to creator
        if (_underlyingContest.isOrIsBelowTiedRank(determinedRankingIdxInSortedRanks)) {
            addressToPayOut = creator();
        }
        // otherwise, determine proposal at ranking and pay out according to that
        else {
            uint256 rankValue = _underlyingContest.sortedRanks(determinedRankingIdxInSortedRanks);
            IGovernor.ProposalCore memory rankingProposal = _underlyingContest.getProposal(
                _underlyingContest.getOnlyProposalIdWithThisManyForVotes(rankValue) // if no ties there should only be one
            );
            addressToPayOut = _paysOutTarget ? rankingProposal.targetMetadata.targetAddress : rankingProposal.author;
        }

        return addressToPayOut;
    }

    /**
     * @dev Triggers a transfer to `ranking` of the amount of Ether they are owed, according to their percentage of the
     * total shares and their previous withdrawals.
     */
    function release(uint256 ranking) public virtual {
        runReleaseChecks(ranking);

        uint256 payment = releasable(ranking);

        require(
            payment != 0,
            "RewardsModule: account isn't due payment as there isn't any native currency in the module to pay out"
        );

        // _totalReleased is the sum of all values in _released.
        // If "_totalReleased += payment" does not overflow, then "_released[account] += payment" cannot overflow.
        _totalReleased += payment;
        unchecked {
            _released[ranking] += payment;
        }

        address payable addressToPayOut = payable(getAddressToPayOut(ranking));

        require(addressToPayOut != address(0), "RewardsModule: account is the zero address");

        emit PaymentReleased(addressToPayOut, payment);
        Address.sendValue(addressToPayOut, payment);
    }

    /**
     * @dev Triggers a transfer to `ranking` of the amount of `token` tokens they are owed, according to their
     * percentage of the total shares and their previous withdrawals. `token` must be the address of an IERC20
     * contract.
     */
    function release(IERC20 token, uint256 ranking) public virtual {
        runReleaseChecks(ranking);

        uint256 payment = releasable(token, ranking);

        require(
            payment != 0,
            "RewardsModule: account isn't due payment as there isn't any native currency in the module to pay out"
        );

        // _erc20TotalReleased[token] is the sum of all values in _erc20Released[token].
        // If "_erc20TotalReleased[token] += payment" does not overflow, then "_erc20Released[token][account] += payment" cannot overflow.
        _erc20TotalReleased[token] += payment;
        unchecked {
            _erc20Released[token][ranking] += payment;
        }

        address payable addressToPayOut = payable(getAddressToPayOut(ranking));

        require(addressToPayOut != address(0), "RewardsModule: account is the zero address");

        emit ERC20PaymentReleased(token, addressToPayOut, payment);
        SafeERC20.safeTransfer(token, addressToPayOut, payment);
    }

    function withdrawRewards() public virtual {
        require(msg.sender == creator(), "RewardsModule: only the creator can withdraw rewards");

        emit RewardWithdrawn(creator(), address(this).balance);
        Address.sendValue(payable(creator()), address(this).balance);
    }

    function withdrawRewards(IERC20 token) public virtual {
        require(msg.sender == creator(), "RewardsModule: only the creator can withdraw rewards");

        emit ERC20RewardWithdrawn(token, creator(), token.balanceOf(address(this)));
        SafeERC20.safeTransfer(token, payable(creator()), token.balanceOf(address(this)));
    }

    /**
     * @dev internal logic for computing the pending payment of a `ranking` given the token historical balances and
     * already released amounts.
     */
    function _pendingPayment(uint256 ranking, uint256 totalReceived, uint256 alreadyReleased)
        private
        view
        returns (uint256)
    {
        return (totalReceived * _shares[ranking]) / _totalShares - alreadyReleased;
    }

    /**
     * @dev Add a new payee to the contract.
     * @param ranking The ranking of the payee to add.
     * @param shares_ The number of shares owned by the payee.
     */
    function _addPayee(uint256 ranking, uint256 shares_) private {
        require(ranking > 0, "RewardsModule: ranking is 0, must be greater");
        require(shares_ > 0, "RewardsModule: shares are 0");
        require(_shares[ranking] == 0, "RewardsModule: account already has shares");

        _payees.push(ranking);
        _shares[ranking] = shares_;
        _totalShares = _totalShares + shares_;
        emit PayeeAdded(ranking, shares_);
    }
}
