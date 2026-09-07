const axios = require("axios");
const serverService = require("./fivemServerService");

async function search(keyword = "", selected = "") {

    const hasil = [];
    const servers = await serverService.getAll();

    for (const server of servers) {

        // Kalau memilih server tertentu
        if (selected && String(server.code) !== String(selected)) {
            continue;
        }

        try {

            const res = await axios.get(
                `https://frontend.cfx-services.net/api/servers/single/${server.code}`,
                {
                    timeout: 10000
                }
            );

            const data = res.data?.Data;

            // API berhasil tapi Data kosong
            if (!data) {
                throw new Error("Data server kosong");
            }

            const players = data.players || [];

            const filter = players.filter(player => {

                if (!keyword) return true;

                const nama =
                    String(player.name || "").toLowerCase();

                const id =
                    String(player.id || "").toLowerCase();

                return (
                    nama.includes(keyword.toLowerCase()) ||
                    id.includes(keyword.toLowerCase())
                );

            });

            const icon = data.iconVersion
            ? `https://frontend.cfx-services.net/api/servers/icon/${server.code}/${data.iconVersion}.png`
            : null;

            server.icon = icon;
            console.log(icon);

            hasil.push({

                nama: server.nama,

                code: server.code,

                hostname: data.hostname,
                
                icon: icon,

                online: data.clients ?? 0,

                max: data.sv_maxclients ?? data.svMaxclients ?? 0,

                banner:
                    data.vars?.banner_detail ||
                    data.vars?.banner_connecting ||
                    null,

                // ==========================
                // SERVER AKTIF
                // ==========================

                aktif: true,

                error: false,

                players: filter

            });

        } catch (err) {

            console.log(
                `===== SERVER ${server.nama} ERROR =====`
            );

            console.log(
                err.response?.status || err.message
            );

            // ==========================
            // SERVER OFFLINE
            // ==========================

            hasil.push({

                nama: server.nama,

                code: server.code,

                hostname: "-",

                icon: icon,
                online: 0,

                max: 0,

                banner: null,

                aktif: false,

                error: true,

                players: []

            });

        }

    }

    return hasil;
}

module.exports = {
    search
};