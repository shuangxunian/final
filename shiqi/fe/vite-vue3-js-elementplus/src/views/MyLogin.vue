<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const router = useRouter()
const loginForm = ref({
  id: 'admin',
  password: '123456'
})

function resetLoginForm() {
  loginForm.value.id = 'admin'
  loginForm.value.password = '123456'
}

async function login () {
  const { data } = await axios.post('http://localhost:3000/user/login', loginForm.value)
  if (data.code === 2) {
    window.sessionStorage.setItem('id', loginForm.value.id)
    window.sessionStorage.setItem('userName', loginForm.value.userName)
    router.push('/home')
  } else {
    ElMessage.error(data.msg)
  }
}


</script>


<template>
  <div class="about">
    <div class="login_box">
      <h3 align="center">医药企业库存管理系统</h3>
      <!-- 登录表单区域 -->
      <el-form ref="loginFormRef" :model="loginForm" label-width="0px" class="login_form">
        <!-- 用户名 -->
        <el-form-item prop="phone">
          <el-input v-model="loginForm.id" placeholder="请输入员工工号"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" placeholder="请输入密码" type="password"></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item>
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
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
