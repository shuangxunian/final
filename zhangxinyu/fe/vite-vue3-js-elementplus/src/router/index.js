import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'
import MyLogin from '../views/MyLogin.vue'
import MyHome from '../views/MyHome.vue'

import charts from '../views/charts.vue'
import charts1 from '../views/charts1.vue'
import charts2 from '../views/charts2.vue'
import Users from '../views/Users.vue'
import Options from '../views/Options.vue'
import DataList from '../views/DataList.vue'
import Data1List from '../views/Data1List.vue'
import Data2List from '../views/Data2List.vue'
import Data3List from '../views/Data3List.vue'
import Data4List from '../views/Data4List.vue'
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
        { path: '/charts', component: charts },
        { path: '/charts1', component: charts1 },
        { path: '/charts2', component: charts2 },
        { path: '/options', component: Options },
        { path: '/dataList', component: DataList },
        { path: '/data1List', component: Data1List },
        { path: '/data2List', component: Data2List },
        { path: '/data3List', component: Data3List },
        { path: '/data4List', component: Data4List },
        { path: '/info', component: Info }
      ]
    },
  ]
})

export default router
