import Vue from 'vue'
import Router from 'vue-router'

import MyPage from '~/components/Logo'
import About from '~/components/about'

Vue.use(Router)

export function createRouter() {
  return new Router({
    mode: 'history',
    routes: [
      {
        path: '/',
        component: MyPage
      },
      {
        path: '/about',
        component: About
      }
    ]
  })
}
