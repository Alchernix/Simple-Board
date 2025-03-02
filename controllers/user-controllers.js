// 회원가입, 로그인, 로그아웃
const bcrypt = require("bcrypt");
const db = require("../db/quries");
const passport = require("../passport");

function signupPageGet(req, res) {
    const dupErr = req.session.dupErr ? true : false;
    req.session.dupErr = false;
    res.render("sign-up", { dupErr });
}

async function signupPagePost(req, res, next) {
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

module.exports = {
    signupPageGet,
    signupPagePost,
    signinPageGet,
    signinPagePost,
    logoutGet,
}