const express = require("express");

const router = express.Router();

const userController =
    require("../controllers/userController");

const {
    isLogin
} = require("../middleware/auth");


// ==========================================
// USER LIST
// ==========================================

router.get(
    "/",
    isLogin,
    userController.index
);


// ==========================================
// CREATE USER
// ==========================================

router.get(
    "/create",
    isLogin,
    userController.createPage
);


router.post(
    "/create",
    isLogin,
    userController.create
);


// ==========================================
// UPDATE ROLE
// ==========================================

router.post(
    "/role/:row",
    isLogin,
    userController.updateRole
);


// ==========================================
// DELETE USER
// ==========================================

router.post(
    "/delete/:row",
    isLogin,
    userController.remove
);

// ==========================================
// EDIT USER
// ==========================================

router.get(
    "/edit/:row",
    isLogin,
    userController.editPage
);

router.post(
    "/edit/:row",
    isLogin,
    userController.update
);

module.exports = router;