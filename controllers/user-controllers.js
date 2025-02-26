// 회원가입, 로그인, 로그아웃
const bcrypt = require("bcrypt");
const db = require("../db/quries");
const passport = require("../passport");

function signupPageGet(req, res) {
    res.render("sign-up");
}

async function signupPagePost(req, res, next) {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.createUser(username, hashedPassword);
        res.redirect("/");
    } catch (err) {
        next(error);
    }
}

function signinPageGet(req, res) {
    res.render("sign-in");
}

function signinPagePost(req, res, next) {
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/sign-in"
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