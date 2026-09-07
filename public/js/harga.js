$(function () {

    // ===============================
    // SEARCH CARD
    // ===============================

    $("#searchCard").on("keyup", function () {

        let value = $(this).val().toLowerCase();

        $(".cardHarga").filter(function () {

            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);

        });

    });

    // ===============================
    // TEMPLATE
    // ===============================

    function rowJual() {

        return $("#templateJual").html();

    }

    function rowBeli() {

        return $("#templateBeli").html();

    }

    // ===============================
    // TAMBAH BARIS
    // ===============================

    $("#btnTambahJual").click(function () {

        $("#tableJual tbody").append(rowJual());

    });

    $("#btnTambahBeli").click(function () {

        $("#tableBeli tbody").append(rowBeli());

    });

    $("#editTambahJual").click(function () {

        $("#editTableJual tbody").append(rowJual());

    });

    $("#editTambahBeli").click(function () {

        $("#editTableBeli tbody").append(rowBeli());

    });

    // ===============================
    // HAPUS BARIS
    // ===============================

    $(document).on("click", ".btnHapusBaris", function () {

        $(this).closest("tr").remove();

    });

    // ===============================
    // BARIS PERTAMA
    // ===============================

    $('#modalTambah').on('shown.bs.modal', function () {

        if ($("#tableJual tbody tr").length == 0)
            $("#btnTambahJual").click();

        if ($("#tableBeli tbody tr").length == 0)
            $("#btnTambahBeli").click();

    });

    // ===============================
    // FORMAT RUPIAH
    // ===============================

    $(document).on("keyup", ".rupiah", function () {

        let angka = $(this).val().replace(/\D/g, "");

        $(this).val(

            new Intl.NumberFormat("id-ID").format(angka)

        );

    });

    // ===============================
    // RESET MODAL
    // ===============================

    $("#modalTambah").on("hidden.bs.modal", function () {

        $("#formTambah")[0].reset();

        $("#tableJual tbody").html("");

        $("#tableBeli tbody").html("");

    });

    // ===============================
    // EDIT
    // ===============================

    $(".btnEdit").click(function () {

    const card = $(this).data("card");

    $("#editCard").val(card.nama);

    $("#formEdit").attr(
        "action",
        "/harga/edit/" + encodeURIComponent(card.nama)
    );

    $("#editTableJual tbody").html("");

    $("#editTableBeli tbody").html("");

    // =====================
    // JUAL
    // =====================

    card.jual.forEach(item => {

        $("#editTableJual tbody").append(`
            <tr>

                <td>
                    <input
                        class="form-control"
                        name="jualBarang"
                        value="${item.barang}">
                </td>

                <td>
                    <input
                        class="form-control"
                        name="jualQty"
                        type="number"
                        value="${item.qty}">
                </td>

                <td>
                    <input
                        class="form-control rupiah"
                        name="jualHarga"
                        value="${item.harga}">
                </td>

                <td>

                    <button
                        type="button"
                        class="btn btn-danger btnHapusBaris">

                        <i class="bi bi-trash"></i>

                    </button>

                </td>

            </tr>
        `);

    });

    // =====================
    // BELI
    // =====================

    card.beli.forEach(item => {

        $("#editTableBeli tbody").append(`
            <tr>

                <td>
                    <input
                        class="form-control"
                        name="beliBarang"
                        value="${item.barang}">
                </td>

                <td>
                    <input
                        class="form-control"
                        name="beliQty"
                        type="number"
                        value="${item.qty}">
                </td>

                <td>
                    <input
                        class="form-control rupiah"
                        name="beliHarga"
                        value="${item.harga}">
                </td>

                <td>

                    <button
                        type="button"
                        class="btn btn-danger btnHapusBaris">

                        <i class="bi bi-trash"></i>

                    </button>

                </td>

            </tr>
        `);

    });

    if (card.jual.length)
        $("#editJualKeterangan").val(card.jual[0].keterangan);

    if (card.beli.length)
        $("#editBeliKeterangan").val(card.beli[0].keterangan);

    $("#modalEdit").modal("show");

});

    // ===============================
    // SWEET ALERT DELETE
    // ===============================

    $(".formDelete").submit(function (e) {

        e.preventDefault();

        let form = this;

        Swal.fire({

            title: "Hapus Card?",

            text: "Card akan dihapus permanen.",

            icon: "warning",

            showCancelButton: true,

            confirmButtonText: "Ya",

            cancelButtonText: "Batal",

            confirmButtonColor: "#d33"

        }).then((result) => {

            if (result.isConfirmed) {

                form.submit();

            }

        });

    });

});