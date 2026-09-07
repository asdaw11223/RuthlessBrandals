const express = require("express");
const router = express.Router();

const barangController = require("../controllers/barangController");
const authMiddleware = require("../middleware/auth");

console.log("Route Barang Loaded");

// ==========================================
// SEMUA ROUTE BARANG WAJIB LOGIN
// ==========================================

router.use(authMiddleware.isLogin);


// ==========================================
// LIHAT BARANG
// MEMBER + ADMIN + OWNER
// ==========================================

router.get(
    "/",
    authMiddleware.allowRoles(
        "Member",
        "BuzChef",
        "Head BuzChef",
        "Original Gangster"
    ),
    barangController.index
);


// ==========================================
// TAMBAH BARANG
// BUZCHEF + HEAD + OWNER
// ==========================================

router.post(
    "/tambah",
    authMiddleware.allowRoles(
        "BuzChef",
        "Head BuzChef",
        "Original Gangster"
    ),
    barangController.store
);


// ==========================================
// EDIT BARANG
// BUZCHEF + HEAD + OWNER
// ==========================================

router.post(
    "/edit/:id",
    authMiddleware.allowRoles(
        "BuzChef",
        "Head BuzChef",
        "Original Gangster"
    ),
    barangController.update
);


// ==========================================
// DEPOSIT
// BUZCHEF + HEAD + OWNER
// ==========================================

router.post(
    "/deposit/:id",
    authMiddleware.allowRoles(
        "BuzChef",
        "Head BuzChef",
        "Original Gangster"
    ),
    barangController.deposit
);


// ==========================================
// PENARIKAN
// BUZCHEF + HEAD + OWNER
// ==========================================

router.post(
    "/penarikan/:id",
    authMiddleware.allowRoles(
        "BuzChef",
        "Head BuzChef",
        "Original Gangster"
    ),
    barangController.penarikan
);


// ==========================================
// UBAH STATUS
// BUZCHEF + HEAD + OWNER
// ==========================================

router.post(
    "/status/:id",
    authMiddleware.allowRoles(
        "BuzChef",
        "Head BuzChef",
        "Original Gangster"
    ),
    barangController.status
);


// ==========================================
// HAPUS BARANG
// BUZCHEF + HEAD + OWNER
// ==========================================

router.post(
    "/delete/:id",
    authMiddleware.allowRoles(
        "BuzChef",
        "Head BuzChef",
        "Original Gangster"
    ),
    barangController.remove
);


module.exports = router;