import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'
import MyLogin from '../views/MyLogin.vue'
import MyHome from '../views/MyHome.vue'

import Product from '../views/Product.vue'
import CRM from '../views/CRM.vue'
import User from '../views/User.vue'
import Option from '../views/Option.vue'
import Sell from '../views/Sell.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: MyLogin },
    { path: '/home', redirect: '/product' },
    {
      path: '/home',
      component: MyHome,
      children: [
        { path: '/', redirect: '/product' },
        { path: '/product', component: Product },
        { path: '/crm', component: CRM },
        { path: '/user', component: User },
        { path: '/option', component: Option },
        { path: '/sell', component: Sell }
      ]
    },
  ]
})

export default router
