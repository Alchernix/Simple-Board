const { Router } = require("express");
const asyncHandler = require('express-async-handler');
const router = Router();
const multer = require('multer');
const upload = multer({ dest: './uploads/' });
// const { upload } = require("./app");
const controllers = require("./controllers/controllers");
const userControllers = require("./controllers/user-controllers");
const postControllers = require("./controllers/post-controllers");
const commentControllers = require("./controllers/comment-controllers");
const likeControllers = require("./controllers/like-controller");
const notificationControllers = require("./controllers/notification-controller");


router.get("/", asyncHandler(controllers.indexPageGet));

// users
router.get("/sign-up", asyncHandler(userControllers.signupPageGet));
router.post("/sign-up", asyncHandler(userControllers.signupPagePost));

router.get("/sign-in", asyncHandler(userControllers.signinPageGet));
router.post("/sign-in", asyncHandler(userControllers.signinPagePost));

router.get("/log-out", asyncHandler(userControllers.logoutGet));

// posts
router.get("/post-editor", asyncHandler(postControllers.createPostGet));
router.post("/post-editor", upload.array("image", 10), asyncHandler(postControllers.createPostPost));

router.get("/post/:postId", asyncHandler(postControllers.getPostDetail));

router.get("/post/:postId/edit", asyncHandler(postControllers.editPostGet));
router.post("/post/:postId/edit", upload.array("image", 10), asyncHandler(postControllers.editPostPost));

router.post("/post/:postId/delete", asyncHandler(postControllers.deletePost));

router.post("/image/:imgId/delete", asyncHandler(postControllers.deleteImg));

// comments
router.post("/post/:postId/comment/create", asyncHandler(commentControllers.createComment));
router.post("/post/:postId/reply/create", asyncHandler(commentControllers.createReply));
router.post("/post/:postId/comment/:commentId/delete", asyncHandler(commentControllers.deleteComment));

//likes
router.post("/post/:postId/like", asyncHandler(likeControllers.like));

// notifications 
router.get("/user/:userId/notification", asyncHandler(notificationControllers.notificationPageGet));
router.post("/user/:userId/notification", asyncHandler(notificationControllers.readAllNotifications));
router.get("/user/:userId/notification/:notificationId", asyncHandler(notificationControllers.readNotification));

module.exports = router;