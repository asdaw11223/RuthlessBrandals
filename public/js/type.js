$(document).ready(function () {

    const table = $('#tableType').DataTable({
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


});

document.querySelectorAll(".btnEdit").forEach(btn=>{

    btn.onclick=function(){

        document.getElementById("editNama").value=this.dataset.nama;

        document.getElementById("formEdit").action=
            "/type/edit/"+this.dataset.id;

    }

});

document.querySelectorAll(".formDelete").forEach(form=>{

    form.addEventListener("submit",function(e){

        e.preventDefault();

        Swal.fire({

            title:"Hapus Type?",

            text:"Type yang dihapus tidak dapat dikembalikan.",

            icon:"warning",

            showCancelButton:true,

            confirmButtonText:"Ya, Hapus",

            cancelButtonText:"Batal"

        }).then(result=>{

            if(result.isConfirmed){

                form.submit();

            }

        });

    });


});