import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'
import MyLogin from '../views/MyLogin.vue'
import userLogin from '../views/userLogin.vue'
import userTalk from '../views/userTalk.vue'
import MyHome from '../views/MyHome.vue'

import Info from '../views/Info.vue'
import foodList from '../views/foodList.vue'
import recipeList from '../views/recipeList.vue'
import adminHome from '../views/adminHome.vue'
import buyList from '../views/buyList.vue'
import userList from '../views/userList.vue'
import Users from '../views/Users.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: MyLogin },
    { path: '/userLogin', component: userLogin },
    { path: '/userTalk', component: userTalk },
    {
      path: '/home',
      component: MyHome,
      children: [
        { path: '/home', redirect: '/users' },
        { path: '/users', component: Users },
        { path: '/foodList', component: foodList },
        { path: '/recipeList', component: recipeList },
        { path: '/adminHome', component: adminHome },
        { path: '/buyList', component: buyList },
        { path: '/userList', component: userList },
        { path: '/info', component: Info }
      ]
    },
  ]
})

export default router
