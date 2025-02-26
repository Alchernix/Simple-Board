const db = require("../db/quries");

async function like(req, res) {
    const postId = Number(req.params.postId);
    const userId = req.user.id;
    const isLiked = await db.isLiked(userId, postId);

    if (isLiked) {
        // 이미 좋아요를 눌렀으면 취소
        await db.removeLike(userId, postId);
    } else {
        // 안 눌렀으면 좋아요 누르기
        await db.addLike(userId, postId);
    }

    const likeCount = await db.countLikesByPostId(postId);

    res.json({ isLiked: !isLiked, likeCount: likeCount.count });
}

module.exports = {
    like,
}