<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'


const route = useRoute()
const router = useRouter()
const userid = ref('')
const menus = ref([])

function handleSelect(key, keyPath) {
  router.push('/' + key)
}

function logout() {
  window.sessionStorage.clear()
  router.push('/login')
}

onMounted(() => {
  userid.value = window.sessionStorage.getItem('id')
  console.log()
  if (userid.value === 'admin') {
    menus.value = [
      {
        value: "product",
        name: "产品"
      },{
        value: "crm",
        name: "入库"
      },{
        value: "sell",
        name: "卖出"
      },{
        value: "user",
        name: "用户管理"
      },
      {
        value: "option",
        name: "操作记录"
      },
      {
        value: "info",
        name: "个人信息"
      }
    ]
  } else {
    menus.value = [
      {
        value: "product",
        name: "产品"
      },{
        value: "crm",
        name: "入库"
      },{
        value: "sell",
        name: "卖出"
      },{
        value: "info",
        name: "个人信息"
      }
    ]

  }
})

</script>

<template>
  <div class="home-container">
    <div class="header">
      <div class="title">
        <span>医药跟踪与库存管理系统</span>
      </div>
      <div class="options">
        <el-button type="info" @click="logout">退出</el-button>
      </div>
    </div>
    <div class="body">
      <div class="left">
        <el-menu
          :default-active="menus[0]?.value"
          class="el-menu-vertical-demo"
          @select="handleSelect"
        >
          <el-menu-item v-for="menu in menus" :key="menu.value" :index="menu.value">
            <el-icon><Menu /></el-icon>
            <span>{{ menu.name }}</span>
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
      width: 200px;
      height: 100%;
      background-color: #fff
    }
    .right {
      margin: 10px;
      width: calc(100% - 220px);
      height: calc(100% - 20px);
    }
  }
}
</style>
