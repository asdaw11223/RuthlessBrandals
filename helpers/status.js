function getStatus(stok) {

    stok = Number(stok);

    if (stok <= 0) return "Kosong";

    return "Aktif";

}

module.exports = {
    getStatus
};