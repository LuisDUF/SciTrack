<template>
  <div >

    <div class="pa-7 mt-4 rounded" style="background-color: #ffffff; height: 82.5vmin">
      <v-text-field placeholder="Nombre/ID Participante" label="Buscar" v-model="buscado" @input="buscar()" ></v-text-field>
      <h1 class="">Participantes</h1>
      <v-row class="px-0 mt-2"   style=" background-color: #BFD6FF; border-radius: 15px;  border: solid 10px #BFD6FF; overflow-y:scroll; scrollbar-width: none; height: max-content; max-height: 80%;">

        <v-col class="rounded me-2 mx-0 ms-0" cols="8" style="margin-left: 1.5vw; background-color: #BFD6FF; height: fit-content; ">
          <v-row v-if="filtrados.length>1">
            <itemListaUsuario
            v-for="(filtrado, index) in filtrados"
            :key="index"
            :nombre="filtrado.nombre"
            :institucion="filtrado.nombreIns"
            :convocatoria="filtrado.nombreConvo"
            :participante="filtrado"
            :vari="vari"
            :seleccion="elegido"
            :esUno = false
          />
          </v-row>
          <v-row style="background-color: #BFD6FF;" v-else>           
            <itemListaUsuario
            v-for="(filtrado, index) in filtrados"
            :key="index"
            :nombre="filtrado.nombre"
            :institucion="filtrado.nombreIns"
            :convocatoria="filtrado.nombreConvo"
            :participante="filtrado"
            :vari="vari"
            :seleccion="elegido"
            :esUno = true
          /></v-row>

        </v-col>

        
        <v-col class="rounded"  style="margin-left: 1.5vw;">
          <v-row>
            <v-col cols="12" class="rounded" style=" background-color: #BFD6FF; margin-bottom: 2vw;">
                        <h4 style="font-weight: bold; color: gray;">Filtrar por convocatoria:</h4>
          <div class="rounded pa-0" style="margin-top: 0.666vw; padding: 1vw; padding-left:1.33vw; padding-right: 1.33vw; background-color: #EBF2FF; ">
            <div class="rounded" style="max-height: 5.5vw; overflow-y: auto; background-color: #EBF2FF; ">
            <v-list class="ma-5 my-0 rounded" style="background-color: #EBF2FF; ">
              <v-radio-group v-model="selectedAreaDeConocimiento" style="margin-top: 0;">
                  <v-radio
                  v-for="AreaDeConocimiento in AreaDeConocimientos"
                  :key="AreaDeConocimiento.nombre"
                  :label="AreaDeConocimiento.nombre"
                  :value="AreaDeConocimiento.nombre"
                  @change="selectedAreaDeConocimiento=AreaDeConocimiento.nombre, onCheckboxChange()"
                ></v-radio>
              </v-radio-group>


            </v-list>
          </div>
          </div>
            </v-col>
            <v-col class="rounded" style=" background-color: #BFD6FF;">
                        <h4 style="font-weight: bold; color: gray;">Filtrar por institución:</h4>
          <div class="rounded pa-0" style="margin-top: 0.666vw; padding: 1vw; padding-left:1.33vw; padding-right: 1.33vw; background-color: #EBF2FF; ">
            <div class="rounded" style="max-height: 5.5vw; overflow-y: auto; background-color: #EBF2FF; ">
            <v-list class="ma-5 my-0" style="background-color: #EBF2FF; ">
              <v-radio-group class="" v-model="selectedInstitucion" style="margin-top: 0;">
                  <v-radio class=""
                  v-for="Institucion in Institucions"
                  :key="Institucion.nombre"
                  :label="Institucion.nombre"
                  :value="Institucion.nombre"
                  @change="selectedInstitucion=Institucion.nombre, onCheckboxChange()"
                ></v-radio>
              </v-radio-group>


            </v-list>
          </div>
          </div>
            </v-col>
          </v-row>

        </v-col>

       


        
      </v-row>

      <transition name="fade">

        <div v-if="vari.no=='SI'" class="overlay" @click.self="cerrar">
            <v-card  class="pa-8 pt-3 modal-card" >
                          <v-alert
    v-if="confirmAlert"
    type="success"
    dismissible
    >
    {{ confirmAlert }}
    </v-alert>
        <v-alert
    v-if="confirmError"
    type="error"
    dismissible
    >
    {{ confirmError }}
    </v-alert>
        <div style=" font-size: 2.5vmax; font-weight: bold; margin-top: 0vmax; " class="card-header ps-0 mb-3" >Información</div> 
        
          <v-row  class="rounded py-3 px-2" style="background-color: #BFD6FF;">
            <v-col cols="8">
              <v-card style="width: 100%;">
                <h4 class="ps-5 pt-3">Nombre: {{ elegido.selectis.nombre }}</h4>
                <h4 class="ps-5 mt-5">Institucion: {{ elegido.isti }} </h4>
                <h4 v-if="elegido.selectis.proyecto" class="ps-5 mt-5">Proyecto: {{ elegido.selectis.proyecto[0].nombre }}</h4>
                <h4 class="ps-5 mt-5">Correo: {{ elegido.selectis.correo }}</h4>
                <h4 class="ps-5 mt-5">Teléfono: {{ elegido.selectis.telefono }}</h4>
                <h4 class="ps-5 mt-5" v-if="elegido.archivos">Documentos: </h4>
                <v-list class="ps-5 mt-0">
                  <v-radio-group  class="mt-0">
                    <v-radio
                      v-for="(doc,index) in elegido.archivos"
                      :key="index"
                      :label="doc.nombre"
                      :value="index"
                      @change="abrirArchivo(doc)"
                    ></v-radio>
                  </v-radio-group>
                </v-list>
                <button @click="generar()" class="ms-5 mt-5 mb-5 rounded pa-2 px-5 aceptar" >Generar constancia</button>
              </v-card>
            </v-col>
            <v-col cols="4">
              <iframe
                    :src="pdfUrl"
                    class="iframe-responsive very-rounded"
                    style="width: 100%"
                    v-if="pdfUrl"
                  ></iframe>
            </v-col>
          </v-row>
        
      </v-card>
      </div>
      </transition>

    </div>
    


  </DIV>

</template>


<script>
import api from  "../services/api.js"
import itemListaUsuario from "@/components/itemListaUsuario.vue"

  export default{
    name: "App",
    components: {itemListaUsuario},
    data(){
      return{
        usuario : JSON.parse(localStorage.getItem("userData")) || null,
        pdfUrl: null,
        confirmAlert: '',
        confirmError: '',
        buscado: null,
        participantes: [],
        filtrados: [],
        Institucions: [],
        AreaDeConocimientos: [],
        selectedAreaDeConocimiento: "Todos",
        selectedInstitucion: "Todos",
        vari: {no:'NO'},
        elegido: {selectis:null,isti:null,area:null,archivos:null},




        investigadores: [],


        pendientes: [],
        aceptados: [],



        selectedPdf: 0,

      }
    },
    created(){
      this.onCheckboxChange();
    },async mounted(){
      try{
      this.participantes = JSON.parse(JSON.stringify((await api.get('/api/Participante')).data));
      
      const response2 = await api.get('/api/institucion');
      this.Institucions = JSON.parse(JSON.stringify(response2.data));
      this.Institucions.splice(0,0,{nombre:"Todos",idInstitucion:"Todos"});

      const response3 = await api.get('/api/Dependencia/');
      const data = [];
      data.push(...JSON.parse(JSON.stringify(response3.data)));

      const response = await api.get('/api/convocatoria');
      this.AreaDeConocimientos = JSON.parse(JSON.stringify(response.data));
      this.AreaDeConocimientos.splice(0,0,{nombre:"Todos",idConvocatoria:"Todos"});


     for (const p of this.participantes) {
  // Asignar nombre de institución
  const inst = this.Institucions.find(i =>
    i.idInstitucion === (data.find(d => d.idDependencia === p.Dependencia_idDependencia)?.Institucion_idInstitucion)
  );
  p.nombreIns = inst ? inst.nombre : "Institución desconocida";

  // Si tiene equipo, buscar convocatoria
  if (p.Equipo_idEquipo != null) {
    try {
      const res = await api.get('/api/equipo/'+p.Equipo_idEquipo);
      const equipo = res.data[0] || response.data;
      p.equipo = [];
      p.equipo.push(equipo);

      const response = await api.get('/api/proyectos/equipo/' + p.Equipo_idEquipo);
      const proyecto = response.data[0] || response.data;
      p.proyecto = [];
      p.proyecto.push(proyecto);
     
      if(proyecto){
        const response = await api.get('/api/archivos/proyecto/' + p.proyecto[0].idProyecto);
        const archivos = response.data[0] || response.data;
       
        p.archivos = [];
        p.archivos.push(archivos); 
        
      }

      const response2 = await api.get('/api/convocatoria/id/' + proyecto.idProyecto);
      const convocatoria = response2.data[0] || response2.data;

      p.nombreConvo = convocatoria.nombre;
    } catch (err) {
      console.error("Error obteniendo convocatoria:", err);
      p.nombreConvo = "Error al obtener convocatoria";
    }
  } else {
    p.nombreConvo = "No se encuentra en un equipo.";
  }
}



                

      


          
        this.filtrados = this.participantes;
          
          this.vari.no = 'NO';
      }catch(e){
        console.log(e);
      }

    },methods: {
async  generar(){
  const v = this.elegido.selectis.proyecto[0];
  const p = this.elegido.selectis;
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const currentDate = `${year}-${month}-${day}`;

  const response = await api.get('/api/asesor/'+this.elegido.selectis.equipo[0].Asesor_idAsesor);
  const Asesor = []
  Asesor.push( response.data[0] || response.data);

  const res = await api.get('/api/fase/'+this.elegido.selectis.proyecto[0].Fase_idFase);
  const fase = [];
  fase.push(res.data[0] || res.data);

  const res2 = await api.get('/api/ubicacion/'+fase[0].Ubicacion_idUbicacion);
  const Ubicacion = [];
  Ubicacion.push(res2.data[0] || res2.data)


    fetch("http://localhost:3000/api/constancias/enviar-constancia/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre: p.nombre,
        proyecto: v.nombre,
        asesor: Asesor[0].nombre,
        ciudad: Ubicacion[0].ciudad,
        estado: Ubicacion[0].estado,
        fecha: currentDate,
        email: p.correo,
        fase: fase[0].nombre,
        esGanador: false,
        idP: p.idParticipante,
        idProy: v.idProyecto
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        this.confirmAlert = 'Generada y enviada con éxito';
      })
      .catch((error) => {console.error("Error:", error); this.confirmError='Error al generar constancia.'});

}
  ,
      abrirArchivo(doc){
        const byteArray = new Uint8Array(doc.contenido.data);
        const blob = new Blob([byteArray], { type: "application/pdf" });
        this.pdfUrl = URL.createObjectURL(blob);
      },
      async buscar(){
        this.onCheckboxChange();
      },
            cerrar(){
        this.vari.no = 'NO';
        this.pdfUrl = null;
      },
       async onCheckboxChange(){
        this.filtrados = this.participantes;
        if(this.buscado)
          this.filtrados = this.participantes.filter(p=> p.nombre.toLowerCase().trim().includes(this.buscado.toLowerCase().trim()) || p.idParticipante == (this.buscado));

     

          if(this.selectedInstitucion!="Todos"){
            this.filtrados = this.filtrados.filter(f => f.nombreIns == this.selectedInstitucion);
          }

          if( this.selectedAreaDeConocimiento!="Todos")
            this.filtrados = this.filtrados.filter(f => f.nombreConvo == this.selectedAreaDeConocimiento);

            console.log(this.selectedAreaDeConocimiento);
            console.log(this.selectedInstitucion);
        
      },
    }

  }


</script>
<style scoped>
  .baner{
    font-weight: normal;
  }
  .fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5); /* Oscurece el fondo */
  z-index: 1000; /* Por encima del contenido normal */
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-card {
  position: relative;
  z-index: 1001; /* Mayor que el overlay */
  width: 80%;
  max-width: 80%;
  background: white;
}

.very-rounded {
  border-radius: 10px;
}

.iframe-responsive {
  max-height: 60vh;
  height: 54vh;
}

@media (max-width: 960px) {
  .iframe-responsive {
    height: 60vh;
  }
}

.iframe-responsive-2 {
  height: 70vh;
}

@media (max-width: 960px) {
  .iframe-responsive-2 {
    height: 70vh;
  }
}

.bit-more-rounded {
  border-radius: 6px;
}

.denegar:hover{
  background-color: orangered;
  color: brown;
}
.aceptar:hover{
 color: cadetblue;
  background-color: lawngreen;
}
.aceptar, .denegar{
  border: solid 0.3vmax #BFD6FF ;
  color: #BFD6FF;
  transition: 0.7s;
}

</style>  