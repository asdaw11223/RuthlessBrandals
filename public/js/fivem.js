document.addEventListener("DOMContentLoaded", function () {

    console.log("FiveM JS berhasil dimuat");

    // ==========================================
    // PILIH KOTA OTOMATIS
    // ==========================================

    const serverSelect = document.getElementById("serverSelect");

    if (serverSelect) {

        serverSelect.addEventListener("change", function () {

            if (this.value === "") {
                return;
            }

            const url = new URL(window.location.href);

            url.searchParams.set("server", this.value);

            // Hapus pencarian lama
            url.searchParams.delete("q");

            // Langsung reload dan tampilkan server
            window.location.href = url.toString();

        });

    }


    // ==========================================
    // SEARCH PLAYER DI TABEL
    // ==========================================

    const searchInputs =
        document.querySelectorAll(".player-search");

    console.log("Jumlah search:", searchInputs.length);

    searchInputs.forEach(function (input) {

        input.addEventListener("input", function () {

            const keyword =
                this.value.toLowerCase().trim();

            const card =
                this.closest(".fivem-server-card");

            if (!card) {
                console.log("Card tidak ditemukan");
                return;
            }

            const rows =
                card.querySelectorAll(".player-row");

            let nomor = 1;
            let jumlah = 0;

            rows.forEach(function (row) {

                const id =
                    row.querySelector(".player-id")
                        ?.textContent
                        .toLowerCase()
                        .trim() || "";

                const nama =
                    row.querySelector(".player-name")
                        ?.textContent
                        .toLowerCase()
                        .trim() || "";

                const ping =
                    row.querySelector(".player-ping")
                        ?.textContent
                        .toLowerCase()
                        .trim() || "";

                const cocok =
                    id.includes(keyword) ||
                    nama.includes(keyword) ||
                    ping.includes(keyword);

                if (cocok) {

                    row.style.display = "";

                    const no =
                        row.querySelector(".player-no");

                    if (no) {
                        no.textContent = nomor++;
                    }

                    jumlah++;

                } else {

                    row.style.display = "none";

                }

            });

            const info =
                card.querySelector(".search-result-info");

            if (info) {

                if (keyword === "") {
                    info.textContent = "";
                } else {
                    info.textContent =
                        `${jumlah} player ditemukan`;
                }

            }

        });

    });

});


// ==========================================
// COPY KE DISCORD
// ==========================================
// JANGAN dimasukkan ke dalam DOMContentLoaded
// karena tombol HTML menggunakan onclick="copyDiscord()"

function copyDiscord() {

    let text = "";

    const cards =
        document.querySelectorAll(".fivem-server-card");

    if (cards.length === 0) {

        Swal.fire({
            icon: "warning",
            title: "Tidak ada data",
            text: "Data server belum tersedia."
        });

        return;
    }


    cards.forEach(function (card) {

        const server =
            card.querySelector(".server-name")?.innerText || "FiveM Server";

        const badge =
            card.querySelector(".server-online")?.innerText || "";

        // ==============================
        // SEARCH
        // ==============================
        const searchInput =
                    card.querySelector(".player-search");

        const search =
                    searchInput?.value.trim() || "";

        text += "🪙 **Ruthless Brandals Player Finder**\n";
        text += "🏙️ **Server :** " + server + "\n";

        if (badge) {
            text += "👥 **Online :** " + badge + "\n";
        }

        text += "\n";
        text += "🔍 **Search :** " + search + "\n";
        text += "```text\n";
        text += "+----+------+------------------------------+------+\n";
        text += "| No | ID   | Nama                         | Ping |\n";
        text += "+----+------+------------------------------+------+\n";


        const rows =
            card.querySelectorAll(".player-row");

        rows.forEach(function (row) {

            // Jangan copy row yang disembunyikan search
            if (row.style.display === "none") {
                return;
            }

            const no =
                row.querySelector(".player-no")?.innerText || "";

            const id =
                row.querySelector(".player-id")?.innerText || "";

            const nama =
                row.querySelector(".player-name")?.innerText || "";

            const ping =
                row.querySelector(".player-ping")?.innerText || "";


            const noText =
                String(no).padEnd(2);

            const idText =
                String(id).padEnd(4);

            const namaText =
                String(nama).substring(0, 28).padEnd(28);

            const pingText =
                String(ping).padEnd(4);


            text +=
                `| ${noText} | ${idText} | ${namaText} | ${pingText} |\n`;

        });


        text += "+----+------+------------------------------+------+\n";
        text += "```\n\n";

    });


    // ==========================================
    // COPY CLIPBOARD
    // ==========================================

    navigator.clipboard.writeText(text)
        .then(function () {

            Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: "Hasil pencarian berhasil disalin.",
                timer: 1800,
                showConfirmButton: false
            });

        })
        .catch(function (err) {

            console.error("Clipboard error:", err);

            Swal.fire({
                icon: "error",
                title: "Gagal!",
                text: "Tidak dapat menyalin ke clipboard."
            });

        });

}