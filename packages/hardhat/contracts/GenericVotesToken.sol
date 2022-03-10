// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./token/ERC20/ERC20.sol";
import "./token/ERC20/extensions/draft-ERC20Permit.sol";
import "./token/ERC20/extensions/ERC20Votes.sol";

contract GenericVotesToken is ERC20, ERC20Permit, ERC20Votes {
    constructor() ERC20("TestToken", "TEST") ERC20Permit("TestToken") {
        _mint(0xd698e31229aB86334924ed9DFfd096a71C686900, 10000 * 10 ** decimals());
    }

    // The following functions are overrides required by Solidity.

    function _afterTokenTransfer(address from, address to, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address to, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._mint(to, amount);
    }

    function _burn(address account, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._burn(account, amount);
    }
}