const db = require("../db/quries");
const { format } = require("date-fns");

async function indexPageGet(req, res) {
    const searchType = req.query.searchType;
    const searchKeyword = req.query.search;
    let notificationCount = null;
    // let notifications = null;
    if (req.user) {
        const userId = req.user.id;
        notificationCount = await db.countUnreadNotifications(userId);
        // notifications = await db.getNotifications(userId);
    }

    let posts;

    if (searchKeyword) {
        posts = await db.searchPosts(searchType, searchKeyword);
    } else {
        posts = await db.getAllPosts();
    }

    res.render("index", { user: req.user, posts, format, notificationCount });
}

module.exports = {
    indexPageGet,
}