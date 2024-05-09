import { createRouter, createWebHistory } from 'vue-router'
import MyLogin from '../views/MyLogin.vue'
import MyHome from '../views/MyHome.vue'

import Users from '../views/Users.vue'
import info from '../views/info.vue'
import adminUsers from '../views/adminUsers.vue'
import adminCollege from '../views/adminCollege.vue'
import adminClass from '../views/adminClass.vue'
import adminWord from '../views/adminWord.vue'
import teacherUsers from '../views/teacherUsers.vue'
import teacherClass from '../views/teacherClass.vue'
import student from '../views/student.vue'
import myword from '../views/myword.vue'

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
        { path: '/adminCollege', component: adminCollege },
        { path: '/adminClass', component: adminClass },
        { path: '/adminWord', component: adminWord },
        { path: '/teacherUsers', component: teacherUsers },
        { path: '/teacherClass', component: teacherClass },
        { path: '/users', component: Users },
        { path: '/info', component: info },
        { path: '/student', component: student },
        { path: '/myword', component: myword }
      ]
    },
  ]
})

export default router
