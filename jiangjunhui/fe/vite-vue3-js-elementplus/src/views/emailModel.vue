<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const textarea = ref('')

const save = async () => {
  const { data } = await axios.post('http://localhost:3000/option/fixmodel', {
    text: textarea.value
  })
  if (data.code === 2) {
    ElMessage({
      message: `保存成功`,
      type: 'success',
    })
  }
}

const getModelList = async () => {
  const { data } = await axios.post('http://localhost:3000/option/model', {})
  if (data.code === 2) {
    textarea.value = data.info[0].model
  }
}

onMounted(async () => {
  getModelList()
})

</script>

<template>
  <div class="email-model">
    <div class="header">
      <div class="my-input">
        <p>请注意：`time`会解析成对应时间，`name`会解析成对应行动代号，`warplane`会解析成对应机型</p>
        <el-input
          v-model="textarea"
          :autosize="{ minRows: 7, maxRows: 7 }"
          type="textarea"
          placeholder="请输入邮件模版"
        />
      </div>
    </div>
    <div class="body">
      <el-button @click="save">保存</el-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
.email-model {
  .header {
    display: flex;
    height: 250px;
    .my-input {
      width: 45%;
      .el-col {
        margin-top: 10px;
      }
    }
    .my-btn {
      width: 10%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .body {}
}
</style>
