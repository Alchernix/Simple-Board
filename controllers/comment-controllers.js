// 댓글
const db = require("../db/quries");

async function createComment(req, res) {
    const postId = Number(req.params.postId);
    const userId = req.user.id;
    const content = req.body.content;
    const postAuthor = (await db.getPost(postId)).author;
    const comment = await db.createComment(userId, postId, content, null);
    const comments = await db.getCommentsByPostId(postId);

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
    const postAuthor = (await db.getPost(postId)).author;
    const comment = await db.createComment(userId, postId, content, originalCommentId);
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
    // const test = [];

    // for (let i = 0; i < comments.length; i++) {
    //     if (comments[i].parent_comment_id) {
    //         const parentId = comments[i].parent_comment_id;
    //         const index = test.findIndex((comment) => comment.id === parentId);
    //         test[index].replies.push(comments[i])
    //     } else {
    //         comments[i].replies = [];
    //         test.push(comments[i]);
    //     }
    // }
    // console.log(test);

    if (userId !== postAuthor) {
        // 자기 글에 댓글 단 게 아닐 때만 알림가게
        await db.createNotification(postAuthor, "comment", postId, userId, comment.id);
    }

    res.json({ nestedComments, postId, user: req.user });
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
    createReply,
    deleteComment
}