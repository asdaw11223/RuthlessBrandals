const userService = require("../services/userService");

exports.loginPage = (req, res) => {

    res.render("auth/login");

};
exports.login = async (req, res) => {

    const { username, password } = req.body;

    const user = await userService.login(username, password);

    if (!user) {
        return res.render("auth/login", {
            error: "Username atau Password salah"
        });
    }

    req.session.user = user;

    req.session.save(err => {

        if (err) {
            console.error(err);
            return res.render("auth/login", {
                error: "Gagal menyimpan session"
            });
        }

        console.log("Session tersimpan:", req.session.user);

        return res.redirect("/");

    });

};

exports.logout = (req, res) => {

    req.session.destroy(() => {

        res.redirect("/login");

    });

};