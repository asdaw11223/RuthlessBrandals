const barangService = require("../services/barangService");
const typeService = require("../services/typeService");

exports.index = async (req, res) => {

    const barang = await barangService.getAll();
    const types = await typeService.getAll();

    const error = req.session.error;
    const success = req.session.success;

    req.session.error = null;
    req.session.success = null;

    res.render("barang/index", {
        title: "Data Barang",
        user: req.session.user,
        barang,
        types,
        error,
        success
    });

};

exports.store = async (req, res) => {

    try {

        await barangService.create({
            ...req.body,
            user: req.session.user.username
        });

        req.session.success = "Barang berhasil ditambahkan.";

    } catch (err) {

        console.error(err);

        req.session.error = err.message;

    }

    res.redirect("/barang");

};

exports.update = async (req, res) => {

    try {

        await barangService.update(req.params.id, {
            ...req.body,
            user: req.session.user.username
        });

        req.session.success = "Barang berhasil diubah.";

    } catch (err) {

        console.error(err);

        req.session.error = err.message;

    }

    res.redirect("/barang");

};

exports.deposit = async (req, res) => {

    console.log(req.session);
    console.log(req.session.user);

    try {

        await barangService.deposit(req.params.id, {
            ...req.body,
            user: req.session.user.username
        });

        res.redirect("/barang");

    } catch (err) {

        console.error(err);

        res.status(500).send("Deposit gagal.");

    }

};

exports.penarikan = async (req, res) => {

    try {

        await barangService.penarikan(req.params.id, {
            ...req.body,
            user: req.session.user.username
        });

        req.session.success = "Penarikan berhasil.";

        res.redirect("/barang");

    } catch (err) {

        console.error(err);

        req.session.error = err.message;

        res.redirect("/barang");

    }

};

exports.status = async (req, res) => {

    try {

        await barangService.status(req.params.id, req.body.status);

        res.redirect("/barang");

    } catch (err) {

        console.error(err);

        res.status(500).send("Status gagal diubah.");

    }

};

exports.remove = async (req, res) => {

    try {

        await barangService.remove(req.params.id, {
            user: req.session.user.username
        });

        req.session.success = "Barang berhasil dihapus.";

    } catch (err) {

        console.error(err);

        req.session.error = err.message;

    }

    res.redirect("/barang");

};