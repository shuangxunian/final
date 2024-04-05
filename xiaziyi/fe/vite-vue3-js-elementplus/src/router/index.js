import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'
import MyLogin from '../views/MyLogin.vue'
import MyHome from '../views/MyHome.vue'

import adminKnow from '../views/adminKnow.vue'
import adminKnowList from '../views/adminKnowList.vue'
import adminTest from '../views/adminTest.vue'
import adminClass from '../views/adminClass.vue'
import adminQuestion from '../views/adminQuestion.vue'
import adminUser from '../views/adminUser.vue'
import masterUser from '../views/masterUser.vue'
import testList from '../views/testList.vue'
import userClass from '../views/userClass.vue'
import userTest from '../views/userTest.vue'
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
        { path: '/adminClass', component: adminClass },
        { path: '/adminQuestion', component: adminQuestion },
        { path: '/adminUser', component: adminUser },
        { path: '/masterUser', component: masterUser },
        { path: '/adminKnow', component: adminKnow },
        { path: '/adminKnowList', component: adminKnowList },
        { path: '/adminTest', component: adminTest },
        { path: '/userClass', component: userClass },
        { path: '/testList', component: testList },
        { path: '/userTest', component: userTest },
        { path: '/info', component: Info }
      ]
    },
  ]
})

export default router
