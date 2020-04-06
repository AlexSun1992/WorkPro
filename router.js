import Vue from 'vue'
import Router from 'vue-router'

import Main from '~/components/Pages/Main'
import DemoAbout from '~/components/Pages/DemoAbout'
import Feedback from '~/components/Pages/Feedback'
import Calculator from '~/components/Pages/Calculator'
// import DemoPage from '~/components/Pages/DemoPage'
import DemoCarousel from '~/components/Pages/DemoCarousel'

import Cabinet from '~/components/Pages/Cabinet/Full'
import Dashboard from '~/components/Pages/Cabinet/Dashboard'
import Fluid from '~/components/Pages/Cabinet/Fluid'

import Login from '~/components/Pages/Login/LoginPage'
import PasswordRecovery from '~/components/Pages/Login/PasswordRecovery/PasswordRecoveryForm'
import DynamicRoutesRenderer from '~/components/Libs/DynamicRoutesRenderer/DynamicRoutesRenderer'

Vue.use(Router)

export function createRouter() {
  return new Router({
    mode: 'history',
    routes: [
      {
        meta: 'Главная',
        path: '/',
        component: Main,
      },
      {
        meta: 'Регистрация',
        path: '/login',
        component: Login,
        alias: '/register'
      },
      {
        meta: 'Восстановление',
        path: '/recovery',
        component: PasswordRecovery
      },
      {
        meta: 'О компании',
        path: '/about',
        component: DemoAbout
      },
      {
        meta: 'Обратная связь',
        path: '/feedback',
        component: Feedback
      },
      {
        meta: 'Калькулятор',
        path: '/calculator',
        component: Calculator
      },
      // {
      //   meta: 'Демонстрационная страница',
      //   path: '/coronavirus',
      //   component: DemoPage
      // },
      {
        meta: 'Карусель',
        path: '/demo-carousel',
        component: DemoCarousel
      },
      {
        meta: 'Кабинет',
        path: '/cabinet',
        component: Cabinet,
        redirect: '/cabinet/dashboard',
        children: [
          {
            path: 'dashboard',
            component: Dashboard
          },
          {
            path: ':idModule/:idParent/:idItem',
            component: Fluid
          }
        ]
      },
      {
        path: '/*',
        component: DynamicRoutesRenderer
      },
    ]
  })
}
