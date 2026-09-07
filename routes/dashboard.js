const router = require("express").Router();

const { isLogin } = require("../middleware/auth");

router.get("/", isLogin, (req, res) => {

    res.render("dashboard/index", {
        user: req.session.user
    });

});

module.exports = router;