import Vue from "vue";
import Router from "vue-router";

//INITIAL es de la del admin porfa no lo cambien
import Initial from "../views/InitialPage.vue";
import Raws from "../views/RawsPage.vue";
import Rubricas from "../views/RubricasPage.vue";
import ConvocatoriasPage from "../views/ConvocatoriasPage.vue";
import ProyectosInvestigador from "../views/ProyectosInvPage.vue";

import ProyectosYUsauriosPage from "../views/ProyectosYUsuariosPage.vue";
import EquiposProyectosUser from "../views/ProyectosEquiposUser.vue";
import HomeUser from "../views/HomePageUser.vue";
import HomeInv from "../views/HomePageInv.vue";


import Reportes from "../views/ReportesPage.vue";
import LoginPage from "../views/LoginPage.vue";
import LandingPage from "../views/LandingPage.vue";
import AdminMenu from "../views/AdminMenu.vue";
import InvMenu from "../views/InvMenu.vue";
import UserMenu from "../views/UserMenu.vue";


Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "Landing",
      component: LandingPage,
    },
    {
      path: "/login",
      name: "Login",
      component: LoginPage,
    },
    {
      path: "/invmenu",
      component: InvMenu, // no name; it's a parent route
      children: [
        {
          path: "", // default child (shows on /adminmenu)
          name: "InvMenu",
          component: HomeInv, // or any default sub-view
        },
        {
          path: "proyectos",
          name: "Proyectos",
          component: ProyectosInvestigador,
        },
      ],
    },
    {
      path: "/usermenu",
      component: UserMenu, // no name; it's a parent route
      children: [
        {
          path: "", // default child (shows on /adminmenu)
          name: "UserMenu",
          component: HomeUser, // or any default sub-view
        },
        {
          path: "equiposproyectos",
          name: "EquiposProyectos",
          component: EquiposProyectosUser,
        },
      ],
    },
    {
      path: "/adminmenu",
      component: AdminMenu, 
      children: [
        {
          path: "", 
          name: "AdminMenu",
          component: Initial, 
        },
        {
          path: "convocatorias",
          name: "Convocatorias",
          component: ConvocatoriasPage,
        },
        {
          path: "rubricas",
          name: "Rubricas",
          component: Rubricas,
        },
        {
          path: "proyectosyusuarios",
          name: "ProyectosYUsuarios",
          component: ProyectosYUsauriosPage,
        },
        {
          path: "reportes",
          name: "Reportes",
          component: Reportes,
        },
        {
          path: "raws",
          name: "Raws",
          component: Raws,
        },
      ],
    },
  ],
});
