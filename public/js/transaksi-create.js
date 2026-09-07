$(function () {

    renderBarang();

    $("#kelompok, #jenis").change(function () {

        renderBarang();

    });

    $(document).on("keyup change", ".qty", function () {

        hitungTotal();

    });

});

function renderBarang() {

    const kelompok = $("#kelompok").val();

    const jenis = $("#jenis").val();

    $("#barangContainer").html("");

    if (!kelompok) {

        $("#barangContainer").html(`
            <div class="alert alert-info">
                Pilih kelompok terlebih dahulu.
            </div>
        `);

        return;
    }

    const card = DATA.find(x => x.nama == kelompok);

    if (!card) return;

    const list = jenis == "Penjualan"
        ? card.jual
        : card.beli;

    let html = `

    <table class="table table-bordered">

        <thead>

            <tr>

                <th>Barang</th>

                <th width="120">Qty</th>

                <th width="120">Harga</th>

                <th width="150">Subtotal</th>

            </tr>

        </thead>

        <tbody>

    `;

    list.forEach(item => {

        html += `

        <tr>

            <td>

                ${item.barang}

                <input
                    type="hidden"
                    name="barang"
                    value="${item.barang}">

                <input
                    type="hidden"
                    name="harga"
                    value="${item.harga}">

            </td>

            <td>

                <input
                    class="form-control qty"
                    type="number"
                    min="0"
                    value="0"
                    name="qty">

            </td>

            <td>

                Rp ${Number(item.harga).toLocaleString("id-ID")}

            </td>

            <td>

                Rp <span class="subtotal">0</span>

            </td>

        </tr>

        `;

    });

    html += `

        </tbody>

    </table>

    `;

    $("#barangContainer").html(html);

    hitungTotal();

}

function hitungTotal() {

    let total = 0;

    $("#barangContainer tbody tr").each(function () {

        const qty = Number($(this).find(".qty").val());

        const harga = Number($(this).find("input[name='harga']").val());

        const subtotal = qty * harga;

        $(this).find(".subtotal").text(

            subtotal.toLocaleString("id-ID")

        );

        total += subtotal;

    });

    $("#grandTotal").text(

        total.toLocaleString("id-ID")

    );

}