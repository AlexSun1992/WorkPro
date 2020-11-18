import Vue from "vue";
import Router from "vue-router";
import Main from "~/components/Pages/Main";
import DemoPage from "~/components/Pages/DemoPage";
import Cabinet from "~/components/Pages/Cabinet/Full";
import Dashboard from "~/components/Pages/Cabinet/Dashboard";
import Fluid from "~/components/Pages/Cabinet/Fluid";
import CardPage from "~/components/Pages/Cabinet/CardPage";
import Login from "~/components/Pages/Login/LoginPage";
import PasswordRecovery from "~/components/Pages/Login/PasswordRecovery/PasswordRecoveryForm";
import DynamicRoutesRenderer from "~/components/Libs/DynamicRoutesRenderer/DynamicRoutesRenderer";
import Preview from "~/components/Pages/PreviewPage/Preview";
import Table from "~/components/Pages/Table/Table";

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
        meta: "Загрузка файлов",
        path: "/download",
        component: Table,
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
        ],
      },
      {
        path: "/preview/:pageId",
        component: Preview,
      },
      {
        meta: "Main",
        path: "/*",
        component: DynamicRoutesRenderer,
      },
    ],
  });
}
