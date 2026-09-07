const typeService = require("../services/typeService");

exports.index = async (req, res) => {

    const type = await typeService.getAll();

    res.render("type/index", {
        title: "Master Type",
        user: req.session.user,
        type
    });

};

exports.store = async (req, res) => {

    await typeService.create({
            ...req.body,
            user: req.session.user.username
        });

    res.redirect("/type");

};

exports.update = async (req, res) => {

    await typeService.update(req.params.id, {
            ...req.body,
            user: req.session.user.username
        });

    res.redirect("/type");

};

exports.remove = async (req, res) => {

    try {

        await typeService.remove(req.params.id, {
            ...req.body,
            user: req.session.user.username
        });

        res.redirect("/type");

    } catch (err) {

        console.error(err);

        res.status(500).send("Gagal menghapus Type.");

    }

};