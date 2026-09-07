const express = require("express");
const router = express.Router();

const typeController = require("../controllers/typeController");
const auth = require("../middleware/auth");

// ==========================================
// SEMUA ROUTE TYPE WAJIB LOGIN
// ==========================================

router.use(auth.isLogin);


// ==========================================
// LIHAT TYPE
// HEAD + OWNER
// ==========================================

router.get(
    "/",
    auth.allowRoles(
        "Head BuzChef",
        "Original Gangster"
    ),
    typeController.index
);


// ==========================================
// TAMBAH TYPE
// HEAD + OWNER
// ==========================================

router.post(
    "/tambah",
    auth.allowRoles(
        "Head BuzChef",
        "Original Gangster"
    ),
    typeController.store
);


// ==========================================
// EDIT TYPE
// HEAD + OWNER
// ==========================================

router.post(
    "/edit/:id",
    auth.allowRoles(
        "Head BuzChef",
        "Original Gangster"
    ),
    typeController.update
);


// ==========================================
// HAPUS TYPE
// HEAD + OWNER
// ==========================================

router.post(
    "/delete/:id",
    auth.allowRoles(
        "Head BuzChef",
        "Original Gangster"
    ),
    typeController.remove
);


module.exports = router;