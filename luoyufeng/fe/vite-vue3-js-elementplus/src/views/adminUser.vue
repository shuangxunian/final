<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const tableData = ref([])
const addUserDialog = ref(false)
const form = ref({
  id: '',
  username: '',
  password: '',
})
const formLabelWidth = ref(100)

const refreshForm = () => {}

const makeSureDel = async (row) => {
  const { data } = await axios.post('http://localhost:3000/user/del', row)
  if (data.code === 2) {
    ElMessage({
      message: '删除成功！',
      type: 'success',
    })
    await getUserList()
  }
}

const makeSureFix = async (row) => {
  const { data } = await axios.post('http://localhost:3000/user/fix', row)
  if (data.code === 2) {
    ElMessage({
      message: '重置成功！',
      type: 'success',
    })
  }
}

const getUserList = async () => {
  const { data } = await axios.post('http://localhost:3000/user/allData', {})
  if (data.code === 2) {
    tableData.value = data.info
  }
}

const addUser = async () => {
  const { data } = await axios.post('http://localhost:3000/user/add', form.value)
  if (data.code === 2) {
    ElMessage({
      message: '添加成功！',
      type: 'success',
    })
    addUserDialog.value = false
    await getUserList()
  } else {
    ElMessage.error(data.msg)
  }
}

onMounted(async() => {
  await getUserList()
})

</script>

<template>
  <div class="admin-user">
    <div class="header">
      <el-button style="margin-left: 10px" type="primary" @click="addUserDialog = true">新建用户</el-button>
    </div>
    <div class="body">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="id" label="用户id" width="180" />
        <el-table-column prop="username" label="用户名" width="180" />
        <el-table-column prop="role" label="身份" >
          <template #default="scope">
            {{ scope.row.roleType === '0' ? '管理员' : '用户' }}
          </template>
        </el-table-column>
        <el-table-column prop="optionTime" label="访问次数" />
        <el-table-column fixed="right" label="操作" >
          <template #default="scope">
            <el-popconfirm confirm-button-text="确认" cancel-button-text="取消" title="确认删除吗" @confirm="makeSureDel(scope.row)">
              <template #reference>
                <el-button link type="danger" size="small">删除</el-button>
              </template>
            </el-popconfirm>
            <el-popconfirm confirm-button-text="确认" cancel-button-text="取消" title="确认重置吗" @confirm="makeSureFix(scope.row)">
              <template #reference>
                <el-button link type="primary" size="small">重置密码</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="addUserDialog" title="添加用户" width="500" @close="refreshForm">
      <el-form :model="form">
        <el-form-item label="用户id" :label-width="formLabelWidth">
          <el-input v-model="form.id"/>
        </el-form-item>
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="form.username"/>
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
  .body {
    padding: 10px;
  }
}
</style>
