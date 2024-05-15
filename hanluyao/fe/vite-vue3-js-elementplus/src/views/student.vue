<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import OSS from 'ali-oss'

const findData = ref('')
const form = ref({
  classname: '',
  wordname: '',
  url: ''
})
const wordList = ref([])
const needList = ref([])
const tableData = ref([])
const dialogFormVisible = ref(false)
const userList = ref([])
const classList = ref([])
const collegeList = ref([])
const editClassDialog = ref(false)
const userid = ref('')
const collegeid = ref('')

function refreshFrom() {
  form.value = {
    classname: '',
    wordname: '',
    url: ''
  }
}

function getList() {
  const list = classList.value.filter(item => {
    return item.classname.includes(findData.value)
  })
  tableData.value = list
}

function editData(row) {
  editClassDialog.value = true
  console.log(row)
  form.value.needid = row.needid
  form.value.classname = row.classname
}

async function editClass() {
  console.log(form.value)
  if (form.value.wordname === '') {
    ElMessage.error('请填写文档名称')
    return
  }
  if (form.value.url === '') {
    ElMessage.error('请上传文档')
    return
  }
  // console.log(form.value)
  const { data } = await axios.post('http://localhost:3000/word/add', {
    ...form.value,
    userid: userid.value
  })
  if (data.code === 2) {
    editClassDialog.value = false
    ElMessage.success('提交成功')
    await getWordList()
    await getClassList()
  } else {
    ElMessage.error(data.msg)
  }
}

const fnUploadRequest = async function (options) {
  const client= new OSS({
    accessKeyId: import.meta.env.VITE_OSSId,  // 查看你自己的阿里云KEY
    accessKeySecret: import.meta.env.VITE_OSSSecret, // 查看自己的阿里云KEYSECRET
    bucket: 'sxntest', // 你的 OSS bucket 名称
    region: 'oss-cn-beijing', // bucket 所在地址，我的是 华北2 北京
  })

  let file = options.file; // 拿到 file
  let fileName = file.name
  let date = new Date().getTime()
  let fileNames = `${date}_${fileName}` // 拼接文件名，保证唯一，这里使用时间戳+原文件名
  console.log(fileNames)
  // 上传文件,这里是上传到OSS的 uploads文件夹下
  client.put("uploads/"+fileNames, file).then(res=>{
    if (res.res.statusCode === 200) {
      form.value.url = res.url
    }else {}
  })
}

async function getCollegeList() {
  if (collegeList.value.length !== 0) {
    return
  }
  const { data } = await axios.post('http://localhost:3000/college/allData', {})
  if (data.code === 2) {
    collegeList.value = data.body
  }
}

async function getClassList() {
  const { data } = await axios.post('http://localhost:3000/class/allData', {})
  if (data.code === 2) {
    const arr = []
    for (let i = 0; i < data.body.length; i++) {
      if (data.body[i].collegeid === collegeid.value) {
        arr.push({
          ...data.body[i],
          mywordnum: wordList.value.filter(item => item.classid === data.body[i].classid).length
        })
      }
    }
    classList.value = arr
    // tableData.value = arr
  }
}

async function getWordList() {
  const { data } = await axios.post('http://localhost:3000/word/myData', {
    userid: userid.value
  })
  if (data.code === 2) {
    wordList.value = data.body
  }
}

async function getNeedList() {
  const { data } = await axios.post('http://localhost:3000/need/allData', {})
  if (data.code === 2) {
    const arr = []
    for (let i = 0; i < data.body.length; i++) {
      classList.value.find(item => {
        if (item.classid === data.body[i].classid && classList.value[i].collegeid === collegeid.value) {
          data.body[i].classname = item.classname
          arr.push({
            ...data.body[i],
          })
        }
      })
    }
    needList.value = arr
    tableData.value = arr
  }
}

onMounted(async() => {
  userid.value = window.sessionStorage.getItem('id')
  collegeid.value = window.sessionStorage.getItem('collegeid')
  await getWordList()
  await getClassList()
  await getNeedList()
})

</script>

<template>
  <div class="admin-class">
    <div class="header">
      <div class="left">
        <el-input v-model="findData" style="width: 240px" placeholder="请输入课程名" />
        <el-button @click="getList">筛选</el-button>
      </div>
    </div>
    <div class="body">
      <el-table :data="tableData" border style="width: 100%" max-height="600">
        <!-- <el-table-column prop="collegename" label="所属学院" /> -->
        <el-table-column prop="classname" label="课程名" width="300" />
        <el-table-column prop="needname" label="教学任务名" width="300" />
        <el-table-column prop="needwordnum" label="所需文档数量" />
        <!-- <el-table-column prop="mywordnum" label="我已提交的数量" /> -->
        <el-table-column fixed="right" label="操作" width="200">
          <template #default="scoped">
            <el-button link type="primary" size="small" @click="editData(scoped.row)">提交文档</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="editClassDialog" title="上传文档" width="500" @close="refreshFrom">
      <el-form :model="form">
        <el-form-item label="课程名" label-width="100">
          {{ form.classname }}
        </el-form-item>
        <el-form-item label="文档名" label-width="100">
          <el-input v-model="form.wordname" placeholder="请填写文档名称"/>
          <!-- {{ form.wordname }} -->
        </el-form-item>
        <el-form-item label="" label-width="100">
          <el-upload
              class=""
              action=""
              :show-file-list="false"
              :http-request="fnUploadRequest">
            <el-button :disabled="form.url !== ''" type="primary">点此上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="editClassDialog = false">取消</el-button>
          <el-button type="primary" @click="editClass">提交</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="less" scoped>
.admin-class {
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
}
</style>
