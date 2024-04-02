<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const tableData = ref([])
const userList = ref([])
const addUserDialog = ref(false)
const editUserDialog = ref(false)
const formLabelWidth = ref(140)
const form = ref({
  userid: '203401010101',
  username: '杜小月学生',
  roleType: '2',
  password: '123456',
})
const findString = ref('')
const nowSelectType = ref('0')

const handleSuccess = function(index, scope) {
  console.log(index, scope)
}

const handleDelete = function(index, scope) {
  console.log(index, scope)
}

const gotoFind = function() {
  console.log(nowSelectType.value)
}

const addUser = async function() {
  const { data } = await axios.post('http://localhost:3000/user/add', form.value)
  if (data.code === 2) {
    addUserDialog.value = false
    await getUserList()
  } else {
    ElMessage.error(data.msg)
  }
}

const makeSureFix = async function(row) {
  const { data } = await axios.post('http://localhost:3000/user/fix', row)
  if (data.code === 2) {
    ElMessage({
      message: '重置成功！',
      type: 'success',
    })
    await getUserList()
  }
}

const editData = async function(row) {
  form.value = row
  editUserDialog.value = true
}

const editUser = async function() {
  const { data } = await axios.post('http://localhost:3000/user/edit', form.value)
  if (data.code === 2) {
    ElMessage({
      message: '编辑成功！',
      type: 'success',
    })
    editUserDialog.value = false
    await getUserList()
  }
}

const makeSureDel = async function(row) {
  const { data } = await axios.post('http://localhost:3000/user/del', row)
  if (data.code === 2) {
    ElMessage({
      message: '删除成功！',
      type: 'success',
    })
    await getUserList()
  }

}

const getUserList = async function() {
  const { data } = await axios.post('http://localhost:3000/user/alldata',{})
  if (data.code === 2) {
    userList.value = []
    tableData.value = []
    data.body.forEach(item => {
      let role = ''
      if (item.roleType ===  '0') {
        role='管理员'
      } else if (item.roleType ===  '1') {
        role='老师'
      } else if (item.roleType ===  '2') {
        role='学生'
      }
      userList.value.push({
        ...item,
        role,
      })
      tableData.value.push({
        ...item,
        role,
      })
    })
  }
}

const refreshForm = function() {
  form.value = {
    userid: '203401010101',
    username: '杜小月学生',
    roleType: '2',
    password: '123456',
  }
}

onMounted(async() => {
  await getUserList()
})

</script>

<template>
  <div class="admin-users">
    <div class="body">
      <div class="header">
        <div class="find-string">
          <el-input v-model="findString" placeholder="请输入筛选内容" style="width: 160px"/>
        </div>
        <div class="find-button">
          <el-button type="primary" @click="gotoFind">筛选</el-button>
          <el-button type="primary" @click="addUserDialog = true">新建用户</el-button>
        </div>
      </div>
      <div class="table">
        <el-table :data="tableData" style="width: 100%" border max-height="600">
          <el-table-column prop="userid" label="学工号" />
          <el-table-column prop="username" label="姓名" />
          <el-table-column prop="role" label="身份"/>
          <el-table-column fixed="right" label="操作" width="180">
            <template #default="scope">
              <el-popconfirm confirm-button-text="确认" cancel-button-text="取消" title="确认重置吗" @confirm="makeSureFix(scope.row)">
                <template #reference>
                  <el-button link type="primary" size="small">重置密码</el-button>
                </template>
              </el-popconfirm>
              <el-button link type="primary" size="small" @click="editData(scope.row)">编辑</el-button>
              <el-popconfirm confirm-button-text="确认" cancel-button-text="取消" title="确认删除吗" @confirm="makeSureDel(scope.row)">
                <template #reference>
                  <el-button link type="danger" size="small">删除</el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <el-dialog v-model="addUserDialog" title="添加用户" width="500" @close="refreshForm">
      <el-form :model="form">
        <el-form-item label="学工号" :label-width="formLabelWidth">
          <el-input v-model="form.userid"/>
        </el-form-item>
        <el-form-item label="姓名" :label-width="formLabelWidth">
          <el-input v-model="form.username"/>
        </el-form-item>
        <el-form-item label="身份" :label-width="formLabelWidth">
          <el-radio-group v-model="form.roleType" class="ml-4">
            <el-radio value="1">教师</el-radio>
            <el-radio value="2">学生</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="form.password"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addUserDialog = false">取消</el-button>
          <el-button type="primary" @click="addUser">添加</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="editUserDialog" title="编辑用户" width="500" @close="refreshForm">
      <el-form :model="form">
        <el-form-item label="学工号" :label-width="formLabelWidth">
          <el-input v-model="form.userid" disabled/>
        </el-form-item>
        <el-form-item label="姓名" :label-width="formLabelWidth">
          <el-input v-model="form.username"/>
        </el-form-item>
        <el-form-item label="身份" :label-width="formLabelWidth">
          <el-radio-group v-model="form.roleType" class="ml-4">
            <el-radio value="1">教师</el-radio>
            <el-radio value="2">学生</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addUserDialog = false">取消</el-button>
          <el-button type="primary" @click="editUser">编辑</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="less" scoped>
.admin-users {
  height: 100%;
  width: 100%;
  background-color: #fff;
  .body {
    .header {
      display: flex;
      height: 40px;
      padding: 10px;
      .find-string {
        width: 200px;
      }
      .find-type {
        width: 200px;
      }
      // margin-top: 20px;
    }
    .table {
      margin: 0 10px;
    }
  }
}
</style>
