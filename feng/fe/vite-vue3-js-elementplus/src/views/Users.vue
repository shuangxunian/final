<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import OSS from 'ali-oss'

const leftUrl = ref('')
const rightUrl = ref('')
const aiUrl = ref('')
const num = ref(0)
const id = ref('')
const loading = ref(false)

const leftUploadRequest = async (options) => {
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
  client.put("uploads/"+fileNames, file).then(async res=>{
    if (res.res.statusCode === 200) {
      leftUrl.value = res.url
      // res.url
    }else {
      ElMessage.error('上传失败')
    }
  })
}

const rightUploadRequest = async (options) => {
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
  client.put("uploads/"+fileNames, file).then(async res=>{
    if (res.res.statusCode === 200) {
      rightUrl.value = res.url
    }else {
      ElMessage.error('上传失败')
    }
  })
}

const getFlyData = async(model) => {
  if (leftUrl.value === '' || rightUrl.value === '') {
    ElMessage.error('请上传图片')
    return
  }
  loading.value = true
  const flyData = await axios.post('http://localhost:3000/option/getImgData', {
    id: id.value,
    model,
    leftUrl: leftUrl.value,
    rightUrl: rightUrl.value
  })
  if (flyData.data.code === 2) {
    aiUrl.value = flyData.data.body
    num.value--
    loading.value = false
    ElMessage.success('合成成功')
  }else {
    ElMessage.error('合成失败')
  }
}

onMounted(async() => {
  id.value = window.sessionStorage.getItem('id')
  num.value = window.sessionStorage.getItem('num')
  // await getFlyData()
})

</script>

<template>
  <div class="user">
    <div v-loading="loading" class="user-input">
      <div class="img left">
        <h2 v-if="leftUrl === ''" align="center">请选择左侧图片</h2>
        <el-upload v-else
          class="upload-text"
          :show-file-list="false"
          :http-request="leftUploadRequest">
          <el-button link type="primary" size="small">重新上传</el-button>
        </el-upload>
        <el-upload v-if="leftUrl === ''"
          class="upload-css"
          :show-file-list="false"
          :http-request="leftUploadRequest">
          <el-icon><Plus /></el-icon>
        </el-upload>
        <div v-else class="img-css">
          <el-image :src="leftUrl" fit="contain"></el-image>
        </div>
      </div>
      <div class="join">
        <p>可用次数：{{ num }}</p>
        <div class="my-btn">
          <!-- <el-button type="primary" @click="getFlyData(1)">模型1合成</el-button> -->
          <el-button :disabled="num === '0'" type="primary" @click="getFlyData(1)">模型1合成</el-button>
        </div>
        <div class="my-btn">
          <el-button :disabled="num === '0'" type="primary" @click="getFlyData(2)">模型2合成</el-button>
        </div>
        <div class="my-btn">
          <el-button :disabled="num === '0'" type="primary" @click="getFlyData(3)">模型3合成</el-button>
        </div>
      </div>
      <div class="img right">
        <h2 v-if="rightUrl === ''" align="center">请选择右侧图片</h2>
        <el-upload v-else
          class="upload-text"
          :show-file-list="false"
          :http-request="rightUploadRequest">
          <el-button link type="primary" size="small">重新上传</el-button>
        </el-upload>
        <el-upload v-if="rightUrl === ''"
          class="upload-css"
          :show-file-list="false"
          :http-request="rightUploadRequest">
          <el-icon><Plus /></el-icon>
        </el-upload>
        <div v-else class="img-css">
          <el-image :src="rightUrl" fit="contain"></el-image>
        </div>
      </div>
    </div>
    <div class="ai-out">
      <h2 align="center" style="width: 100%">结果：</h2>
      <img class="my-img" v-if="aiUrl" :src="aiUrl"/>
    </div>
  </div>
</template>

<style lang="less" scoped>
.user {
  width: 100%;
  height: 100%;
  background-color: #fff;
  .user-input {
    width: 100%;
    display: flex;
    justify-content: space-around;
    .img {
      width: 400px;
      height: 400px;
      .upload-text {
        margin: 10px 0;
        width: 100%;
      }
      .upload-css {
        width: 140px;
        height: 140px;
        border: 1px solid #ccc;
        border-radius: 10%;
        margin: 0 auto;
        display: flex;
        justify-content: center;
        .el-icon {
          font-size: 40px;
        }
      }
      .img-css {
        margin: 0 auto;
        max-height: 300px;
        max-width: 400px;
        display: flex;
        justify-content: center;
      }
    }
    .join {
      margin: 40px 0;
      .my-btn{
        margin-top: 10px;
        display: flex;
        justify-content: center;
      }
    }
  }
  .ai-out {
    margin: 0 auto;
    max-height: 450px;
    max-width: 100%;
    display: flex;
    justify-content: center;
    flex-wrap:wrap;
    .my-img {
      max-height: 370px;
      max-width: 100%;
    }
  }
}
</style>
