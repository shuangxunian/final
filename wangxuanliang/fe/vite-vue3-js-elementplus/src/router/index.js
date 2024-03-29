import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'
import MyLogin from '../views/MyLogin.vue'
import MyHome from '../views/MyHome.vue'

import Users from '../views/Users.vue'
import adminAddress from '../views/adminAddress.vue'
import adminUser from '../views/adminUser.vue'
import serverAddress from '../views/serverAddress.vue'
import serverUser from '../views/serverUser.vue'
import serverList from '../views/serverList.vue'
import maintainAddress from '../views/maintainAddress.vue'
import maintainBuild from '../views/maintainBuild.vue'
import maintainFix from '../views/maintainFix.vue'
import userBuild from '../views/userBuild.vue'
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
        { path: '/adminAddress', component: adminAddress },
        { path: '/adminUser', component: adminUser },
        { path: '/serverAddress', component: serverAddress },
        { path: '/serverUser', component: serverUser },
        { path: '/serverList', component: serverList },
        { path: '/maintainAddress', component: maintainAddress },
        { path: '/maintainBuild', component: maintainBuild },
        { path: '/maintainFix', component: maintainFix },
        { path: '/userBuild', component: userBuild },
        { path: '/info', component: Info }
      ]
    },
  ]
})

export default router
