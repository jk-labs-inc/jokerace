// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./token/ERC20/extensions/ERC20Wrapper.sol";
import "./token/ERC20/extensions/ERC20VotesTimestamp.sol";
 
contract ERC20VotesTimestampWrapper is ERC20, ERC20Wrapper, ERC20VotesTimestamp{
    constructor(IERC20 wrappedToken, string memory tokenName, string memory tokenSymbol)
       ERC20(tokenName, tokenSymbol)
       ERC20Permit(tokenName)
       ERC20Wrapper(wrappedToken)
    {}
    
    function _afterTokenTransfer(address from, address to, uint256 amount)
        internal
        override(ERC20, ERC20VotesTimestamp)
    {
        super._afterTokenTransfer(from, to, amount);
    }
 
    function _mint(address to, uint256 amount)
        internal
        override(ERC20, ERC20VotesTimestamp)
    {
        super._mint(to, amount);
    }
 
    function _burn(address account, uint256 amount)
        internal
        override(ERC20, ERC20VotesTimestamp)
    {
        super._burn(account, amount);
    }

    function decimals()
        public
        view
        override(ERC20, ERC20Wrapper)
        returns (uint8)
    {
        return super.decimals();
    }
}