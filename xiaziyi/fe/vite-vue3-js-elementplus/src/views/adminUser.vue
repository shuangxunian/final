<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const userList = ref([])
const tableList = ref([])
const formLabelWidth = ref(100)
const addUserDialog = ref(false)
const editUserDialog = ref(false)
const addUserForm = ref({
  id: '',
  name: '',
  password: '123456',
})

const clearForm = () => {
  addUserForm.value = {
    id: '',
    name: '',
    password: '123456',
  }
}

const dontAddUser = () => {}
const trueAddUser = async () => {
  const{ data } = await axios.post('http://localhost:3000/user/add',{
    ...addUserForm.value,
    roleType: '1'
  })
  if (data.code === 2) {
    ElMessage({
      message: '添加成功',
      type: 'success',
    })
    await getUserList()
    addUserDialog.value = false
  }
}

const editUser = (row) => {
  addUserForm.value = row
  editUserDialog.value = true
}

const trueEditUser = () => {}
const fixPassword = (row) => {}

const getTableList = async () => {
  tableList.value = []
  const roleMap = {
    '0': '管理员',
    '1': '负责人',
    '2': '成员',
  }
  for (let i = 0; i < userList.value.length; i++) {
    const nowData = userList.value[i]
    nowData.standing = roleMap[userList.value[i].roleType]
    if (!nowData.master) {
      tableList.value.push({
        ...nowData,
        children: []
      })
    }
  }
  for (let i = 0; i < userList.value.length; i++) {
    const nowData = userList.value[i]
    if (nowData.master !== '') {
      for (let j = 0; j < tableList.value.length; j++) {
        if (nowData.master === tableList.value[j].id) {
          tableList.value[j].children.push(nowData)
        }
      }
    }
  }
}

const makeSureDel = async (row) => {
  const { data } = await axios.post('http://localhost:3000/user/del',{
    id: row.id
  })
  if (data.code === 2) {
    ElMessage({
      message: '删除成功',
      type: 'success',
    })
    await getUserList()
  }
}

const getUserList = async () => {
  const { data } = await axios.post('http://localhost:3000/user/allData',{})
  if (data.code === 2) {
    console.log(data)
    userList.value = data.body
    getTableList()
  }
}

onMounted(async () => {
  await getUserList()
})

</script>

<template>
  <div class="admin-user">
    <div class="header">
      <el-button type="primary" @click="addUserDialog = true">新建负责人</el-button>
    </div>
    <div class="body">
      <el-table :data="tableList" row-key="id" border style="width: 100%">
        <el-table-column prop="name" label="姓名" width="180" />
        <el-table-column prop="standing" label="身份" />
        <el-table-column fixed="right" label="操作" width="200">
          <template #default="scope">
            <el-popconfirm confirm-button-text="确认" cancel-button-text="取消" title="确认重置密码吗" @confirm="fixPassword(scope.row)">
              <template #reference>
                <el-button link type="primary" size="small">重置密码</el-button>
              </template>
            </el-popconfirm>
            <el-button link type="primary" size="small" @click="editUser(scope.row)">编辑</el-button>
            <el-popconfirm v-if="!scope.row.children || (scope.row.children.length === 0 && scope.row.id !== 'admin')" confirm-button-text="确认" cancel-button-text="取消" title="确认删除吗" @confirm="makeSureDel(scope.row)">
              <template #reference>
                <el-button link type="danger" size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="addUserDialog" title="添加负责人" width="500"  @close="clearForm">
      <el-form :model="addUserForm">
        <el-form-item label="负责人工号" :label-width="formLabelWidth">
          <el-input v-model="addUserForm.id" />
        </el-form-item>
        <el-form-item label="负责人姓名" :label-width="formLabelWidth">
          <el-input v-model="addUserForm.name" />
        </el-form-item>
        <el-form-item label="负责人密码" :label-width="formLabelWidth">
          <el-input v-model="addUserForm.password" disabled/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addUserDialog = false">取消</el-button>
          <el-button type="primary" @click="trueAddUser">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="editUserDialog" title="成员编辑" width="500"  @close="clearForm">
      <el-form :model="addUserForm">
        <el-form-item label="成员工号" :label-width="formLabelWidth" disabled>
          <el-input v-model="addUserForm.id" disabled/>
        </el-form-item>
        <el-form-item label="成员姓名" :label-width="formLabelWidth">
          <el-input v-model="addUserForm.name" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="editUserDialog = false">取消</el-button>
          <el-button type="primary" @click="trueEditUser">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="less" scoped>
.admin-user {
  width: 100%;
  height: 100%;
  background-color: #fff;
  .header {
    height: 70px;
    line-height: 70px;
    width: calc(100% - 40px);
    padding: 0 20px;
  }
  .table {
    height: 600px;
    width: 100%;
  }
}
</style>

