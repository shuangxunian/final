<script setup>
import { ref, computed } from 'vue'

const textarea = ref('于`time`执行的行动代号为`name`的行动，需你单位提供协助，请发现机型为`warplane`的机型请放行！')

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
      <el-button>保存</el-button>
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
