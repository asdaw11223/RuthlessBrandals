 const dirtyService = require("../services/dirtyService");

exports.index = async (req, res) => {

    const data = await dirtyService.getAll();

    const summary = await dirtyService.summary();

    res.render("dirty/index", {
        title: "Dirty",
        user: req.session.user,
        data,
        summary
    });

};

exports.store = async (req, res) => {

    try {

        await dirtyService.create({
            ...req.body,
            user: req.session.user.username
        });

        res.redirect("/dirty");

    } catch (err) {

        console.log(err);

        res.status(500).send(err.message);

    }

};

exports.destroy = async (req, res) => {

    await dirtyService.remove(req.params.id);

    res.redirect("/dirty");

};