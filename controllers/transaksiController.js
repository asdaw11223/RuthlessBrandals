const transaksiService = require("../services/transaksiService");

exports.index = async (req, res) => {

    const transaksi = await transaksiService.getAll();

    res.render("transaksi/index", {

        title: "Transaksi",

        user: req.session.user,

        transaksi

    });

};

const hargaService = require("../services/hargaService");

exports.create = async (req, res) => {

    const harga = await hargaService.getAll();

    res.render("transaksi/create", {

        title: "Tambah Transaksi",

        user: req.session.user,

        harga

    });

};

exports.store = async (req, res) => {

    await transaksiService.create({

        ...req.body,

        user: req.session.user.username

    });

    res.redirect("/transaksi");

};

exports.show = async (req, res) => {

    const transaksi = await transaksiService.getByNo(req.params.no);

    if (!transaksi)
        return res.redirect("/transaksi");

    res.render("transaksi/detail", {

        title: transaksi.no,

        user: req.session.user,

        transaksi

    });

};

exports.selesai = async (req, res) => {

    try {

        await transaksiService.selesai(
            req.params.no,
            req.session.user.username
        );

        res.redirect("/transaksi/" + req.params.no);

    } catch (err) {

        console.log(err);

        res.status(500).send(err.message);

    }

};

exports.destroy = async (req, res) => {

    try {

        await transaksiService.remove(req.params.no);

        res.redirect("/transaksi");

    } catch (err) {

        console.log(err);

        res.status(500).send(err.message);

    }

};