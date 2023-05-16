/* eslint-disable */
import Vue from "vue";
import Router from "vue-router";
import Cabinet from "~/components/Pages/Cabinet/Full";
import Dashboard from "~/components/Pages/Cabinet/Dashboard";
import Fluid from "~/components/Pages/Cabinet/Fluid";
import CardPage from "~/components/Pages/Cabinet/CardPage";
import WizardPage from "@/components/Pages/Cabinet/Wizard/Wizard";
import LoginEsia from "@/components/Pages/Esia/LoginEsia";
import Telemed from "@/components/Pages/Telemed/Telemed";
import AuthFormWrapper from "~/components-vue2/src/components/Login/AuthForm/AuthFormWrapper";
import PasswordRecoveryFormWrapper from "~/components-vue2/src/components/Login/RecoveryForm/PasswordRecoveryFormWrapper";
import ErrorPage from "@/layouts/error";
import olddms from "@/components/Pages/OLDDMS/olddms.vue";
Vue.use(Router);

export function createRouter() {
  return new Router({
    mode: "history",
    scrollBehavior(to, from, savedPosition) {
      return { x: 0, y: 0 };
    },
    routes: [
      {
        meta: "AuthFormWrapper",
        path: "/login",
        component: AuthFormWrapper,
      },
      {
        meta: "AuthFormWrapper",
        path: "/login/registration",
        component: AuthFormWrapper,
      },
      {
        meta: "PasswordRecoveryFormWrapper",
        path: "/login/password-recovery",
        component: PasswordRecoveryFormWrapper,
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
            path: ":idModule/:idParent/:idItem/0/:idCard",
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
                path: ":idModule/:idParent/:idItem/:idCard/idlist/:idList",
                component: CardPage,
              },
              {
                meta: "Cabinet",
                path: "list/:idModule/:idParent/:idItem/:idCard/:idRel",
                component: Fluid,
              },
            ],
          },
          {
            meta: "DMS",
            path: "/cabinet/dms",
            component: olddms,
          },
        ],
      },
      {
        meta: "Telemed",
        path: "/telemed",
        component: Telemed,
      },
      {
        meta: "Esia",
        path: "/idesia",
        component: LoginEsia,
      },
      {
        meta: "Error",
        path: "/error",
        component: ErrorPage,
      },
    ],
  });
}
