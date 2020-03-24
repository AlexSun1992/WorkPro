import Vue from 'vue'
import Router from 'vue-router'

import Main from '~/components/Pages/Main'
import About from '~/components/Pages/About'
import Feedback from '~/components/Pages/Feedback'
import Calculator from '~/components/Pages/Calculator'

import Cabinet from '~/components/Pages/Cabinet/Full'
import Dashboard from '~/components/Pages/Cabinet/Dashboard'
import Fluid from '~/components/Pages/Cabinet/Fluid'

import Login from '~/components/Pages/Login/LoginPage'
import PasswordRecovery from '~/components/Pages/Login/PasswordRecoveryForm/PasswordRecoveryForm'

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
        component: About
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
      }
    ]
  })
}
