<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'


const route = useRoute()
const router = useRouter()

const routerList = ref([
  {
    index: "charts",
    name: "数据看板",
    icon: "Menu"
  },
  {
    index: "charts1",
    name: "用户增长率",
    icon: "Menu"
  },
  {
    index: "charts2",
    name: "区域分析",
    icon: "Menu"
  },
  {
    index: "users",
    name: "用户列表",
    icon: "Menu"
  },
  {
    index: "options",
    name: "用户操作记录",
    icon: "Menu"
  },
  // {
  //   index: "dataList",
  //   name: "数据列表",
  //   icon: "Menu"
  // },
  {
    index: "data1List",
    name: "识字规则库",
    icon: "Menu"
  },
  {
    index: "data2List",
    name: "笔顺动画库",
    icon: "Menu"
  },
  {
    index: "data3List",
    name: "组词造句库",
    icon: "Menu"
  },
  {
    index: "data4List",
    name: "演示视频库",
    icon: "Menu"
  },
  // {
  //   index: "info",
  //   name: "信息",
  //   icon: "Service"
  // },
])

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
        <span>识字帮后台</span>
      </div>
      <div class="options">
        <el-button type="info" @click="logout">退出</el-button>
      </div>
    </div>
    <div class="body">
      <div class="left">
        <el-menu
          :default-active="routerList[0].index"
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
