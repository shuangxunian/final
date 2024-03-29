<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const tableData = ref([
  {
    username: 'user',
    name: '用户1',
    role: '用户',
    belong: '',
  },
  {
    username: 'user1',
    name: '代理商1',
    role: '代理商',
    belong: '移动',
  },
  {
    username: 'user2',
    name: '信息员1',
    role: '信息员',
    belong: '移动',
  },
])
const addUserDialog = ref(false)
const editUserDialog = ref(false)
const formLabelWidth = ref(150)
const form = ref({
  userid: '',
  roleType: '1',
  username: '',
  belong: '',
  password: '123456',
})
const belong = ref('')

const clearForm = () => {
  form.value = {
    userid: '',
    roleType: '1',
    username: '',
    belong: '',
    password: '123456',
  }
}

const editUser = (row) => {
  console.log(row)
  form.value = row
  form.value.roleType = row.roleType + ''
  editUserDialog.value = true
}

const addUser = async () => {
  if (form.value.userid === '') return ElMessage.error('请输入用户工号/手机号！')
  if (form.value.username === '') return ElMessage.error('请输入用户姓名！')
  if (form.value.password === '') return ElMessage.error('请输入用户密码！')
  form.value.belong = belong.value
  const { data } = await axios.post('http://localhost:3000/user/add', form.value)
  if (data.code === 2) {
    ElMessage({
      message: '添加成功！',
      type: 'success',
    })
    await getUserList()
    addUserDialog.value = false
  } else {
    ElMessage.error(data.msg)
  }
}

const toEditUser = async () => {
  if (form.value.userid === '') return ElMessage.error('请输入用户工号/手机号！')
  if (form.value.roleType !== '3' && form.value.belong === '') return ElMessage.error('请输入用户所属平台！')
  if (form.value.username === '') return ElMessage.error('请输入用户姓名！')
  if (form.value.roleType === '3') form.value.belong = ''
  const { data } = await axios.post('http://localhost:3000/user/edit', form.value)
  if (data.code === 2) {
    ElMessage({
      message: '修改成功！',
      type: 'success',
    })
    await getUserList()
    editUserDialog.value = false
  } else {
    ElMessage.error(data.msg)
  }
}

const makeSureDel = async (row) => {
  const { data } = await axios.post('http://localhost:3000/user/del', row)
  if (data.code === 2) {
    ElMessage({
      message: '删除成功！',
      type: 'success',
    })
    await getUserList()
    addUserDialog.value = false
  }
}

const getUserList = async () => {
  const { data } = await axios.post('http://localhost:3000/user/allData', {})
  if (data.code === 2) {
    const roleMap = {
      '0': '管理员',
      '1': '代理商',
      '2': '维护人员',
      '3': '用户',
    }
    tableData.value = []
    data.info.forEach(item => {
      if (item.belong === belong.value) {
        let role = roleMap[item.roleType]
        tableData.value.push({
          ...item,
          role
        })
      }

    })
  }
}

onMounted(async () => {
  belong.value = window.sessionStorage.getItem('belong')
  await getUserList()
})

</script>

<template>
  <div class="admin-user">
    <div class="header">
      <el-button style="margin-left: 10px" @click="addUserDialog = true">新建用户</el-button>
    </div>
    <div class="body">
      <el-table :data="tableData" style="width:100%" border max-height="600">
        <el-table-column prop="userid" label="账号" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="role" label="身份">

        </el-table-column>
        <el-table-column prop="belong" label="所属平台" />
        <el-table-column fixed="right" label="操作" width="120">
          <template #default="scope">
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
    <el-dialog v-model="addUserDialog" title="新建用户" width="500" @close="clearForm">
      <el-form :model="form">
        <el-form-item label="用户工号/手机号" :label-width="formLabelWidth">
          <el-input v-model="form.userid"/>
        </el-form-item>
        <el-form-item label="用户身份" :label-width="formLabelWidth">
          <el-radio-group v-model="form.roleType">
            <el-radio value="1">代理商</el-radio>
            <el-radio value="2">信息维护人员</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="用户姓名" :label-width="formLabelWidth">
          <el-input v-model="form.username"/>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="form.password"/>
        </el-form-item>

      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addUserDialog = false">取消</el-button>
          <el-button type="primary" @click="addUser">创建</el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog v-model="editUserDialog" title="修改用户信息" width="500" @close="clearForm">
      <el-form :model="form">
        <el-form-item label="用户工号/手机号" :label-width="formLabelWidth">
          <el-input v-model="form.userid" disabled/>
        </el-form-item>
        <el-form-item label="用户身份" :label-width="formLabelWidth">
          <span>{{ form.role }}</span>
        </el-form-item>
        <el-form-item label="用户姓名" :label-width="formLabelWidth">
          <el-input v-model="form.username"/>
        </el-form-item>
        <el-form-item v-if="form.roleType !== '3'" label="所属平台" :label-width="formLabelWidth">
          <el-input v-model="form.belong"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="editUserDialog = false">取消</el-button>
          <el-button type="primary" @click="toEditUser">修改</el-button>
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
  }
}
</style>
