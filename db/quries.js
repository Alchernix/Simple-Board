const pool = require("./pool");

async function createUser(username, password) {
    const SQL = `
    INSERT INTO users (username, password)
    VALUES ($1, $2);`
    await pool.query(SQL, [username, password]);
}

async function createPost(userId, title, content) {
    const SQL = `
    INSERT INTO posts (author, title, content)
    VALUES($1, $2, $3);
    `
    await pool.query(SQL, [userId, title, content]);
}

//최근 게시물이 위로 오도록 역순으로 조회
async function getAllPosts() {
    const SQL = `
    SELECT posts.id, posts.title, users.username FROM posts
    INNER JOIN users
    ON posts.author = users.id
    ORDER BY posts.id DESC`
    const { rows } = await pool.query(SQL);
    return rows;
}

async function getPost(id) {
    const SQL = `
    SELECT posts.id, posts.author, posts.title, users.username, posts.content, posts.created_at FROM posts
    INNER JOIN users
    ON posts.author = users.id
    WHERE posts.id = $1`
    const { rows } = await pool.query(SQL, [id]);
    return rows[0];
}

async function deletePost(id) {
    await pool.query(`DELETE FROM posts WHERE id = $1`, [id]);
}

module.exports = {
    createUser,
    createPost,
    getAllPosts,
    getPost,
    deletePost,
}