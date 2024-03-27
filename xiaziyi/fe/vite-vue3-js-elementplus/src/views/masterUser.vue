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
  userRole: 1,
  score: '',
  standing: '管理员',
  needTest: false,
  master: '',
})

const clearForm = () => {
  addUserForm.value = {
    id: '',
    name: '',
    password: '123456',
    userRole: 1,
    score: '',
    standing: '管理员',
    needTest: false,
    master: ''
  }
}

const dontAddUser = () => {}
const trueAddUser = () => {}
const editUser = (row) => {
  addUserForm.value = row
  editUserDialog.value = true
}

const trueEditUser = () => {}
const fixPassword = (row) => {}

const getTableList = async () => {
  tableList.value = []
  const userid = '1001'
  for (let i = 0; i < userList.value.length; i++) {
    const nowData = userList.value[i]
    if (nowData.master === userid) {
      tableList.value.push(nowData)
    }
  }
}

const getUserList = async () => {
  userList.value = [
    {
      id: 'admin',
      name: 'admin',
      userRole: 0,
      score: '',
      standing: '管理员',
      needTest: false,
      master: '',
    },
    {
      id: '1001',
      name: '张三',
      userRole: 1,
      score: '',
      standing: '负责人',
      needTest: false,
      master: '',
    },
    {
      id: '2001',
      name: '张四',
      userRole: 2,
      score: '',
      standing: '成员',
      needTest: false,
      master: '1001',
    },
  ]
}

onMounted(async () => {
  await getUserList()
  await getTableList()
  
})

</script>

<template>
  <div class="admin-user">
    <div class="header">
      <el-button type="primary" @click="addUserDialog = true">新建成员</el-button>
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
            <el-popconfirm confirm-button-text="确认" cancel-button-text="取消" title="确认删除吗" @confirm="makeSureDel(scope.row)">
              <template #reference>
                <el-button link type="danger" size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="addUserDialog" title="添加成员" width="500"  @close="clearForm">
      <el-form :model="addUserForm">
        <el-form-item label="成员工号" :label-width="formLabelWidth">
          <el-input v-model="addUserForm.id" />
        </el-form-item>
        <el-form-item label="成员姓名" :label-width="formLabelWidth">
          <el-input v-model="addUserForm.name" />
        </el-form-item>
        <el-form-item label="成员密码" :label-width="formLabelWidth">
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

