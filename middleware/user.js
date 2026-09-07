const express = require("express");

const router = express.Router();

const userController =
    require("../controllers/userController");

const {
    isLogin,
    allowRoles
} = require("../middleware/auth");


// ==========================================
// LIHAT USER
// ==========================================

router.get(
    "/",
    isLogin,
    allowRoles(
        "Head BuzChef",
        "Original Gangster"
    ),
    userController.index
);


// ==========================================
// CREATE USER
// ORIGINAL GANGSTER SAJA
// ==========================================

router.get(
    "/create",
    isLogin,
    allowRoles("Original Gangster"),
    userController.createPage
);

router.post(
    "/create",
    isLogin,
    allowRoles("Original Gangster"),
    userController.create
);


// ==========================================
// EDIT USER
// ORIGINAL GANGSTER SAJA
// ==========================================

router.get(
    "/edit/:row",
    isLogin,
    allowRoles("Original Gangster"),
    userController.editPage
);

router.post(
    "/edit/:row",
    isLogin,
    allowRoles("Original Gangster"),
    userController.update
);


// ==========================================
// UPDATE ROLE
// CONTROLLER AKAN CEK DETAILNYA
// ==========================================

router.post(
    "/role/:row",
    isLogin,
    allowRoles(
        "Head BuzChef",
        "Original Gangster"
    ),
    userController.updateRole
);


// ==========================================
// DELETE USER
// ORIGINAL GANGSTER SAJA
// ==========================================

router.post(
    "/delete/:row",
    isLogin,
    allowRoles("Original Gangster"),
    userController.remove
);


module.exports = router;