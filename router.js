/* eslint-disable */
import Vue from "vue";
import Router from "vue-router";
import Main from "~/components/Pages/Main";
import DemoPage from "~/components/Pages/DemoPage";
import Cabinet from "~/components/Pages/Cabinet/Full";
import Dashboard from "~/components/Pages/Cabinet/Dashboard";
import Fluid from "~/components/Pages/Cabinet/Fluid";
import CardPage from "~/components/Pages/Cabinet/CardPage";
import WizardPage from "@/components/Pages/Cabinet/Wizard/Wizard";
import Login from "~/components/Pages/Login/LoginPage";
import PasswordRecovery from "~/components/Pages/Login/PasswordRecovery/PasswordRecoveryForm";
import DynamicRoutesRenderer from "~/components/Libs/DynamicRoutesRenderer/DynamicRoutesRenderer";
import Preview from "~/components/Pages/PreviewPage/Preview";
import Table from "~/components/Pages/Table/Table";
import DemoOsago from "@/components/Pages/DemoOsago";
import MapViewer from "@/components/MapViewer/MapViewer";

Vue.use(Router);

export function createRouter() {
  return new Router({
    mode: "history",
    scrollBehavior(to, from, savedPosition) {
      return { x: 0, y: 0 };
    },
    routes: [
      {
        meta: "Main",
        path: "/",
        component: Main,
        redirect: "/cabinet/55/0/701",
      },
      {
        meta: "Register",
        path: "/login",
        component: Login,
        alias: "/register",
      },
      {
        meta: "Recovery",
        path: "/recovery",
        component: PasswordRecovery,
      },
      {
        meta: "Демонстрационная страница",
        path: "/demo-page",
        component: DemoPage,
      },
      {
        meta: "Оформление ОСАГО",
        path: "/demo-osago",
        component: DemoOsago,
      },
      {
        meta: "Загрузка файлов",
        path: "/download",
        component: Table,
      },
      {
        meta: "Карта офисов",
        path: "/contacts",
        component: MapViewer,
      },
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
