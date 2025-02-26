require("dotenv").config();
const express = require("express");
const path = require("path");
const pool = require("./db/pool");
const session = require("express-session");
const passport = require("./passport");
const app = express();
const pgSession = require("connect-pg-simple")(session);
const routes = require("./routes");

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
app.use(express.urlencoded({ extended: true }));

app.use("/", routes);

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send(err);
})

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));