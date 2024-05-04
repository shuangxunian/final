<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const id = ref('')
const dialogFormVisible = ref(false)
const form = ref({
  oldPwd: '',
  newPwd1: '',
  newPwd2: '',
})

const refresh = function() {
  dialogFormVisible.value = false
  form.value.oldPwd = ''
  form.value.newPwd1 = ''
  form.value.newPwd2 = ''
}

const goPost = async function() {
  if (form.value.oldPwd === '') {
    return ElMessage.error('请输入旧密码！')
  } else if (form.value.newPwd1 === '') {
    return ElMessage.error('请输入新密码！')
  } else if (form.value.newPwd2 === '') {
    return ElMessage.error('请再次输入新密码！')
  } else if (form.value.newPwd2 !== form.value.newPwd1) {
    return ElMessage.error('两次密码不一致！')
  }
  const { data } = await axios.post('http://localhost:3000/user/fixPassword', {
    ...form.value,
    id: id.value
  })
  if (data.code === 2) {
    ElMessage({
      message: '修改成功！',
      type: 'success',
    })
    refresh()
  } else {
    ElMessage.error(data.msg)
  }
}

const routerList = ref([
  {
    index: "getData",
    name: "获取数据",
    icon: "Menu"
  },
  {
    index: "dataList",
    name: "数据列表",
    icon: "Menu"
  },
  {
    index: "modelRun",
    name: "模型",
    icon: "Menu"
  }
])

function handleSelect(key, keyPath) {
  router.push('/' + key)
}

function logout() {
  window.sessionStorage.clear()
  router.push('/login')
}

onMounted(() => {
  id.value = window.sessionStorage.getItem('id')
  if (id.value === 'admin') {
    routerList.value.push({
      index: "info",
      name: "用户信息",
      icon: "Menu"
    })
  }
  router.push('/' + routerList.value[0].index)
})


</script>

<template>
  <div class="home-container">
    <div class="header">
      <div class="title">
        <span>短文本情感分析系统</span>
      </div>
      <div class="options">
        <el-button @click="dialogFormVisible = true">修改密码</el-button>
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
    <el-dialog v-model="dialogFormVisible" title="修改密码" width="500" @close="refresh">
      <el-form :model="form">
        <el-form-item label="旧密码" label-width="120">
          <el-input v-model="form.oldPwd" placeholder="请输入旧密码" />
        </el-form-item>
        <el-form-item label="新密码" label-width="120">
          <el-input v-model="form.newPwd1" placeholder="请输入新密码" />
        </el-form-item>
        <el-form-item label="再次输入新密码" label-width="120">
          <el-input v-model="form.newPwd2" placeholder="请再次输入新密码" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="goPost">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
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
      padding: 10px;
      width: calc(100% - 220px);
      height: calc(100% - 20px);
    }
  }
}
</style>
