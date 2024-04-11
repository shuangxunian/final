<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const userID = ref('')
const name = ref('')
const tableData = ref([])
const newDate = ref('')
const fixPasswordDialog = ref(false)
const addTimeDialog = ref(false)
const form = ref({
  oldPassword: '',
  newPassword: ''
})

const refreshForm = () => {
  form.value.oldPassword = ''
  form.value.newPassword = ''
}

const fixPassword = async() => {
  if (form.value.oldPassword === '' || form.value.newPassword === '') {
    ElMessage.error('密码不能为空')
    return
  }
  const { data } = await axios.post('http://localhost:3000/user/fixPassword', {
    ...form.value,
    id: userID.value
  })
  if (data.code === 2) {
    ElMessage.success('修改成功')
    fixPasswordDialog.value = false
  } else {
    ElMessage.error(data.msg)
  }
}

const fixName = async() => {
  if (name.value === '') return ElMessage.error('姓名不能为空')
  const { data } = await axios.post('http://localhost:3000/user/fixName', {
    id: userID.value,
    name: name.value
  })
  if (data.code === 2) {
    ElMessage.success('修改成功')
    window.sessionStorage.setItem('name', name.value)
  }
}

const addTime = async() => {
  const date = new Date(newDate.value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const str = `${year}-${month}-${day}`
  const { data } = await axios.post('http://localhost:3000/date/add', {
    date: str
  })
  if (data.code === 2) {
    ElMessage.success('添加成功')
    addTimeDialog.value = false
    getDateList()
  }
}

const makeSureDel = async(row) => {
  const { data } = await axios.post('http://localhost:3000/date/del', row)
  if (data.code === 2) {
    ElMessage.success('删除成功')
    getDateList()
  }
}

const getDateList = async() => {
  const { data } = await axios.post('http://localhost:3000/date/allData', {})
  if (data.code === 2) {
    tableData.value = data.info
  }
}

onMounted(() => {
  userID.value = window.sessionStorage.getItem('id')
  name.value = window.sessionStorage.getItem('name')
  getDateList()
})

</script>

<template>
  <div class="info">
    <div class="left">
      <el-row>
        <el-col :span="8">
          用户id
        </el-col>
        <el-col :span="16">
          {{ userID }}
        </el-col>
        <el-col :span="8">
          用户姓名
        </el-col>
        <el-col :span="16">
          <el-input v-model="name" style="width: 160px" placeholder="请输入姓名" />
          <el-button type="primary" @click="fixName">修改</el-button>
        </el-col>
        <el-col :span="8">
          密码
        </el-col>
        <el-col :span="16">
          <el-button link type="primary" @click="fixPasswordDialog = true">修改密码</el-button>
        </el-col>
      </el-row>

    </div>
    <div class="right" v-if="userID === 'admin'">
      <div class="header">
        <el-button type="primary" @click="addTimeDialog = true" style="margin-left: 10px;">添加敏感时间</el-button>
      </div>
      <div class="body">

        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="date" label="日期" />
          <el-table-column fixed="right" label="操作" width="120">
            <template #default="scoped">
              <el-popconfirm confirm-button-text="确认" cancel-button-text="取消" title="确认删除吗" @confirm="makeSureDel(scoped.row)">
                <template #reference>
                  <el-button link type="danger" >删除</el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <el-dialog v-model="addTimeDialog" title="添加敏感时间" width="30%" @close="refreshForm">
      <el-form label-width="120px">
        <el-form-item label="日期">
          <el-date-picker
            v-model="newDate"
            type="date"
            placeholder="选择日期"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addTimeDialog = false">取消</el-button>
          <el-button type="primary" @click="addTime">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog v-model="fixPasswordDialog" title="修改密码" width="30%" @close="refreshForm">
      <el-form :model="form" label-width="120px">
        <el-form-item label="原密码">
          <el-input v-model="form.oldPassword" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item label="新密码">
          <el-input v-model="form.newPassword" type="password" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="fixPasswordDialog = false">取消</el-button>
          <el-button type="primary" @click="fixPassword">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
    <!-- info -->
  </div>
</template>

<style lang="less" scoped>
.info {
  width: 100%;
  height: 100%;
  display: flex;
  .left {
    width: 30%;
    height: 500px;
    padding: 10px;
    background-color: #fff;
  }
  .right {
    width: calc(70% - 10px);
    height: 700px;
    margin-left: 10px;
    background-color: #fff;
    .header {
      height: 70px;
      line-height: 70px;
    }
    .body {
      height: 630px;
    }
  }
  // color: red;
}
.el-col {
  margin-top: 20px;
}
</style>
