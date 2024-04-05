<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const tableData = ref([])
const infoList = ref([])
const input = ref('')
const form = ref({
  id: '',
  name: '',
  password: ''
})
const editUserDialog = ref(false)
const addUserDialog = ref(false)
const formLabelWidth = '140px'

const refreshForm = () => {
  form.value = {
    id: '',
    name: '',
    password: ''
  }
}

const getData = async () => {
  if (input.value === '') {
    tableData.value = infoList.value
  } else {
    tableData.value = []
    infoList.value.forEach(item => {
      if (item.name.includes(input.value) || item.id.includes(input.value)) {
        tableData.value.push(item)
      }
    })
  }
}


const addUser = async function() {
  const { data } = await axios.post('http://localhost:3000/info/add', form.value)
  if (data.code === 2) {
    ElMessage.success('添加成功')
    addUserDialog.value = false
    await getInfoList()
  } else {
    ElMessage.error(data.msg)
  }
}

const getInfoList = async () => {
  const { data } = await axios.post('http://localhost:3000/info/allData', {})
  if (data.code === 2) {
    infoList.value = data.body
    tableData.value = data.body
  }
}

const makeSureFix = async function(row) {
  const { data } = await axios.post('http://localhost:3000/info/fix', row)
  if (data.code === 2) {
    ElMessage({
      message: '重置成功！',
      type: 'success',
    })
    await getInfoList()
  }
}


const makeSureDel = async function(row) {
  const { data } = await axios.post('http://localhost:3000/info/del', row)
  if (data.code === 2) {
    ElMessage({
      message: '删除成功！',
      type: 'success',
    })
    await getInfoList()
  }
}

const editUser = async function() {
  const { data } = await axios.post('http://localhost:3000/info/edit', form.value)
  if (data.code === 2) {
    ElMessage.success('编辑成功')
    editUserDialog.value = false
    await getInfoList()
  }
}

const editData = async function(row) {
  form.value = row
  editUserDialog.value = true
}

onMounted(async () => {
  getInfoList()
})

</script>

<template>
  <div class="option-list">
    <div class="header">
      <div class="input">
        <el-input style="margin-top:20px" v-model="input" placeholder="请输入内容" />
      </div>
      <div class="btn">
        <el-button style="margin-top:20px" type="primary" @click="getData">搜索</el-button>
        <el-button style="margin-top:20px" type="primary" @click="addUserDialog = true">添加用户</el-button>
      </div>
    </div>
    <div class="body">
      <el-table :data="tableData" style="width: 100%" border height="500">
        <el-table-column prop="id" label="工号" />
        <el-table-column prop="name" label="用户名" />
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
        <el-form-item label="工号" :label-width="formLabelWidth">
          <el-input v-model="form.id"/>
        </el-form-item>
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="form.name"/>
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
       <el-form-item label="工号" :label-width="formLabelWidth">
          <el-input disabled v-model="form.id"/>
        </el-form-item>
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="form.name"/>
        </el-form-item>
        <!-- <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="form.password"/>
        </el-form-item> -->
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
.option-list {

  background-color: #fff;
  height: 100%;
  width: 100%;
  .header {
    height: 70px;
    display: flex;
    .input {
      width: 300px;
      margin-left: 20px;
    }
    .btn {
      margin-left: 20px;
    }
  }
}
</style>
