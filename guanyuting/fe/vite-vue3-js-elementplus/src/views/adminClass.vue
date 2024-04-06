<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const findData = ref('')
const tableData = ref([])
const dialogFormVisible = ref(false)
const userList = ref([])
const classList = ref([])
const addClassDialog = ref(false)
const editClassDialog = ref(false)

function refreshFrom() {
  form.value = {
    name: '',
    teacherid: '',
    num: 0
  }
}

function getList() {
  if (findData.value === '') {
    getClassList()
    return
  }
  const list = classList.value.filter(item => {
    return item.name.includes(findData.value) || item.teacher.includes(findData.value)
  })
  tableData.value = list
}

function editData(row) {
  editClassDialog.value = true
  form.value = row
  // console.log(scoped)
}

async function addClass() {
  // console.log(form.value)
  const { data } = await axios.post('http://localhost:3000/class/add', form.value)
  if (data.code === 2) {
    addClassDialog.value = false
    ElMessage.success('添加成功')
    getClassList()
  } else {
    ElMessage.error(data.msg)
  }
}

async function editClass() {
  // console.log(form.value)
  const { data } = await axios.post('http://localhost:3000/class/edit', form.value)
  if (data.code === 2) {
    editClassDialog.value = false
    ElMessage.success('编辑成功')
    getClassList()
  } else {
    ElMessage.error(data.msg)
  }
}


async function makeSureDel(row) {
  const { data } = await axios.post('http://localhost:3000/class/del', { id: row.id })
  if (data.code === 2) {
    ElMessage.success('删除成功')
    getClassList()
  }
}

async function getUserList() {
  const { data } = await axios.post('http://localhost:3000/user/allData', {})
  if (data.code === 2) {
    userList.value = []
    data.body.forEach(item => {
      if (item.roletype === '1') userList.value.push(item)
    })
  }
}

async function getClassList() {
  const { data } = await axios.post('http://localhost:3000/class/allData', {})
  if (data.code === 2) {
    const userMap = {}
    userList.value.forEach(item => {
      userMap[item.id] = item.name
    })
    classList.value = []
    data.body.forEach(item => {
      classList.value.push({
        ...item,
        teacher: userMap[item.teacherid]
      })
    })
    tableData.value = classList.value
  }
}

onMounted(async() => {
  await getUserList()
  await getClassList()
})

</script>

<template>
  <div class="admin-class">
    <div class="header">
      <div class="left">
        <el-input v-model="findData" style="width: 240px" placeholder="请输入内容" />
        <el-button @click="getList">筛选</el-button>
      </div>
      <div class="right">
        <el-button type="primary" @click="addClassDialog = true">新建课程</el-button>
      </div>
    </div>
    <div class="body">
      <el-table :data="tableData" border style="width: 100%" max-height="600">
        <el-table-column prop="name" label="课程名" width="300" />
        <el-table-column prop="teacher" label="教师名" />
        <el-table-column prop="num" label="选课人数" />
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

    <el-dialog v-model="addClassDialog" title="添加课程" width="500" @close="refreshFrom">
      <el-form :model="form">
        <el-form-item label="课程名" label-width="100">
          <el-input v-model="form.name" placeholder="请填写课程名"/>
        </el-form-item>
        <el-form-item label="教师名" label-width="100">
          <el-select v-model="form.teacherid" filterable placeholder="请选择教师">
            <el-option v-for="item in userList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="选课人数" label-width="100">
          <el-input v-model="form.num" disabled placeholder="请填写选课人数"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="editClassDialog = false">取消</el-button>
          <el-button type="primary" @click="addClass">新建</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="editClassDialog" title="编辑课程" width="500" @close="refreshFrom">
      <el-form :model="form">
        <el-form-item label="课程名" label-width="100">
          <el-input v-model="form.name" placeholder="请填写课程名"/>
        </el-form-item>
        <el-form-item label="教师名" label-width="100">
          <span>{{ form.teacher }}</span>
        </el-form-item>
        <el-form-item label="选课人数" label-width="100">
          <el-input v-model="form.num" disabled placeholder="请填写选课人数"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="editClassDialog = false">取消</el-button>
          <el-button type="primary" @click="editClass">编辑</el-button>
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
