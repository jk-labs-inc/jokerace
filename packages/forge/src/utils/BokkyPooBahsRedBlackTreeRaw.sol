// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./BokkyPooBahsRedBlackTreeLibrary.sol";

// ----------------------------------------------------------------------------
// BokkyPooBah's Red-Black Tree Library v1.0-pre-release-a - Contract for testing
//
// A Solidity Red-Black Tree binary search library to store and access a sorted
// list of unsigned integer data. The Red-Black algorithm rebalances the binary
// search tree, resulting in O(log n) insert, remove and search time (and ~gas)
//
// https://github.com/bokkypoobah/BokkyPooBahsRedBlackTreeLibrary
//
//
// Enjoy. (c) BokkyPooBah / Bok Consulting Pty Ltd 2020. The MIT Licence.
// ----------------------------------------------------------------------------
contract BokkyPooBahsRedBlackTreeRaw {
    using BokkyPooBahsRedBlackTreeLibrary for BokkyPooBahsRedBlackTreeLibrary.Tree;

    BokkyPooBahsRedBlackTreeLibrary.Tree _tree;

    event Log(string where, uint key, uint value);

    function root() public view returns (uint _key) {
        _key = _tree.root;
    }
    function first() public view returns (uint _key) {
        _key = _tree.first();
    }
    function last() public view returns (uint _key) {
        _key = _tree.last();
    }
    function next(uint key) public view returns (uint _key) {
        _key = _tree.next(key);
    }
    function prev(uint key) public view returns (uint _key) {
        _key = _tree.prev(key);
    }
    function exists(uint key) public view returns (bool _exists) {
        _exists = _tree.exists(key);
    }
    function getNode(uint _key) public view returns (uint key, uint parent, uint left, uint right, bool red) {
        (key, parent, left, right, red) = _tree.getNode(_key);
    }

    function insert(uint _key) public {
        _tree.insert(_key);
    }
    function remove(uint _key) public {
        _tree.remove(_key);
    }
}
