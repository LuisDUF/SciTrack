import Vue from 'vue'
import Router from 'vue-router'

import Home from '../views/HomePage.vue'
import Raws from '../views/RawsPage.vue'
import Rubricas from '../views/RubricasPage.vue'
import ConvocatoriasPage from '../views/ConvocatoriasPage.vue'
import ProyectosYUsauriosPage from '../views/ProyectosYUsuariosPage.vue'
import Reportes from '../views/ReportesPage.vue'

Vue.use(Router)

export default new Router({
  mode: 'history', // This is equivalent to createWebHistory()
  routes: [
    { path: '/', name: 'Home', component: Home },
    { path: '/raws', name: 'Raws', component: Raws },
    { path: '/rubricas', name: 'Rubricas', component: Rubricas },
    { path: '/convocatorias', name: 'Convocatorias', component: ConvocatoriasPage },
    { path: '/proyectosyusuarios', name: 'ProyectosYUsaurios', component: ProyectosYUsauriosPage },
    { path: '/reportes', name: 'Reportes', component: Reportes },
    // Add more as needed
  ]
})
