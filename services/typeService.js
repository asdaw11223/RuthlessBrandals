const {
    getSheet,
    appendSheet,
    updateRow,
    deleteRow
} = require("./sheets");
const logService = require("./logService");

function now() {
    return new Date().toLocaleString("id-ID");
}

async function getAll() {

    const rows = await getSheet("Type");

    if (!rows.length) return [];

    rows.shift();

    const data = rows
        .map((row, index) => ({
            row: index + 2,
            id: row[0],
            nama: row[1]
        }))
        .filter(item => item.id && item.nama);

    return data.reverse();
}

async function create(data) {

    const rows = await getSheet("Type");

    const id = rows.length;

    await appendSheet("Type", [
        id,
        data.nama
    ]);
    
    await logService.create({
        user: data.user,
        aksi: "Tambah",
        barang: data.nama,
        type: data.nama,
        sebelum: "-",
        sesudah: "-",
        perubahan: "-" ,
        alasan: "Type Baru di Tambahkan"
    });


}

async function update(id, data) {

    const types = await getAll();

    const item = types.find(t => t.id == id);

    if (!item) throw new Error("Type tidak ditemukan");

    await updateRow("Type", item.row, [
        item.id,
        data.nama
    ]);
    
    await logService.create({
        user: data.user,
        aksi: "Edit",
        barang: data.nama,
        type: data.nama,
        sebelum: "-",
        sesudah: "-",
        perubahan: "-" ,
        alasan: "Type di Ubah"
    });

}

async function remove(id, data) {

    const types = await getAll();

    const item = types.find(t => t.id == id);

    if (!item) {
        throw new Error("Type tidak ditemukan");
    }

    await logService.create({
        user: data.user,
        aksi: "Hapus",
        barang: item.nama,
        type: item.nama,
        sebelum: "-",
        sesudah: "-",
        perubahan: "-",
        alasan: "Type di Hapus"
    });

    await deleteRow("Type", item.row);

}

module.exports = {
    getAll,
    create,
    update,
    remove
};