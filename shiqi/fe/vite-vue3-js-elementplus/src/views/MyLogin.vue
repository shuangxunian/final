<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import OSS from 'ali-oss'

const flag = ref(false)
const router = useRouter()
const loginForm = ref({
  id: 'admin',
  password: '123456',
  imgUrl: ''
})

function resetLoginForm() {
  loginForm.value.id = 'admin'
  loginForm.value.password = '123456'
}

const handleAvatarSuccess = function (res) {
  if (res) console.log(res.url)
}

const beforeAvatarUpload = function (file) {
  const isJPG = file.type === 'image/jpeg';
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isJPG) {
    ElMessage.error('上传头像图片只能是 JPG 格式!');
  }
  if (!isLt2M) {
    ElMessage.error('上传头像图片大小不能超过 2MB!');
  }
  return isJPG && isLt2M;
}

async function login () {
  // if (flag.value) {
  //   if (loginForm.value.imgUrl === '') {
  //     ElMessage.error('请上传照片')
  //     return
  //   }
  // }
  const { data } = await axios.post('http://localhost:3000/user/login', loginForm.value)
  if (data.code === 2) {
    window.sessionStorage.setItem('id', loginForm.value.id)
    window.sessionStorage.setItem('name', data.body.name)
    router.push('/home')
  } else {
    ElMessage.error(data.msg)
  }
}


const fnUploadRequest = async function (options) {
  console.log(import.meta.env.VUE_APP_OSSId)
  const client= new OSS({
    accessKeyId: import.meta.env.VITE_OSSId,  // 查看你自己的阿里云KEY
    accessKeySecret: import.meta.env.VITE_OSSSecret, // 查看自己的阿里云KEYSECRET
    bucket: 'sxntest', // 你的 OSS bucket 名称
    region: 'oss-cn-beijing', // bucket 所在地址，我的是 华北2 北京
  })

  let file = options.file; // 拿到 file
  let fileName = file.name.substr(0,file.name.lastIndexOf('.'))
  let date = new Date().getTime()
  let fileNames = `${date}_${fileName}` // 拼接文件名，保证唯一，这里使用时间戳+原文件名
  // 上传文件,这里是上传到OSS的 uploads文件夹下
  client.put("uploads/"+fileNames, file).then(res=>{
    if (res.res.statusCode === 200) {
      loginForm.value.imgUrl = res.url
      console.log(res)
      // options.onSuccess(res)
    }else {
      console.log('error')
      // options.onError("上传失败")
    }
  })
}

onMounted(async() => {
  const { data } = await axios.post('http://localhost:3000/date/today', {})
  console.log(data)
  if(data.info?.length) {
    flag.value = true
  }
})


</script>


<template>
  <div class="about">
    <div class="login_box">
      <h3 align="center">医药企业库存管理系统</h3>
      <!-- 登录表单区域 -->
      <el-form ref="loginFormRef" :model="loginForm" label-width="100px" class="login_form">
        <!-- 用户名 -->
        <el-form-item prop="phone" label="个人工号" >
          <el-input v-model="loginForm.id" placeholder="请输入员工工号"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password" label="个人密码" >
          <el-input v-model="loginForm.password" placeholder="请输入密码" type="password"></el-input>
        </el-form-item>
        <el-form-item v-if="flag" label="个人照片" >
          <el-upload
              class=""
              action=""
              :show-file-list="false"
              :http-request="fnUploadRequest"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
            <!-- <el-image v-if="loginForm.imgUrl" :src="loginForm.imgUrl" class="avatar" alt=""/> -->
            <el-button :disabled="loginForm.imgUrl !== ''" type="primary">点此上传</el-button>
            <!-- <i v-else class="el-icon-plus avatar-uploader-icon"></i> -->
          </el-upload>
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
  background-image: url('../../public/back.png');
  background-size: cover;
  background-position: center;
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
