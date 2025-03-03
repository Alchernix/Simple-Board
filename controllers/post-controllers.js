// 포스트 + 이미지 생성/수정/삭제/상세보기
const db = require("../db/quries");
const { format } = require("date-fns");
const { body, validationResult } = require("express-validator");

// const validatePost = [
//     body("title").trim()
//         .isLength({min: 1, max: 50})
// ];

function createPostGet(req, res) {
    res.render("post-editor", { title: "게시글 작성" });
}

async function createPostPost(req, res) {
    const title = req.body.title;
    const content = req.body.content;
    const user = req.user;
    const post = await db.createPost(user.id, title, content);
    if (req.files && req.files.length > 0) {
        const urls = req.files.map(file => `/uploads/${file.filename}`);
        for (const url of urls) {
            await db.uploadImage(post.id, url);
        }
    }

    res.redirect("/");
}

async function getPostDetail(req, res) {
    if (req.user) {
        const postId = Number(req.params.postId);
        const userId = req.user.id;
        const notificationCount = await db.countUnreadNotifications(userId);
        // const notifications = await db.getNotifications(userId);
        const post = await db.getPost(postId);
        const images = await db.getImagesByPostId(postId);
        // const comments = await loadComments(postId);
        post.created_at = format(new Date(post.created_at), "yyyy.MM.dd HH:mm:ss");
        const isLiked = await db.isLiked(userId, postId);
        const likeCount = await db.countLikesByPostId(postId);
        res.render("post-detail", { post, user: req.user, images, format, isLiked, likeCount: likeCount.count, notificationCount });
    } else {
        req.session.membErr = true; // 회원만 게시글을 볼 수 있습니다
        res.redirect("/sign-in");
    }

}

async function editPostGet(req, res) {
    const postId = Number(req.params.postId);
    const post = await db.getPost(postId);
    const images = await db.getImagesByPostId(postId);
    res.render("post-editor", { title: "게시글 수정", post, images });
}

async function editPostPost(req, res) {
    const postId = Number(req.params.postId);
    const title = req.body.title;
    const content = req.body.content;

    await db.editPost(postId, title, content);

    if (req.body.deletedImages) {
        const deletedImages = req.body.deletedImages.split(',');
        for (const imgId of deletedImages) {
            await db.deleteImg(Number(imgId));
        }
    }
    if (req.files && req.files.length > 0) {
        const urls = req.files.map(file => `/uploads/${file.filename}`);
        for (const url of urls) {
            await db.uploadImage(postId, url);
        }
    }
    res.redirect(`/post/${postId}`);
}

async function deletePost(req, res) {
    const postId = Number(req.params.postId);
    await db.deletePost(postId);
    res.redirect("/");
}

// 이미지
async function deleteImg(req, res) {
    const postId = Number(req.params.postId);
    const imgId = Number(req.params.imgId);
    await db.deleteImg(imgId);
    // const images = await db.getImagesByPostId(postId);
    // res.json({ images });

}

module.exports = {
    createPostGet,
    createPostPost,
    getPostDetail,
    editPostGet,
    editPostPost,
    deletePost,
    deleteImg,
}