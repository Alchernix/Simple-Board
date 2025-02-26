const pool = require("./pool");

// 유저
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

// 포스트
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

// 포스트 검색기능
async function searchPosts(searchType, searchKeyword) {
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
    SELECT posts.id, posts.title, users.username FROM posts
    INNER JOIN users
    ON posts.author = users.id
    ${search}
    ORDER BY posts.id DESC
    `
    const { rows } = await pool.query(SQL, [searchKeyword]);
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


module.exports = {
    createUser,
    createPost,
    getAllPosts,
    searchPosts,
    getPost,
    editPost,
    deletePost,
}