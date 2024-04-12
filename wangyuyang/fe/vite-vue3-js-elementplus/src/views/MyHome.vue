<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'


const route = useRoute()
const router = useRouter()

onMounted(() => {
  router.push('/users')
})

function handleSelect(key, keyPath) {
  if (key === '1') {
    router.push('/users')
  } else if (key === '2') {
    router.push('/info')
  }
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
        <span>肤质管理后台</span>
      </div>
      <div class="options">
        <el-button type="info" @click="logout">退出</el-button>
      </div>
    </div>
    <div class="body">
      <div class="left">
        <el-menu
          default-active="1"
          class="el-menu-vertical-demo"
          @select="handleSelect"
        >
          <el-menu-item index="1">
            <el-icon><Menu /></el-icon>
            <span>用户管理</span>
          </el-menu-item>
          <el-menu-item index="2">
            <el-icon><Menu /></el-icon>
            <span>化妆品管理</span>
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
      width: 240px;
      height: 100%;
      background-color: #fff
    }
    .right {
      width: calc(100% - 240px);
      height: 100%;
    }
  }
}
</style>
