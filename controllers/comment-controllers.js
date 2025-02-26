// 댓글
const db = require("../db/quries");

async function createComment(req, res) {
    const postId = Number(req.params.postId);
    const userId = req.user.id;
    const content = req.body.content;
    await db.createComment(userId, postId, content);
    res.redirect(`/post/${postId}`);
}

async function deleteComment(req, res) {
    const postId = Number(req.params.postId);
    const commentId = Number(req.params.commentId);
    await db.deleteComment(commentId);
    res.redirect(`/post/${postId}`);
}

module.exports = {
    createComment,
    deleteComment
}