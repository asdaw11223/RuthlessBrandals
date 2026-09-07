const hargaService = require("../services/hargaService");
const barangService = require("../services/barangService");

exports.index = async (req, res) => {

    const harga = await hargaService.getAll();

    const barang = await barangService.getAll();

    res.render("harga/index", {
        title: "Harga",
        user: req.session.user,
        harga,
        barang
    });

};

exports.store = async (req, res) => {

    try {

        await hargaService.create(req.body);

        res.redirect("/harga");

    } catch (err) {

        console.error(err);

        res.status(500).send(err.message);

    }

};

exports.update = async (req, res) => {

    try {

        await hargaService.update(req.params.card, req.body);

        res.redirect("/harga");

    } catch (err) {

        console.error(err);

        res.status(500).send(err.message);

    }

};

exports.remove = async (req, res) => {

    try {

        await hargaService.remove(req.params.card);

        res.redirect("/harga");

    } catch (err) {

        console.error(err);

        res.status(500).send(err.message);

    }

};