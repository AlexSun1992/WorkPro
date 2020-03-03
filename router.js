import Vue from 'vue'
import Router from 'vue-router'

import Main from '~/components/Pages/Main'
import About from '~/components/Pages/About'
import Feedback from '~/components/Pages/Feedback'
import Calculator from '~/components/Pages/Calculator'

import Cabinet from '~/components/Pages/Cabinet/Full'
import Profile from '~/components/Pages/Cabinet/Profile'
import RegPolicy from '~/components/Pages/Cabinet/RegPolicy'
import Policies from '~/components/Pages/Cabinet/Policies'
import Agents from '~/components/Pages/Cabinet/Agents'

import Login from '~/components/Pages/Login/LoginPage'

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
        redirect: '/cabinet/policies',
        children: [
          {
            meta: 'Профиль',
            path: 'profile',
            component: Profile
          },
          {
            meta: 'Полисы',
            path: 'policies',
            component: Policies
          },
          {
            meta: 'Агенты',
            path: 'agents',
            component: Agents
          },
          {
            meta: 'Оформление полиса',
            path: 'reg-policy/:calcId',
            component: RegPolicy
          }
        ]
      }
    ]
  })
}
