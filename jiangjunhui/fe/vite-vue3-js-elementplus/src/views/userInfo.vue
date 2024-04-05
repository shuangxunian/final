<script setup>
import { ref, computed,onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const tableData = ref([
  {
    name: '长春航空局',
    email: '1776056253@qq.com'
  },
  {
    name: '沈阳航空局',
    email: '1776056253@qq.com'
  },
  {
    name: '大连航空局',
    email: '1776056253@qq.com'
  },
])
const userList = ref([])
const addUserDialog = ref(false)
const editUserDialog = ref(false)
const input = ref('')
const form = ref({
  id: '',
  name: '',
  email: ''
})
const formLabelWidth = ref(100)

const addUser = async () => {
  if (form.value.name === '') return ElMessage.error('请输入单位名称')
  if (form.value.email === '') return ElMessage.error('请输入单位联系邮箱')
  const { data } = await axios.post('http://localhost:3000/user/add', form.value)
  if (data.code === 2) {
    ElMessage({
      message: '添加成功！',
      type: 'success',
    })
    getUserList()
    addUserDialog.value = false
  }
}

const fixUser = async () => {
  if (form.value.name === '') return ElMessage.error('请输入单位名称')
  if (form.value.email === '') return ElMessage.error('请输入单位联系邮箱')
  const { data } = await axios.post('http://localhost:3000/user/fix', form.value)
  if (data.code === 2) {
    ElMessage({
      message: '修改成功！',
      type: 'success',
    })
    getUserList()
    editUserDialog.value = false
  }
}

const getData = async () => {
  if (input.value === '') {
    tableData.value = userList.value
  } else {
    tableData.value = []
    userList.value.forEach(item => {
      if (item.name.includes(input.value) || item.email.includes(input.value)) {
        tableData.value.push(item)
      }
    })
  }
}


const clearForm = () => {
  form.value = {
    id: '',
    name: '',
    email: ''
  }
}

const editData = (row) => {
  form.value = row
  editUserDialog.value = true
  // console.log(row)
}

const getUserList = async () => {
  const { data } = await axios.post('http://localhost:3000/user/allData', {})
  if (data.code === 2) {
    userList.value = data.info
    tableData.value = data.info
    console.log(data.info)
  }
}

onMounted(async () => {
  getUserList()
})

</script>

<template>
  <div class="user-info">
    <div class="header">
      <div class="input">
        <el-input style="margin-top:20px" v-model="input" placeholder="请输入内容" />
      </div>
      <div class="btn">
        <el-button style="margin-top:20px" type="primary" @click="getData">搜索</el-button>
        <el-button style="margin-top:20px" type="primary" @click="addUserDialog = true">添加单位</el-button>
      </div>
      <!-- <el-button style="margin-left: 10px;" @click="addUserDialog = true">添加单位</el-button> -->
    </div>
    <div class="body">
      <el-table :data="tableData" style="width: 100%" border height="500">
        <el-table-column prop="name" label="单位名称" />
        <el-table-column prop="email" label="联系邮箱" />
        <el-table-column fixed="right" label="操作" width="200">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="editData(scope.row)">编辑</el-button>
            <el-popconfirm confirm-button-text="确认" cancel-button-text="取消" title="确认删除吗" @confirm="makeSureDel(scope.row)">
              <template #reference>
                <el-button link type="danger" size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <div class="img">
        <img src="./../assets/image.png" style="height: 300px" alt=""/>
        <img src="./../assets/img1.png" style="height: 300px" alt=""/>
      </div>
    </div>

    <el-dialog v-model="addUserDialog" title="添加单位" width="500" @close="clearForm">
      <el-form :model="form">
        <el-form-item label="单位名称" :label-width="formLabelWidth">
          <el-input v-model="form.name"/>
        </el-form-item>
        <el-form-item label="联系邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addUserDialog = false">取消</el-button>
          <el-button type="primary" @click="addUser">添加</el-button>
        </div>
      </template>
    </el-dialog>


    <el-dialog v-model="editUserDialog" title="修改单位" width="500" @close="clearForm">
      <el-form :model="form">
        <el-form-item label="单位id" :label-width="formLabelWidth">
          <el-input v-model="form.id" disabled/>
        </el-form-item>
        <el-form-item label="单位名称" :label-width="formLabelWidth">
          <el-input v-model="form.name"/>
        </el-form-item>
        <el-form-item label="联系邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="editUserDialog = false">取消</el-button>
          <el-button type="primary" @click="fixUser">添加</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="less" scoped>
.user-info {
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
  .body {
    .img {
      display: flex;
      justify-content: space-around;
      height: 300px;
    }
  }
}
</style>
