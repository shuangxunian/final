<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const userList  = ref([])
const tableData = ref([])
const form = ref({
  id: '',
  name: '',
  password: '123456'
})
const formLabelWidth = '100px'
const addUserDialog = ref(false)
const editUserDialog = ref(false)
const refreshForm = function() {
  form.value = {
    id: '',
    name: '',
    password: '123456',
  }
}

const addUser = async function() {
  if (form.value.id === '' || form.value.name === '') {
    ElMessage.error('请输入完整信息！')
    return
  }
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
  if (form.value.id === '' || form.value.name === '') {
    ElMessage.error('请输入完整信息！')
    return
  }
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
    tableData.value = data.body
  }
}

onMounted(async() => {
  await getUserList()
})

</script>

<template>
  <div class="user-info">
    <div class="header">
      <el-button style="margin-left: 10px" type="primary" @click="addUserDialog = true">新建用户</el-button>
      <!-- <el-button style="margin-left: 10px" type="primary" @click="addDataDialog = true">新建用户</el-button> -->
      
    </div>
    <div class="body">
      <div class="table">
        <el-table :data="tableData" style="width: 100%" border max-height="600">
          <el-table-column prop="id" label="工号" />
          <el-table-column prop="name" label="姓名" />
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
        <el-form-item label="工号" :label-width="formLabelWidth">
          <el-input placeholder="请输入工号" v-model="form.id"/>
        </el-form-item>
        <el-form-item label="姓名" :label-width="formLabelWidth">
          <el-input placeholder="请输入姓名" v-model="form.name"/>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input disabled v-model="form.password"/>
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
        <el-form-item label="工号" :label-width="formLabelWidth">
          <el-input placeholder="请输入工号" v-model="form.id" disabled/>
        </el-form-item>
        <el-form-item label="姓名" :label-width="formLabelWidth">
          <el-input placeholder="请输入姓名" v-model="form.name"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="editUserDialog = false">取消</el-button>
          <el-button type="primary" @click="editUser">编辑</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="less" scoped>
.user-info {
  width: 100%;
  height: 100%;
  background-color: #fff;
  .header {
    height: 70px;
    line-height: 70px;
  }
  .body {
    .no-data {
      color: #ccc;
      font-size: 40px;
      text-align: center;
    }
    .bottom {
      margin-top: 10px;
    }
  }
}
</style>
