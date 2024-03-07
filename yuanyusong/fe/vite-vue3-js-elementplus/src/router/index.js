import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'
import MyLogin from '../views/MyLogin.vue'
import MyHome from '../views/MyHome.vue'

import Users from '../views/Users.vue'
import Info from '../views/Info.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: MyLogin },
    {
      path: '/home',
      component: MyHome,
      children: [
        { path: '/home', redirect: '/users' },
        { path: '/users', component: Users },
        { path: '/info', component: Info }
      ]
    },
  ]
})

export default router
