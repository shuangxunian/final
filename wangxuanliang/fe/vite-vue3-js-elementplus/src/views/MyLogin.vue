<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const loginForm = ref({
  userid: '203401010101',
  password: '123456'
})
const formLabelWidth = ref(100)
const addUserForm = ref({
  userid: '',
  username: '',
  password: '',
})
const addUserDialog = ref(false)

function resetLoginForm() {
  loginForm.value.userid = '203401010101'
  loginForm.value.password = '123456'
}

function clearForm() {}

async function login () {
  if (loginForm.value.userid === '') return ElMessage.error('请输入账号')
  if (loginForm.value.password === '') return ElMessage.error('请输入密码')
  const { data } = await axios.post('http://localhost:3000/user/login', loginForm.value)
  if (data.code === 2) {
    ElMessage({
      message: '登录成功',
      type: 'success',
    })
    window.sessionStorage.setItem('userid', data.body.userid)
    window.sessionStorage.setItem('roleType', data.body.roleType)
    window.sessionStorage.setItem('belong', data.body.belong)
    window.sessionStorage.setItem('username', data.body.username)
    router.push('/home')
  } else {
    return ElMessage.error(data.msg)
  }
}

async function addUser() {
  if (addUserForm.value.userid === '') return ElMessage.error('手机号不能为空！')
  if (addUserForm.value.username === '') return ElMessage.error('姓名不能为空！')
  if (addUserForm.value.password === '') return ElMessage.error('密码不能为空！')
  const { data } = await axios.post('http://localhost:3000/user/add', {
    ...addUserForm.value,
    roleType: '3'
  })
  if (data.code === 2) {
    ElMessage({
      message: '新建成功',
      type: 'success',
    })
    ElMessage({
      message: '登录成功',
      type: 'success',
    })
    window.sessionStorage.setItem('userid', addUserForm.value.userid)
    window.sessionStorage.setItem('roleType', '3')
    router.push('/home')
  } else {
    return ElMessage.error(data.msg)
  }
}

// function add () {}

</script>


<template>
  <div class="about">
    <div class="login_box">
      <h3 align="center">基于电子地图的宽带运营管理系统</h3>
      <!-- 登录表单区域 -->
      <el-form ref="loginFormRef" :model="loginForm" label-width="0px" class="login_form">
        <!-- 用户名 -->
        <el-form-item prop="phone">
          <el-input v-model="loginForm.userid" placeholder="请输入手机号/工号"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" placeholder="请输入密码" type="password"></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item>
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
          <el-button type="info" @click="addUserDialog = true">注册账号</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-dialog v-model="addUserDialog" title="注册" width="500" @close="clearForm">
      <el-form :model="addUserForm">
        <el-form-item label="手机号" :label-width="formLabelWidth">
          <el-input v-model="addUserForm.userid" />
        </el-form-item>
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="addUserForm.username" />
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="addUserForm.password"/>
        </el-form-item>

      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="addUser">新建</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="less" scoped>
.about {
  width: 100%;
  height: 100%;
  background-image: linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%);
  .login_box{
    width: 450px;
    height: 220px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .login_form {
    position: absolute;
    // top: 100px;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
}
</style>
