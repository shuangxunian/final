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
        <div class="input">
          <el-input
            v-model="textarea"
            :autosize="{ minRows: 7, maxRows: 7 }"
            type="textarea"
            placeholder="请输入邮件模版"
          />
        </div>
        <div class="myp">
          <p>请注意：`time`会解析成对应时间，`name`会解析成对应行动代号，`warplane`会解析成对应机型</p>
        </div>

      </div>
    </div>
    <div class="body">
      <el-button @click="save">保存</el-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
.email-model {
  background-color: #fff;
  height: 100%;
  width: 100%;
  .header {
    width: calc(100% - 20px);
    padding: 10px;
    height: 170px;
    .my-input {
      display: flex;
      justify-content: space-between;
      width: 100%;
      .input {
        width: 45%;
      }
      .myp {
        width: 45%;
      }
    }
  }
  .body {
    margin-left: 10px;
  }
}
</style>
