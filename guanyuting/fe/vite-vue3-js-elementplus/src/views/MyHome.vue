<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const userid = ref('')
// const classMap=ref({})

// async function getClassList() {
//   const { data } = await axios.post('http://localhost:3000/class/allData', {})
//   if (data.code === 2) {
//     classMap.value = {}
//     data.body.forEach(item => {
//       classMap.value[item.id] = item.name
//     })
//   }
// }

// const getStudentList = async () => {
//   await getClassList()
//   const { data } = await axios.post('http://localhost:3000/select_class/mySelect', {
//     studentid: userid.value
//   })
//   if (data.code === 2) {
//     routerList.value = []

//     data.body.forEach(item => {
//       routerList.value.push({
//         index: "student",
//         name: classMap.value[item.classid],
//         icon: "Menu"
//       })
//     })

//     routerList.value.push({
//       index: "info",
//       name: "个人信息",
//       icon: "Service"
//     })
//   }
// }

onMounted(async () => {
  userid.value = sessionStorage.getItem('id')
  roletype.value = window.sessionStorage.getItem('roletype')
  if (roletype.value === '0') {
    routerList.value = [
      {
        index: "adminUsers",
        name: "用户信息",
        icon: "Menu"
      },
      {
        index: "adminClass",
        name: "课程信息",
        icon: "Service"
      },
      {
        index: "info",
        name: "个人信息",
        icon: "Service"
      },
    ]
  } else if (roletype.value === '1') {
    routerList.value = [
      {
        index: "teacherUsers",
        name: "学生信息",
        icon: "Menu"
      },
      {
        index: "teacherClass",
        name: "课程信息",
        icon: "Menu"
      },
      {
        index: "info",
        name: "个人信息",
        icon: "Service"
      },
    ]
  } else {
    routerList.value = [
      {
        index: "student",
        name: "课程列表",
        icon: "Menu"
      },
      {
        index: "info",
        name: "个人信息",
        icon: "Service"
      },
    ]
    // await getStudentList()
  }
  router.push('/' + routerList.value[0].index)
})

const route = useRoute()
const router = useRouter()

const routerList = ref([])
const roletype = ref('0')

function handleSelect(key, keyPath) {
  router.push('/' + key)
}

function logout() {
  window.sessionStorage.clear()
  router.push('/login')
}


</script>

<template>
  <div class="home-container">
    <div class="header">
      <div class="title">
        <span>学生学习状态预警系统</span>
      </div>
      <div class="options">
        <el-button type="info" @click="logout">退出</el-button>
      </div>
    </div>
    <div class="body">
      <div class="left">
        <el-menu
          :default-active="routerList[0]?.index"
          class="el-menu-vertical-demo"
          @select="handleSelect"
        >
          <el-menu-item v-for="obj in routerList" :key="obj.index" :index="obj.index">
            <el-icon><component :is="obj.icon" /></el-icon>
            <span>{{ obj.name }}</span>
          </el-menu-item>
        </el-menu>
      </div>
      <div class="right">
        <router-view/>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.home-container {
  height: 100%;
  background-color: #eee;
  .header {
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: space-between;
    background-color: #fff;
    .title {
      margin-left: 20px;
      line-height: 40px;
    }
    .options {
      margin-right: 20px;
      margin-top: 4px;
    }
  }
  .body {
    width: 100%;
    height: calc(100% - 40px);
    display: flex;
    .left {
      width: 150px;
      height: 100%;
      background-color: #fff
    }
    .right {
      width: calc(100% - 170px);
      height: calc(100% - 20px);
      margin: 10px;
    }
  }
}
</style>
