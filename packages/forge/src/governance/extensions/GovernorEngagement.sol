// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../Governor.sol";

/**
 * @dev Extension of {Governor} for engagement features.
 */
abstract contract GovernorEngagement is Governor {
    struct CommentCore {
        address author;
        uint256 timestamp;
        uint256 proposalId;
        string commentContent;
    }

    /**
     * @dev Emitted when a comment is created.
     */
    event CommentCreated(uint256 commentId);

    /**
     * @dev Emitted when comments are deleted.
     */
    event CommentsDeleted(uint256[] commentIds);

    uint256[] public commentIds;
    uint256[] public deletedCommentIds;
    mapping(uint256 => CommentCore) public comments;
    mapping(uint256 => uint256[]) public proposalComments;
    mapping(uint256 => bool) public commentIsDeleted;

    error OnlyCreatorOrAuthorCanDeleteComments(uint256 failedToDeleteCommentId);

    /**
     * @dev Hashing function used to build the comment id from the comment details.
     */
    function hashComment(CommentCore memory commentObj) public pure returns (uint256) {
        return uint256(keccak256(abi.encode(commentObj)));
    }

    /**
     * @dev Returns if a comment has been deleted or not.
     */
    function isCommentDeleted(uint256 commentId) public view returns (bool) {
        return commentIsDeleted[commentId];
    }

    /**
     * @dev Comment on a proposal.
     *
     * Emits a {CommentCreated} event.
     */
    function comment(uint256 proposalId, string memory commentContent) public returns (uint256) {
        CommentCore memory commentObject = CommentCore({
            author: msg.sender,
            timestamp: block.timestamp,
            proposalId: proposalId,
            commentContent: commentContent
        });
        uint256 commentId = hashComment(commentObject);

        commentIds.push(commentId);
        comments[commentId] = commentObject;
        proposalComments[proposalId].push(commentId);

        emit CommentCreated(commentId);

        return commentId;
    }

    /**
     * @dev Delete comments.
     *
     * Emits a {CommentsDeleted} event.
     */
    function deleteComments(uint256[] memory commentIdsParam) public {
        uint256 commentIdsParamMemVar = commentIdsParam.length;

        for (uint256 index = 0; index < commentIdsParamMemVar; index++) {
            uint256 currentCommentId = commentIdsParam[index];

            if ((msg.sender != creator) && (msg.sender != comments[currentCommentId].author)) {
                revert OnlyCreatorOrAuthorCanDeleteComments(currentCommentId);
            }

            if (!commentIsDeleted[currentCommentId]) {
                commentIsDeleted[currentCommentId] = true;
            }
        }

        emit CommentsDeleted(commentIdsParam);
    }
}
