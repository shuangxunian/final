import { createRouter, createWebHistory } from 'vue-router'
import MyLogin from '../views/MyLogin.vue'
import MyHome from '../views/MyHome.vue'

import Users from '../views/Users.vue'
import info from '../views/info.vue'
import adminClass from '../views/adminClass.vue'
import adminUsers from '../views/adminUsers.vue'
import teacherUsers from '../views/teacherUsers.vue'
import teacherClass from '../views/teacherClass.vue'
import student from '../views/student.vue'

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
        { path: '/teacherUsers', component: teacherUsers },
        { path: '/teacherClass', component: teacherClass },
        { path: '/users', component: Users },
        { path: '/info', component: info },
        { path: '/student', component: student }
      ]
    },
  ]
})

export default router
