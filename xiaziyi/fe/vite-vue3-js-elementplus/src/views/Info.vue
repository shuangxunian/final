<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const dialogFormVisible = ref(false)
const formLabelWidth = ref(120)
const password = ref('')

const fixPassword = async () => {}
const dontFix = async () => {
  password.value = ''
}
const toFix = async () => {
  ElMessage('修改成功！')
  password.value = ''
}

onMounted(async() => {})

</script>

<template>
  <div class="info">
    <p>
      <span>id：</span>
      <span>admin</span>
    </p>
    <p>
      <span>姓名</span>
      <span>admin</span>
    </p>
    <p>
      <span>身份</span>
      <span>管理员</span>
    </p>
    <p>
      <span>密码</span>
      <el-link type="primary" @click="dialogFormVisible = true">修改密码</el-link>
    </p>

    <el-dialog v-model="dialogFormVisible" title="修改密码" width="500">
      <el-form>
        <el-form-item label="新密码" :label-width="formLabelWidth">
          <el-input v-model="password" autocomplete="off" />
        </el-form-item>
        <el-form-item label="再次输入新密码" :label-width="formLabelWidth">
          <el-input v-model="password" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dontFix">取消</el-button>
          <el-button type="primary" @click="toFix">修改</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="less" scoped>
.info {
  width: calc(100% - 20px);
  height: calc(100% - 20px);
  background-color: #fff;
  padding: 10px;
  p {
    span {
      display: inline-block;
      min-width: 100px;
    }
  }
}
</style>
