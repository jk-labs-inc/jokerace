// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./token/ERC20/extensions/ERC20Wrapper.sol";
import "./token/ERC20/extensions/ERC20Votes.sol";
 
contract ERC20VotesWrapper is ERC20, ERC20Wrapper, ERC20Votes{
    constructor(IERC20 wrappedToken)
       ERC20("Wrapped Joke", "wJOKE")
       ERC20Permit("Wrapped Joke")
       ERC20Wrapper(wrappedToken)
    {}
    
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

    function decimals()
        public
        view
        override(ERC20, ERC20Wrapper)
        returns (uint8)
    {
        return super.decimals();
    }
}