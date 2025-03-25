
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
    }
]




window.onload = function(){
    const input_num = document.getElementById("input_num_equi");        
    input_num.onchange = function (){
        buscarAsesorByIdTeam(input_num.value);
    }

}

    



function buscarAsesorByIdTeam(idTeam){
    const result = document.getElementById("resultado_asesor");
    result.textContent = ""
    TEAMS.forEach(equipo => {
        if(equipo.idEquipo == idTeam){
             //codigo a modificar cuando se implemente el framework
             ASESORES.forEach(asesor => {
                if(equipo.Asesor_idAsesor==asesor.idAsesor)
                    result.textContent = asesor.Nombre
            });
        }    
    });
    if (result.textContent=="")
        result.textContent = "No hay un asesor asignado";
}

