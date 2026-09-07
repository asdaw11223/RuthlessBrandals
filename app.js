require("dotenv").config();

const express = require("express");
const session = require("express-session");
const path = require("path");

const app = express();


// ==========================================
// VIEW ENGINE
// ==========================================

app.set("view engine", "ejs");
app.set(
    "views",
    path.join(__dirname, "views")
);


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(
    express.urlencoded({
        extended: true
    })
);

app.use(express.json());


// ==========================================
// SESSION
// ==========================================

app.use(
    session({
        secret:
            process.env.SESSION_SECRET ||
            "gudang-secret",

        resave: false,

        saveUninitialized: false,

        cookie: {
            maxAge: 1000 * 60 * 60 * 8
        }
    })
);

// ==========================================
// USER GLOBAL
// ==========================================

app.use((req, res, next) => {

    res.locals.currentUser =
        req.session.user || null;

    next();

});

// ==========================================
// STATIC FILES
// ==========================================

app.use(
    express.static(
        path.join(__dirname, "public")
    )
);

app.use(
    "/bootstrap",
    express.static(
        path.join(
            __dirname,
            "node_modules/bootstrap/dist"
        )
    )
);

app.use(
    "/icons",
    express.static(
        path.join(
            __dirname,
            "node_modules/bootstrap-icons/font"
        )
    )
);

app.use(
    "/adminlte",
    express.static(
        path.join(
            __dirname,
            "node_modules/admin-lte"
        )
    )
);


// ==========================================
// ROUTES
// ==========================================

app.use(
    "/",
    require("./routes/dashboard")
);

app.use(
    "/",
    require("./routes/auth")
);

app.use(
    "/type",
    require("./routes/type")
);

app.use(
    "/barang",
    require("./routes/barang")
);

app.use(
    "/log",
    require("./routes/log")
);

app.use(
    "/harga",
    require("./routes/harga")
);

app.use(
    "/dirty",
    require("./routes/dirty")
);

app.use(
    "/transaksi",
    require("./routes/transaksi")
);

app.use(
    "/fivem",
    require("./routes/fivem")
);


// ==========================================
// USER MANAGEMENT
// ==========================================

const userRoutes =
    require("./routes/user");

app.use(
    "/user",
    userRoutes
);


// ==========================================
// 404
// ==========================================

app.use((req, res) => {

    res.status(404).send(
        "404 - Halaman tidak ditemukan"
    );

});


// ==========================================
// SERVER
// ==========================================

const PORT =
    process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(
        `🚀 Server berjalan di http://localhost:${PORT}`
    );

});