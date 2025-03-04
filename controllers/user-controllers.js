// 회원가입, 로그인, 로그아웃
const bcrypt = require("bcrypt");
const db = require("../db/quries");
const passport = require("../passport");
const { body, validationResult } = require("express-validator");

const validateUser = [
    body("username").trim()
        .isLength({ min: 1, max: 10 }).withMessage("사용자 이름은 10글자 이하여야 합니다.")
];

function signupPageGet(req, res) {
    const dupErr = req.session.dupErr ? true : false;
    const lenErr = req.session.lenErr ? true : false;
    req.session.dupErr = false;
    req.session.lenErr = false;
    res.render("sign-up", { dupErr, lenErr });
}

async function signupPagePost(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.session.lenErr = true;
        return res.redirect("/sign-up");
    }

    const username = req.body.username;
    const password = req.body.password;
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.createUser(username, hashedPassword);
    if (result.length === 0) {
        req.session.dupErr = true;
        res.redirect("/sign-up");
    } else {
        // 회원가입 후 자동 로그인
        passport.authenticate("local", {
            successRedirect: "/",
            failureRedirect: "/sign-in",
            failureMessage: true
        })(req, res, next);
    }
}

function signinPageGet(req, res) {
    const message = req.session.messages || [];
    const membErr = req.session.membErr ? '회원만 게시글을 볼 수 있습니다!' : '';
    req.session.membErr = false;
    req.session.messages = [];
    res.render("sign-in", { membErr, message });
}

function signinPagePost(req, res, next) {
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/sign-in",
        failureMessage: true
    })(req, res, next);
};

function logoutGet(req, res, next) {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
};

async function userPageGet(req, res) {
    const user = req.user;
    const userId = user.id;
    const notificationCount = await db.countUnreadNotifications(userId);
    res.render("user-detail", { user, notificationCount });
}

async function editUser(req, res) {
    const user = req.user;
    const { username } = req.body;
    let lenErr = false;
    let dupErr = false;
    // 길이 확인
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        lenErr = true;
    } else {
        const result = await db.editUser(user.id, username);
        if (!result) {
            dupErr = true;
        }
    }

    res.json({ dupErr, lenErr });
}

module.exports = {
    validateUser,
    signupPageGet,
    signupPagePost,
    signinPageGet,
    signinPagePost,
    logoutGet,
    userPageGet,
    editUser,
}