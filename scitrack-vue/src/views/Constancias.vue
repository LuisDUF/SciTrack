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
                  :key="AreaDeConocimiento.idConvocatoria"
                  :label="AreaDeConocimiento.nombre"
                  :value="AreaDeConocimiento.idConvocatoria"
                  @change="selectedAreaDeConocimiento=AreaDeConocimiento, onCheckboxChange()"
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
                  :key="Institucion.idInstitucion"
                  :label="Institucion.nombre"
                  :value="Institucion.idInstitucion"
                  @change="selectedInstitucion=Institucion, onCheckboxChange()"
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
        <div style=" font-size: 2.5vmax; font-weight: bold; margin-top: 0vmax; " class="card-header ps-0 mb-3" >Información</div> 
        
          <v-row  class="rounded py-3 px-2" style="background-color: #BFD6FF;">
            <v-col cols="8">
              <v-card style="width: 100%;">
                <h4 class="ps-5 pt-3">Nombre: {{ elegido.selectis.nombre }}</h4>
                <h4 class="ps-5 mt-5">Institucion: {{ elegido.isti.nombre }} </h4>
                <h4 class="ps-5 mt-5">Área de conocimiento: {{ elegido.area.nombre }}</h4>
                <h4 class="ps-5 mt-5">Correo: {{ elegido.selectis.correo }}</h4>
                <h4 class="ps-5 mt-5">Teléfono: {{ elegido.selectis.telefono }}</h4>
                <h4 class="ps-5 mt-5">Documentos: </h4>
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
                <button @click="aprobar(elegido.selectis,true)" v-if="elegido.selectis.EstadoPersona_idEstadoPersona==1" class="ms-5 mt-5 rounded pa-2 px-5 aceptar" >Aprobar</button>
                <button  @click="aprobar(elegido.selectis,false)" v-if="elegido.selectis.EstadoPersona_idEstadoPersona==1" class="ms-5 mt-5 mb-5 rounded pa-2 px-5 denegar" >Denegar</button>
                <button @click="aprobar(elegido.selectis,false)" v-if="elegido.selectis.EstadoPersona_idEstadoPersona==2" class="ms-5 mt-5 mb-5 rounded pa-2 px-5 denegar">Eliminar</button>
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
      const response = await api.get('/api/proyectos/equipo/' + p.Equipo_idEquipo);
      const proyecto = response.data[0] || response.data;

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
      abrirArchivo(doc){
        const byteArray = new Uint8Array(doc.contenido.data);
        const blob = new Blob([byteArray], { type: "application/pdf" });
        this.pdfUrl = URL.createObjectURL(blob);
      },
      async buscar(){
        this.filtrados = this.participantes.filter(p=> p.nombre.toLowerCase().trim().includes(this.buscado.toLowerCase().trim()) || p.idParticipante == (this.buscado));
      },
            cerrar(){
        this.vari.no = 'NO';
        this.pdfUrl = null;
      },
       async onCheckboxChange(){
      this.aceptados = [];
      this.pendientes = [];
      this.investigadores = [];
        try {
            const response = await api.get(`/api/investigador/`);
            this.investigadores = (JSON.parse(JSON.stringify(response.data)));
            var inv2 = [];
          if(this.selectedAreaDeConocimiento!=null&&this.selectedAreaDeConocimiento!="Todos"){
            const response = await api.get(`/api/investigador/area/`+this.selectedAreaDeConocimiento);
           
            inv2.push(...JSON.parse(JSON.stringify(response.data)));
            if(this.selectedInstitucion!=null&&this.selectedInstitucion!="Todos"){
              inv2 = inv2.filter(i => i.Institucion_idInstitucion==this.selectedInstitucion);
            }
            
         
          }
          if(this.selectedInstitucion!=null&&this.selectedInstitucion!="Todos"){
            const response = await api.get(`/api/investigador/institucion/`+this.selectedInstitucion);
            inv2.push(...JSON.parse(JSON.stringify(response.data)));
            if(this.selectedAreaDeConocimiento!=null&&this.selectedAreaDeConocimiento!="Todos"){
            inv2 = inv2.filter(i => i.AreaDeConocimientoInv_idAreaDeConocimientoInv==this.selectedAreaDeConocimiento);
            }

          }

          if(inv2.length>0){
            inv2 = inv2.filter((item, index, self) => 
            index === self.findIndex((t) => (
                t.idInvestigador === item.idInvestigador 
            ))
            );
            this.investigadores = inv2;
          }else if(this.selectedAreaDeConocimiento!=null&&this.selectedAreaDeConocimiento!="Todos"||this.selectedInstitucion!=null&&this.selectedInstitucion!="Todos"){
            this.investigadores = [];

          }
          
          
          
          this.investigadores.forEach(async inv  =>   {

            
            const response2 = await api.get('/api/institucion/'+inv.Institucion_idInstitucion)
            const ins = JSON.parse(JSON.stringify(response2.data));


            const response = await api.get('/api/AreaDeConocimientoInv/disciplina/'+inv.Disciplina_idDisciplina)
            const are = JSON.parse(JSON.stringify(response.data));

            inv.nombreIns = ins[0].nombre;
            inv.nombreAre = are[0].nombre;

            if(inv.EstadoPersona_idEstadoPersona==1){
              inv.estadoP = "Pendiente de revisión"
              this.pendientes.push(inv);
              console.log("si");
            }

            else if(inv.EstadoPersona_idEstadoPersona==2){
            inv.estadoP = "Aprobado"
              this.aceptados.push(inv); 
            }
            
        });

        } catch (error) {
          console.error("Error al cargar datos:", error);
        }
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
  height: 60vh;
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