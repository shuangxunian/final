<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import Papa from 'papaparse'

const findData = ref('')
const tableData = ref([])
const form = ref({
  userID: '',
  name: '',
})
const dialogFormVisible = ref(false)
const dialogUploadVisible = ref(false)
const uploadRef = ref(null)
const fileList = ref([])
const newUserList = ref([])
const userList = ref([])
const addUserDialog = ref(false)
const editUserDialog = ref(false)

function clearForm() {
  form.value = {
    id: '',
    name: '',
  }
}

function getList() {
  if (findData.value === '') {
    getUserList()
    return
  }
  const list = userList.value.filter(item => item.id.includes(findData.value))
  tableData.value = list
}

async function addUser() {
  if (form.value.id === '') return ElMessage.error('请输入学工号')
  if (form.value.name === '') return ElMessage.error('请输入用户姓名')
  if (form.value.roletype === '') return ElMessage.error('请选择用户身份')
  const { data } = await axios.post('http://localhost:3000/user/add', {
    ...form.value,
    roletype: '2',
  })
  if (data.code === 2) {
    addUserDialog.value = false
    ElMessage.success('添加成功')
    getUserList()
  } else {
    ElMessage.error(data.msg)
  }
}

async function editUser() {
  if (form.value.id === '') return ElMessage.error('请输入学工号')
  if (form.value.name === '') return ElMessage.error('请输入用户姓名')
  const { data } = await axios.post('http://localhost:3000/user/edit', form.value)
  if (data.code === 2) {
    editUserDialog.value = false
    ElMessage.success('修改成功')
    getUserList()
  } else {
    ElMessage.error(data.msg)
  }
}

async function fixPassword() {
  const { data } = await axios.post('http://localhost:3000/user/fixPassword', { id: form.value.id })
  if (data.code === 2) {
    ElMessage.success('重置成功')
    getUserList()
    editUserDialog.value = false
  }
}

function doNotPush() {
  refreshFrom()
  dialogFormVisible.value = false
}

async function pushUser() {
  if (form.value.userID === '') return ElMessage.error('请输入学号')
  if (form.value.name === '') return ElMessage.error('请输入学生姓名')
  // const { data } = await axios.post('http://localhost:3000/user/add', {})
  refreshFrom()
  dialogFormVisible.value = false
}

function doNotPushList() {
  newUserList.value = []
  refreshFrom()
  dialogFormVisible.value = false
}

function pushUserList() {
  refreshFrom()
  dialogUploadVisible.value = false
}

function editData(row) {
  form.value = row
  editUserDialog.value = true
}

function delData(scoped) {
  console.log(scoped)
}

function isNewUser(item,newList) {
  for(let i = 0; i < tableData.value.length; i++) {
    if (tableData.value[i].userID === item.userID) return false
  }
  for(let i = 0; i < newList.length; i++) {
    if (newList[i].userID === item.userID) return false
  }
  return true
}

function fileChange(uploadFile, uploadFiles) {
  var reader = new FileReader()
  reader.readAsDataURL(uploadFile.raw)
  reader.onload = evt => {
    Papa.parse(uploadFile.raw, {
      complete: res => {
        let data = res.data
        const result = Papa.unparse(data)
        const csvRecordsArray = result?.split(/\r\n|\n/)
        const newArr = csvRecordsArray.slice(1)
        const newList = []
        newArr.forEach(str => {
          const obj = str.split(',')
          const item = {
            userID: obj[0],
            name: obj[1],
          }
          if (item.userID !== '' && item.name !== '' && isNewUser(item,newList)) {
            newList.push(item)
          }
        })
        newUserList.value = newList
        console.log(newUserList.value)
      }
    })
  }
  // console.log(file, fileList)
  // console.log(uploadRef.value)
}

async function getUserList() {
  const { data } = await axios.post('http://localhost:3000/user/allData', {})
  if (data.code === 2) {
    userList.value = []
    data.body.forEach(item => {
      if (item.roletype === '2') {
        userList.value.push({
          ...item,
          status: '正常'
        })
      }
    })
    tableData.value = userList.value
  }
}
onMounted(async() => {
  await getUserList()
})

</script>

<template>
  <div class="admin-user">
    <div class="header">
      <div class="left">
        <el-input v-model="findData" style="width: 240px" placeholder="请输入内容" />
        <el-button @click="getList">筛选</el-button>
      </div>
      <div class="right">
        <el-button type="primary" @click="addUserDialog = true">新建学生</el-button>
      </div>
    </div>
    <div class="body">
      <el-table :data="tableData" border style="width: 100%" max-height="600">
        <el-table-column prop="id" label="学号"/>
        <el-table-column prop="name" label="学生姓名" width="300" />
        <el-table-column prop="status" label="学习状态" width="300" />
        <el-table-column fixed="right" label="操作" width="200">
          <template #default="scoped">
            <el-button link type="primary" size="small" @click="editData(scoped.row)">编辑</el-button>
            <el-button link type="danger" size="small" @click="delData(scoped)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="addUserDialog" title="添加学生" width="500" @close="clearForm">
      <el-form :model="form">
        <el-form-item label="学号" label-width="100">
          <el-input v-model="form.id" placeholder="请填写学号"/>
        </el-form-item>
        <el-form-item label="学生姓名" label-width="100">
          <el-input v-model="form.name" placeholder="请填写学生姓名"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <!-- <el-button link type="primary" @click="dialogUploadVisible = true">一键导入</el-button> -->
          <el-button @click="addUserDialog = false">取消</el-button>
          <el-button type="primary" @click="addUser">新建</el-button>
        </div>
      </template>
    </el-dialog>


    <el-dialog v-model="editUserDialog" title="编辑用户" width="500"  @close="clearForm">
      <el-form :model="form">
        <el-form-item label="学工号" label-width="100">
          <el-input disabled v-model="form.id" />
        </el-form-item>
        <el-form-item label="用户姓名" label-width="100">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="密码" label-width="100">
          <el-button link type="primary" size="small" @click="fixPassword">重置密码</el-button>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="editUserDialog = false">取消</el-button>
          <el-button type="primary" @click="editUser">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog
      v-model="dialogUploadVisible"
      title="上传"
      width="500"
    >
      <el-upload
        ref="uploadRef"
        :show-file-list="false"
        :auto-upload="false"
        :on-change="fileChange"
      >
        <el-button type="success">
          点此上传
        </el-button>
      </el-upload>
      <div v-if="newUserList.length !== 0">
        一共有{{ newUserList.length }}条有效数据，确定添加吗？
      </div>
      <!-- <span>This is a message</span> -->
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogUploadVisible = false">取消</el-button>
          <el-button type="primary" @click="pushUserList">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
    <!-- dialogUploadVisible -->
  </div>
</template>

<style lang="less" scoped>
.admin-user {
  height: 100%;
  width: 100%;
  background-color: #fff;
  .header {
    height: 60px;
    display: flex;
    justify-content: space-between;
    padding: 0 10px;
    line-height: 60px;
    .left {}
    .right {}
  }
  .body {
    padding: 0 10px;
  }
}
</style>
