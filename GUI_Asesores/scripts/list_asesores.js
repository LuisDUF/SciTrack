const TEAMS =
[
    {
        idEquipo:1,
        Asesor_idAsesor:1
    },
    {
        idEquipo:2,
        Asesor_idAsesor:2
    },
    {
        idEquipo:3,
        Asesor_idAsesor:3
    },
    {
        idEquipo:11,
        Asesor_idAsesor: 11
    }
]

const ASESORES = 
[
    {
        idAsesor:1,
        Nombre: "Juan Perez"
    },
    {
        idAsesor:2,
        Nombre: "Felipe Rodriguez"
    },
    {
        idAsesor:3,
        Nombre: "Armando Undiano"
    },
    {
        idAsesor:11,
        Nombre: "Ricardo Arjona"
    }
]




window.onload = function(){

    
    let btn = document.getElementById("boton_eliminar");
    let btn2 = document.getElementById("boton_modificar");
    const result = document.getElementById("resultado_asesor");
    const input_num = document.getElementById("input_num_equi");  
    btn.hidden = true;
    btn2.hidden = true;
    listar_all();
    input_num.onchange = function (){
        if(input_num.value==""){
            result.textContent = "";
            listar_all();
        }
        else if(input_num.value>=1){
            buscarAsesorByIdTeam(input_num.value);
        }else{
            result.textContent = "Ingresa un equipo existente"
        }
       
    }

}


function radio(){
    
    let btn = document.getElementById("boton_eliminar");
    let btn2 = document.getElementById("boton_modificar");
    btn.hidden = false;
    btn2.hidden = false;

}

function delete_asesor(){
    let rad = document.querySelector('input[name="asesor"]:checked').id;
    const result = document.getElementById("resultado_asesor");
    //borrar asesor(rad)
    //load asesores()
    alert("ASESOR A BORRAR: "+rad)
    result.textContent = "";
    listar_all();
}

function modificar_asesor(){
    let rad = document.querySelector('input[name="asesor"]:checked').id;
    const result = document.getElementById("resultado_asesor");
    //borrar asesor(rad)
    //load asesores()
    alert("ASESOR A MODIFICAR: "+rad)
    result.textContent = "";
    listar_all();
}




function listar_all(){
    const result = document.getElementById("resultado_asesor");
    
    ASESORES.forEach(asesor => {
        let fila = document.createElement("li");
        fila.innerHTML= `

            <input type="radio" id="${asesor.idAsesor}" name="asesor" onclick=radio()>${asesor.Nombre}</input>
        `;
        result.appendChild(fila);
    });
}


function buscarAsesorByIdTeam(idTeam){
    const result = document.getElementById("resultado_asesor");
    result.textContent = ""
    TEAMS.forEach(equipo => {
        if(equipo.idEquipo==idTeam){
             //codigo a modificar cuando se implemente el frxamework
             ASESORES.forEach(asesor => {
                if(equipo.Asesor_idAsesor==asesor.idAsesor)
                    result.innerHTML= `
                    <li><input type="radio" id="btn_asesor${asesor.idAsesor}" name="asesor" onclick=radio()>${asesor.Nombre}</input></li>
                `;
                
            });
        }    
    });
    if (result.textContent=="")
        result.textContent = "No hay un asesor asignado";

}

