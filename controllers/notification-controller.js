const db = require("../db/quries");
const { format } = require("date-fns");

async function notificationPageGet(req, res) {
    const userId = req.user.id;
    const notificationCount = await db.countUnreadNotifications(userId);
    const notifications = await db.getNotifications(userId);
    res.render("notification", { user: req.user, format, notificationCount, notifications });
}

async function readAllNotifications(req, res) {
    const userId = req.user.id;
    await db.readAllNotifications(userId);
    res.redirect(`/user/${userId}/notification`);
}

async function readNotification(req, res) {
    const notificationId = Number(req.params.notificationId);
    const notification = await db.getNotificationById(notificationId);
    // 해당 알림이 온 포스트로 이동
    if (notification.type === "comment") {
        await db.readNotification(notificationId);
        res.redirect(`/post/${notification.post_id}`);
    } else if (notification.type === "like") {
        await db.readNotification(notificationId);
        res.redirect(`/post/${notification.post_id}`);
    } else if (notification.type === "reply") {
        await db.readNotification(notificationId);
        res.redirect(`/post/${notification.post_id}`);
    }
}

module.exports = {
    notificationPageGet,
    readAllNotifications,
    readNotification
}