import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'
import MyLogin from '../views/MyLogin.vue'
import MyHome from '../views/MyHome.vue'

import Users from '../views/Users.vue'
import Info from '../views/Info.vue'
import adminUsers from '../views/adminUsers.vue'
import adminClass from '../views/adminClass.vue'
import studentUsers from '../views/studentUsers.vue'
import classList from '../views/classList.vue'
import allClass from '../views/allClass.vue'
import myClass from '../views/myClass.vue'

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
        { path: '/adminUsers', component: adminUsers },
        { path: '/adminClass', component: adminClass },
        { path: '/studentUsers', component: studentUsers },
        { path: '/classList', component: classList },
        { path: '/allClass', component: allClass },
        { path: '/myClass', component: myClass },
        { path: '/users', component: Users },
        { path: '/info', component: Info }
      ]
    },
  ]
})

export default router
