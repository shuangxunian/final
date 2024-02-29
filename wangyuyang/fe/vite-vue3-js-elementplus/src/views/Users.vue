<script setup>
import { ref, getCurrentInstance, inject, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const axios = inject('$axios')
const tableData = ref([])
const dialogFormVisible = ref(false)
const dialogOpVisible = ref(false)
const showString = ref('')
const nowOp = ref(0)
const nowSelect = ref(0)

const form = ref({
  username: '',
  password: '123456',
})

// const vm = getCurrentInstance()
// const tableData = [
//   {
//     username: '',
//     birthDay: '',
//     blacklist: ''
//   },
// ]
// function handleClick () {}

function adminOp (op, scope) {
  nowOp.value = op
  nowSelect.value = scope.$index
  if (op === 0) {
    // 删除
    showString.value = '你确定删除此用户吗？'
  } else if (op === 1) {
    // 重制密码
    showString.value = '你确定重置此用户的密码吗？重置完为123456'
  }
  dialogOpVisible.value = true
}

async function getUserList () {
  const { data } = await axios.post('/user/allData')
  tableData.value = data.body
}

async function addUser () {
  if (form.value.username !== '') {
    const { data } = await axios.post('/user/add', form.value)
    if (data.code === 4) {
      ElMessage.error('此账号已注册，请直接登陆！')
    } else {
      ElMessage({
        message: '注册成功，请告知用户',
        type: 'success',
      })
      form.value.username = ''
      dialogFormVisible.value = false
      getUserList()
    }

  } else {
    ElMessage.error('用户名不能为空')
  }
}

async function makeSure() {
  if (nowOp.value === 0) {
    const { data } = await axios.post('/user/del', tableData.value[nowSelect.value])
    if (data.code === 2) {
      ElMessage({
        message: '删除成功',
        type: 'success',
      })
      dialogOpVisible.value = false
      getUserList()
    }
  } else if (nowOp.value === 1) {
    const { data } = await axios.post('/user/fixpwd', tableData.value[nowSelect.value])
    if (data.code === 2) {
      ElMessage({
        message: '重置成功',
        type: 'success',
      })
      dialogOpVisible.value = false
      getUserList()
    }
  }
}


onMounted(() => {
  getUserList()
})


</script>

<template>
  <div class="user">
    <div class="header">
      <div class="options">
        <div class="btn">
          <el-button type="success" @click="dialogFormVisible = true">新建用户</el-button>
        </div>
      </div>
    </div>
    <div class="body">
      <div class="table">
        <el-table :data="tableData" style="width: 100%" height="600">
          <el-table-column prop="username" label="用户名" width="180" />
          <el-table-column prop="birthDay" label="生日" width="180" />
          <el-table-column prop="blacklist" label="黑名单" />
          <el-table-column fixed="right" label="操作" width="160">
            <template #default="scope">
              <el-button link type="danger" @click="adminOp(0, scope)"
                >删除</el-button
              >
              <el-button link type="primary" @click="adminOp(1, scope)">重置密码</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog v-model="dialogFormVisible" title="新建用户" width="500">
      <el-form :model="form" label-width="100px" label-position="left">
        <el-form-item label="用户名">
          <el-input v-model="form.username"/>
        </el-form-item>
        <el-form-item label="密码">
          <el-input disabled v-model="form.password"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="addUser">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog v-model="dialogOpVisible" title="敏感操作提示" width="500">
      <div>
        <p>
          {{ showString }}
        </p>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="makeSure">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
    <!-- user -->
  </div>
</template>

<style lang="less" scoped>
.user {
  // height: 100%;
  height: calc(100% - 10px);
  margin-top: 10px;
  .header {
    height: 40px;
    .options {
      margin: 0 10px;
      height: 40px;
      background-color: #fff;
      display: flex;
      .btn {
        margin-top: 4px;
        margin-left: 10px;
      }
    }
  }
  .body {
    .table {
      max-height: calc(100% - 60px);
      margin: 10px;
      background-color: #fff;
    }
  }
}
</style>
