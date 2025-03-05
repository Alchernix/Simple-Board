// 댓글
const db = require("../db/quries");

async function createComment(req, res) {
    const postId = Number(req.params.postId);
    const userId = req.user.id;
    const content = req.body.content;
    const postAuthor = (await db.getPost(postId)).author;
    const comment = await db.createComment(userId, postId, content, null);
    const comments = await loadComments(postId);

    if (userId !== postAuthor) {
        // 자기 글에 댓글 단 게 아닐 때만 알림가게
        await db.createNotification(postAuthor, "comment", postId, userId, comment.id);
    }

    res.json({ comments, postId, user: req.user });
}

async function createReply(req, res) {
    const postId = Number(req.params.postId);
    const userId = req.user.id;
    const content = req.body.replyContent;
    const originalCommentId = Number(req.query.originalComment);
    const originalCommentAuthor = (await db.getCommentById(originalCommentId)).user_id;
    const postAuthor = (await db.getPost(postId)).author;
    const comment = await db.createComment(userId, postId, content, originalCommentId);
    const comments = await loadComments(postId);

    if (userId !== postAuthor) {
        // 자기 글에 댓글 단 게 아닐 때만 알림가게
        await db.createNotification(postAuthor, "comment", postId, userId, comment.id);
    } else if (userId !== originalCommentAuthor) {
        await db.createNotification(originalCommentAuthor, "reply", postId, userId, comment.id);
    }

    res.json({ comments, postId, user: req.user });
}

// 댓글을 대댓글까지 계층화해서 보내주는 함수
async function loadComments(postId) {
    const comments = await db.getCommentsByPostId(postId);
    const commentMap = {};
    const nestedComments = [];

    comments.forEach(comment => {
        comment.replies = [];
        commentMap[comment.id] = comment;
    })
    comments.forEach(comment => {
        if (comment.parent_comment_id) {
            const parent = commentMap[comment.parent_comment_id];
            if (parent) {
                parent.replies.push(comment);
            }
        } else {
            nestedComments.push(comment);
        }
    });

    return nestedComments;
}

async function loadCommentsAPI(req, res) {
    const postId = Number(req.params.postId);
    const comments = await loadComments(postId);

    res.json({ comments, user: req.user });
}

async function deleteComment(req, res) {
    const postId = Number(req.params.postId);
    const commentId = Number(req.params.commentId);
    await db.deleteComment(commentId);
    const comments = await loadComments(postId);

    res.json({ comments, postId, user: req.user });
    // res.redirect(`/post/${postId}`);
}

module.exports = {
    loadComments,
    loadCommentsAPI,
    createComment,
    createReply,
    deleteComment
}