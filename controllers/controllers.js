const db = require("../db/quries");
const { format } = require("date-fns");

async function indexPageGet(req, res) {
    const searchType = req.query.searchType;
    const searchKeyword = req.query.search;
    let posts;

    if (searchKeyword) {
        posts = await db.searchPosts(searchType, searchKeyword);
    } else {
        posts = await db.getAllPosts();
    }
    res.render("index", { user: req.user, posts, format });
}

module.exports = {
    indexPageGet,
}