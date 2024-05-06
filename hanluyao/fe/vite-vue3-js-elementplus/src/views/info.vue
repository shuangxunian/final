<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const form = ref({
  id: '',
  name: '',
  role: '',
  roletype: ''
})
const passForm = ref({
  oldPwd: '',
  newPwd1: '',
  newPwd2: ''
})
const dialogFormVisible = ref(false)

function refreshFrom() {
  passForm.value = {
    oldPwd: '',
    newPwd1: '',
    newPwd2: ''
  }
}

async function goPost() {
  if (passForm.value.newPwd1 !== passForm.value.newPwd2) {
    ElMessage.error('两次输入的密码不一致')
    return
  }
  const { data } = await axios.post('http://localhost:3000/user/changePassword', {
    id: form.value.id,
    ...passForm.value
  })
  if (data.code === 2) {
    ElMessage.success('修改成功')
    dialogFormVisible.value = false
  } else {
    ElMessage.error(data.msg)
  }
}

onMounted(() => {
  form.value.id = sessionStorage.getItem('id')
  form.value.name = sessionStorage.getItem('name')
  form.value.roletype = sessionStorage.getItem('roletype')
  form.value.role = form.value.roletype === '0' ? '管理员' : form.value.roletype === '1' ? '教师' : '学生'
  // getData()
})
</script>

<template>
  <div>
    <el-card style="width: 500px">
      <el-form :model="form" label-width="auto" style="width: 400px">
        <el-form-item label="用户id">
          <span>{{ form.id }}</span>
        </el-form-item>
        <el-form-item label="用户名">
          <div style="display:flex">
            <el-input v-model="form.name" style="width:300px"/>
            <el-button>保存</el-button>
          </div>
        </el-form-item>
        <el-form-item label="身份">
          <span>{{ form.role }}</span>
        </el-form-item>
        <el-form-item label="密码">
          <el-button link type="primary" size="small" @click="dialogFormVisible = true">修改密码</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-dialog v-model="dialogFormVisible" title="修改密码" width="500" @close="refreshFrom">
      <el-form :model="passForm">
        <el-form-item label="旧密码" label-width="120">
          <el-input v-model="passForm.oldPwd" placeholder="请输入旧密码" />
        </el-form-item>
        <el-form-item label="新密码" label-width="120">
          <el-input v-model="passForm.newPwd1" placeholder="请输入新密码" />
        </el-form-item>
        <el-form-item label="再次输入新密码" label-width="120">
          <el-input v-model="passForm.newPwd2" placeholder="请再次输入新密码" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="goPost">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="less" scoped>
</style>
