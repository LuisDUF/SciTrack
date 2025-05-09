let TEAMS =[];

let ASESORES = [];




window.onload = function(){
       
    
        

    
        listar_all();
        

          fetch("https://scitrackapi-production.up.railway.app/api/equipo/", {
            method: "GET",
          })
          
            .then((response) => response.json())
            .then((data) => {
              
              data.forEach(d => {
                  console.log(d.nombre);
              });
              TEAMS = data;
              console.log(data);
  
            })
            .catch((error) => console.error("Error:", error));
    
    
    var p_equis = document.getElementById("p_equi");
    p_equis.hidden = true;

    
    var btn = document.getElementById("boton_eliminar");
    var btn3 = document.getElementById("boton_eliminar_equipo");
    var btn2 = document.getElementById("boton_modificar");
        btn2.onclick= function llevar_editar(){
            modificar_asesor();
        }
    

    const result = document.getElementById("resultado_asesor");
    const input_num = document.getElementById("input_num_equi");  
    btn.hidden = true;
    btn2.hidden = true;
    btn3.hidden = true;
    
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

function listar_all(){
        
    fetch("https://scitrackapi-production.up.railway.app/api/asesor/", {
    method: "GET",
})

  .then((response) => response.json())
  .then((data) => {
    
    const result = document.getElementById("resultado_asesor");
    
    data.forEach(asesor => {
        let fila = document.createElement("li");
        fila.innerHTML= `

            <input type="radio" id="${asesor.idAsesor}" name="asesor" onclick=radio()>${asesor.nombre}</input>
        `;
        result.appendChild(fila);
    });

    data.forEach(d => {
        console.log(d.nombre);
    });
    ASESORES = data;
    console.log(data);

  })
  .catch((error) => console.error("Error:", error));
}


function radio(){
    
    let btn = document.getElementById("boton_eliminar");
    let btn2 = document.getElementById("boton_modificar");
    let btn3 = document.getElementById("boton_eliminar_equipo");
    let p_equis = document.getElementById("p_equi");
    p_equis.hidden = false;
    btn.hidden = false;
    btn2.hidden = false;
    btn3.hidden = false;

    listar_equipo();
}

function delete_asesor(){
    let rad = document.querySelector('input[name="asesor"]:checked').id;
    const result = document.getElementById("resultado_asesor");
   
    const equis = TEAMS.find(e=>{
        return e.Asesor_idAsesor == rad;
    });
    
    if(equis!=undefined){
        alert("Elimine primero el asesor de los equipos")
    }
    else
        elimina(rad);
    
}

function elimina(rad){
    const result = document.getElementById("resultado_asesor");
    fetch("https://scitrackapi-production.up.railway.app/api/asesor/"+rad, {
        method: "DELETE",
    })
        .then((data) => {
        console.log("Data was deleted!");
        result.textContent = "";
        listar_all();
        alert("Asesor eliminado con éxito");
        }) 
        .catch((error) => console.error("Error:", error));
}

function modificar_asesor(){
    let rad = document.querySelector('input[name="asesor"]:checked').id;
    const equis = TEAMS.find(e=>{
        return e.Asesor_idAsesor == rad;
    });
        if(equis!=undefined)
        location.href = 'modify_asesores.html?asesor='+rad;
        else
        location.href = 'modify_asesores.html?asesor='+rad;

}

function buscarAsesorByIdTeam(idTeam){
    const result = document.getElementById("resultado_asesor");
    result.textContent = ""
    let rad =[];
   
        fetch("https://scitrackapi-production.up.railway.app/api/equipo/"+idTeam, {
          method: "GET",
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            rad = data[0];
            ASESORES.forEach(ASES => {
                if(ASES.idAsesor==rad.Asesor_idAsesor)
                    result.innerHTML= `
                
                <input type="radio" id="${ASES.idAsesor}" name="asesor" onclick=radio()>${ASES.nombre}</input>
            `;
                
              });
          })
          .catch((error) => console.error("Error:", error));
                
    if (result.textContent=="")
        result.textContent = "No hay un asesor asignado";

}

function listar_equipo(){
    let rad = document.querySelector('input[name="asesor"]:checked').id;
    

    fetch("https://scitrackapi-production.up.railway.app/api/equipo/", {
        method: "GET",
    })
    
      .then((response) => response.json())
      .then((data) => {
        
        const result = document.getElementById("lista_equis");
        result.textContent ="";
        data.forEach(equipo => {
            if(equipo.Asesor_idAsesor==rad){
            let fila = document.createElement("li");
            fila.innerHTML= `
    
                <input type="radio" id="${equipo.idEquipo}" name="equipo">${equipo.idEquipo}</input>
            `;
            result.appendChild(fila);}
        });
    
        data.forEach(d => {
            console.log(d.nombre);
        });
        ASESORES = data;
        console.log(data);
    
      })
      .catch((error) => console.error("Error:", error));
}

function eliminar_equipo(equipo){
    
    if(equipo===undefined)
        equipo = document.querySelector('input[name="equipo"]:checked').id;

    fetch("https://scitrackapi-production.up.railway.app/api/equipo/"+equipo, {
        method: "PUT",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({
            Asesor_idAsesor: null                              
        }),
    })
        .then((response) => response.json())
        .then((data) => {
        console.log(data);
        document.getElementById("resultado_asesor").textContent="";
        document.getElementById("lista_equis").textContent="";
        ocultar_bots();
        
        document.getElementById("resultado_asesor").textContent = "";
        location.reload();
        })
        .catch((error) => console.error("Error:", error));

        
}

function ocultar_bots(){
    const btn = document.getElementById("boton_eliminar");
    const btn2 = document.getElementById("boton_modificar");
    const btn3 = document.getElementById("boton_eliminar_equipo");
    const p_equis = document.getElementById("p_equi");
    p_equis.hidden = true;
    btn.hidden = true;
    btn2.hidden = true;
    btn3.hidden = true;
}