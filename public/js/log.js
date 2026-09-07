$(document).ready(function () {

    const table = $('#tableLog').DataTable({
        pageLength: 10,
        responsive: true,
        columnDefs: [
            {
                targets: 0,
                searchable: false,
                orderable: false
            }
        ]
    });

    // Nomor urut
    table.on('draw.dt order.dt search.dt', function () {

        let info = table.page.info();

        table.column(0, { page: 'current' }).nodes().each(function (cell, i) {
            cell.innerHTML = info.start + i + 1;
        });

    });

    table.draw();


    // Cari Barang
    $('#searchBarang').on('keyup', function () {
        table.column(3).search(this.value).draw();
    });

    // Filter Aksi
    $('#filterAksi').on('change', function () {
        table.column(2).search(this.value).draw();
    });

    // Filter User
    $('#filterUser').on('change', function () {
        table.column(1).search(this.value).draw();
    });

    // FILTER TANGGAL
    $.fn.dataTable.ext.search.push(function (settings, data) {

    const awal = $('#tanggalAwal').val();
    const akhir = $('#tanggalAkhir').val();

    // Kolom Waktu (kolom ke-0)
    const waktu = data[0];

    if (!waktu) return true;

    // contoh: 3/8/2026, 06.31.28
    const tanggal = waktu.split(",")[0];
    const pecah = tanggal.split("/");

    const tgl = pecah[0].padStart(2, "0");
    const bln = pecah[1].padStart(2, "0");
    const thn = pecah[2];

    const dataTanggal = `${thn}-${bln}-${tgl}`;

    if (awal && dataTanggal < awal) return false;
    if (akhir && dataTanggal > akhir) return false;

    return true;

    });

    // Ketika tanggal berubah
    $('#tanggalAwal, #tanggalAkhir').on('change', function () {
        table.draw();
    });

        //
        $('#btnResetFilter').click(function () {

        $('#searchBarang').val('');
        $('#filterAksi').val('');
        $('#filterUser').val('');
        $('#tanggalAwal').val('');
        $('#tanggalAkhir').val('');

        table.search('');
        table.columns().search('');

        table.draw();

    });

});