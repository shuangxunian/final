<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()
const loginForm = ref({
  id: '13012345672',
  password: '123456'
})

async function login () {
  const { data } = await axios.post('http://localhost:3000/user/login', loginForm.value)
  if (data.code === 2) {
    if (data.body.roleType === 2) {
      window.sessionStorage.setItem('id', data.body.id)
      router.push('/userTalk')
    }
    else {
      return ElMessage.error('此入口为家长入口，请使用家长账号登录')
    }
    // console.log(typeof data.body.roleType)
    // window.sessionStorage.setItem('username', data.body.username)
    // window.sessionStorage.setItem('roleType', data.body.roleType)
    // router.push('/home')
  } else {
    return ElMessage.error(data.msg)
  }
}


</script>


<template>
  <div class="about">
    <div class="login_box">
      <h3 align="center">幼儿园家长登录平台</h3>
      <!-- 登录表单区域 -->
      <el-form ref="loginFormRef" :model="loginForm" label-width="0px" class="login_form">
        <!-- 用户名 -->
        <el-form-item prop="phone">
          <el-input v-model="loginForm.id" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" placeholder="请输入密码" type="password"></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item>
          <el-button type="primary" @click="login">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style lang="less" scoped>
.about {
  width: 100%;
  height: 100%;
  background: pink;
  background-size: cover;
  position: relative;
  .login_box{
    width: 350px;
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
