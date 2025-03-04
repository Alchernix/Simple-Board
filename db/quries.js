const pool = require("./pool");

// 유저
async function createUser(username, password) {
    const SQL = `
    INSERT INTO users (username, password)
    VALUES ($1, $2)
    ON CONFLICT (username) DO NOTHING RETURNING *;`
    const { rows } = await pool.query(SQL, [username, password]);
    return rows;
}

async function createPost(userId, title, content) {
    const SQL = `
    INSERT INTO posts (author, title, content)
    VALUES($1, $2, $3) RETURNING *;
    `
    const { rows } = await pool.query(SQL, [userId, title, content]);
    return rows[0];
}

// 유저네임이 중복되지 않을 경우만 업데이트
async function editUser(userId, username) {
    const SQL = `
    UPDATE users
    SET username = $2
    WHERE id = $1
    AND NOT EXISTS(SELECT 1 FROM users WHERE username = $2)
    RETURNING *;
    `
    const { rows } = await pool.query(SQL, [userId, username]);
    return rows[0];
}
// ================================================
// 포스트
//최근 게시물이 위로 오도록 역순으로 조회
async function getAllPosts(limit, offset) {
    const SQL = `
    SELECT posts.id, posts.title, users.username, posts.created_at, count(DISTINCT comments.id) AS comment_count, count(DISTINCT likes.id) AS like_count
    FROM posts
    INNER JOIN users
    ON posts.author = users.id
    LEFT JOIN comments
    ON posts.id = comments.post_id AND comments.is_deleted = false
    LEFT JOIN likes
    ON posts.id = likes.post_id
    GROUP BY posts.id, posts.title, users.username, posts.created_at
    ORDER BY posts.id DESC
    LIMIT $1 OFFSET $2;`
    const { rows } = await pool.query(SQL, [limit, offset]);
    return rows;
}

async function getTotalPostNumbers() {
    const { rows } = await pool.query("SELECT COUNT(*) FROM posts;");
    return rows[0];
}

async function getSearchedPostNumbers(searchType, searchKeyword) {
    let search;
    switch (searchType) {
        case 'title+content':
            search = "WHERE posts.title ILIKE '%' || $1 || '%' OR posts.content ILIKE '%' || $1 || '%'";
            break;
        case 'title':
            search = "WHERE posts.title ILIKE '%' || $1 || '%'";
            break;
        case 'content':
            search = "WHERE posts.content ILIKE '%' || $1 || '%'";
            break;
        case 'user':
            search = "WHERE users.username ILIKE '%' || $1 || '%'";
    }
    const SQL = `
    SELECT COUNT(DISTINCT posts.id)
    FROM posts
    INNER JOIN users
    ON posts.author = users.id
    ${search}
    `
    const { rows } = await pool.query(SQL, [searchKeyword]);
    return rows[0];
}

// 포스트 검색기능
async function searchPosts(searchType, searchKeyword, limit, offset) {
    let search;
    switch (searchType) {
        case 'title+content':
            search = "WHERE posts.title ILIKE '%' || $1 || '%' OR posts.content ILIKE '%' || $1 || '%'";
            break;
        case 'title':
            search = "WHERE posts.title ILIKE '%' || $1 || '%'";
            break;
        case 'content':
            search = "WHERE posts.content ILIKE '%' || $1 || '%'";
            break;
        case 'user':
            search = "WHERE users.username ILIKE '%' || $1 || '%'";
    }
    const SQL = `
    SELECT posts.id, posts.title, users.username, posts.created_at, count(DISTINCT comments.id) AS comment_count, count(DISTINCT likes.id) AS like_count
    FROM posts
    INNER JOIN users
    ON posts.author = users.id
    LEFT JOIN comments
    ON posts.id = comments.post_id
    LEFT JOIN likes
    ON posts.id = likes.post_id
    ${search}
    GROUP BY posts.id, posts.title, users.username, posts.created_at
    ORDER BY posts.id DESC
    LIMIT $2 OFFSET $3;
    `
    const { rows } = await pool.query(SQL, [searchKeyword, limit, offset]);
    return rows;
}

// 아이디로 포스트 검색
async function getPost(id) {
    const SQL = `
    SELECT posts.id, posts.author, posts.title, users.username, posts.content, posts.created_at FROM posts
    INNER JOIN users
    ON posts.author = users.id
    WHERE posts.id = $1`
    const { rows } = await pool.query(SQL, [id]);
    return rows[0];
}

async function editPost(id, title, content) {
    const SQL = `
    UPDATE posts
    SET title = $1, content = $2
    WHERE id = $3`
    await pool.query(SQL, [title, content, id]);
}

async function deletePost(id) {
    await pool.query(`DELETE FROM posts WHERE id = $1`, [id]);
}
// ================================================
// 이미지
async function uploadImage(postId, url) {
    await pool.query(`INSERT INTO images (post_id, url) VALUES ($1, $2);`, [postId, url]);
}

async function getImagesByPostId(postId) {
    const { rows } = await pool.query("SELECT * FROM images WHERE post_id = $1", [postId]);
    return rows;
}

async function deleteImg(id) {
    await pool.query("DELETE FROM images WHERE id = $1", [id]);
}

// ================================================
// 댓글
async function createComment(userId, postId, content, parentCommentId) {
    const { rows } = await pool.query("INSERT INTO comments (user_id, post_id, content, parent_comment_id) VALUES ($1, $2, $3, $4) RETURNING *;", [userId, postId, content, parentCommentId]);
    return rows[0];
}

async function getCommentById(id) {
    const { rows } = await pool.query("SELECT * FROM comments WHERE id = $1", [id]);
    return rows[0];
}

async function getCommentsByPostId(id) {
    const SQL = `
    SELECT comments.*, users.username
    FROM comments
    INNER JOIN users
    ON users.id = comments.user_id
    WHERE comments.post_id = $1
    ORDER BY comments.id;
    `
    const { rows } = await pool.query(SQL, [id]);
    return rows;
}

async function countCommentsByPostId(id) {
    const SQL = `
    SELECT count(*) FROM comments
    WHERE post_id = $1 AND is_deleted = false;
    `
    const { rows } = await pool.query(SQL, [id]);
    return rows[0];
}

async function deleteComment(id) {
    // await pool.query("DELETE from comments WHERE id = $1", [id]);
    const { rows } = await pool.query("SELECT * FROM comments WHERE id = $1", [id]);
    const comment = rows[0];
    if (comment.parent_comment_id) {
        // 대댓글이면 그냥 삭제
        await pool.query("DELETE FROM comments WHERE id = $1", [id]);
    } else {
        // 대댓글 처리를 위해 실제로 지우지는 않고 화면상에서만 표시하지 않음
        await pool.query("UPDATE comments SET is_deleted = true WHERE id = $1", [id]);
    }
}

// ================================================
// 하트
async function isLiked(userId, postId) {
    const { rows } = await pool.query("SELECT * FROM likes WHERE user_id = $1 AND post_id = $2", [userId, postId]);
    if (rows.length !== 0) {
        return true;
    } else {
        return false;
    }
}

async function addLike(userId, postId) {
    const SQL = `
    INSERT INTO likes (user_id, post_id)
    VALUES ($1, $2)
    ON CONFLICT (user_id, post_id) DO NOTHING;
    `
    await pool.query(SQL, [userId, postId]);
}

async function removeLike(userId, postId) {
    await pool.query("DELETE FROM likes WHERE user_id = $1 AND post_id = $2", [userId, postId]);
}

async function countLikesByPostId(postId) {
    const { rows } = await pool.query("SELECT count(*) FROM likes WHERE post_id = $1", [postId]);
    return rows[0];
}

// ================================================
// 알림

async function createNotification(userId, type, postId, fromUserId, commentId) {
    await pool.query("INSERT INTO notifications (user_id, type, post_id, from_user_id, comment_id) VALUES ($1, $2, $3, $4, $5)", [userId, type, postId, fromUserId, commentId]);
}

async function countUnreadNotifications(userId) {
    const { rows } = await pool.query("SELECT count(*) FROM NOTIFICATIONS WHERE user_id = $1 AND is_read = false", [userId]);
    return rows[0].count;
}

async function getNotifications(userId) {
    const SQL = `
    SELECT notifications.type, notifications.is_read, notifications.id, notifications.created_at, comments.content, users.username AS from_user
    FROM notifications
    LEFT JOIN comments
    ON notifications.comment_id = comments.id
    LEFT JOIN users
    ON notifications.from_user_id = users.id
    WHERE notifications.user_id = $1
    ORDER BY notifications.id DESC;
    `
    const { rows } = await pool.query(SQL, [userId]);
    return rows;
}

async function getNotificationById(id) {
    const { rows } = await pool.query("SELECT * FROM notifications WHERE id = $1", [id]);
    return rows[0];
}

async function readNotification(id) {
    await pool.query("UPDATE notifications SET is_read = true WHERE id = $1", [id]);
}

async function readAllNotifications(userId) {
    await pool.query("UPDATE notifications SET is_read = true WHERE user_id = $1", [userId]);
}

async function deleteNotifications(userId) {
    await pool.query("DELETE FROM notifications WHERE user_id = $1", [userId]);
}

module.exports = {
    createUser,
    editUser,
    createPost,
    getAllPosts,
    getTotalPostNumbers,
    searchPosts,
    getSearchedPostNumbers,
    getPost,
    editPost,
    deletePost,
    uploadImage,
    getImagesByPostId,
    deleteImg,
    createComment,
    getCommentById,
    getCommentsByPostId,
    countCommentsByPostId,
    deleteComment,
    isLiked,
    addLike,
    removeLike,
    countLikesByPostId,
    createNotification,
    countUnreadNotifications,
    getNotifications,
    getNotificationById,
    readNotification,
    readAllNotifications,
    deleteNotifications,
}