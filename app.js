require("dotenv").config();
const express = require("express");
// const multer = require('multer');
const path = require("path");
const pool = require("./db/pool");
const session = require("express-session");
const passport = require("./passport");
const app = express();
const pgSession = require("connect-pg-simple")(session);
const routes = require("./routes");
// const upload = multer({ dest: './uploads/' });

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
    store: new pgSession({
        pool: pool,
        tableName: "session"
    }),
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
}));
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/", routes);

app.use((req, res) => {
    res.status(404);
    res.render("error", { title: "404 not found", message: "존재하지 않는 페이지에 접속했어요. 뒤로가기를 눌러주세요." });
})

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500);
    res.render("error", { title: "서버 에러", message: "놀라지 말고 새로고침을 해주세요. 버그 발생시 개발자에게 연락주세요." });
})

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

// module.exports = { upload };