<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const roleType = ref('')
const username = ref('')
const id = ref('')
const fixPasswordDialog = ref(false)
const form = ref({
  oldPassword: '',
  newPassword: ''
})

const fixPassword = async() => {
  if (form.value.oldPassword === '' || form.value.newPassword === '') {
    ElMessage.error('密码不能为空')
    return
  }
  const { data } = await axios.post('http://localhost:3000/user/fixPassword', {
    ...form.value,
    id: id.value
  })
  if (data.code === 2) {
    ElMessage.success('修改成功')
    fixPasswordDialog.value = false
  } else {
    ElMessage.error(data.msg)
  }
}

const fixName = async() => {
  if (username.value === '') {
    ElMessage.error('用户名不能为空')
    return
  }
  const { data } = await axios.post('http://localhost:3000/user/fixName', {
    username: username.value,
    id: id.value
  })
  if (data.code === 2) {
    ElMessage.success('修改成功')
  } else {
    ElMessage.error(data.msg)
  }
}

onMounted(async() => {
  roleType.value = window.sessionStorage.getItem('roleType')
  username.value = window.sessionStorage.getItem('username')
  id.value = window.sessionStorage.getItem('id')
})
</script>

<template>
  <div class="info">
    <div class="body">
      <div class="show">
        <p class="title">用户id：</p>
        <p class="text">{{ id }}</p>
      </div>
      <div class="show">
        <p class="title">用户名：</p>
        <el-input v-model="username" style="width:200px;height:32px;margin-top:11px;"/>
        <el-button style="margin-top:11px;" @click="fixName">修改</el-button>
      </div>
      <div class="show">
        <p class="title">用户身份：</p>
        <p class="text">{{ roleType === '0' ? '管理员' : '普通用户'}}</p>
      </div>
      <div class="show">
        <p class="title">密码：</p>
        <el-button link type="primary" size="small" @click="fixPasswordDialog = true">修改密码</el-button>
      </div>
    </div>

    <el-dialog v-model="fixPasswordDialog" title="修改密码" width="30%">
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
  </div>
</template>

<style lang="less" scoped>
.info {
  width: 100%;
  height: 100%;
  display: flex;
  background-color: #fff;
  .body {
    .show {
      width: 400px;
      margin-left: 10px;
      display: flex;
      .title {
        width: 100px;
      }
    }
  }
}
</style>
