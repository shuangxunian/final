<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import OSS from 'ali-oss'
import qs from 'qs'

const findData = ref('')
const tableData = ref([])
const userList = ref([])
const addUserDialog = ref(false)
const editUserDialog = ref(false)

const addForm = ref({
  id: '',
  name: '',
  password: '123456',
  optionTime: 0,
  imgUrl: ''
})
const formLabelWidth = ref(100)

const getList = function () {
  tableData.value = []
  userList.value.forEach(item => {
    if (item.id.indexOf(findData.value) !== -1
    || item.name.indexOf(findData.value) !== -1) {
      tableData.value.push(item)
    }
  })
}

const editData = function (row) {
  addForm.value = row
  editUserDialog.value = true
}

const makeSureDel = async function (row) {
  if (row.id === 'admin') return ElMessage.error('不能删除管理员！')
  const { data } = await axios.post('http://localhost:3000/user/del', {
    id: row.id
  })
  if (data.code === 4) return ElMessage.error(data.msg)
  ElMessage({
    message: '删除成功！',
    type: 'success',
  })
  getTableData()
}


const deleteData = function () {}

const addUser = function () {
  addUserDialog.value = true
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
      addForm.value.imgUrl = res.url
      console.log(res)
      // options.onSuccess(res)
    }else {
      console.log('error')
      // options.onError("上传失败")
    }
  })
}

const clearFrom = function () {
  addForm.value = {
    id: '',
    name: '',
    password: '123456',
    optionTime: 0,
    imgUrl: ''
  }
}

const dontAddUser = function () {
  clearFrom()
}

const makeSureAddUser = async function () {
  if (addForm.value.id === '') return ElMessage.error('请输入用户工号')
  if (addForm.value.imgUrl === '') return ElMessage.error('请上传用户头像')
  let userImg = ''
  tableData.value.forEach(item => {
    if (item.id === addForm.value.id) {
      userImg = item.imgUrl
    }
  })
  const { data } = await axios.post('https://api-cn.faceplusplus.com/facepp/v3/compare', qs.stringify({
    api_key: import.meta.env.VITE_APIKey,
    api_secret: import.meta.env.VITE_APISecret,
    image_url1: userImg,
    image_url2: addForm.value.imgUrl,
  }))
  if (data.confidence < 80) {
    ElMessage.error('警告，人脸识别失败，照片与此员工不匹配！')
  } else {
    ElMessage({
      message: '此员工存在',
      type: 'success',
    })
  }
}

const makeSureEditUser = async function () {
  if (addForm.value.name === '') return ElMessage.error('请输入用户名')
  if (addForm.value.imgUrl === '') return ElMessage.error('请上传用户头像')

  const { data } = await axios.post('http://localhost:3000/user/edit', {
    ...addForm.value,
  })
  if (data.code === 4) return ElMessage.error(data.msg)
  ElMessage({
    message: '修改成功！',
    type: 'success',
  })
  editUserDialog.value = false
  getTableData()
}

 


const getTableData = async function () {
  const { data } = await axios.post('http://localhost:3000/user/allData', {})
  if (data.code === 2) {
    userList.value = data.info
    tableData.value = data.info
  }
}

const getOSS = function () {

}

onMounted(() => {
  getTableData()
  getOSS()
})

</script>

<template>
  <div class="product">
    <div class="header">
      <div class="left">
        <el-input v-model="findData" style="width: 240px" placeholder="请输入内容" />
        <el-button @click="getList">筛选</el-button>
      </div>
      <div class="right">
        <el-button type="primary" @click="addUser">人脸识别</el-button>
      </div>
    </div>
    <div class="body">
      <el-table :data="tableData" border style="width: 100%" max-height="600">
        <el-table-column prop="id" label="用户工号" width="120" />
        <el-table-column prop="name" label="用户昵称" width="300" />
        <!-- <el-table-column prop="optionTime" label="操作次数" /> -->
        <el-table-column label="个人头像">
          <template #default="scoped">
            <el-image
              :preview-teleported="true"
              :preview-src-list="[scoped.row.imgUrl]"
              :src="scoped.row.imgUrl"
              style="width: 60px; height: 60px"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="addUserDialog" title="添加用户" width="500" @close="clearFrom">
      <el-form :model="addForm">
        <el-form-item label="用户工号" :label-width="formLabelWidth">
          <el-select v-model="addForm.id" placeholder="请选择" style="width: 240px">
            <el-option
              v-for="item in tableData"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="个人照片" :label-width="formLabelWidth">
          <el-upload
              class=""
              action=""
              :show-file-list="false"
              :http-request="fnUploadRequest"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
            <el-image v-if="addForm.imgUrl" :src="addForm.imgUrl" class="avatar" alt=""/>
            <el-button v-else type="primary">点此上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addUserDialog = false">取消</el-button>
          <el-button type="primary" @click="makeSureAddUser">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="less" scoped>
.product {
  height: 100%;
  width: 100%;
  background-color: #fff;
  .header {
    height: 60px;
    display: flex;
    justify-content: space-between;
    padding: 0 10px;
    line-height: 60px;
  }
  .body {
    padding: 0 10px;
  }
  .avatar {
    width: 60px;
    height: 60px;
  }
}
</style>
