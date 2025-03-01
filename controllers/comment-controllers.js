// 댓글
const db = require("../db/quries");

async function createComment(req, res) {
    const postId = Number(req.params.postId);
    const userId = req.user.id;
    const content = req.body.content;
    const postAuthor = (await db.getPost(postId)).author;
    const comment = await db.createComment(userId, postId, content);
    const comments = await db.getCommentsByPostId(postId);

    if (userId !== postAuthor) {
        // 자기 글에 댓글 단 게 아닐 때만 알림가게
        await db.createNotification(postAuthor, "comment", postId, userId, comment.id);
    }

    res.json({ comments, postId, user: req.user });
}

async function deleteComment(req, res) {
    const postId = Number(req.params.postId);
    const commentId = Number(req.params.commentId);
    await db.deleteComment(commentId);
    const comments = await db.getCommentsByPostId(postId);

    res.json({ comments, postId, user: req.user });
    // res.redirect(`/post/${postId}`);
}

module.exports = {
    createComment,
    deleteComment
}