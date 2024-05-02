<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import OSS from 'ali-oss'

const foodList = ref([])
const buyList = ref([])
const tableData = ref([])
const addBuyDialog = ref(false)
const form = ref({
  foodid: '',
  foodfrom: '',
  imgUrl: ''
})
const formLabelWidth = '140px'

function getToday() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const addBuy = async () => {
  if (form.value.foodid === '' || form.value.foodfrom === '' || form.value.imgUrl === '') {
    ElMessage.error('请填写完整信息')
    return
  }
  const today = getToday()
  // console.log(form.value)
  const { data } = await axios.post('http://localhost:3000/dateBuy/add', {
    date: today,
    ...form.value
  })
  if (data.code === 2) {
    ElMessage.success('添加成功')
    await dateBuyList()
    addBuyDialog.value = false
  }else {
    ElMessage.error('添加失败')
  }
}

const refreshForm = () => {
  form.value = {
    foodid: '',
    foodfrom: '',
    imgUrl: ''
  }
}

const handleAvatarSuccess = (res, file) => {}

const beforeAvatarUpload = (file) => {
  const isJPG = file.type === 'image/jpeg'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG) {
    ElMessage.error('上传头像图片只能是 JPG 格式!')
  }
  if (!isLt2M) {
    ElMessage.error('上传头像图片大小不能超过 2MB!')
  }
  return isJPG && isLt2M
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
      form.value.imgUrl = res.url
    }
  })
}

const dateBuyList = async () => {
  const { data } = await axios.post('http://localhost:3000/dateBuy/allData', {})
  if (data.code === 2) {
    const foodMap = {}
    foodList.value.forEach(item => {
      foodMap[item.id] = item.name
    })
    buyList.value = data.body.map(item => {
      return {
        ...item,
        name: foodMap[item.foodid]
      }
    })
    tableData.value = buyList.value
  }
}

const getFoodList = async() => {
  const { data } = await axios.post('http://localhost:3000/food/allData', {})
  if (data.code === 2) {
    foodList.value = data.body
  }
}

onMounted(async() => {
  await getFoodList()
  await dateBuyList()
})

</script>

<template>
  <div class="admin-home">
    <div class="header">
      <el-button style="margin-left: 10px" type="primary" @click="addBuyDialog = true">新建采购记录</el-button>
    </div>
    <div class="body">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="name" label="食材名称"/>
        <el-table-column prop="date" label="入库时间"/>
        <el-table-column prop="foodfrom" label="来源"/>
        <el-table-column prop="imgUrl" label="照片">
          <template #default="scope">
            <el-image 
              :preview-teleported="true"
              :preview-src-list="[scope.row.imgUrl]"
              :src="scope.row.imgUrl"
              style="width: 100px; height: 100px"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>


    <el-dialog v-model="addBuyDialog" title="添加采购记录" width="500" @close="refreshForm">
      <el-form :model="form">
        <el-form-item label="食材" :label-width="formLabelWidth">
          <el-select v-model="form.foodid" placeholder="请选择">
            <el-option
              v-for="item in foodList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="来源" :label-width="formLabelWidth">
          <el-input v-model="form.foodfrom"/>
        </el-form-item>
        <el-form-item label="图片" :label-width="formLabelWidth">
          <el-upload
              :show-file-list="false"
              :http-request="fnUploadRequest"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
            <el-button v-if="form.imgUrl === ''" type="primary">点此上传</el-button>
            <img v-else style="width: 100px; height: 100px" :src="form.imgUrl" alt="">
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addBuyDialog = false">取消</el-button>
          <el-button type="primary" @click="addBuy">添加</el-button>
        </div>
      </template>
    </el-dialog>

  </div>
</template>

<style lang="less" scoped>
.admin-home {
  height: 100%;
  width: 100%;
  background-color: #fff;
  .header {
    height: 70px;
    line-height: 70px;
  }
  .body {
    height: 700px;
    width: calc(100% - 20px);
    padding: 10px;
  }
}
</style>
