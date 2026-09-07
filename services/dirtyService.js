const {
    getSheet,
    appendSheet,
    deleteRow
} = require("./sheets");

function tanggal() {

    return new Date().toLocaleString("id-ID");

}

async function getAll() {

    const rows = await getSheet("Dirty");

    if (!rows.length) return [];

    rows.shift();

    return rows.map((row, index) => ({

        row: index + 2,

        id: row[0],

        tanggal: row[1],

        jenis: row[2],

        kelompok: row[3],

        masuk: Number(row[4]),

        keluar: Number(row[5]),

        saldo: Number(row[6]),

        keterangan: row[7],

        user: row[8]

    }));

}

async function summary() {

    const rows = await getAll();

    let masuk = 0;

    let keluar = 0;

    rows.forEach(r => {

        masuk += r.masuk;

        keluar += r.keluar;

    });

    return {

        saldo: rows.length ? rows[rows.length - 1].saldo : 0,

        masuk,

        keluar,

        transaksi: rows.length

    };

}

async function create(data) {

    const rows = await getAll();

    const saldoSebelumnya = rows.length
        ? rows[rows.length - 1].saldo
        : 0;

    const masuk = Number(data.masuk || 0);

    const keluar = Number(data.keluar || 0);

    const saldo = saldoSebelumnya + masuk - keluar;

    await appendSheet("Dirty", [

        rows.length + 1,

        tanggal(),

        data.jenis,

        data.kelompok,

        masuk,

        keluar,

        saldo,

        data.keterangan,

        data.user

    ]);

}

async function remove(id) {

    const rows = await getSheet("Dirty");

    rows.shift();

    for (let i = rows.length - 1; i >= 0; i--) {

        if (rows[i][0] == id) {

            await deleteRow("Dirty", i + 2);

        }

    }

}

module.exports = {

    getAll,
    summary,
    create,
    remove

};