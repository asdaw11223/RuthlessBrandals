const express = require("express");
const router = express.Router();

const logController = require("../controllers/logController");
const auth = require("../middleware/auth");


// ==========================================
// HALAMAN LOG
// BUZCHEF + HEAD BUZCHEF + OWNER
// ==========================================

router.get(
    "/",
    auth.isLogin,
    auth.allowRoles(
        "BuzChef",
        "Head BuzChef",
        "Original Gangster"
    ),
    logController.index
);


module.exports = router;