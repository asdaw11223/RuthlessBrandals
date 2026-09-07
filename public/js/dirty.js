$(function(){

    // =============================
    // DATATABLE
    // =============================

    $("#dirtyTable").DataTable({

        order:[[0,"desc"]],

        pageLength:25,

        language:{
            url:"//cdn.datatables.net/plug-ins/1.13.8/i18n/id.json"
        }

    });

    // =============================
    // NOMINAL
    // =============================

    $("form").submit(function(){

        let nominal = Number($("#nominal").val());

        $("#masuk").val(0);
        $("#keluar").val(0);

        switch($("#jenis").val()){

            case "Saldo Awal":
            case "Pemasukan":
                $("#masuk").val(nominal);
                break;

            case "Pengeluaran":
                $("#keluar").val(nominal);
                break;

        }

    });

    // =============================
    // HAPUS
    // =============================

    $(".formDelete").submit(function(e){

        e.preventDefault();

        const form=this;

        Swal.fire({

            title:"Hapus data?",

            text:"Data Dirty akan dihapus.",

            icon:"warning",

            showCancelButton:true,

            confirmButtonText:"Ya",

            cancelButtonText:"Batal"

        }).then((r)=>{

            if(r.isConfirmed){

                form.submit();

            }

        });

    });

});
