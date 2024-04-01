<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const dialogFormVisible = ref(false)
const userid = ref('')
const username = ref('')
const role = ref('')
const roleType = ref('')
const form = ref({
  oldPwd: '',
  newPwd1: '',
  newPwd2: '',
})

const refresh = function() {
  dialogFormVisible.value = false
  form.value = {
    oldPwd: '',
    newPwd1: '',
    newPwd2: '',
  }
}

const doNotPost = function() {
  refresh()
}

const goPost = async function() {
  if (form.value.oldPwd === '') {
    return ElMessage.error('请输入旧密码！')
  } else if (form.value.newPwd1 === '') {
    return ElMessage.error('请输入新密码！')
  } else if (form.value.newPwd2 === '') {
    return ElMessage.error('请再次输入新密码！')
  } else if (form.value.newPwd2 !== form.value.newPwd1) {
    return ElMessage.error('两次密码不一致！')
  }
  const { data } = await axios.post('http://localhost:3000/user/fixPassword', {
    ...form.value,
    userid: userid.value
  })
  if (data.code === 2) {
    ElMessage({
      message: '修改成功！',
      type: 'success',
    })
    refresh()
  } else {
    ElMessage.error(msg)
  }
  
}

onMounted(() => {
  userid.value = window.sessionStorage.getItem('userid')
  username.value = window.sessionStorage.getItem('username')
  roleType.value = window.sessionStorage.getItem('roleType')
  if (roleType.value === '0') {
    role.value='管理员'
  } else if (roleType.value === '1') {
    role.value='教师'
  } else if (roleType.value === '2') {
    role.value='学生'
  } 
})

</script>

<template>
  <div class="info">
    <div class="body">
      <div class="every-data">
        <div class="left">
          学工号：
        </div>
        <div class="right">
          {{ userid }}
        </div>
      </div>
      <div class="every-data">
        <div class="left">
          昵称：
        </div>
        <div class="right">
          {{ username }}
        </div>
      </div>
      <div class="every-data">
        <div class="left">
          身份：
        </div>
        <div class="right">
          {{ role }}
        </div>
      </div>
      <div class="every-data">
        <div class="left">
          密码：
        </div>
        <div class="right">
          ***
        </div>
        <div class="right">
          <el-link type="primary" @click="dialogFormVisible = true">修改密码</el-link>
        </div>
      </div>
    </div>
    <el-dialog v-model="dialogFormVisible" title="修改密码" width="500">
      <el-form :model="form">
        <el-form-item label="旧密码" label-width="120">
          <el-input v-model="form.oldPwd" placeholder="请输入旧密码" />
        </el-form-item>
        <el-form-item label="新密码" label-width="120">
          <el-input v-model="form.newPwd1" placeholder="请输入新密码" />
        </el-form-item>
        <el-form-item label="再次输入新密码" label-width="120">
          <el-input v-model="form.newPwd2" placeholder="请再次输入新密码" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="doNotPost">取消</el-button>
          <el-button type="primary" @click="goPost">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="less" scoped>
.info {
  height: 100%;
  width: 100%;
  background-color: #fff;
  .body {
    padding: 10px;
    width: calc(100% - 20px);
    display: flex;
    flex-wrap: wrap;
    .every-data {
      width: 100%;
      display: flex;
      margin-top: 10px;
      .left {
        width: 10%;
      }
      .right {
        width: 20%;
      }
    }

  }

}
</style>
