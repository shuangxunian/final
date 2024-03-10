<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const findData = ref('')
const tableData = ref([
  {
    userID: '101010',
    name: '李四',
    standing: '老师'
  },
  {
    userID: '203401010506',
    name: '关雨婷',
    standing: '学生'
  },
])
const form = ref({
  name: '',
  standing: ''
})
const dialogFormVisible = ref(false)
const dialogUploadVisible = ref(false)
const standingList = ref([
  {
    label: '老师',
    value: '1'
  },
  {
    label: '学生',
    value: '2'
  },
])
const uploadRef = ref(null)
const fileList = ref([])

function refreshFrom() {
  form.value = {
    name: '',
    standing: ''
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
  if (form.value.name === '') return ElMessage.error('请输入用户名')
  if (form.value.standing === '') return ElMessage.error('请选择用户身份')
  // const { data } = await axios.post('http://localhost:3000/user/add', {})
  refreshFrom()
  dialogFormVisible.value = false
}

function editData(scoped) {
  console.log(scoped)
}

function delData(scoped) {
  console.log(scoped)
}

function fileChange(file, fileList) {
  console.log(file, fileList)
  // console.log(uploadRef.value)
}

async function getUserList() {
  // const { data } = await axios.post('http://localhost:3000/user/alldata', {})
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
        <el-button type="primary" @click="addUser">新建用户</el-button>
      </div>
    </div>
    <div class="body">
      <el-table :data="tableData" border style="width: 100%" max-height="600">
        <el-table-column prop="userID" label="学工号" width="300" />
        <el-table-column prop="name" label="用户昵称" width="300" />
        <el-table-column prop="standing" label="身份" />
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
        <el-form-item label="用户昵称" label-width="100">
          <el-input v-model="form.name" placeholder="请填写用户昵称"/>
        </el-form-item>
        <el-form-item label="身份" label-width="100">
          <el-select
            v-model="form.standing"
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
          <el-button link type="primary" @click="dialogUploadVisible = true">一键导入</el-button>
          <el-button @click="doNotPush">取消</el-button>
          <el-button type="primary" @click="pushUser">
            新建
          </el-button>
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
        :file-list="fileList"
        :on-change="fileChange"
      >
        <el-button type="success">
          点此上传
        </el-button>
      </el-upload>
      <!-- <span>This is a message</span> -->
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="dialogVisible = false">
            Confirm
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
