const service = require("../services/fivemService");
const serverService = require("../services/fivemServerService");

exports.index = async (req, res) => {

    try {

        const keyword = req.query.q || "";
        const selected = req.query.server || "";

        const servers = await serverService.getAll();

        let result = [];

        if (selected) {

            result = await service.search(
                keyword,
                selected
            );

        }

        console.log("Selected:", selected);
        console.log("Keyword:", keyword);
        console.log("Result:", result.length);

        res.render("fivem/index", {

            title: "FiveM Player Finder",

            user: req.session.user,

            servers,

            selected,

            keyword,

            result

        });

    } catch (err) {

        console.error("FiveM Controller Error:", err);

        res.status(500).send(
            "Terjadi kesalahan saat mengambil data FiveM."
        );

    }

};