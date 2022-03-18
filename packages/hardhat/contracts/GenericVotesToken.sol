// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./token/ERC20/ERC20.sol";
import "./token/ERC20/extensions/draft-ERC20Permit.sol";
import "./token/ERC20/extensions/ERC20Votes.sol";

contract GenericVotesToken is ERC20, ERC20Permit, ERC20Votes {
    constructor(string memory _name, string memory _symbol, address _mintRecipient, uint256 _amountToMint) 
        ERC20(_name, _symbol) 
        ERC20Permit(_name)
    {
        _mint(_mintRecipient, _amountToMint);
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