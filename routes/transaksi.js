const express = require("express");
const router = express.Router();

const controller = require("../controllers/transaksiController");
const auth = require("../middleware/auth");

console.log("auth =", typeof auth);
console.log("controller =", controller);
console.log("controller.index =", typeof controller.index);
console.log("create =", typeof controller.create);
console.log("store =", typeof controller.store);
console.log("show =", typeof controller.show);
console.log("selesai =", typeof controller.selesai);
console.log("destroy =", typeof controller.destroy);
console.log("auth =", typeof auth);


router.get("/", auth.isLogin, controller.index);

router.get("/tambah", auth.isLogin, controller.create);

router.post("/tambah", auth.isLogin, controller.store);

router.get("/:no", auth.isLogin, controller.show);

router.post("/selesai/:no", auth.isLogin, controller.selesai);

router.post("/hapus/:no", auth.isLogin, controller.destroy);

module.exports = router;
