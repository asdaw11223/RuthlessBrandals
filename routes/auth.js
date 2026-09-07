const router = require("express").Router();

const auth = require("../controllers/authController");

router.get("/login", auth.loginPage);

router.post("/login", auth.login);

router.get("/logout", auth.logout);

module.exports = router;