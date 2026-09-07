$(function () {

    // ===============================
    // SEARCH
    // ===============================

    $("#searchTransaksi").on("keyup", function () {

        let value = $(this).val().toLowerCase();

        $(".transaksiCard").filter(function () {

            $(this).toggle(
                $(this).text().toLowerCase().indexOf(value) > -1
            );

        });

    });

    // ===============================
    // HAPUS
    // ===============================

    $(".formDelete").submit(function (e) {

        e.preventDefault();

        const form = this;

        Swal.fire({

            title: "Hapus transaksi?",

            text: "Transaksi akan dihapus permanen.",

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

    // ===============================
    // SELESAI
    // ===============================

    $(".formSelesai").submit(function (e) {

        e.preventDefault();

        const form = this;

        Swal.fire({

            title: "Selesaikan transaksi?",

            text: "Barang, Dirty dan Log akan diproses.",

            icon: "question",

            showCancelButton: true,

            confirmButtonText: "Selesaikan",

            cancelButtonText: "Batal",

            confirmButtonColor: "#198754"

        }).then((result) => {

            if (result.isConfirmed) {

                form.submit();

            }

        });

    });

});