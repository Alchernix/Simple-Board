const db = require("../db/quries");
const { format } = require("date-fns");

async function indexPageGet(req, res) {
    const currentPage = Number(req.query.page) || 1;
    const limit = 20;
    const offset = (currentPage - 1) * limit;
    let totalPages;
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
        posts = await db.searchPosts(searchType, searchKeyword, limit, offset);
        totalPages = Math.ceil((await db.getSearchedPostNumbers(searchType, searchKeyword)).count / limit);
    } else {
        posts = await db.getAllPosts(limit, offset);
        totalPages = Math.ceil((await db.getTotalPostNumbers()).count / limit);
    }

    res.render("index", { user: req.user, posts, format, notificationCount, totalPages, currentPage });
}

module.exports = {
    indexPageGet,
}