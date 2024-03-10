<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const findData = ref('')
const tableData = ref([
  {
    id: 0,
    name: '计算机科学',
    teacher: '张三',
    num: 20
  },
])
const form = ref({
  name: '',
  teacher: '',
  num: 0
})
const dialogFormVisible = ref(false)

function refreshFrom() {
  form.value = {
    name: '',
    teacher: '',
    num: 0
  }
}

function getList() {}

function addUser() {
  dialogFormVisible.value = true
}

function doNotPush() {
  refreshFrom()
  dialogFormVisible.value = false
}

async function pushUser() {
  if (form.value.name === '') return ElMessage.error('请输入课程名')
  if (form.value.teacher === '') return ElMessage.error('请输入教师名')
  // const { data } = await axios.post('http://localhost:3000/user/add', {})
  // 判断一下老师是否存在
  refreshFrom()
  dialogFormVisible.value = false
}

function editData(scoped) {
  console.log(scoped)
}

function delData(scoped) {
  console.log(scoped)
}

async function getUserList() {
  // const { data } = await axios.post('http://localhost:3000/user/alldata', {})
}

async function getClassList() {
  // const { data } = await axios.post('http://localhost:3000/user/alldata', {})
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
        <el-button type="primary" @click="addUser">新建用户</el-button>
      </div>
    </div>
    <div class="body">
      <el-table :data="tableData" border style="width: 100%" max-height="600">
        <el-table-column prop="name" label="用户昵称" width="300" />
        <el-table-column prop="teacher" label="教师名" />
        <el-table-column prop="num" label="选课人数" />
        <el-table-column fixed="right" label="操作" width="200">
          <template #default="scoped">
            <el-button link type="primary" size="small" @click="editData(scoped)">编辑</el-button>
            <el-button link type="danger" size="small" @click="delData(scoped)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog v-model="dialogFormVisible" title="添加用户" width="500">
      <el-form :model="form">
        <el-form-item label="课程名" label-width="100">
          <el-input v-model="form.name" placeholder="请填写课程名"/>
        </el-form-item>
        <el-form-item label="教师名" label-width="100">
          <el-input v-model="form.teacher" placeholder="请填写教师名"/>
        </el-form-item>
        <el-form-item label="选课人数" label-width="100">
          <el-input v-model="form.num" disabled placeholder="请填写选课人数"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="doNotPush">取消</el-button>
          <el-button type="primary" @click="pushUser">
            新建
          </el-button>
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
