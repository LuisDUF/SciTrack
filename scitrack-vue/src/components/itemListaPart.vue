<template>
    <div class="rounded" style="margin-top: 0.666vw; padding: 1vw; padding-left:1.33vw; padding-right: 1.33vw; background-color: #ffffff;">
      <label style="font-size: small; font-weight: bold;" >Nombre:</label> <label style="font-size: small;"> {{ nombre }}</label> <br>
      <label style="font-size: small; font-weight: bold;">Institución:</label> <label style="font-size: small;" > {{ institucion }}</label> <br>
      <button @click="openModalRev()" class="rounded px-12 mt-2" style="color: #ffffff; background-color: #6596FF;">Revisar</button>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      nombre: String,
      institucion: String,
      conocimiento: String,
      estado: String,
      investigador: Object,
      vari: Object,
      seleccion: Object
    },
    methods: {
      async openModalRev() {
        this.$set(this.seleccion, 'selectis', this.investigador);
  
        let response = await fetch(`http://localhost:3000/api/institucion/${this.investigador.Institucion_idInstitucion}`);
        let data = await response.json();
        this.$set(this.seleccion, 'isti', JSON.parse(JSON.stringify(data[0])));
  
        response = await fetch(`http://localhost:3000/api/areaDeConocimientoInv/disciplina/${this.investigador.Disciplina_idDisciplina}`);
        data = await response.json();
        this.$set(this.seleccion, 'area', JSON.parse(JSON.stringify(data[0])));
  
        response = await fetch(`http://localhost:3000/api/archivos/investigador/${this.investigador.idInvestigador}`);
        data = await response.json();
        const archi = [...JSON.parse(JSON.stringify(data))];
        this.$set(this.seleccion, 'archivos', archi);
  
        this.$set(this.vari, 'no', 'SI');
      }
    }
  };
  </script>
  
  