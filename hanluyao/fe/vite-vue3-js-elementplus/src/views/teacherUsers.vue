<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import Papa from 'papaparse'

const userid = ref('')
const collegeid = ref('')
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
const findID = ref('')
const findName = ref('')
const findBelongClass = ref('')

function clearForm() {
  form.value = {
    id: '',
    name: '',
  }
}

function getList() {
  const list = userList.value.filter(item => {
    return (
      item.id.includes(findID.value) &&
      item.belongClass?.includes(findBelongClass.value) &&
      item.name.includes(findName.value)
    )
  })
  tableData.value = list
  if (findID.value === '' && findName.value === '' && findBelongClass.value === '') tableData.value = userList.value
}

async function addUser() {
  if (form.value.id === '') return ElMessage.error('请输入学工号')
  if (form.value.name === '') return ElMessage.error('请输入用户姓名')
  if (form.value.roletype === '') return ElMessage.error('请选择用户身份')
  if (form.value.belongClass === '') return ElMessage.error('请输入用户班级')
  const { data } = await axios.post('http://localhost:3000/user/add', {
    ...form.value,
    collegeid: collegeid.value,
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

async function makeSureDel(row) {
  const { data } = await axios.post('http://localhost:3000/user/del', { id: row.id })
  if (data.code === 2) {
    ElMessage.success('删除成功')
    getUserList()
  }
}

async function getUserList() {
  const { data } = await axios.post('http://localhost:3000/user/allData', {})
  if (data.code === 2) {
    const list = data.body.filter(item => item.collegeid === collegeid.value)
    userList.value = list
    tableData.value = list
  }
}

onMounted(async() => {
  userid.value = window.sessionStorage.getItem('id')
  collegeid.value = window.sessionStorage.getItem('collegeid')
  await getUserList()
})

</script>

<template>
  <div class="admin-user">
    <div class="header">
      <div class="left">
        <el-row :gutter="20">
          <el-col :span="4">工号：</el-col>
          <el-col :span="8">
            <el-input v-model="findID" style="width: 240px" placeholder="请输入内容" />
          </el-col>
          <el-col :span="4">用户姓名：</el-col>
          <el-col :span="8">
            <el-input v-model="findName" style="width: 240px" placeholder="请输入内容" />
          </el-col>
          <el-col :span="4">所属班级</el-col>
          <el-col :span="8">
            <el-input v-model="findBelongClass" style="width: 240px" placeholder="请输入内容" />
          </el-col>
        </el-row>
      </div>
      <div class="right">
        <el-button @click="getList">筛选</el-button>
        <el-button type="primary" @click="addUserDialog = true">新建老师</el-button>
      </div>
    </div>
    <div class="body">
      <el-table :data="tableData" border style="width: 100%" height="600">
        <el-table-column prop="id" label="工号"/>
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="belongClass" label="所属班级" />
        <!-- <el-table-column prop="status" label="学习状态" width="300" /> -->
        <el-table-column fixed="right" label="操作" width="200">
          <template #default="scoped">
            <el-button link type="primary" size="small" @click="editData(scoped.row)">编辑</el-button>
            <el-popconfirm v-if="scoped.row.roletype === 2" confirm-button-text="确认" cancel-button-text="取消" title="确认删除吗" @confirm="makeSureDel(scoped.row)">
              <template #reference>
                <el-button link type="danger" size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="addUserDialog" title="添加教师" width="500" @close="clearForm">
      <el-form :model="form">
        <el-form-item label="工号" label-width="100">
          <el-input v-model="form.id" placeholder="请填写工号"/>
        </el-form-item>
        <el-form-item label="教师姓名" label-width="100">
          <el-input v-model="form.name" placeholder="请填写教师姓名"/>
        </el-form-item>
        <el-form-item label="所属班级" label-width="100">
          <el-input v-model="form.belongClass" placeholder="请填写所属班级"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addUserDialog = false">取消</el-button>
          <el-button type="primary" @click="addUser">新建</el-button>
        </div>
      </template>
    </el-dialog>


    <el-dialog v-model="editUserDialog" title="编辑教师" width="500"  @close="clearForm">
      <el-form :model="form">
        <el-form-item label="工号" label-width="100">
          <el-input disabled v-model="form.id" />
        </el-form-item>
        <el-form-item label="教师姓名" label-width="100">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="所属班级" label-width="100">
          <el-input v-model="form.belongClass" />
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

  </div>
</template>

<style lang="less" scoped>
.admin-user {
  height: 100%;
  width: 100%;
  background-color: #fff;
  .header {
    // height: 60px;
    display: flex;
    justify-content: space-between;
    padding: 0 10px;
    line-height: 60px;
    .left {
      width: 80%;
    }
    .right {}
  }
  .body {
    padding: 0 10px;
  }
}
</style>
