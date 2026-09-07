
const table = $('#tableBarang').DataTable({
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

table.on('draw.dt', function () {

    let info = table.page.info();

    table.column(0, { page: 'current' }).nodes().each(function (cell, i) {

        cell.innerHTML = info.start + i + 1;

    });

});

table.draw();
console.log("barang.js loaded");
document.querySelectorAll(".btnEdit").forEach(btn => {
    btn.addEventListener("click", function () {

        document.getElementById("editNama").value = this.dataset.nama;
        document.getElementById("editType").value = this.dataset.type;
        // document.getElementById("editStok").value = this.dataset.stok;
        document.getElementById("editStatus").value = this.dataset.status;

        document.getElementById("formEdit").action =
            "/barang/edit/" + this.dataset.id;
    });
});

document.querySelectorAll(".btnDeposit").forEach(btn=>{
    btn.onclick=function(){
        document.getElementById("depositNama").innerHTML=this.dataset.nama;
        document.getElementById("depositStok").value = this.dataset.stok;
        document.getElementById("formDeposit").action="/barang/deposit/"+this.dataset.id;
    }

});

document.querySelectorAll(".btnPenarikan").forEach(btn=>{
    btn.onclick=function(){
        document.getElementById("penarikanNama").innerHTML=this.dataset.nama;
        document.getElementById("stokSekarang").innerHTML=this.dataset.stok;
        document.getElementById("formPenarikan").action="/barang/penarikan/"+this.dataset.id;
    }

});

document.querySelectorAll(".formDelete").forEach(form => {

    form.addEventListener("submit", function (e) {

        e.preventDefault();

        Swal.fire({

            title: "Hapus Barang?",
            text: "Barang yang dihapus tidak dapat dikembalikan.",
            icon: "warning",

            showCancelButton: true,

            confirmButtonText: "Ya, Hapus",
            cancelButtonText: "Batal",

            confirmButtonColor: "#0d6efd",
            cancelButtonColor: "#6c757d"

        }).then((result) => {

            if (result.isConfirmed) {
                form.submit();
            }

        });

    });

});


document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // ANTI DOUBLE SUBMIT
    // ==========================================

    document.querySelectorAll("form").forEach(form => {

        form.addEventListener("submit", function (e) {

            // Kalau sudah pernah submit
            if (form.dataset.submitted === "true") {
                e.preventDefault();
                return false;
            }

            // Tandai sudah submit
            form.dataset.submitted = "true";

            // Buat request ID unik
            let input = form.querySelector(
                'input[name="requestId"]'
            );

            if (!input) {

                input = document.createElement("input");

                input.type = "hidden";
                input.name = "requestId";

                form.appendChild(input);
            }

            input.value =
                crypto.randomUUID();

            // Cari tombol submit
            const button =
                form.querySelector(
                    'button[type="submit"], button:not([type])'
                );

            if (button) {

                button.disabled = true;

                const originalHTML =
                    button.innerHTML;

                button.innerHTML =
                    '<span class="spinner-border spinner-border-sm me-1"></span> Memproses...';

                // Simpan jika diperlukan
                button.dataset.originalHtml =
                    originalHTML;
            }

        });

    });

});