// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// ----------------------------------------------------------------------------
// BokkyPooBah's Red-Black Tree Library v1.0-pre-release-a
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
library BokkyPooBahsRedBlackTreeLibrary {
    struct Node {
        uint256 parent;
        uint256 left;
        uint256 right;
        bool red;
        uint256 count;
    }

    struct Tree {
        uint256 root;
        mapping(uint256 => Node) nodes;
    }

    uint256 private constant _EMPTY = 0;

    function getCount(Tree storage self, uint256 key) internal view returns (uint256) {
        if (key == _EMPTY) {
            return _EMPTY;
        }
        return self.nodes[key].count;
    }

    function first(Tree storage self) internal view returns (uint256 _key) {
        _key = self.root;
        if (_key != _EMPTY) {
            while (self.nodes[_key].left != _EMPTY) {
                _key = self.nodes[_key].left;
            }
        }
    }

    function last(Tree storage self) internal view returns (uint256 _key) {
        _key = self.root;
        if (_key != _EMPTY) {
            while (self.nodes[_key].right != _EMPTY) {
                _key = self.nodes[_key].right;
            }
        }
    }

    function next(Tree storage self, uint256 target) internal view returns (uint256 cursor) {
        require(target != _EMPTY);
        if (self.nodes[target].right != _EMPTY) {
            cursor = _treeMinimum(self, self.nodes[target].right);
        } else {
            cursor = self.nodes[target].parent;
            while (cursor != _EMPTY && target == self.nodes[cursor].right) {
                target = cursor;
                cursor = self.nodes[cursor].parent;
            }
        }
    }

    function prev(Tree storage self, uint256 target) internal view returns (uint256 cursor) {
        require(target != _EMPTY);
        if (self.nodes[target].left != _EMPTY) {
            cursor = _treeMaximum(self, self.nodes[target].left);
        } else {
            cursor = self.nodes[target].parent;
            while (cursor != _EMPTY && target == self.nodes[cursor].left) {
                target = cursor;
                cursor = self.nodes[cursor].parent;
            }
        }
    }

    function exists(Tree storage self, uint256 key) internal view returns (bool) {
        return (key != _EMPTY) && ((key == self.root) || (self.nodes[key].parent != _EMPTY));
    }

    function isEMPTY(uint256 key) internal pure returns (bool) {
        return key == _EMPTY;
    }

    function getEMPTY() internal pure returns (uint256) {
        return _EMPTY;
    }

    function getNode(Tree storage self, uint256 key)
        internal
        view
        returns (uint256 _returnKey, uint256 _parent, uint256 _left, uint256 _right, bool _red)
    {
        require(exists(self, key));
        return (key, self.nodes[key].parent, self.nodes[key].left, self.nodes[key].right, self.nodes[key].red);
    }

    function insert(Tree storage self, uint256 key) internal {
        require(key != _EMPTY);
        require(!exists(self, key));
        uint256 cursor = _EMPTY;
        uint256 probe = self.root;
        while (probe != _EMPTY) {
            cursor = probe;
            if (key < probe) {
                probe = self.nodes[probe].left;
            } else {
                probe = self.nodes[probe].right;
            }
        }
        self.nodes[key] = Node({parent: cursor, left: _EMPTY, right: _EMPTY, red: true, count: 1});
        if (cursor == _EMPTY) {
            self.root = key;
        } else if (key < cursor) {
            self.nodes[cursor].left = key;
        } else {
            self.nodes[cursor].right = key;
        }
        _insertFixup(self, key);

        // After inserting, adjust counts of ancestors
        while (self.nodes[key].parent != _EMPTY) {
            uint256 currentParent = self.nodes[key].parent;
            self.nodes[currentParent].count++;
            key = currentParent;
        }
    }

    function remove(Tree storage self, uint256 key) internal {
        require(key != _EMPTY);
        require(exists(self, key));

        // Store ancestor nodes before deletion to update counts
        uint256[] memory ancestors = new uint[](32); // Assuming tree height will not exceed 32 (would need to have more than 1bn proposals)
        uint256 index = 0;
        uint256 temp = key;
        while (self.nodes[temp].parent != _EMPTY) {
            uint256 currentParent = self.nodes[temp].parent;
            ancestors[index] = currentParent;
            index++;
            temp = currentParent;
        }

        uint256 probe;
        uint256 cursor;
        if (self.nodes[key].left == _EMPTY || self.nodes[key].right == _EMPTY) {
            cursor = key;
        } else {
            cursor = self.nodes[key].right;
            while (self.nodes[cursor].left != _EMPTY) {
                cursor = self.nodes[cursor].left;
            }
        }
        if (self.nodes[cursor].left != _EMPTY) {
            probe = self.nodes[cursor].left;
        } else {
            probe = self.nodes[cursor].right;
        }
        uint256 yParent = self.nodes[cursor].parent;
        self.nodes[probe].parent = yParent;
        if (yParent != _EMPTY) {
            if (cursor == self.nodes[yParent].left) {
                self.nodes[yParent].left = probe;
            } else {
                self.nodes[yParent].right = probe;
            }
        } else {
            self.root = probe;
        }
        bool doFixup = !self.nodes[cursor].red;
        if (cursor != key) {
            _replaceParent(self, cursor, key);
            self.nodes[cursor].left = self.nodes[key].left;
            self.nodes[self.nodes[cursor].left].parent = cursor;
            self.nodes[cursor].right = self.nodes[key].right;
            self.nodes[self.nodes[cursor].right].parent = cursor;
            self.nodes[cursor].red = self.nodes[key].red;
            (cursor, key) = (key, cursor);
        }
        if (doFixup) {
            _removeFixup(self, probe);
        }
        delete self.nodes[cursor];

        // After deleting, adjust counts of ancestors
        for (uint256 i = 0; i < index; i++) {
            self.nodes[ancestors[i]].count--;
        }
    }

    function _treeMinimum(Tree storage self, uint256 key) private view returns (uint256) {
        while (self.nodes[key].left != _EMPTY) {
            key = self.nodes[key].left;
        }
        return key;
    }

    function _treeMaximum(Tree storage self, uint256 key) private view returns (uint256) {
        while (self.nodes[key].right != _EMPTY) {
            key = self.nodes[key].right;
        }
        return key;
    }

    function _rotateLeft(Tree storage self, uint256 key) private {
        uint256 cursor = self.nodes[key].right;
        uint256 keyParent = self.nodes[key].parent;
        uint256 cursorLeft = self.nodes[cursor].left;
        self.nodes[key].right = cursorLeft;
        if (cursorLeft != _EMPTY) {
            self.nodes[cursorLeft].parent = key;
        }
        self.nodes[cursor].parent = keyParent;
        if (keyParent == _EMPTY) {
            self.root = cursor;
        } else if (key == self.nodes[keyParent].left) {
            self.nodes[keyParent].left = cursor;
        } else {
            self.nodes[keyParent].right = cursor;
        }
        self.nodes[cursor].left = key;
        self.nodes[key].parent = cursor;
    }

    function _rotateRight(Tree storage self, uint256 key) private {
        uint256 cursor = self.nodes[key].left;
        uint256 keyParent = self.nodes[key].parent;
        uint256 cursorRight = self.nodes[cursor].right;
        self.nodes[key].left = cursorRight;
        if (cursorRight != _EMPTY) {
            self.nodes[cursorRight].parent = key;
        }
        self.nodes[cursor].parent = keyParent;
        if (keyParent == _EMPTY) {
            self.root = cursor;
        } else if (key == self.nodes[keyParent].right) {
            self.nodes[keyParent].right = cursor;
        } else {
            self.nodes[keyParent].left = cursor;
        }
        self.nodes[cursor].right = key;
        self.nodes[key].parent = cursor;
    }

    function _insertFixup(Tree storage self, uint256 key) private {
        uint256 cursor;
        while (key != self.root && self.nodes[self.nodes[key].parent].red) {
            uint256 keyParent = self.nodes[key].parent;
            if (keyParent == self.nodes[self.nodes[keyParent].parent].left) {
                cursor = self.nodes[self.nodes[keyParent].parent].right;
                if (self.nodes[cursor].red) {
                    self.nodes[keyParent].red = false;
                    self.nodes[cursor].red = false;
                    self.nodes[self.nodes[keyParent].parent].red = true;
                    key = self.nodes[keyParent].parent;
                } else {
                    if (key == self.nodes[keyParent].right) {
                        key = keyParent;
                        _rotateLeft(self, key);
                    }
                    keyParent = self.nodes[key].parent;
                    self.nodes[keyParent].red = false;
                    self.nodes[self.nodes[keyParent].parent].red = true;
                    _rotateRight(self, self.nodes[keyParent].parent);
                }
            } else {
                cursor = self.nodes[self.nodes[keyParent].parent].left;
                if (self.nodes[cursor].red) {
                    self.nodes[keyParent].red = false;
                    self.nodes[cursor].red = false;
                    self.nodes[self.nodes[keyParent].parent].red = true;
                    key = self.nodes[keyParent].parent;
                } else {
                    if (key == self.nodes[keyParent].left) {
                        key = keyParent;
                        _rotateRight(self, key);
                    }
                    keyParent = self.nodes[key].parent;
                    self.nodes[keyParent].red = false;
                    self.nodes[self.nodes[keyParent].parent].red = true;
                    _rotateLeft(self, self.nodes[keyParent].parent);
                }
            }
        }
        self.nodes[self.root].red = false;
    }

    function _replaceParent(Tree storage self, uint256 a, uint256 b) private {
        uint256 bParent = self.nodes[b].parent;
        self.nodes[a].parent = bParent;
        if (bParent == _EMPTY) {
            self.root = a;
        } else {
            if (b == self.nodes[bParent].left) {
                self.nodes[bParent].left = a;
            } else {
                self.nodes[bParent].right = a;
            }
        }
    }

    function _removeFixup(Tree storage self, uint256 key) private {
        uint256 cursor;
        while (key != self.root && !self.nodes[key].red) {
            uint256 keyParent = self.nodes[key].parent;
            if (key == self.nodes[keyParent].left) {
                cursor = self.nodes[keyParent].right;
                if (self.nodes[cursor].red) {
                    self.nodes[cursor].red = false;
                    self.nodes[keyParent].red = true;
                    _rotateLeft(self, keyParent);
                    cursor = self.nodes[keyParent].right;
                }
                if (!self.nodes[self.nodes[cursor].left].red && !self.nodes[self.nodes[cursor].right].red) {
                    self.nodes[cursor].red = true;
                    key = keyParent;
                } else {
                    if (!self.nodes[self.nodes[cursor].right].red) {
                        self.nodes[self.nodes[cursor].left].red = false;
                        self.nodes[cursor].red = true;
                        _rotateRight(self, cursor);
                        cursor = self.nodes[keyParent].right;
                    }
                    self.nodes[cursor].red = self.nodes[keyParent].red;
                    self.nodes[keyParent].red = false;
                    self.nodes[self.nodes[cursor].right].red = false;
                    _rotateLeft(self, keyParent);
                    key = self.root;
                }
            } else {
                cursor = self.nodes[keyParent].left;
                if (self.nodes[cursor].red) {
                    self.nodes[cursor].red = false;
                    self.nodes[keyParent].red = true;
                    _rotateRight(self, keyParent);
                    cursor = self.nodes[keyParent].left;
                }
                if (!self.nodes[self.nodes[cursor].right].red && !self.nodes[self.nodes[cursor].left].red) {
                    self.nodes[cursor].red = true;
                    key = keyParent;
                } else {
                    if (!self.nodes[self.nodes[cursor].left].red) {
                        self.nodes[self.nodes[cursor].right].red = false;
                        self.nodes[cursor].red = true;
                        _rotateLeft(self, cursor);
                        cursor = self.nodes[keyParent].left;
                    }
                    self.nodes[cursor].red = self.nodes[keyParent].red;
                    self.nodes[keyParent].red = false;
                    self.nodes[self.nodes[cursor].left].red = false;
                    _rotateRight(self, keyParent);
                    key = self.root;
                }
            }
        }
        self.nodes[key].red = false;
    }

    // Additional function to calculate rank of a key
    // (highest number key will be the highest number rank - if the numbers 7 and 99 are being sorted,
    // 99 will be rank 2 while 7 will be rank 1)
    function getRank(Tree storage self, uint256 key) internal view returns (uint256 rank) {
        require(exists(self, key), "key does not exist");
        rank = getCount(self, key);
        uint256 parent = self.nodes[key].parent;
        while (parent != _EMPTY) {
            if (key == self.nodes[parent].right) {
                rank += getCount(self, parent);
            }
            key = parent;
            parent = self.nodes[key].parent;
        }
    }
}
// ----------------------------------------------------------------------------
// End - BokkyPooBah's Red-Black Tree Library
// ----------------------------------------------------------------------------
