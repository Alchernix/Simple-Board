// 포스트 생성/수정/삭제/상세보기
const db = require("../db/quries");
const { format } = require("date-fns");

function createPostGet(req, res) {
    res.render("post-editor", { title: "게시글 작성" });
}

async function createPostPost(req, res) {
    const title = req.body.title;
    const content = req.body.content;
    const user = req.user;

    await db.createPost(user.id, title, content);

    res.redirect("/");
}

async function getPostDetail(req, res) {
    if (req.user) {
        const postId = Number(req.params.postId);
        const post = await db.getPost(postId);
        const comments = await db.getCommentByPostId(postId);
        post.created_at = format(new Date(post.created_at), "yyyy.MM.dd HH:mm:ss");
        comments.forEach(comment => {
            comment.created_at = format(new Date(comment.created_at), "yyyy.MM.dd HH:mm:ss");
        });
        res.render("post-detail", { post, user: req.user, comments });
    } else {
        res.render("sign-up", { isNonMemb: true });
    }

}

async function editPostGet(req, res) {
    const postId = Number(req.params.postId);
    const post = await db.getPost(postId);
    res.render("post-editor", { title: "게시글 수정", post });
}

async function editPostPost(req, res) {
    const postId = Number(req.params.postId);
    const title = req.body.title;
    const content = req.body.content;
    await db.editPost(postId, title, content);
    res.redirect(`/post/${postId}`);
}

async function deletePost(req, res) {
    const postId = Number(req.params.postId);
    await db.deletePost(postId);
    res.redirect("/");
}

module.exports = {
    createPostGet,
    createPostPost,
    getPostDetail,
    editPostGet,
    editPostPost,
    deletePost,
}