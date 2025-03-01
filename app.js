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

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send(err);
    res.render("error");
})

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

// module.exports = { upload };