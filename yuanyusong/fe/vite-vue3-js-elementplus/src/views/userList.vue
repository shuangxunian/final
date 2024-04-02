<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const activeName = ref('nowWeek')
const tableData = ref([])
const userList = ref([])
const formLabelWidth = ref(100)
const addUserDialog = ref(false)
const editUserDialog = ref(false)

const form = ref({
  id: '13012345670',
  username: '张三1',
  roleType: '1',
  password: '123456'
})

const handleClick = (pane) => {
  console.log(pane.props.name)
}

const refreshForm = () => {
  form.value = {
    id: '13012345670',
    username: '张三1',
    roleType: '1',
    password: '123456'
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

const getUserList = async() => {
  const { data } = await axios.post('http://localhost:3000/user/allData', {})
  if (data.code === 2) {
    tableData.value = data.body
  }
  // tableData.value = [
  //   { id: 'admin', username: '张三', roleType: '0' },
  //   { id: '13012345670', username: '李四', roleType: '1' },
  //   { id: '13012345678', username: '王五', roleType: '2' }
  // ]
  // 调用接口获取数据
  // 更新userList
}

const addUser = async() => {
  const { data } = await axios.post('http://localhost:3000/user/add', form.value)
  if (data.code === 2) {
    ElMessage.success('添加成功')
    addUserDialog.value = false
    getUserList()
  } else {
    ElMessage.error(data.msg)
  }
}



onMounted(async() => {
  await getUserList()
  // 获取本周食谱数据
  // 调用接口获取数据
  // 更新tableData
  // 获取本周食谱数据
  // 调用接口获取数据
  // 更新tableData
})

</script>

<template>
  <div class="admin-home">
    <div class="header">
      <el-button style="margin-left: 10px" type="primary" @click="addUserDialog = true">新建用户</el-button>
    </div>
    <div class="body">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="id" label="手机号"/>
        <el-table-column prop="username" label="用户名"/>
        <el-table-column prop="roleType" label="身份">
          <template #default="scope">
            {{ scope.row.roleType === '0' ? '管理员' : scope.row.roleType === '1' ? '老师' : '家长' }}
          </template>
        </el-table-column>
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

    <el-dialog v-model="addUserDialog" title="添加用户" width="500" @close="refreshForm">
      <el-form :model="form">
        <el-form-item label="手机号" :label-width="formLabelWidth">
          <el-input v-model="form.id"/>
        </el-form-item>
        <el-form-item label="姓名" :label-width="formLabelWidth">
          <el-input v-model="form.username"/>
        </el-form-item>
        <el-form-item label="身份" :label-width="formLabelWidth">
          <el-radio-group v-model="form.roleType" class="ml-4">
            <el-radio value="1">老师</el-radio>
            <el-radio value="2">家长</el-radio>
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
        <el-form-item label="手机号" :label-width="formLabelWidth">
          <el-input v-model="form.id"/>
        </el-form-item>
        <el-form-item label="姓名" :label-width="formLabelWidth">
          <el-input v-model="form.username"/>
        </el-form-item>
        <el-form-item label="身份" :label-width="formLabelWidth">
          <el-radio-group v-model="form.roleType" class="ml-4">
            <el-radio value="1">老师</el-radio>
            <el-radio value="2">家长</el-radio>
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
.admin-home {
  height: 100%;
  width: 100%;
  background-color: #fff;
  .header {
    height: 70px;
    line-height: 70px;
  }
  .body {
    height: 700px;
    width: calc(100% - 20px);
    padding: 10px;
  }
}
</style>
