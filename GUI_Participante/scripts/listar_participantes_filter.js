//Constantes que se usarán temporalmente, mientras no se tiene conexion a la BD
//import { TEAMS,PROJECTS,CONTESTS } from "./database_connection"



const PROJECTS = 
[
    {
        idProyecto:1,
        nombre:"Pony Hambriento",
        fechaRegistro:"2025-05-01",
        estado:"Aceptado",
        Convocatoria_idConvocatoria:1,
        Equipo_idEquipo:1,
        Categoria_idCategoria:1,
        Investigador_idInvestigador:1,
        Archivos_idArchivos:1,
    },
    {
        idProyecto:2,
        nombre:"Pony Miserable",
        fechaRegistro:"2025-05-03",
        estado:"Aceptado",
        Convocatoria_idConvocatoria:1,
        Equipo_idEquipo:2,
        Categoria_idCategoria:1,
        Investigador_idInvestigador:1,
        Archivos_idArchivos:1,
    },
    {
        idProyecto:3,
        nombre:"Pony Peor",
        fechaRegistro:"2025-05-03",
        estado:"Aceptado",
        Convocatoria_idConvocatoria:2,
        Equipo_idEquipo:3,
        Categoria_idCategoria:1,
        Investigador_idInvestigador:1,
        Archivos_idArchivos:1,
    }
]

const CONTESTS = 
[
    {
        idConvocatoria:1,
        nombre:"INOVA TEC",
        descripcion: "Lorem impsum",
        fechaInicio: "2025-05-05",
        fechaFin:"2025-06-06",
        estado:"Pendiente",
        Administrador_idAdministrador:1,
        Archivos_idArchivos:1,
    },
    {
        idConvocatoria:2,
        nombre:"PIIM",
        descripcion: "Lorem impsum",
        fechaInicio: "2025-05-05",
        fechaFin:"2025-06-06",
        estado:"Pendiente",
        Administrador_idAdministrador:1,
        Archivos_idArchivos:1,
    }
]


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

const DEPENDENCIES = 
[
    {
        idDependencia:1,
        nombre:"Campus 1",
        Institucion_idInstitucion:1,
    },
    {
        idDependencia:2,
        nombre:"Campus 2",
        Institucion_idInstitucion:1,
    },
    {
        idDependencia:3,
        nombre:"Facultad de Bellas Artes",
        Institucion_idInstitucion:2,
    },
    {
        idDependencia:4,
        nombre:"Facultad de Gastronomía",
        Institucion_idInstitucion:2,
    },
    {
        idDependencia:5,
        nombre:"Facultad de Arquitectura",
        Institucion_idInstitucion:2,
    }      
    ,
    {
        idDependencia:6,
        nombre:"Campus Morelia",
        Institucion_idInstitucion:3,
    }      
]

const PARTICIPANTS =
[
    {
        idParticipante:1,
        nombre:"Sebastian",
        apellidoPaterno:"Antonio",
        apellidoMaterno:"Liza",
        correo:"sebastian@gmail.com",
        contraseña:"123",
        telefono:"4341394541",
        Equipo_idEquipo:1,
        Dependencia_idDependencia:1,
    },
    {
        idParticipante:2,
        nombre:"David",
        apellidoPaterno:"Araujo",
        apellidoMaterno:"Medina",
        correo:"david@gmail.com",
        contraseña:"123",
        telefono:"4341394541",
        Equipo_idEquipo:1,
        Dependencia_idDependencia:1,
    },
    {
        idParticipante:3,
        nombre:"David",
        apellidoPaterno:"AAAAAA",
        apellidoMaterno:"EEEEEE",
        correo:"david@gmail.com",
        contraseña:"123",
        telefono:"4341394541",
        Equipo_idEquipo:3,
        Dependencia_idDependencia:3,
    }
]

const INSTITUTIONS = 
[
    {
        idInstitucion:1,
        nombre:"ITM Morelia"
    },
    {
        idInstitucion:2,
        nombre:"Universidad Michoacan de San Nicolas de Hidalgo"
    }
    ,
    {
        idInstitucion:3,
        nombre:"Universidad Latina de America"
    }
]

//Los objetos anteriores siguen la misma estructura que las entidades correspondientes en la base de datos,
//Por lo que en teoria, se pueden eventualmente reemplazar con un query real sin conflictos.

window.onload = function () 
{
    const selectContest = document.getElementById('selectContest');
    const selectInstitution = document.getElementById('selectInstitution');
    const participantsList = document.getElementById('listParticipants');

    const getInstitutions = async () => {
        fetch("https://scitrackapi-production.up.railway.app/api/institucion/", {
          method: "GET",
        })
        
          .then((response) => response.json())
          .then((data) => {
            
            data.forEach(d => {
                console.log(d.nombre);
            });
            console.log(data);
            INSTITUTIONS = data;
            INSTITUTIONS.forEach(ins =>{
                selectInstitution.innerHTML = selectInstitution.innerHTML + `
                    <option value="${ins.idInstitucion}">${ins.nombre}</option>
                `
            });
          })
          .catch((error) => console.error("Error:", error));
    };

    CONTESTS.forEach(ins => {
        selectContest.innerHTML = selectContest.innerHTML + `
            <option value="${ins.idConvocatoria}">${ins.nombre}</option>
        `
    });
    
    INSTITUTIONS.forEach(ins => {
        selectInstitution.innerHTML = selectInstitution.innerHTML + `
            <option value="${ins.idInstitucion}">${ins.nombre}</option>
        `
    });

    selectContest.onchange = function ()
    {
       showParticipants();
    }
    selectInstitution.onchange = function () {showParticipants()}
}

function showParticipants()
{
    const selectContest = document.getElementById('selectContest');
    const selectInstitution = document.getElementById('selectInstitution');
    const participantsList = document.getElementById('listParticipants');


    participantsList.innerHTML="";
    if (selectContest.value != "none" && selectInstitution.value != "none")
    {


        PARTICIPANTS.forEach(p => {
            let instituion = "none";

            DEPENDENCIES.forEach(dep =>{
                if (dep.idDependencia == p.Dependencia_idDependencia)
                {
                    INSTITUTIONS.forEach(ins =>{
                        if(ins.idInstitucion == dep.Institucion_idInstitucion)
                        {
                            instituion = ins.idInstitucion
                        }
                    });
                }
            });

            TEAMS.forEach(t =>{
                const teamId = t.idEquipo;
                if (teamId == p.Equipo_idEquipo)
                {
                    PROJECTS.forEach(pr =>{
                        const projectTeam = pr.Equipo_idEquipo;
                        const projectContest = pr.Convocatoria_idConvocatoria;
                        if (projectTeam == teamId)
                        {
                            CONTESTS.every(c => {
                                const contestId = c.idConvocatoria;
                                if 
                                (
                                    contestId == pr.Convocatoria_idConvocatoria 
                                    && contestId == selectContest.value
                                    && instituion == selectInstitution.value
                                )
                                {
                                    participantsList.innerHTML = participantsList.innerHTML + `
                                    <div class="student_section">
                                        <p>Nombre: ${p.nombre} ${p.apellidoPaterno} ${p.apellidoMaterno}</p>
                                        <p>ID: ${p.idParticipante}</p>
                                        <p>Equipo: ${pr.nombre}</p>
                                        <button id="${p.idParticipante}" class="btnEditParticipant">Editar</button>
                                        <button id="${p.idParticipante}" class="btnDeleteParticipant">Eliminar</button>
                                    </div>
                                    `;
                                    return false;
                                }
                                else
                                return true;
                            });
                        }
                    });
                }
            });
        });
    }

    deleteParticipant();
}

function deleteParticipant()
{
  try
  {
    const btnDelete = document.getElementsByClassName('btnDeleteParticipant');
    for (let p of btnDelete) {
      p.onclick = function () {
        PARTICIPANTS.forEach(par =>{
            if (par.idParticipante == p.id)
            {
                alert('¡Alerta! ¿Estas seguro que deseas borrar al participante '+par.nombre+'? Esta acción NO se puede deshacer.')
            }
        });
      }
    }
  }
  catch(ex)
  {
    //alert(ex);
  }
}