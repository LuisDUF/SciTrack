//Este archivo tiene de momento el propósito de colocar export constantes que representen entidades
//y tuplas de la base de datos, dado que por el momento no se implementara aun la conexión
//real a la base de datos.

export const TEAMS =
[
    {
        idEquipo:1,
        Asesor_idAsesor:1
    }
]

export const PROJECTS = 
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
        idProyecto:1,
        nombre:"Pony Miserable",
        fechaRegistro:"2025-05-03",
        estado:"Aceptado",
        Convocatoria_idConvocatoria:1,
        Equipo_idEquipo:2,
        Categoria_idCategoria:1,
        Investigador_idInvestigador:1,
        Archivos_idArchivos:1,
    }
]

export const CONTESTS = 
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
        idConvocatoria:1,
        nombre:"PIIM",
        descripcion: "Lorem impsum",
        fechaInicio: "2025-05-05",
        fechaFin:"2025-06-06",
        estado:"Pendiente",
        Administrador_idAdministrador:1,
        Archivos_idArchivos:1,
    }
]