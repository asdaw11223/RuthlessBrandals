const barangService = require("./barangService");
const dirtyService = require("./dirtyService");
const logService = require("./logService");

const {
    getSheet,
    appendSheet,
    updateRow
} = require("./sheets");

function tanggal() {
    return new Date().toLocaleString("id-ID");
}

function nomor(id) {
    return "TRX" + String(id).padStart(6, "0");
}

async function getAll(){

    const rows = await getSheet("Transaksi");

    if(!rows.length) return [];

    rows.shift();

    return rows.map((row,index)=>({

        row:index+2,

        id:row[0],

        no:row[1],

        tanggal:row[2],

        kelompok:row[3],

        jenis:row[4],

        status:row[5],

        total:Number(row[6]),

        keterangan:row[7],

        user:row[8]

    }));

}

async function create(data) {

    // ==========================
    // ID & NO TRANSAKSI
    // ==========================

    const transaksi = await getSheet("Transaksi");

    const detail = await getSheet("DetailTransaksi");

    const id = transaksi.length;

    const no = nomor(id);

    // ==========================
    // UBAH MENJADI ARRAY
    // ==========================

    const barang = Array.isArray(data.barang)
        ? data.barang
        : [data.barang];

    const type = Array.isArray(data.type)
    ? data.type
    : [data.type];

    const qty = Array.isArray(data.qty)
        ? data.qty
        : [data.qty];

    const harga = Array.isArray(data.harga)
        ? data.harga
        : [data.harga];

    let total = 0;

    // ==========================
    // HITUNG TOTAL
    // ==========================

    for (let i = 0; i < barang.length; i++) {

        total += Number(qty[i]) * Number(harga[i]);

    }

    // ==========================
    // SIMPAN TRANSAKSI
    // ==========================

    await appendSheet("Transaksi", [

        id,

        no,

        tanggal(),

        data.kelompok,

        data.jenis,

        "Pending",

        total,

        data.keterangan,

        data.user

    ]);

    // ==========================
    // SIMPAN DETAIL
    // ==========================


let detailId = detail.length;

for (let i = 0; i < barang.length; i++) {

    if (Number(qty[i]) <= 0) continue;

    await appendSheet("DetailTransaksi", [
        detailId++,
        no,
        barang[i],
        type[i],
        qty[i],
        harga[i],
        Number(qty[i]) * Number(harga[i])
    ]);

}

}

async function getByNo(no) {

    const transaksiRows = await getSheet("Transaksi");
    const detailRows = await getSheet("DetailTransaksi");

    transaksiRows.shift();
    detailRows.shift();

    const trx = transaksiRows.find(r => r[1] == no);

    if (!trx) return null;

    return {

        id: trx[0],

        no: trx[1],

        tanggal: trx[2],

        kelompok: trx[3],

        jenis: trx[4],

        status: trx[5],

        total: Number(trx[6]),

        keterangan: trx[7],

        user: trx[8],

        detail: detailRows
            .filter(r => r[1] == no)
            .map(r => ({

                id: r[0],

                barang: r[2],

                type: r[3],

                qty: Number(r[4]),

                harga: Number(r[5]),

                subtotal: Number(r[6])

            }))

    };

}

async function selesai(no, user) {

    const transaksi = await getByNo(no);

    if (!transaksi)
        throw new Error("Transaksi tidak ditemukan.");

    if (transaksi.status === "Selesai")
        throw new Error("Transaksi sudah selesai.");

    // ==========================
    // PENJUALAN
    // ==========================

    if (transaksi.jenis === "Penjualan") {

        for (const item of transaksi.detail) {

            await barangService.kurangiStok(
                item.barang,
                item.qty,
                user,
                no
            );

        }

        await dirtyService.create({

            jenis: "Penjualan",

            kelompok: transaksi.kelompok,

            masuk: transaksi.total,

            keluar: 0,

            keterangan: no,

            user

        });

    }

    // ==========================
    // PEMBELIAN
    // ==========================

    else {

        for (const item of transaksi.detail) {

            await barangService.tambahStok(
                item.barang,
                item.type,
                item.qty,
                user,
                no
            );

        }

        await dirtyService.create({

            jenis: "Pembelian",

            kelompok: transaksi.kelompok,

            masuk: 0,

            keluar: transaksi.total,

            keterangan: no,

            user

        });

    }

    // ==========================
    // UPDATE STATUS
    // ==========================

    const rows = await getSheet("Transaksi");

    rows.shift();

    const index = rows.findIndex(r => r[1] === no);

    await updateRow("Transaksi", index + 2, [

        transaksi.id,

        transaksi.no,

        transaksi.tanggal,

        transaksi.kelompok,

        transaksi.jenis,

        "Selesai",

        transaksi.total,

        transaksi.keterangan,

        transaksi.user

    ]);

    // ==========================
    // LOG
    // ==========================

    await logService.create({

        user,

         aksi: transaksi.jenis,

        barang: transaksi.kelompok,

        type: transaksi.jenis,

        sebelum: "-",

        sesudah: "-",

        perubahan: transaksi.total,

        alasan: no

    });

}

async function remove(no) {

    throw new Error("Belum dibuat.");

}

module.exports = {
    getAll,
    create,
    getByNo,
    selesai,
    remove
};