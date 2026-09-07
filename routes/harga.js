const express = require("express");
const router = express.Router();

const hargaController = require("../controllers/hargaController");
const authMiddleware = require("../middleware/auth");

router.use(authMiddleware.isLogin);

router.get("/", hargaController.index);

router.post("/tambah", hargaController.store);

router.post("/edit/:card", hargaController.update);

router.post("/delete/:card", hargaController.remove);

module.exports = router;