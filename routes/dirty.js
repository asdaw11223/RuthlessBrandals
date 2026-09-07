const express = require("express");
const router = express.Router();

const dirtyController = require("../controllers/dirtyController");
const authMiddleware = require("../middleware/auth");

router.use(authMiddleware.isLogin);

router.get("/", dirtyController.index);
router.post("/tambah", dirtyController.store);
router.post("/delete/:id", dirtyController.destroy);

module.exports = router;


