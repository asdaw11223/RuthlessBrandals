const {
    getSheet,
    appendSheet,
    updateRow,
    deleteRow
} = require("./sheets");

async function getAll() {

    const rows = await getSheet("Harga");

    if (!rows.length) return [];

    rows.shift();

    const cards = {};

    rows.forEach((row, index) => {

        const card = row[1];

        if (!cards[card]) {

            cards[card] = {
                nama: card,
                jual: [],
                beli: []
            };

        }

        const item = {
            row: index + 2,
            id: row[0],
            barang: row[3],
            qty: row[4],
            harga: row[5],
            keterangan: row[6]
        };

        if (row[2] === "Jual") {
            cards[card].jual.push(item);
        } else {
            cards[card].beli.push(item);
        }

    });

    return Object.values(cards);

}

async function create(data) {

    const rows = await getSheet("Harga");

    let id = rows.length
    ? Number(rows[rows.length - 1][0]) + 1
    : 1;

    // Ubah menjadi array jika hanya 1 input
    const jualBarang = Array.isArray(data.jualBarang) ? data.jualBarang : [data.jualBarang];
    const jualQty = Array.isArray(data.jualQty) ? data.jualQty : [data.jualQty];
    const jualHarga = Array.isArray(data.jualHarga) ? data.jualHarga : [data.jualHarga];

    const beliBarang = Array.isArray(data.beliBarang) ? data.beliBarang : [data.beliBarang];
    const beliQty = Array.isArray(data.beliQty) ? data.beliQty : [data.beliQty];
    const beliHarga = Array.isArray(data.beliHarga) ? data.beliHarga : [data.beliHarga];

    // Simpan Harga Jual
    for (let i = 0; i < jualBarang.length; i++) {

        await appendSheet("Harga", [
            id++,
            data.card,
            "Jual",
            jualBarang[i],
            jualQty[i],
            jualHarga[i],
            data.jualKeterangan
        ]);

    }

    // Simpan Harga Beli
    for (let i = 0; i < beliBarang.length; i++) {

        await appendSheet("Harga", [
            id++,
            data.card,
            "Beli",
            beliBarang[i],
            beliQty[i],
            beliHarga[i],
            data.beliKeterangan
        ]);

    }

}
async function update(card, data) {

    await remove(card);

    await create(data);

}

async function remove(card) {

    const rows = await getSheet("Harga");

    rows.shift();

    for (let i = rows.length - 1; i >= 0; i--) {

        if (rows[i][1] == card) {

            await deleteRow("Harga", i + 2);

        }

    }

}

module.exports = {
    getAll,
    create,
    update,
    remove
};