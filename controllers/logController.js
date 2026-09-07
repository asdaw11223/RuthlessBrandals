const logService = require("../services/logService");

// Halaman Log
exports.index = async (req, res) => {

    try {

        const logs = await logService.getAll();

        const statistik = {
            total: logs.length,
            deposit: logs.filter(x => x.aksi === "Deposit").length,
            penarikan: logs.filter(x => x.aksi === "Penarikan").length,
            user: [...new Set(logs.map(x => x.user))].length
        };

        res.render("log/index", {
            title: "Log",
            user: req.session.user,
            logs,
            statistik
        });

    } catch (err) {

        console.error(err);
        res.status(500).send("Gagal memuat Log.");

    }

};
