<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const testValue = ref(true)
const tableData = ref([])
const userList = ref([])
const loading = ref(true)
const addUserForm = ref({
  userid: '203401010101',
  username: '张三',
  password: '123456',
  optionTime: 0,
  birthday: ''
})
const editUserForm = ref({
  userid: '',
  username: '',
  password: '',
})
const loginForm = ref({
  userid: '203401010101',
  password: '123456',
})
const addUserDialog = ref(false)
const editUserDialog = ref(false)
const loginUserDialog = ref(false)

const formLabelWidth = ref(100)


const addUser = () => {

}

const editUser = (scoped) => {
  editUserForm.value = scoped.row
  editUserForm.value.password = '密码仅能重置，不支持手动修改'
  editUserDialog.value = true
  // console.log(scoped.row)
}

const dontEditUser = () => {
  editUserDialog.value = false
  clearForm()
}

const goEditUser = async () => {
  if (editUserForm.value.username === '') return ElMessage.error('请输入学生姓名')
  editUserForm.value.password = ''
  const { data } = await axios.post('http://localhost:3000/user/fix', {
    user: 'admin',
    ...editUserForm.value
  })
  if (data.code === 2) {
    ElMessage({
      message: '修改成功！',
      type: 'success',
    })
  }
  dontEditUser()
  getTableData()
}

const fixPassWord = async () => {
  editUserForm.value.password = '123456'
  const { data } = await axios.post('http://localhost:3000/user/fix', {
    user: 'admin',
    ...editUserForm.value
  })
  if (data.code === 2) {
    ElMessage({
      message: '重置成功！',
      type: 'success',
    })
  }
  dontEditUser()
  getTableData()
}


const delUser = async (scoped) => {
  // console.log(scoped.row)
  const { data } = await axios.post('http://localhost:3000/user/del', {
    user: 'admin',
    ...scoped.row
  })
  if (data.code === 2) {
    ElMessage({
      message: '删除成功！',
      type: 'success',
    })
  }
  getTableData()
}

const dontLogin = () => {
  loginUserDialog.value = false
  clearForm()
}

const goLogin = async () => {
  if (loginForm.value.userid === '') return ElMessage.error('请输入学号')
  if (loginForm.value.password === '') return ElMessage.error('请输入学生密码')
  const { data } = await axios.post('http://localhost:3000/user/login', {
    ...loginForm.value
  })
  if (data.code === 2) {
    ElMessage({
      message: '登录成功！',
      type: 'success',
    })
  } else {
    ElMessage.error('账号或密码错误')
  }
}

const clearForm = () => {
  addUserForm.value = {
    userid: '',
    username: '',
    password: '123456',
    optionTime: 0,
    birthday: ''
  }
  loginForm.value = {
    userid: '',
    password: '123456',
  }
  editUserForm.value = {
    userid: '',
    username: '',
    password: '',
  }
}

const dontAddUser = () => {
  addUserDialog.value = false
  clearForm()
}

const goAddUser = async () => {
  if (addUserForm.value.userid === '') return ElMessage.error('请输入学号')
  if (addUserForm.value.username === '') return ElMessage.error('请输入学生名')
  if (addUserForm.value.password === '') return ElMessage.error('请输入学生密码')
  const { data } = await axios.post('http://localhost:3000/user/add', {
    ...addUserForm.value,
    wherefrom: 'web'
  })
  if (data.code === 2) {
    ElMessage({
      message: '添加成功！',
      type: 'success',
    })
    dontAddUser()
    getTableData()
  } else {
    ElMessage.error(data.msg)
  }
}

const getTableData = async () => {
  const { data } = await axios.post('http://localhost:3000/user/allData', {})
  if (data.code === 2) {
    userList.value = data.info
    tableData.value = data.info
  }
  loading.value = false
}


onMounted(async () => {
  await getTableData()
})

</script>

<template>
  <div class="user">
    <div class="header">
      <div class="is-test">
        启动模拟：<el-switch v-model="testValue" />
      </div>
      <div class="test-button" v-if="testValue">
        <el-button type="primary" @click="addUserDialog = true">添加学生</el-button>
        <el-button type="primary" @click="loginUserDialog = true">模拟学生登录</el-button>
      </div>
    </div>
    <div class="body">
      <el-table v-loading="loading" :data="tableData" border height="500">
        <el-table-column prop="userid" label="用户ID"/>
        <el-table-column prop="username" label="用户昵称"/>
        <el-table-column prop="optionTime" label="使用次数"/>
        <el-table-column prop="birthday" label="出生年份">
          <template #default="scope">
            {{ Number((scope.row.birthday).substring(0, 4)) + 1 }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template #default="scoped">
            <el-button link type="primary" size="small" @click="editUser(scoped)">编辑</el-button>
            <el-popconfirm confirm-button-text="确认" cancel-button-text="取消" title="确认删除吗" @confirm="delUser(scoped)">
              <template #reference>
                <el-button link type="danger" size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="addUserDialog" title="添加学生" width="500" @close="clearForm">
      <el-form :model="addUserForm">
        <el-form-item label="学号" :label-width="formLabelWidth">
          <el-input v-model="addUserForm.userid" autocomplete="off" />
        </el-form-item>
        <el-form-item label="姓名" :label-width="formLabelWidth">
          <el-input v-model="addUserForm.username" autocomplete="off" />
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="addUserForm.password" autocomplete="off" />
        </el-form-item>
        <el-form-item label="出生年份" :label-width="formLabelWidth">
          <el-date-picker
            v-model="addUserForm.birthday"
            type="year"
            placeholder="请选择出生年份"
          />
        </el-form-item>

      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dontAddUser">取消</el-button>
          <el-button type="primary" @click="goAddUser">确认</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="loginUserDialog" title="试验学生账号密码" width="500" @close="clearForm">
      <el-form :model="loginForm">
        <el-form-item label="学号" :label-width="formLabelWidth">
          <el-input v-model="loginForm.userid" autocomplete="off" />
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="addUserForm.password" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dontLogin">取消</el-button>
          <el-button type="primary" @click="goLogin">确认</el-button>
        </div>
      </template>
    </el-dialog>
    
    <el-dialog v-model="editUserDialog" title="编辑信息" width="500" @close="clearForm">
      <el-form :model="editUserForm">
        <el-form-item label="学号" :label-width="formLabelWidth">
          <el-input v-model="editUserForm.userid" disabled />
        </el-form-item>
        <el-form-item label="姓名" :label-width="formLabelWidth">
          <el-input v-model="editUserForm.username"/>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="editUserForm.password" disabled />
        </el-form-item>
        <el-form-item label="出生年份" :label-width="formLabelWidth">
          <el-date-picker
            v-model="addUserForm.birthday"
            type="year"
            placeholder="请选择出生年份"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="danger" @click="fixPassWord">重置密码</el-button>
          <el-button @click="dontEditUser">取消</el-button>
          <el-button type="primary" @click="goEditUser">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="less" scoped>
.user {
  width: 100%;
  height: 100%;
  background-color: #fff;
  .header {
    width: 100%;
    height: 60px;
    display: flex;
    .is-test {
      width: 140px;
      margin-left: 10px;
      line-height: 60px;
    }
    .test-button {
      line-height: 60px;
    }
  }
  .body {
    width: 100%;
    height: calc(100% - 70px);
    margin-top: 10px;
    .echart {
      width: 100%;
      height: calc(100% - 500px);
    }
  }
}
</style>
