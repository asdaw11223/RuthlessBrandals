const logService = require("./logService");
const { getSheet, appendSheet, updateRow, deleteRow } = require("./sheets");

function tanggal() {
    return new Date().toLocaleString("id-ID");
}

// ==========================================
// ANTI DOUBLE REQUEST
// ==========================================

const processedRequests = new Map();

function checkRequest(requestId) {

    if (!requestId) {
        throw new Error("Request ID tidak ditemukan.");
    }

    if (processedRequests.has(requestId)) {
        throw new Error("Request sedang diproses / sudah diproses.");
    }

    processedRequests.set(requestId, Date.now());

    // Hapus setelah 10 detik
    setTimeout(() => {
        processedRequests.delete(requestId);
    }, 10000);
}

async function getAll() {

    const rows = await getSheet("Gudang");

    if (!rows.length) return [];

    // Hapus header
    rows.shift();

    const data = rows.map((row, index) => ({
        row: index + 2, // Nomor baris di Google Sheets
        id: row[0],
        nama: row[1],
        type: row[2],
        stok: Number(row[3]),
        status: row[4],
        dibuat: row[5],
        diubah: row[6]
    }));

    return data.reverse();
}

async function create(data) {

    checkRequest(data.requestId);

    const rows = await getSheet("Gudang");

    const id = rows.length;

    const now = tanggal();

    const barang = await getAll();

    const sudahAda = barang.find(
        b => b.nama.toLowerCase() === data.nama.toLowerCase()
    );

    if (sudahAda) {
        throw new Error("Nama barang sudah digunakan.");
    }

    await appendSheet("Gudang", [
        id,
        data.nama,
        data.type,
        Number(data.stok),
        Number(data.stok) > 0 ? "Aktif" : "Kosong",
        now,
        now
    ]);
    
    await logService.create({
        user: data.user,
        aksi: "Tambah",
        barang: data.nama,
        type: data.type,
        sebelum: data.stok,
        sesudah: "0",
        perubahan: "+" + data.stok,
        alasan: "Barang Baru di Tambahkan"
    });

}

async function update(id, data) {

    checkRequest(data.requestId);
    const barang = await getAll();

    const item = barang.find(b => b.id == id);

    
    const sebelum = Number(item.stok);
    const sesudah = sebelum;

    const duplikat = barang.find(
        b =>
            b.nama.toLowerCase() === data.nama.toLowerCase() &&
            b.id != id
    );

    if (duplikat) {
        throw new Error("Nama barang sudah digunakan.");
    }


    if (!item) {
        throw new Error("Barang tidak ditemukan");
    }

    await updateRow("Gudang", item.row, [
        item.id,
        data.nama,
        data.type,
        Number(item.stok),
        data.status || item.status,
        item.dibuat,
        tanggal()
    ]);
    
    await logService.create({
        user: data.user,
        aksi: "Edit",
        barang: data.nama + "->" + item.nama,
        type: data.type + "->" + item.type,
        sebelum,
        sesudah,
        perubahan: "-",
        alasan: "Barang Diubah"
    });

}

async function deposit(id, data) {

    checkRequest(data.requestId);
    const barang = await getAll();

    const item = barang.find(b => b.id == id);

    if (!item) {
        throw new Error("Barang tidak ditemukan");
    }

    const sebelum = Number(item.stok);
    const jumlah = Number(data.jumlah);
    const sesudah = sebelum + jumlah;

    await updateRow("Gudang", item.row, [
        item.id,
        item.nama,
        item.type,
        sesudah,
        "Aktif",
        item.dibuat,
        tanggal()
    ]);

    await logService.create({
        user: data.user,
        aksi: "Deposit",
        barang: item.nama,
        type: item.type,
        sebelum,
        sesudah,
        perubahan: "+" + jumlah,
        alasan: "Barang" + data.keterangan || "-"
    });

}


async function penarikan(id, data) {

    checkRequest(data.requestId);
    const barang = await getAll();

    const item = barang.find(b => b.id == id);

    if (!item) {
        throw new Error("Barang tidak ditemukan");
    }

    const sebelum = Number(item.stok);
    const jumlah = Number(data.jumlah);

    if (jumlah > sebelum) {
        throw new Error("Stok tidak mencukupi");
    }

    const sesudah = sebelum - jumlah;

    await updateRow("Gudang", item.row, [
        item.id,
        item.nama,
        item.type,
        sesudah,
        sesudah <= 0 ? "Kosong" : "Aktif",
        item.dibuat,
        tanggal()
    ]);

    await logService.create({
        user: data.user,
        aksi: "Penarikan",
        barang: item.nama,
        type: item.type,
        sebelum,
        sesudah,
        perubahan: "-" + jumlah,
        alasan: "Barang" + data.keterangan || "-"
    });

}

async function status(id, status) {

    const barang = await getAll();

    const item = barang.find(b => b.id == id);

    if (!item) {
        throw new Error("Barang tidak ditemukan");
    }

    await updateRow("Gudang", item.row, [
        item.id,
        item.nama,
        item.type,
        item.stok,
        status,
        item.dibuat,
        tanggal()
    ]);

    await logService.create({
        user: data.user,
        aksi: "Status",
        barang: item.nama,
        type: item.type,
        sebelum: item.status,
        sesudah: statusBaru,
        perubahan: "-",
        alasan: "Ubah Status"
    });

}

async function remove(id, data) {

    checkRequest(data.requestId);
    const barang = await getAll();

    const item = barang.find(x => x.id == id);

    if (!item) {
        throw new Error("Barang tidak ditemukan.");
    }


    await logService.create({
        user: data.user,
        aksi: "Hapus",
        barang: item.nama,
        type: item.type,
        sebelum: item.stok,
        sesudah: 0,
        perubahan: "-" + item.stok,
        alasan: "Barang dihapus"
    });
    
    await deleteRow("Gudang", item.row);

}

async function kurangiStok(namaBarang, qty, user, alasan = "") {

    const barang = await getAll();

    const item = barang.find(
        x => x.nama.toLowerCase() === namaBarang.toLowerCase()
    );

    if (!item)
        throw new Error(`Barang ${namaBarang} tidak ditemukan.`);

    if (Number(item.stok) < Number(qty))
        throw new Error(`Stok ${namaBarang} tidak mencukupi.`);

    const stokBaru = Number(item.stok) - Number(qty);

    const status = stokBaru <= 0 ? "Kosong" : "Aktif";

    await updateRow("Gudang", item.row, [

        item.id,
        item.nama,
        item.type,
        stokBaru,
        status

    ]);

    await logService.create({
    user,
    aksi: "Penarikan",
    barang: item.nama,
    type: item.type,
    sebelum: item.stok,
    sesudah: stokBaru,
    perubahan: "-" + qty,
    alasan: "Penjualan (" + alasan + ")"
});

}

async function tambahStok(
    namaBarang,
    type,
    qty,
    user,
    alasan = ""
) {

    const barang = await getAll();

    const item = barang.find(
        x => x.nama.toLowerCase() === namaBarang.toLowerCase()
    );

    if (!item) {

        await create({

            nama: namaBarang,

            type: type,

            stok: qty,

            status: Number(qty) > 0 ? "Aktif" : "Kosong",

            user

        });

        return;

    }

    const stokBaru = Number(item.stok) + Number(qty);

    await updateRow("Gudang", item.row, [

        item.id,
        item.nama,
        item.type,
        stokBaru,
        "Aktif"

    ]);

    await logService.create({
        user,
        aksi: "Penarikan",
        barang: item.nama,
        type: item.type,
        sebelum: item.stok,
        sesudah: stokBaru,
        perubahan: "-" + qty,
        alasan: "Penjualan (" + alasan + ")"
    });

}

module.exports = {
    getAll,
    create,
    update,
    deposit,
    penarikan,
    status,
    remove,
    kurangiStok,
    tambahStok
};