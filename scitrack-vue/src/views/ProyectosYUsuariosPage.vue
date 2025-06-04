<template>
  <div id="app">
    <div class="contenedor">
      <h2>Gestión de Equipos</h2>
           <loading-dialog v-model="loading" />

      <div class="tabs">
        <v-btn 
          class="tab" 
          :class="{ active: activeTab === 'equipos' }" 
          @click="mostrarSeccion('equipos')"
        >
          Equipos
        </v-btn>
        <v-btn 
          class="tab" 
          :class="{ active: activeTab === 'proyectos' }" 
          @click="mostrarSeccion('proyectos')"
        >
          Proyectos
        </v-btn>
      </div>

      <div v-show="activeTab === 'equipos'" class="container">
        <div class="column" id="equiposPendientes">
          <h3>Equipos Pendientes por Revisión</h3>
          <div v-for="equipo in mostrarEquiposPendientes" :key="equipo.idEquipo" class="card">
            <p><strong>Nombre del líder:</strong> {{ obtenerNombreLider(equipo.Participante_idLider) }}</p>
            <p><strong>Asesor:</strong> {{ obtenerNombreAsesor(equipo.Asesor_idAsesor) }}</p>
            <p><strong>Institución:</strong> {{ obtenerInstitucionLider(equipo.Participante_idLider) }}</p>
            <p class="estado pendiente"><strong>Estatus:</strong> {{ obtenerEstadoEquipo(equipo.idEquipo) }}</p>
            <v-btn @click="mostrarModal('equipo', equipo)" class="blue-btn">Revisar</v-btn>
          </div>
        </div>
        
        <div class="column" id="equiposAprobados">
          <h3>Equipos Aprobados</h3>
          <div v-for="equipo in mostrarEquiposAprobados" :key="equipo.idEquipo" class="card">
            <p><strong>Nombre del líder:</strong> {{ obtenerNombreLider(equipo.Participante_idLider) }}</p>
            <p><strong>Asesor:</strong> {{ obtenerNombreAsesor(equipo.Asesor_idAsesor) }}</p>
            <p><strong>Institución:</strong> {{ obtenerInstitucionLider(equipo.Participante_idLider) }}</p>
            <p class="estado disponible"><strong>Estatus:</strong> {{ obtenerEstadoEquipo(equipo.idEquipo) }}</p>
          </div>
        </div>

        <div class="column" style="background-color: #FFFFFF;">
          <div class="filtro-Nombre">
            <p><strong>Buscar por nombre del líder o asesor:</strong></p>
            <div class="native-search-container">
              <input
                type="text"
                v-model="busquedaEquipos"
                @input="filtrarEquipos"
                placeholder="Buscar por líder o asesor"
                class="native-search-input"
              >
            </div>
          </div>
          
          <div class="row">
            <div id="filtroInstitucionEquiposContainer" class="native-checkbox-group pa-5">
              <label for="filtroInstitucionEquipos"><strong> Filtrar por institución:</strong></label>

              <label v-for="institucion in INSTITUCIONES" :key="institucion.idInstitucion" 
                    class="native-checkbox-wrapper" :class="{'is-selected': filtroInstitucionEquipos.includes(institucion.idInstitucion)}">
                <input
                  type="checkbox"
                  v-model="filtroInstitucionEquipos"
                  :value="institucion.idInstitucion"
                  @change="filtrarEquipos"
                  class="native-checkbox"
                >
                <span class="checkmark"></span>
                <span class="label-text">{{ institucion.nombre }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div v-show="activeTab === 'proyectos'" class="container">
        <div class="column" id="listaProyectosPendientes">
          <h3>Proyectos Pendientes por Revisión</h3>
          <div v-for="proyecto in proyectosPendientesFiltrados" :key="proyecto.idProyecto" class="card">
            <p><strong>Nombre del proyecto:</strong> {{ proyecto.nombre }}</p>
            <p><strong>Categoria:</strong> {{ obtenerCategoria(proyecto.Categoria_idCategoria) }}</p>
            <p><strong>Nombre del líder del equipo:</strong> {{ obtenerNombreLiderEquipo(proyecto.Equipo_idEquipo) }}</p>
            <p><strong>Institución:</strong> {{ obtenerInstitucionProyecto(proyecto.Equipo_idEquipo) }}</p>
            <p><strong>Convocatoria:</strong> {{ obtenerConvocatoriaProyecto(proyecto) }}</p>
            <p class="estado pendiente"><strong>Estatus:</strong> {{ obtenerEstatusProyecto(proyecto.EstadosProyecto_idEstadosProyecto) }}</p>
            <v-btn @click="mostrarModal('proyecto', proyecto)" class="blue-btn">Revisar</v-btn>
          </div>
        </div>
        
        <div class="column" id="listaProyectosAprobados">
          <h3>Proyectos Aprobados</h3>
          <div v-for="proyecto in proyectosAprobadosFiltrados" :key="proyecto.idProyecto" class="card">
            <p><strong>Nombre del proyecto:</strong> {{ proyecto.nombre }}</p>
            <p><strong>Categoria:</strong> {{ obtenerCategoria(proyecto.Categoria_idCategoria) }}</p>
            <p><strong>Nombre del líder del equipo:</strong> {{ obtenerNombreLiderEquipo(proyecto.Equipo_idEquipo) }}</p>
            <p><strong>Institución:</strong> {{ obtenerInstitucionProyecto(proyecto.Equipo_idEquipo) }}</p>
            <p><strong>Fase:</strong> {{ obtenerFaseProyecto(proyecto.Fase_idFase) }}</p>
            <p><strong>Convocatoria:</strong> {{ obtenerConvocatoriaProyecto(proyecto) }}</p>
            <p class="estado disponible"><strong>Estatus:</strong> {{ obtenerEstatusProyecto(proyecto.EstadosProyecto_idEstadosProyecto) }}</p>
          </div>
        </div>

        <div class="column" style="background-color: #FFFFFF;">
          <div class="filtro-NombreP">
            <p><strong>Buscar por nombre del proyecto o lider:</strong></p>
            <div class="native-search-container">
              <input
                type="text"
                v-model="busquedaProyectos"
                @input="filtrarProyectos"
                placeholder="Inserte el nombre..."
                class="native-search-input"
              >
            </div>
          </div>

          <div class="column" style="height: 10px;">
            <label for="filtroInstitucionEquipos pa-5"><strong> Filtrar por institución:</strong></label>
            <div id="filtroInstitucionProyectoContainer" class="native-checkbox-group">
              <label v-for="institucion in INSTITUCIONES" :key="institucion.idInstitucion" 
                    class="native-checkbox-wrapper" :class="{'is-selected': filtroInstitucionProyectos.includes(institucion.idInstitucion)}">
                <input
                  type="checkbox"
                  v-model="filtroInstitucionProyectos"
                  :value="institucion.idInstitucion"
                  @change="filtrarProyectos"
                  class="native-checkbox"
                >
                <span class="checkmark"></span>
                <span class="label-text">{{ institucion.nombre }}</span>
              </label>
            </div>
          </div>

          <div class="column" style="height: max-content;">
            <label for="filtroConvocatoriaProyectos"><strong> Filtrar por Convocatoria:</strong></label>
            <div id="filtroConvocatoriaProyectoContainer" class="native-checkbox-group">
              <label v-for="convocatoria in CONVOCATORIAS" :key="convocatoria.idConvocatoria" 
                    class="native-checkbox-wrapper" :class="{'is-selected': filtroConvocatoriaProyectos.includes(convocatoria.idConvocatoria)}">
                <input
                  type="checkbox"
                  v-model="filtroConvocatoriaProyectos"
                  :value="convocatoria.idConvocatoria"
                  @change="filtrarProyectos"
                  class="native-checkbox"
                >
                <span class="checkmark"></span>
                <span class="label-text">{{ convocatoria.nombre }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>



      <div v-if="modalVisible" class="modal-overlay">
        <div class="modal-container">
          <div class="modal-content">
            <button @click="cerrarModal" class="modal-close-btn">&times;</button>
            <h3 class="modal-title"><strong>Detalles</strong></h3>
            <div class="columna-modal">
              <div class="modal-body">
                <div class="modal-details" v-html="modalDetalles"></div>
              </div>
              <div class="preview-pdf">
                <div class="modal-preview" v-html="pdfPreview"></div>
              </div>
            </div>
            <div class="modal-actions">
              <v-btn class="modal-btn aprobar" @click="aprobar">
                <strong>Aprobar</strong>
              </v-btn>
              <v-btn class="modal-btn rechazar" @click="rechazar">
                <strong>Rechazar</strong>
              </v-btn>
            </div>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
import LoadingDialog from "@/components/LoadingDialog.vue";

export default {
    components: {LoadingDialog },

  data() {
    return {
      activeTab: 'equipos',
      busquedaEquipos: '',
      busquedaProyectos: '',
      filtroInstitucionEquipos: [],
      filtroInstitucionProyectos: [],
      filtroConvocatoriaProyectos: [],
      modalVisible: false,
      modalDetalles: '',
      pdfPreview: '',
      tipoActual: '',
      loading:false,
      datosActuales: null,
      
// Datos de API
      ASESOR: [],
      PARTICIPANTE: [],
      EQUIPOS: [],
      DEPENDENCIAS: [],
      INSTITUCIONES: [],
      GENEROS: [],
      FASES: [],
      ITEMCF: [],
      CONVOCATORIAS: [],
      PROYECTOS: [],
      CATEGORIAS: [],
      AREAS: [],
      ESTADOP: [],
      ARCHIVOS: []
    }
  },
    mounted() {
    this.cargarData();
  },
  methods: {
    async cargarData() {
      this.loading = true;
      this.error = null;
      
      try {
        this.loading = false;
        await Promise.all([
          this.cargarAsesores(),
          this.cargarParticipantes(),
          this.cargarEquipos(),
          this.cargarDependencias(),
          this.cargarInstituciones(),
          this.cargarGeneros(),
          this.cargarFases(),
          this.cargarItems(),
          this.cargarConvocatorias(),
          this.cargarProyectos(),
          this.cargarCategorias(),
          this.cargarAreas(),
          this.cargarEstados(),
          this.cargarArchivos()
        ]);
                

      } catch (error) {
        this.error = "Error al cargar los datos. Por favor intenta nuevamente.";
        console.error("Error cargando datos:", error);
                this.loading = false;

      } finally {
        this.loading = false;
      }
    },
    
    async cargarAsesores() {
      try {
        const response = await fetch("http://localhost:3000/api/asesor/");
        this.ASESOR = await response.json();
      } catch (error) {
        console.error("Error al obtener asesores:", error);
        throw error;
      }
    },
    
    async cargarParticipantes() {
      try {
        const response = await fetch("http://localhost:3000/api/participante/");
        this.PARTICIPANTE = await response.json();
      } catch (error) {
        console.error("Error al obtener participantes:", error);
        throw error;
      }
    },
    
    async cargarEquipos() {
      try {
        const response = await fetch("http://localhost:3000/api/equipo/");
        this.EQUIPOS = await response.json();
      } catch (error) {
        console.error("Error al obtener equipos:", error);
        throw error;
      }
    },
    
    async cargarDependencias() {
      try {
        const response = await fetch("http://localhost:3000/api/dependencia/");
        this.DEPENDENCIAS = await response.json();
      } catch (error) {
        console.error("Error al obtener dependencias:", error);
        throw error;
      }
    },
    
    async cargarInstituciones() {
      try {
        const response = await fetch("http://localhost:3000/api/institucion/");
        this.INSTITUCIONES = await response.json();
      } catch (error) {
        console.error("Error al obtener instituciones:", error);
        throw error;
      }
    },
    
    async cargarGeneros() {
      try {
        const response = await fetch("http://localhost:3000/api/genero/");
        this.GENEROS = await response.json();
      } catch (error) {
        console.error("Error al obtener generos:", error);
        throw error;
      }
    },
    
    async cargarFases() {
      try {
        const response = await fetch("http://localhost:3000/api/fase/");
        this.FASES = await response.json();
      } catch (error) {
        console.error("Error al obtener fases:", error);
        throw error;
      }
    },
    
    async cargarItems() {
      try {
        const response = await fetch("http://localhost:3000/api/itemconvocatoria_fase/");
        this.ITEMCF = await response.json();
      } catch (error) {
        console.error("Error al obtener ITEMS:", error);
        throw error;
      }
    },
    
    async cargarConvocatorias() {
      try {
        const response = await fetch("http://localhost:3000/api/convocatoria/");
        this.CONVOCATORIAS = await response.json();
      } catch (error) {
        console.error("Error al obtener convocatorias:", error);
        throw error;
      }
    },
    
    async cargarProyectos() {
      try {
        const response = await fetch("http://localhost:3000/api/proyecto/");
        this.PROYECTOS = await response.json();
      } catch (error) {
        console.error("Error al obtener proyectos:", error);
        throw error;
      }
    },
    
    async cargarCategorias() {
      try {
        const response = await fetch("http://localhost:3000/api/categoria/");
        this.CATEGORIAS = await response.json();
      } catch (error) {
        console.error("Error al obtener categorias:", error);
        throw error;
      }
    },
    
    async cargarAreas() {
      try {
        const response = await fetch("http://localhost:3000/api/areadeconocimientocat/");
        this.AREAS = await response.json();
      } catch (error) {
        console.error("Error al obtener areas:", error);
        throw error;
      }
    },
    
    async cargarEstados() {
      try {
        const response = await fetch("http://localhost:3000/api/estadosproyecto/");
        this.ESTADOP = await response.json();
      } catch (error) {
        console.error("Error al obtener estados:", error);
        throw error;
      }
    },
    
    async cargarArchivos() {
      try {
        const response = await fetch("http://localhost:3000/api/archivos/");
        this.ARCHIVOS = await response.json();
        console.log("Archivos cargados:", this.ARCHIVOS);
      } catch (error) {
        console.error("Error al obtener archivos:", error);
        throw error;
      }
    },
    
     // Métodos auxiliares (no reactivos, por eso van en methods)
    cumpleFiltroInstitucion(lider) {
      if (this.filtroInstitucionProyectos.length === 0) return true;
      
      const dependencia = lider ? this.DEPENDENCIAS.find(d => d.idDependencia === lider.Dependencia_idDependencia) : null;
      const institucionId = dependencia ? dependencia.Institucion_idInstitucion : null;
      
      return this.filtroInstitucionProyectos.includes(String(institucionId));
    },

    cumpleFiltroConvocatoria(proyecto) {
      if (this.filtroConvocatoriaProyectos.length === 0) return true;
      
      const fase = proyecto ? this.FASES.find(f => f.idFase === proyecto.Fase_idFase) : null;
      const item = fase ? this.ITEMCF.find(i => i.Fase_idFase === fase.idFase) : null;
      const convocatoriaId = item ? item.Convocatoria_idConvocatoria : null;
      
      return this.filtroConvocatoriaProyectos.includes(String(convocatoriaId));
    },

  actualizarFiltroInstitucion(id, checked) {
    if (checked) {
      this.filtroInstitucionEquipos.push(id);
    } else {
      this.filtroInstitucionEquipos = this.filtroInstitucionEquipos.filter(item => item !== id);
    }
    this.filtrarEquipos();
  },


  actualizarFiltroInstitucionPro(id, checked) {
    if (checked) {
      this.filtroInstitucionProyectos.push(id);
    } else {
      this.filtroInstitucionProyectos = this.filtroInstitucionProyectos.filter(item => item !== id);
    }
    this.filtrarProyectos();
  },

  actualizarFiltroConvocatoria(id, checked) {
    if (checked) {
      this.filtroConvocatoriaProyectos.push(id);
    } else {
      this.filtroConvocatoriaProyectos = this.filtroConvocatoriaProyectos.filter(item => item !== id);
    }
    this.filtrarProyectos();
  },

    mostrarSeccion(seccion) {
      this.activeTab = seccion;
    },
    filtrarEquipos() {
      // La lógica de filtrado se maneja en las propiedades computadas
    },
    filtrarProyectos() {
      // La lógica de filtrado se maneja en las propiedades computadas
    },



    obtenerNombreLider(idLider) {
      const lider = this.PARTICIPANTE.find(p => p.idParticipante === idLider);
      return lider ? `${lider.nombre} ${lider.apellidoPaterno}` : 'Sin líder';
    },
    obtenerNombreAsesor(idAsesor) {
      const asesor = this.ASESOR.find(a => a.idAsesor === idAsesor);
      return asesor ? `${asesor.nombre} ${asesor.apellidoPaterno}` : 'Sin asesor';
    },
    obtenerEstadoEquipo(idEquipo) {
      const equipo = this.EQUIPOS.find(e => e.idEquipo === idEquipo);
      return equipo ? `${equipo.estado}` : 'Sin asesor';
    },
    obtenerInstitucionLider(idLider) {
      const lider = this.PARTICIPANTE.find(p => p.idParticipante === idLider);
      const dependencia = this.DEPENDENCIAS.find(d => d.idDependencia === (lider ? lider.Dependencia_idDependencia : null));
      const institucion = this.INSTITUCIONES.find(i => i.idInstitucion === (dependencia ? dependencia.Institucion_idInstitucion : null));
      return institucion ? institucion.nombre : 'Sin institución';
    },
    obtenerNombreLiderEquipo(idEquipo) {
      const equipo = this.EQUIPOS.find(e => e.idEquipo === idEquipo);
      const lider = this.PARTICIPANTE.find(p => p.idParticipante === (equipo ? equipo.Participante_idLider : null));
      return lider ? `${lider.nombre} ${lider.apellidoPaterno}` : 'Sin líder';
    },
    obtenerEstatusProyecto(idEstadosProyecto) {
      const estadoP = this.ESTADOP.find(e => e.idEstadosProyecto === idEstadosProyecto);
      return estadoP ? `${estadoP.nombre}` : 'Sin estado';
    },
    obtenerInstitucionProyecto(idEquipo) {
      const equipo = this.EQUIPOS.find(e => e.idEquipo === idEquipo);
      const lider = this.PARTICIPANTE.find(p => p.idParticipante === (equipo ? equipo.Participante_idLider : null));
      const dependencia = this.DEPENDENCIAS.find(d => d.idDependencia === (lider ? lider.Dependencia_idDependencia : null));
      const institucion = this.INSTITUCIONES.find(i => i.idInstitucion === (dependencia ? dependencia.Institucion_idInstitucion : null));
      return institucion ? institucion.nombre : 'Sin institución';
    },   
    obtenerCategoria(idCategoria) {
      const categoria = this.CATEGORIAS.find(c => c.idCategoria === idCategoria);
      return categoria ? categoria.nombre : 'Sin categoria';
    },
    obtenerFaseProyecto(idFase) {
      const fase = this.FASES.find(f => f.idFase === idFase);
      return fase ? fase.nombre : 'Sin fase';
    },
    obtenerConvocatoriaProyecto(proyecto) {
      const fase = this.FASES.find(f => f.idFase === (proyecto ? proyecto.Fase_idFase : null));
      const item = this.ITEMCF.find(i => i.Fase_idFase === (fase ? fase.idFase : null));
      const convocatoria = this.CONVOCATORIAS.find(co => co.idConvocatoria === (item ? item.Convocatoria_idConvocatoria : null));
      return convocatoria ? convocatoria.nombre : 'Sin convocatoria';
    },
    async mostrarModal(tipo, datos) {
      this.tipoActual = tipo;
      this.datosActuales = datos;
      this.modalDetalles = '';
      this.pdfPreview = '';

      if (tipo === 'equipo') {
        const lider = this.PARTICIPANTE.find(p => p.idParticipante === datos.Participante_idLider);
        const asesor = this.ASESOR.find(a => a.idAsesor === datos.Asesor_idAsesor);
        const dependencia = this.DEPENDENCIAS.find(d => d.idDependencia === (lider ? lider.Dependencia_idDependencia : null));
        const institucion = this.INSTITUCIONES.find(i => i.idInstitucion === (dependencia ? dependencia.Institucion_idInstitucion : null));
        const archivo = this.ARCHIVOS.find(a => a.idArchivos === (lider ? lider.Archivos_idArchivos : null));
        
        this.modalDetalles = `
          <p><strong>Nombre del líder:</strong> ${lider ? `${lider.nombre} ${lider.apellidoPaterno}` : 'Sin líder'}</p>
          <p><strong>Correo del líder:</strong> ${lider ? lider.correo : 'N/A'}</p>
          <p><strong>Asesor:</strong> ${asesor ? `${asesor.nombre} ${asesor.apellidoPaterno}` : 'Sin asesor'}</p>
          <p><strong>Institución:</strong> ${institucion ? institucion.nombre : 'Sin institución'}</p>
          <p><strong>Estado:</strong> ${datos.estado}</p>
        `;

  if (archivo && archivo.contenido && archivo.contenido.data) {
    // Convertir el buffer a Blob y crear URL
    const byteArray = new Uint8Array(archivo.contenido.data);
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    
    this.pdfPreview = `
      <embed src="${url}" type="application/pdf" width="100%" height="100%">

    `;
  } else {
    this.pdfPreview = '<p style="text-align: center">No se encontró el archivo.</p>';
  }
      } else if (tipo === 'proyecto') {
        const equipo = this.EQUIPOS.find(e => e.idEquipo === datos.Equipo_idEquipo);
        const lider = this.PARTICIPANTE.find(p => p.idParticipante === (equipo ? equipo.Participante_idLider : null));
        const dependencia = this.DEPENDENCIAS.find(d => d.idDependencia === lider.Dependencia_idDependencia);
        const institucion = this.INSTITUCIONES.find(i => i.idInstitucion === (dependencia ? dependencia.Institucion_idInstitucion : null));
        const archivo = this.ARCHIVOS.find(a => a.idArchivos === datos.Archivos_idArchivos);
        const categoria = this.CATEGORIAS.find(c => c.idCategoria === datos.Categoria_idCategoria);
        const area = this.AREAS.find(a => a.idAreaDeConocimientoCat === (categoria ? categoria.AreaDeConocimientoCat_idAreaDeConocimientoCat : null));
        const estado = this.ESTADOP.find(es => es.idEstadosProyecto === datos.EstadosProyecto_idEstadosProyecto);
        
        this.modalDetalles = `
          <p><strong>Nombre del proyecto:</strong> ${datos.nombre}</p>
          <p><strong>Fecha de registro:</strong> ${datos.fechaRegistro}</p>
          <p><strong>Categoria:</strong> ${categoria ? categoria.nombre : 'Sin categoria'}</p>
          <p><strong>Área:</strong> ${area ? area.nombre : 'Sin área'}</p>
          <p><strong>Líder del equipo:</strong> ${lider ? `${lider.nombre} ${lider.apellidoPaterno}` : 'Sin líder'}</p>
          <p><strong>Institución:</strong> ${institucion ? institucion.nombre : 'Sin institución'}</p>
          <p><strong>Video:</strong> ${datos ? datos.urlVideo : 'Sin video'}</p>
          <p><strong>Documento:</strong> ${archivo ? archivo.nombre : 'Sin archivo'}</p>
          <p class="estado pendiente"><strong>Estatus:</strong> ${estado.nombre}</p>
        `;

  if (archivo && archivo.contenido && archivo.contenido.data) {
    // Convertir el buffer a Blob y crear URL
    const byteArray = new Uint8Array(archivo.contenido.data);
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    
    this.pdfPreview = `
      <embed src="${url}" type="application/pdf" width="100%" height="100%">

    `;
  } else {
    this.pdfPreview = '<p style="text-align: center">No se encontró el archivo.</p>';
  }
      }

      this.modalVisible = true;
    },
    cerrarModal() {
      this.modalVisible = false;
      this.tipoActual = '';
      this.datosActuales = null;
    },
    async aprobar() {
      if (!this.datosActuales) return;

      if (this.tipoActual === 'equipo') {
        await this.aprobarEquipo(this.datosActuales.idEquipo);
      } else if (this.tipoActual === 'proyecto') {
        await this.aprobarProyecto(this.datosActuales.idProyecto);
      }

      this.cerrarModal();
    },
    async rechazar() {
      if (!this.datosActuales) return;

      if (this.tipoActual === 'equipo') {
        await this.rechazarEquipo(this.datosActuales.idEquipo);
      } else if (this.tipoActual === 'proyecto') {
        await this.rechazarProyecto(this.datosActuales.idProyecto);
      }

      this.cerrarModal();
    },
    async aprobarEquipo(idEquipo) {
      const equipo = this.EQUIPOS.find(e => e.idEquipo === idEquipo);
      const lider = this.PARTICIPANTE.find(p => p.idParticipante === equipo.Participante_idLider);
      try {
        const actualizado = {
          idEquipo: idEquipo,
          estado: 'Aprobado',
          claveAcceso: equipo.claveAcceso
        };

        // Aquí iría tu llamada a la API
        const response = await fetch(`http://localhost:3000/api/equipo/${idEquipo}`, {
          method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(actualizado)
        });
        if (!response.ok) throw new Error(`Error al aprobar equipo: ${response.status}`);
        
        
        console.log("Actualizando líder:", {
            id: lider.idParticipante,
            body: { Equipo_idEquipo: idEquipo }
        });
        // Asociar líder con el equipo aprobado
        const resLider = await fetch(`http://localhost:3000/api/participante/${lider.idParticipante}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Equipo_idEquipo: idEquipo })
        });

        if (!resLider.ok) throw new Error("Error al asociar líder al equipo");

        // Recargar datos
        await this.cargarData();
      } catch (error) {
        console.error("Error al aprobar equipo:", error);
      }
    },
    async rechazarEquipo(idEquipo) {
      try {
        const actualizado = {
          idEquipo,
          estado: 'Rechazado'
        };

        // Aquí iría tu llamada a la API
        const response = await fetch(`http://localhost:3000/api/equipo/${idEquipo}`, {
          method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(actualizado)
        });
        if (!response.ok) throw new Error(`Error al rechazar equipo: ${response.status}`);
        // Recargar datos
        await this.cargarData();
      } catch (error) {
        console.error("Error al rechazar equipo:", error);
      }
    },
    async aprobarProyecto(idProyecto) {
      try {
        const actualizado = {
          idProyecto,
          EstadosProyecto_idEstadosProyecto: 2
        };

        // Aquí iría tu llamada a la API
        const resProyecto = await fetch(`http://localhost:3000/api/proyecto/${idProyecto}`, {
          method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(actualizado)
        });
        if (!resProyecto.ok) throw new Error(`Error al aprobar proyecto: ${resProyecto.status}`);
        
        // Recargar datos
        await this.cargarData();
      } catch (error) {
        console.error("Error al aprobar proyecto:", error);
      }
    },
    async rechazarProyecto(idProyecto) {
      try {
        const actualizado = {
          idProyecto,
          Equipo_idEquipo: null,
          EstadosProyecto_idEstadosProyecto: 3
        };

        // Aquí iría tu llamada a la API
        const response = await fetch(`http://localhost:3000/api/proyecto/${idProyecto}`, {
          method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(actualizado)
        });
        if (!response.ok) throw new Error(`Error al rechazar participante: ${response.status}`);
        
        // Recargar datos
        await this.cargarData();
      } catch (error) {
        console.error("Error al rechazar proyecto:", error);
      }
    },
    
  },

  computed: {
    mostrarEquiposPendientes() {
      return this.EQUIPOS.filter(equipo => {
      // Filtro por estado
      if (equipo.estado !== "Pendiente de revisión") return false;
      
      // Filtro por texto (líder o asesor)
      const texto = this.busquedaEquipos.toLowerCase();
      const lider = this.PARTICIPANTE.find(p => p.idParticipante === equipo.Participante_idLider);
      const asesor = this.ASESOR.find(a => a.idAsesor === equipo.Asesor_idAsesor);
      
      const nombreLider = lider ? `${lider.nombre} ${lider.apellidoPaterno}`.toLowerCase() : '';
      const nombreAsesor = asesor ? `${asesor.nombre} ${asesor.apellidoPaterno}`.toLowerCase() : '';
      const coincideNombre = nombreLider.includes(texto) || nombreAsesor.includes(texto);
      
      // Filtro por institución
      const filtroInstitucionActivo = this.filtroInstitucionEquipos.length > 0;
      const dependencia = this.DEPENDENCIAS.find(d => d.idDependencia === (lider ? lider.Dependencia_idDependencia : null));
      const institucionId = dependencia ? dependencia.Institucion_idInstitucion : null;
      
      // Convertir IDs a string para comparación segura
      const institucionSeleccionada = filtroInstitucionActivo 
        ? this.filtroInstitucionEquipos.map(String).includes(String(institucionId))
        : true;
      
      return coincideNombre && institucionSeleccionada;
    });
    },
    mostrarEquiposAprobados() {
      return this.EQUIPOS.filter(equipo => {
        if (equipo.estado !== "Aprobado") return false;
        // Filtro por nombre
        const texto = this.busquedaEquipos.toLowerCase();
        const lider = this.PARTICIPANTE.find(p => p.idParticipante === equipo.Participante_idLider);
        const asesor = this.ASESOR.find(a => a.idAsesor === equipo.Asesor_idAsesor);

        const nombreLider = lider ? `${lider.nombre} ${lider.apellidoPaterno}`.toLowerCase() : '';
        const nombreAsesor = asesor ? `${asesor.nombre} ${asesor.apellidoPaterno}`.toLowerCase() : '';
        const coincideNombre = nombreLider.includes(texto) || nombreAsesor.includes(texto);
        
        // Filtro por institución
        const filtroInstitucionActivo = this.filtroInstitucionEquipos.length > 0;
        const dependencia = this.DEPENDENCIAS.find(d => d.idDependencia === (lider ? lider.Dependencia_idDependencia : null));
        const institucionId = dependencia ? dependencia.Institucion_idInstitucion : null;
      
      // Convertir IDs a string para comparación segura
      const institucionSeleccionada = filtroInstitucionActivo 
        ? this.filtroInstitucionEquipos.map(String).includes(String(institucionId))
        : true;
      
        return coincideNombre && institucionSeleccionada;
      });
    },
     proyectosPendientesFiltrados() {
    return this.PROYECTOS.filter(proyecto => {
      if (proyecto.EstadosProyecto_idEstadosProyecto !== 1) return false; // Cambiar a !
      const texto = this.busquedaProyectos.toLowerCase();
      const equipo = this.EQUIPOS.find(e => e.idEquipo === proyecto.Equipo_idEquipo);
      const lider = this.PARTICIPANTE.find(p => p.idParticipante === (equipo ? equipo.Participante_idLider : null));
      
      const nombreLider = lider ? `${lider.nombre} ${lider.apellidoPaterno}`.toLowerCase() : '';
      const nombreProy = proyecto.nombre ? proyecto.nombre.toLowerCase() : '';
      const coincideNombre = nombreLider.includes(texto) || nombreProy.includes(texto);
      
      // Filtro por institución
      const filtroInstitucionActivo = this.filtroInstitucionProyectos.length > 0;
      const dependencia = this.DEPENDENCIAS.find(d => d.idDependencia === (lider ? lider.Dependencia_idDependencia : null));
      const institucionId = dependencia ? dependencia.Institucion_idInstitucion : null;
      
      const institucionSeleccionada = filtroInstitucionActivo 
        ? this.filtroInstitucionProyectos.map(String).includes(String(institucionId))
        : true;
      
      // Filtro por convocatoria
      const filtroConvocatoriaActivo = this.filtroConvocatoriaProyectos.length > 0;
      const fase = this.FASES.find(f => f.idFase === proyecto.Fase_idFase);
      const item = fase ? this.ITEMCF.find(i => i.Fase_idFase === fase.idFase) : null;
      const convocatoriaId = item ? item.Convocatoria_idConvocatoria : null;
      
      const convocatoriaSeleccionada = filtroConvocatoriaActivo 
        ? this.filtroConvocatoriaProyectos.map(String).includes(String(convocatoriaId))
        : true;
      
      return coincideNombre && institucionSeleccionada && convocatoriaSeleccionada;
    });
  },
  
  proyectosAprobadosFiltrados() {
    return this.PROYECTOS.filter(proyecto => {
      if (proyecto.EstadosProyecto_idEstadosProyecto === 1) return false; //Cambiar a !
      const texto = this.busquedaProyectos.toLowerCase();
      const equipo = this.EQUIPOS.find(e => e.idEquipo === proyecto.Equipo_idEquipo);
      const lider = this.PARTICIPANTE.find(p => p.idParticipante === (equipo ? equipo.Participante_idLider : null));
      
      const nombreLider = lider ? `${lider.nombre} ${lider.apellidoPaterno}`.toLowerCase() : '';
      const nombreProy = proyecto.nombre ? proyecto.nombre.toLowerCase() : '';
      const coincideNombre = nombreLider.includes(texto) || nombreProy.includes(texto);
      
      const filtroInstitucionActivo = this.filtroInstitucionProyectos.length > 0;
      const dependencia = this.DEPENDENCIAS.find(d => d.idDependencia === (lider ? lider.Dependencia_idDependencia : null));
      const institucionId = dependencia ? dependencia.Institucion_idInstitucion : null;
      
      const institucionSeleccionada = filtroInstitucionActivo 
        ? this.filtroInstitucionProyectos.map(String).includes(String(institucionId))
        : true;
      
      const filtroConvocatoriaActivo = this.filtroConvocatoriaProyectos.length > 0;
      const fase = this.FASES.find(f => f.idFase === proyecto.Fase_idFase);
      const item = fase ? this.ITEMCF.find(i => i.Fase_idFase === fase.idFase) : null;
      const convocatoriaId = item ? item.Convocatoria_idConvocatoria : null;
      
      const convocatoriaSeleccionada = filtroConvocatoriaActivo 
        ? this.filtroConvocatoriaProyectos.map(String).includes(String(convocatoriaId))
        : true;
      
      return coincideNombre && institucionSeleccionada && convocatoriaSeleccionada;
    });
  }



  },


}
</script>

<style scoped>
/* Todos tus estilos originales aquí exactamente igual */
body {
  font-family: 'Segoe UI', sans-serif;
  margin: 0;
  padding: 20px;
  background: #C4CEF2;
}

.contenedor{
  margin: 0;
  padding: 20px;
  background: #FFFFFF;
  border-radius: 5px;
  height: max-content;
}

h2 {
  margin-bottom: 20px;
  font-size: 24px;
}

.tabs {
  margin-bottom: 20px;
}

.tab {
  background: linear-gradient(to right, #6596FF, #6596FF);
  color: white;
  border: none;
  padding: 10px 20px;
  margin-right: 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.tab.active {
  background: #4363a8;
}

.container {
  display: flex;
  gap: 20px;
}

.columna-modal {
  flex: 1;
  display: flex;
  flex-direction: row;
  gap: 15px;
  height: 770px;
  overflow-y: auto;
  background-color: #BFD6FF;
  border-radius: 5px;
  padding: 15px;
}

.contenedor-modal {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
  height: 95%;
  overflow-y: auto;
  background-color: #ffffff;
  border-radius: 5px;
  padding: 15px;
}

.column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
  min-height: 600px;
  height: max-content;
  overflow-y: auto;
  background-color: #BFD6FF;
  border-radius: 5px;
  padding: 15px;
}

.column h3 {
  font-size: 20px;
  margin-bottom: 10px;
}

.card {
  background: white;
  border-left: 5px solid #3b82f6;
  border-radius: 8px;
  padding: 10px 15px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
}

.card p {
  margin: 4px 0;
  font-size: 14px;
}

.estado.pendiente { color: #f59e0b; font-weight: bold; }
.estado.lleno { color: #f87171; font-weight: bold; }
.estado.disponible { color: #10b981; font-weight: bold; }

.blue-btn {
  margin-top: 8px;
  background: linear-gradient(to right, #6596FF, #6596FF);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 13px;
  cursor: pointer;
  margin-right: 8px;
}

.aprobar {
  margin-top: 8px;
  background: linear-gradient(to right, #3b82f6, #6366f1);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 20px;
  cursor: pointer;
  margin-right: 8px;
  width: 150px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.rechazar {
  margin-top: 8px;
  background: linear-gradient(to right,  #E02E7B, #961E44);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 20px;
  cursor: pointer;
  margin-right: 8px;
  width: 150px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.filtro-Nombre{
  flex: 1;
  display: flex;
  flex-direction:column;
  gap: 1px;
  height:max-content;
  overflow-y: auto;
  background-color: #BFD6FF;
  border-radius: 5px;
  padding: 10px;
}
.filtro-NombreP{
  flex: 0.5;
  display: flex;
  flex-direction:column;
  gap: 1px;
  height: 10px;
  overflow-y: auto;
  background-color: #BFD6FF;
  border-radius: 5px;
  padding: 10px;
}


.row {
  flex: 4;
  display: flex;
  flex-direction:column;
  gap: 15px;
  height: 55px;
  overflow-x: auto;
  background-color: #BFD6FF;
  border-radius: 5px;
  padding: 15px;
}
.modal-section {
  flex: 1;
  min-width: 300px;
}

.preview-pdf {
  margin-top: 0px;
  border: 1px solid #ddd;
  padding: 10px;
  width: 80%;
  height: 95%;
  background: #f9f9f9;
  border-radius: 5px;
}
.preview-pdf embed {
  width: 100%;
  height: 200px;
  border: none;
}


.native-search-container {
  background: white;
  border-radius: 4px;
  border: 1px solid #ddd;
  padding: 0 12px;
}

.native-search-input {
  width: 100%;
  height: 40px;
  border: none;
  outline: none;
  font-size: 14px;
  background: transparent;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  overflow-y: auto;
}

.modal-container {
  max-width: 1200px;
  width: 90%;
  margin: 20px auto;
}

.modal-content {
  position: relative;
  background: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  max-height: 90vh;
  overflow-y: auto;
}

.modal-close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 30px;
  height: 30px;
  background: #d62424;
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.modal-title {
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
  font-size: 24px;
}

.modal-body {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.modal-details {
  flex: 1;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 6px;
  max-height: 70vh;
  overflow-y: auto;
}

.modal-preview {
  flex: 3;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 6px;
  height: 65vh;

}

.modal-actions {
  display: flex;
  justify-content: left;
  gap: 15px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.modal-btn {
  min-width: 120px !important;
  height: 40px !important;
}


/* Asegurar que el modal esté por encima de todo */
.v-dialog {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  z-index: 9999 !important;
  background-color: rgba(0, 0, 0, 0.5) !important;
}

.native-checkbox-group {
  display: flex;
  flex-direction: column;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f8f9fa;
  width: 100%;
  margin-bottom: 20px;
    max-height: 413px; /* Altura máxima antes de mostrar scroll */
  overflow-y: auto; /* Scroll vertical cuando sea necesario */
}

.native-checkbox-wrapper {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  border-bottom: 1px solid #aaa;
  background-color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.native-checkbox-wrapper:last-child {
  border-bottom: none;
}

.native-checkbox {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: relative;
  height: 18px;
  width: 18px;
  background-color: white;
  border: 2px solid #007bff;
  border-radius: 4px;
  margin-right: 10px;
}

.native-checkbox:checked ~ .checkmark {
  background-color: #007bff;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.native-checkbox:checked ~ .checkmark:after {
  display: block;
}

.checkmark:after {
  left: 5px;
  top: 1px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.label-text {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 14px;
  color: #333;
}

/* Estilo cuando está seleccionado */
.is-selected {
  background-color: #007bff !important;
}

.is-selected .label-text {
  color: white !important;
  font-weight: 600;
}

.native-checkbox-wrapper:hover {
  background-color: #f1f1f1;
}
</style>