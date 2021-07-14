/* eslint-disable */
import Vue from "vue";
import Router from "vue-router";
import Cabinet from "~/components/Pages/Cabinet/Full";
import Dashboard from "~/components/Pages/Cabinet/Dashboard";
import Fluid from "~/components/Pages/Cabinet/Fluid";
import CardPage from "~/components/Pages/Cabinet/CardPage";
import WizardPage from "@/components/Pages/Cabinet/Wizard/Wizard";

Vue.use(Router);

export function createRouter() {
  return new Router({
    mode: "history",
    scrollBehavior(to, from, savedPosition) {
      return { x: 0, y: 0 };
    },
    routes: [
      {
        meta: "Cabinet",
        path: "/cabinet",
        component: Cabinet,
        redirect: "/cabinet/55/0/701",
        children: [
          {
            meta: "Cabinet",
            path: "dashboard",
            component: Dashboard,
          },
          {
            meta: "Cabinet",
            path: ":idModule/:idParent/:idItem",
            component: Fluid,
          },
          {
            meta: "Cabinet",
            path: ":idModule/:idParent/:idItem/:idCard",
            component: CardPage,
          },
          {
            meta: "Cabinet",
            path: ":idModule/:idParent/:idItem/:idCard/:idRel",
            component: CardPage,
          },
          {
            meta: "Cabinet",
            path: ":idModule/:idParent/:idItem/:idWizard/:idCard/:idRel",
            component: CardPage,
          },
          {
            meta: "Cabinet",
            path: "wizard/:idWizard",
            component: WizardPage,
            children: [
              {
                meta: "Cabinet",
                path: ":idModule/:idParent/:idItem/:idCard/:idRel",
                component: CardPage,
              },
              {
                meta: "Cabinet",
                path: "list/:idModule/:idParent/:idItem/:idCard/:idRel",
                component: Fluid,
              },
            ],
          },
        ],
      },
    ],
  });
}
