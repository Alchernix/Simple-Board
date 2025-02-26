const { Router } = require("express");
const router = Router();
const controllers = require("./controllers/controllers");
const userControllers = require("./controllers/user-controllers");
const postControllers = require("./controllers/post-controllers");

router.get("/", controllers.indexPageGet);

// users
router.get("/sign-up", userControllers.signupPageGet);
router.post("/sign-up", userControllers.signupPagePost);

router.get("/sign-in", userControllers.signinPageGet);
router.post("/sign-in", userControllers.signinPagePost);

router.get("/log-out", userControllers.logoutGet);

// posts
router.get("/post-editor", postControllers.createPostGet);
router.post("/post-editor", postControllers.createPostPost);

router.get("/post/:postId", postControllers.getPostDetail);

router.post("/post/:postId/delete", postControllers.deletePost);

module.exports = router;