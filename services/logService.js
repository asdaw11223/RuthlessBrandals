const { getSheet, appendSheet } = require("./sheets");

function tanggal() {
    return new Date().toLocaleString("id-ID");
}

async function getAll() {

    const rows = await getSheet("Log");

    if (!rows.length) return [];

    // Hapus Header
    rows.shift();

    const data = rows.map((row, index) => ({
        row: index + 2,
        id: row[0],
        waktu: row[1],
        user: row[2],
        aksi: row[3],
        barang: row[4],
        type: row[5],
        sebelum: row[6],
        sesudah: row[7],
        perubahan: row[8],
        alasan: row[9]
    }));

    return data.reverse();
}

async function create(data) {

    const rows = await getSheet("Log");

    const id = rows.length;

    await appendSheet("Log", [
        id,
        tanggal(),
        data.user,
        data.aksi,
        data.barang,
        data.type,
        data.sebelum,
        data.sesudah,
        data.perubahan,
        data.alasan
    ]);

}

module.exports = {
    getAll,
    create
};