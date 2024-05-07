<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const findData = ref('')
const userList = ref([])
const addUserDialog = ref(false)
const editUserDialog = ref(false)
const tableData = ref([])
const form = ref({
  id: '',
  name: '',
  roletype: ''
})
const dialogFormVisible = ref(false)
const standingList = ref([
  {
    label: '系主任',
    value: 1
  },
  {
    label: '老师',
    value: 2
  },
])
const uploadRef = ref(null)
const fileList = ref([])

function clearForm() {
  form.value = {
    id: '',
    name: '',
    roletype: ''
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
  if (form.value.id === '') return ElMessage.error('请输入工号')
  if (form.value.name === '') return ElMessage.error('请输入用户姓名')
  if (form.value.roletype === '') return ElMessage.error('请选择用户身份')
  const { data } = await axios.post('http://localhost:3000/user/add', form.value)
  if (data.code === 2) {
    addUserDialog.value = false
    ElMessage.success('添加成功')
    getUserList()
  } else {
    ElMessage.error(data.msg)
  }
}

async function editUser() {
  if (form.value.id === '') return ElMessage.error('请输入工号')
  if (form.value.name === '') return ElMessage.error('请输入用户姓名')
  if (form.value.roletype === '') return ElMessage.error('请选择用户身份')
  const { data } = await axios.post('http://localhost:3000/user/edit', form.value)
  if (data.code === 2) {
    editUserDialog.value = false
    ElMessage.success('修改成功')
    getUserList()
  } else {
    ElMessage.error(data.msg)
  }
}

async function pushUser() {
  if (form.value.name === '') return ElMessage.error('请输入用户名')
  if (form.value.standing === '') return ElMessage.error('请选择用户身份')
  // const { data } = await axios.post('http://localhost:3000/user/add', {})
  refreshFrom()
  dialogFormVisible.value = false
}

function editData(row) {
  form.value = row
  editUserDialog.value = true
}

function delData(scoped) {
  console.log(scoped)
}

function fileChange(file, fileList) {
  console.log(file, fileList)
  // console.log(uploadRef.value)
}

async function makeSureDel(row) {
  const { data } = await axios.post('http://localhost:3000/user/del', { id: row.id })
  if (data.code === 2) {
    ElMessage.success('删除成功')
    getUserList()
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

async function getUserList() {
  const { data } = await axios.post('http://localhost:3000/user/allData', {})
  if (data.code === 2) {
    userList.value = data.body
    tableData.value = data.body
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
        <el-button type="primary" @click="addUserDialog = true">新建用户</el-button>
      </div>
    </div>
    <div class="body">
      <el-table :data="tableData" border style="width: 100%" max-height="600">
        <el-table-column prop="id" label="工号" width="300" />
        <el-table-column prop="name" label="用户昵称" width="300" />
        <el-table-column prop="standing" label="身份">
          <template #default="scoped">
            <span v-if="scoped.row.roletype === 0">管理员</span>
            <span v-if="scoped.row.roletype === 1">系主任</span>
            <span v-if="scoped.row.roletype === 2">老师</span>
          </template>
        </el-table-column>
        <el-table-column prop="collegename" label="所属学院"/>
        <el-table-column fixed="right" label="操作" width="200">
          <template #default="scoped">
            <el-button link type="primary" size="small" @click="editData(scoped.row)">编辑</el-button>
            <el-popconfirm confirm-button-text="确认" cancel-button-text="取消" title="确认删除吗" @confirm="makeSureDel(scoped.row)">
              <template #reference>
                <el-button link type="danger" size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog v-model="addUserDialog" title="添加用户" width="500" @close="clearForm">
      <el-form :model="form">
        <el-form-item label="工号" label-width="100">
          <el-input v-model="form.id" placeholder="请填写工号"/>
        </el-form-item>
        <el-form-item label="用户姓名" label-width="100">
          <el-input v-model="form.name" placeholder="请填写用户姓名"/>
        </el-form-item>
        <el-form-item label="身份" label-width="100">
          <el-select
            v-model="form.roletype"
            placeholder="请选择"
          >
            <el-option
              v-for="item in standingList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addUserDialog = false">取消</el-button>
          <el-button type="primary" @click="addUser">新建</el-button>
        </div>
      </template>
    </el-dialog>


    <el-dialog v-model="editUserDialog" title="编辑用户" width="500"  @close="clearForm">
      <el-form :model="form">
        <el-form-item label="工号" label-width="100">
          <el-input disabled v-model="form.id" />
        </el-form-item>
        <el-form-item label="用户姓名" label-width="100">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="身份：" label-width="100">
          <span v-if="form.roletype === 0">管理员</span>
          <span v-if="form.roletype === 1">系主任</span>
          <span v-if="form.roletype === 2">老师</span>
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
