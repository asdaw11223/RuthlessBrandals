const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const controller = require("../controllers/fivemController");

router.use(auth.isLogin);

router.get("/", controller.index);

module.exports = router;    