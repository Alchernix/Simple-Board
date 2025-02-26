const db = require("../db/quries");

async function indexPageGet(req, res) {
    const posts = await db.getAllPosts();
    res.render("index", { user: req.user, posts });
}

module.exports = {
    indexPageGet,
}